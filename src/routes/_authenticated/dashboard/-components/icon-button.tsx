import type { ButtonHTMLAttributes } from 'react'
import { cn } from 'cn'

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'aria-label': string
}

/** 44px square icon button with press feedback. Hover only on fine pointers. */
export function IconButton({ className, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'grid size-11 shrink-0 place-items-center rounded-xl text-muted-foreground transition-[scale,background-color,color] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 [@media(hover:hover)_and_(pointer:fine)]:hover:bg-muted [@media(hover:hover)_and_(pointer:fine)]:hover:text-foreground',
        className,
      )}
      {...props}
    />
  )
}
