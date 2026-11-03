import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { ArrowRight, Check, Plus, X } from 'lucide-react'
import { cn } from 'cn'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { OptionGroup } from './option-group'
import {
  EASE,
  MAX_IMAGES,
  MAX_TEXTAREA_PX,
  RATIOS,
  SECONDS,
  VARIATIONS,
} from './types-and-constants/constant'
import { useFileDrop } from '#/hooks/use-file-drop'
import { useImageAttachments } from '#/hooks/use-image-attachments'
import type {
  ComposerSettings,
  PromptComposerProps,
} from './types-and-constants/types'

export function PromptComposer({
  onSubmit,
  disabled,
  ref,
}: PromptComposerProps) {
  const [prompt, setPrompt] = useState('')
  const [useAvatar, setUseAvatar] = useState(false)
  const [settings, setSettings] = useState<ComposerSettings>({
    ratio: '9:16',
    seconds: 8,
    variations: 2,
  })

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const attachments = useImageAttachments({})
  const { isDragging, dropProps } = useFileDrop({ onFiles: attachments.add })

  useImperativeHandle(
    ref,
    () => ({
      openFilePicker: () => fileInputRef.current?.click(),
      setAvatar: setUseAvatar,
      focus: () => textareaRef.current?.focus(),
    }),
    [],
  )

  // Grow the textarea with its content, up to a cap.
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_PX)}px`
  }, [prompt])

  const canSubmit =
    !disabled && (prompt.trim().length > 0 || attachments.hasItems)

  function submit() {
    if (!canSubmit) return
    onSubmit({
      prompt: prompt.trim(),
      images: attachments.files,
      useAvatar,
      settings,
    })
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      submit()
    }
  }

  const summary = `${settings.ratio} · ${settings.seconds}s · x${settings.variations}`

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        submit()
      }}
      className="mx-auto w-full max-w-2xl"
    >
      <div
        {...dropProps}
        className={cn(
          'rounded-3xl border bg-card p-3 focus-within:border-foreground/25',
          isDragging
            ? 'border-primary ring-4 ring-primary/15'
            : 'border-border',
        )}
      >
        {attachments.items.length > 0 && (
          <ul className="flex flex-wrap gap-2 px-1 pb-2">
            {attachments.items.map((item) => (
              <li key={item.id} className="relative">
                <img
                  src={item.url}
                  alt={item.file.name}
                  className="size-14 rounded-xl border border-border object-cover"
                />
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
            ))}
          </ul>
        )}

        <textarea
          ref={textareaRef}
          rows={1}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Describe the ad you want to make..."
          aria-label="Describe the ad you want to make"
          className="block w-full resize-none bg-transparent px-2 py-1.5 text-base outline-none placeholder:text-muted-foreground md:text-sm"
        />

        <div className="mt-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={attachments.items.length >= MAX_IMAGES}
              aria-label="Attach product photos"
              className={cn(
                'grid size-9 place-items-center rounded-full border border-border bg-muted/40 text-foreground transition-[scale,opacity] duration-150 active:scale-[0.97] disabled:opacity-40',
                EASE,
              )}
            >
              <Plus aria-hidden className="size-4" />
            </button>

            <button
              type="button"
              aria-pressed={useAvatar}
              onClick={() => setUseAvatar((v) => !v)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-[scale] duration-150 active:scale-[0.97]',
                EASE,
                useAvatar
                  ? 'bg-primary/15 text-primary'
                  : 'bg-muted/60 text-muted-foreground',
              )}
            >
              {useAvatar && <Check aria-hidden className="size-3.5" />}
              Avatar
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger
                render={
                  <button
                    type="button"
                    aria-label={`Video settings: ${summary}`}
                    className={cn(
                      'inline-flex h-8 items-center rounded-full bg-muted/60 px-3 text-xs font-medium text-muted-foreground transition-[scale] duration-150 active:scale-[0.97]',
                      EASE,
                    )}
                  />
                }
              >
                {summary}
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="end"
                className="w-72 space-y-4 rounded-2xl"
              >
                <OptionGroup
                  label="Aspect ratio"
                  value={settings.ratio}
                  options={RATIOS}
                  format={(v) => v}
                  onChange={(ratio) => setSettings((s) => ({ ...s, ratio }))}
                />
                <OptionGroup
                  label="Length"
                  value={settings.seconds}
                  options={SECONDS}
                  format={(v) => `${v}s`}
                  onChange={(seconds) =>
                    setSettings((s) => ({ ...s, seconds }))
                  }
                />
                <OptionGroup
                  label="Variations"
                  value={settings.variations}
                  options={VARIATIONS}
                  format={(v) => `x${v}`}
                  onChange={(variations) =>
                    setSettings((s) => ({ ...s, variations }))
                  }
                />
              </PopoverContent>
            </Popover>

            <button
              type="submit"
              disabled={!canSubmit}
              aria-label="Create ad"
              className={cn(
                'grid size-9 place-items-center rounded-full bg-primary text-primary-foreground transition-[scale,opacity] duration-150 active:scale-[0.97] disabled:opacity-40',
                EASE,
              )}
            >
              <ArrowRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) attachments.add(e.target.files)
          e.target.value = '' // allow picking the same file again
        }}
      />
    </form>
  )
}
