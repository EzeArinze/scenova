import { useCallback, useEffect, useRef, useState } from 'react'
import { discard } from '#/features/image-s3-actions.ts/remove-file'
import { measureImage } from '#/utils/measure-image'
import { nanoid } from 'nanoid'
import { uploadFile } from '#/features/image-s3-actions.ts/upload-file'
import {
  isAllowedImageType,
  makeUploadKey,
  MAX_IMAGE_BYTES,
} from '#/utils/projects/image-rules'

export type UploadedImage = { key: string; width?: number; height?: number }

export type Attachment = {
  id: string
  key: string
  file: File
  url: string
  status: 'uploading' | 'done' | 'error'
  progress: number
  width?: number
  height?: number
}

type Options = { userId: string; max?: number }

export function useImageAttachments({ userId, max = 4 }: Options) {
  const [items, setItems] = useState<Attachment[]>([])
  const itemsRef = useRef(items)
  itemsRef.current = items

  // Revoke blob URLs on unmount. Do NOT delete from Tigris here:
  // after a successful submit the composer unmounts and those files are in use.
  useEffect(
    () => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)),
    [],
  )

  const patch = useCallback((id: string, p: Partial<Attachment>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...p } : i)))
  }, [])

  const start = useCallback(
    async (item: Attachment) => {
      patch(item.id, { status: 'uploading', progress: 0 })
      try {
        const [, size] = await Promise.all([
          uploadFile(item.file, item.key, (progress) =>
            patch(item.id, { progress }),
          ),
          measureImage(item.file),
        ])

        // Removed while it was uploading: the file landed after the user
        // discarded it, so delete it now.
        if (!itemsRef.current.some((i) => i.id === item.id)) {
          discard(item.key)
          return
        }
        patch(item.id, { status: 'done', progress: 100, ...size })
      } catch (err) {
        console.error(err)
        patch(item.id, { status: 'error' })
      }
    },
    [patch],
  )

  const add = useCallback(
    (list: FileList | File[]) => {
      // Same type and size rules the server enforces (see #/lib/image-rules).
      const images = Array.from(list).flatMap((file) =>
        isAllowedImageType(file.type) && file.size <= MAX_IMAGE_BYTES
          ? [{ file, type: file.type }]
          : [],
      )
      const room = max - itemsRef.current.length
      if (!images.length || room <= 0) return

      const next: Attachment[] = images
        .slice(0, room)
        .map(({ file, type }) => ({
          id: nanoid(),
          key: makeUploadKey(userId, nanoid(), type),
          file,
          url: URL.createObjectURL(file),
          status: 'uploading',
          progress: 0,
        }))
      itemsRef.current = [...itemsRef.current, ...next]
      setItems((prev) => [...prev, ...next])
      next.forEach((item) => void start(item))
    },
    [max, userId, start],
  )

  const remove = useCallback((id: string) => {
    const target = itemsRef.current.find((i) => i.id === id)
    if (!target) return

    URL.revokeObjectURL(target.url)
    itemsRef.current = itemsRef.current.filter((i) => i.id !== id)
    setItems((prev) => prev.filter((i) => i.id !== id))

    if (target.status === 'done') discard(target.key)
  }, [])

  const retry = useCallback(
    (id: string) => {
      const item = itemsRef.current.find((i) => i.id === id)
      if (item) void start(item)
    },
    [start],
  )

  const uploaded: UploadedImage[] = items
    .filter((i) => i.status === 'done')
    .map((i) => ({ key: i.key, width: i.width, height: i.height }))

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
