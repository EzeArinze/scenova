import type { ReactElement } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CircleUserRound, CreditCard, LogOut } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { authClient } from '#/lib/auth-client'
import { Link, useNavigate } from '@tanstack/react-router'
import type { User } from '#/integrations/get-auth-session'
import { toast } from './ui/toast'

type Props = {
  trigger: ReactElement
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
  session: {
    user: User
    initials: string
    avatarUrl: string
  }
}

type MenuItem = {
  label: string
  icon: LucideIcon
  destructive?: boolean
  href?: string
}

const PROFILE_ITEMS: MenuItem[] = [
  { label: 'Dashboard', icon: CircleUserRound, href: '/dashboard' },
  { label: 'My Subscription', icon: CreditCard, href: '/#' },
]

const LOGOUT_ITEM: MenuItem = {
  label: 'Signout',
  icon: LogOut,
  destructive: true,
}

const itemClass =
  'p-2 text-sm font-medium text-popover-foreground cursor-pointer gap-2'

export function UserDropdown({
  trigger,
  defaultOpen,
  align = 'end',
  session: { user, avatarUrl, initials },
}: Props) {
  const navigate = useNavigate()

  async function handleSignOut() {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({ to: '/' })
        },
        onError: () => {
          toast.add({
            title: 'Failed to SignOut',
            type: 'error',
            description: 'Error signing out',
            priority: 'high',
          })
        },
      },
    })
    return
  }

  return (
    <div className="flex items-center justify-center">
      <DropdownMenu defaultOpen={defaultOpen}>
        <DropdownMenuTrigger className="cursor-pointer">
          {trigger}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={align}
          className="w-3xs rounded-2xl data-open:slide-in-from-bottom-20! data-closed:slide-out-to-bottom-20 data-open:fade-in-0 data-closed:fade-out-0 data-closed:zoom-out-100 duration-400"
        >
          <DropdownMenuGroup>
            {/* User Info */}
            <DropdownMenuLabel className="flex items-center gap-3 px-4 py-3">
              <div className="relative">
                <Avatar className="size-10">
                  <AvatarImage src={avatarUrl} alt={user.name} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <span className="ring-card absolute right-0 bottom-0 size-2 rounded-full bg-green-600 ring-2" />
              </div>

              <div className="flex flex-col">
                <span className="text-popover-foreground text-sm font-medium">
                  {user.name}
                </span>
                <span className="text-muted-foreground text-sm truncate">
                  {user.email}
                </span>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Main Links */}
            {PROFILE_ITEMS.map(({ label, icon: Icon, href }) => (
              <DropdownMenuItem
                key={label}
                className={itemClass}
                render={<Link to={href} />}
              >
                <Icon size={20} />
                <span>{label}</span>
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              variant="destructive"
              className={itemClass}
              onClick={async () => await handleSignOut()}
            >
              <LOGOUT_ITEM.icon size={20} />
              <span>{LOGOUT_ITEM.label}</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
