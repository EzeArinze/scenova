import { Link, linkOptions, useNavigate } from '@tanstack/react-router'
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react'
import { cn } from 'cn'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import type { User } from '#/hooks/use-auth-session'
import { userObjectConstructor } from '#/utils/user-object-constructor'
import { signOut } from '#/lib/auth-client'
import { toast } from '#/components/ui/toast'
import { UserAvatar } from './user-avatat'
import { Tile } from './tile'

const accountLink = linkOptions({
  to: '/dashboard/account',
  activeOptions: { exact: true },
})
const itemClass =
  'gap-3 rounded-xl p-1.5 transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.98] cursor-pointer'

export function SideBarUser({ user }: { user: User }) {
  const { isMobile } = useSidebar()
  const { avatarUrl, email, initials, name } = userObjectConstructor({ user })
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut({
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className={cn(
                  'h-12 gap-3 rounded-xl px-1.5 ',
                  'transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ',
                  'active:scale-[0.98] ',
                  'hover-fine:bg-foreground/4 data-popup-open:bg-foreground/6 ',
                  // Collapsed: same square as the nav rows, avatar centered in it.
                  'group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!',
                )}
              >
                <UserAvatar
                  avatarUrl={avatarUrl}
                  name={name}
                  initials={initials}
                  className="size-7"
                />
                <div className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate text-sm font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
                <ChevronsUpDown
                  aria-hidden
                  className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden"
                />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={12}
            className="w-60 rounded-2xl p-1.5"
          >
            {/* Identity card */}
            <div className="flex items-center gap-3 p-2">
              <UserAvatar
                avatarUrl={avatarUrl}
                name={name}
                initials={initials}
                className="size-11"
              />
              <div className="grid min-w-0 flex-1 leading-tight">
                <span className="truncate text-sm font-semibold">{name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {email}
                </span>
              </div>
            </div>

            <DropdownMenuSeparator className="mx-1.5 my-1.5" />
            <DropdownMenuItem
              render={<Link {...accountLink} />}
              className={cn(
                itemClass,
                'mt-1',
                ' data-[status=active]:bg-foreground/6 data-[status=active]:text-foreground',
              )}
            >
              <Tile icon={BadgeCheck} />
              <span className="text-sm font-medium">Account</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="mx-1.5 my-1.5" />

            <DropdownMenuItem
              variant="destructive"
              onClick={handleSignOut}
              className={itemClass}
            >
              <Tile icon={LogOut} tone="destructive" />
              <span className="text-sm font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
