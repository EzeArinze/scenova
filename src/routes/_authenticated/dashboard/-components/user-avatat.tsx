import { Avatar, AvatarFallback, AvatarImage } from '#/components/ui/avatar'
import { cn } from 'cn'

export function UserAvatar({
  avatarUrl,
  name,
  initials,
  className,
}: {
  avatarUrl?: string
  name: string
  initials: string
  className?: string
}) {
  return (
    <Avatar className={cn('rounded-xl ring-1 ring-foreground/10', className)}>
      <AvatarImage src={avatarUrl} alt={name} className="rounded-xl" />
      <AvatarFallback className="rounded-xl bg-primary/15 text-sm font-semibold text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
