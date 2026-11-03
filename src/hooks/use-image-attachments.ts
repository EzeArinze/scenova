import { useCallback, useEffect, useRef, useState } from 'react'

export type Attachment = { id: string; file: File; url: string }
type UseImageAttachmentsType = {
  max?: number
}

export function useImageAttachments({ max = 4 }: UseImageAttachmentsType) {
  const [items, setItems] = useState<Attachment[]>([])
  const itemsRef = useRef(items)
  itemsRef.current = items

  // Release object URLs on unmount.
  useEffect(
    () => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.url)),
    [],
  )

  const add = useCallback(
    (list: FileList | File[]) => {
      const images = Array.from(list).filter((f) => f.type.startsWith('image/'))
      const room = max - itemsRef.current.length
      if (!images.length || room <= 0) return

      const next = images.slice(0, room).map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      }))
      setItems((prev) => [...prev, ...next])
    },
    [max],
  )

  const remove = useCallback((id: string) => {
    const target = itemsRef.current.find((i) => i.id === id)
    if (target) URL.revokeObjectURL(target.url)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return {
    items,
    files: items.map((i) => i.file),
    isFull: items.length >= max,
    hasItems: items.length > 0,
    add,
    remove,
  }
}
