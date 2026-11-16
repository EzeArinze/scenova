import { useCallback, useEffect, useRef, useState } from 'react'
import { measureImage } from '#/utils/measure-image'
import { uploadFile } from '#/features/image-s3-actions.ts/upload-file'

export type UploadedImage = { key: string; width?: number; height?: number }

export type Attachment = {
  id: string
  file: File
  url: string // local blob URL, used for previews only
  status: 'uploading' | 'done' | 'error'
  progress: number
  key?: string
  width?: number
  height?: number
}

type Options = { userId: string; max?: number }

export const MAX_BYTES = 10 * 1024 * 1024

export function useImageAttachments({ userId, max = 4 }: Options) {
  const [items, setItems] = useState<Attachment[]>([])
  const itemsRef = useRef(items)
  itemsRef.current = items

  useEffect(
    () => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)),
    [],
  )

  const patch = useCallback((id: string, p: Partial<Attachment>) => {
    // No-op if the item was removed while uploading.
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)))
  }, [])

  const start = useCallback(
    async (item: Attachment) => {
      patch(item.id, { status: 'uploading', progress: 0 })
      try {
        const [key, size] = await Promise.all([
          uploadFile(item.file, userId, (progress) =>
            patch(item.id, { progress }),
          ),
          measureImage(item.file),
        ])
        patch(item.id, { status: 'done', progress: 100, key, ...size })
      } catch (err) {
        console.error(err)
        patch(item.id, { status: 'error' })
      }
    },
    [userId, patch],
  )

  const add = useCallback(
    (list: FileList | File[]) => {
      const images = Array.from(list).filter(
        (f) => f.type.startsWith('image/') && f.size <= MAX_BYTES,
      )
      const room = max - itemsRef.current.length
      if (!images.length || room <= 0) return

      const next: Attachment[] = images.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
        status: 'uploading',
        progress: 0,
      }))
      itemsRef.current = [...itemsRef.current, ...next] // keeps room math right on rapid calls
      setItems((prev) => [...prev, ...next])
      next.forEach((item) => void start(item))
    },
    [max, start],
  )

  const remove = useCallback((id: string) => {
    const target = itemsRef.current.find((i) => i.id === id)
    if (target) URL.revokeObjectURL(target.url)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const retry = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((i) => i.id === id)
      if (item) void start(item)
    },
    [start],
  )

  const uploaded: UploadedImage[] = items.flatMap((i) =>
    i.status === 'done' && i.key
      ? [{ key: i.key, width: i.width, height: i.height }]
      : [],
  )

  return {
    items,
    uploaded,
    hasItems: items.length > 0,
    isUploading: items.some((i) => i.status === 'uploading'),
    isReady: items.length > 0 && items.every((i) => i.status === 'done'),
    isFull: items.length >= max,
    add,
    remove,
    retry,
  }
}
