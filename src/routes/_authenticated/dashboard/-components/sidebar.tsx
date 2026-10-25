import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Logo } from '#/routes/(marketing)/-components/logo'
import { cn } from 'cn'
import { NAV } from '#/utils/dashboard-contants'
import type { User } from '#/hooks/use-auth-session'
import { SideBarUser } from './user-dropdown'

type IAppProps = React.ComponentProps<typeof Sidebar> & { user: User }

// The raised square behind each icon, as in the reference.
function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-foreground/6 shadow-xs ring-1 ring-foreground/10">
      <Icon aria-hidden className="size-4.5 text-primary" />
    </span>
  )
}

export function AppSidebar(props: IAppProps) {
  return (
    <Sidebar variant="floating" collapsible="icon" {...props}>
      <SidebarHeader className="px-3 pt-4">
        <Link
          to="/"
          aria-label="Scenova home"
          className="flex h-10 items-center overflow-hidden rounded-lg"
        >
          <Logo />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 pb-3">
        {NAV.map((group) => (
          <div key={group.label}>
            <SidebarGroup className="px-2 py-1">
              <SidebarGroupLabel className="px-2 text-xs font-medium text-muted-foreground">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1">
                  {/* Change the key here to use link.to instead of index*/}
                  {group.items.map(({ label, icon, ...link }, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuButton
                        render={
                          <Link {...link}>
                            <IconTile icon={icon} />
                            <span className="truncate group-data-[collapsible=icon]:hidden">
                              {label}
                            </span>
                          </Link>
                        }
                        tooltip={label}
                        className={cn(
                          'h-10 gap-3 rounded-xl px-1.5 text-sm font-medium ',
                          'transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ',
                          'active:scale-[0.98] ',
                          'data-[status=active]:bg-foreground/6 data-[status=active]:text-foreground ',
                          'hover-fine:bg-foreground/4 ',
                          // Collapsed: a square exactly as wide as the rail's column,
                          // with the tile centered inside it.
                          'group-data-[collapsible=icon]:size-10! group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0!',
                        )}
                      />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="px-2 pb-3">
        <SideBarUser user={props.user} />
      </SidebarFooter>

      {/* <SidebarRail />*/}
    </Sidebar>
  )
}
