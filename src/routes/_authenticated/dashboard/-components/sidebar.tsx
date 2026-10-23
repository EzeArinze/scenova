import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarRail,
} from '@/components/ui/sidebar'
import { Logo } from '#/routes/(marketing)/-components/logo'
import { cn } from 'cn'
import { NAV } from '#/utils/dashboard-contants'

// The raised square behind each icon, as in the reference.
function IconTile({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="grid size-7 shrink-0 place-items-center rounded-xl bg-foreground/6 shadow-xs ring-1 ring-foreground/10">
      <Icon aria-hidden className="size-4.5 text-primary" />
    </span>
  )
}

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
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
                            <span className="truncate">{label}</span>
                          </Link>
                        }
                        tooltip={label}
                        className={cn(
                          'h-10 gap-3 rounded-xl px-1.5 text-sm font-medium ',
                          'transition-[background-color,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] ',
                          'active:scale-[0.98] ',
                          'data-[status=active]:bg-foreground/6 data-[status=active]:text-foreground ',
                          'hover-fine:bg-foreground/4 ',
                          'group-data-[collapsible=icon]:size-12! group-data-[collapsible=icon]:p-1.5!',
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

      {/* <SidebarRail />*/}
    </Sidebar>
  )
}
