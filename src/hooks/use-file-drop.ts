import { useState } from 'react'
import type { DragEvent } from 'react'

type UseFileDropOptions = {
  onFiles: (files: File[]) => void
}

function hasFiles(e: DragEvent) {
  return Array.from(e.dataTransfer.types).includes('Files')
}

export function useFileDrop({ onFiles }: UseFileDropOptions) {
  const [isDragging, setIsDragging] = useState(false)

  function onDragOver(e: DragEvent) {
    if (!hasFiles(e)) return
    e.preventDefault()
    setIsDragging(true)
  }

  function onDragLeave(e: DragEvent) {
    // Ignore leave events fired when moving over child elements.
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return
    setIsDragging(false)
  }

  function onDrop(e: DragEvent) {
    if (!hasFiles(e)) return
    e.preventDefault()
    setIsDragging(false)
    onFiles(Array.from(e.dataTransfer.files))
  }

  return {
    isDragging,
    dropProps: {
      onDragEnter: onDragOver,
      onDragOver,
      onDragLeave,
      onDrop,
    },
  }
}
