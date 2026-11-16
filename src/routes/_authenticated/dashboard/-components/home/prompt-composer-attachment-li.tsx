import { cn } from 'cn'
import { EASE } from './types-and-constants/constant'
import { X } from 'lucide-react'
import type { Attachment } from '#/hooks/use-image-attachments'

export default function PromptComposerAttachmentLi({
  item,
  attachments,
}: {
  item: Attachment
  attachments: {
    remove: (id: string) => void
    retry: (id: string) => void
  }
}) {
  return (
    <li key={item.id} className="relative">
      <img
        src={item.url}
        alt={item.file.name}
        className="size-14 rounded-xl border border-border object-cover"
      />
      {item.status !== 'done' && (
        <div className="absolute inset-0 grid place-items-center rounded-xl bg-background/70 text-[10px] font-medium">
          {item.status === 'uploading' ? (
            `${item.progress}%`
          ) : (
            <button type="button" onClick={() => attachments.retry(item.id)}>
              Retry
            </button>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => attachments.remove(item.id)}
        aria-label={`Remove ${item.file.name}`}
        className={cn(
          'absolute -top-1.5 -right-1.5 grid size-5 place-items-center rounded-full border border-border bg-background text-foreground transition-[scale] duration-150 active:scale-[0.92]',
          EASE,
        )}
      >
        <X aria-hidden className="size-3" />
      </button>
    </li>
  )
}
