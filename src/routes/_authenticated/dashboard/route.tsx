import type { CSSProperties } from 'react'
import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
import { AppSidebar } from './-components/sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { buttonVariants } from '#/components/ui/button'
import { Trash } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { auth } = Route.useRouteContext()
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': '17rem',
          '--sidebar-width-icon': 'calc(var(--spacing) * 14)',
        } as CSSProperties
      }
    >
      <AppSidebar user={auth} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center justify-between gap-2 px-4">
          <SidebarTrigger aria-label="Toggle sidebar" />
          {/* <Tooltip>
            <TooltipTrigger
              render={
                <Link
                  to="/dashboard/trash"
                  activeOptions={{ exact: true }}
                  className={buttonVariants({
                    variant: 'ghost',
                    className: '',
                  })}
                >
                  <Trash className="size-4" />
                </Link>
              }
            ></TooltipTrigger>
            <TooltipContent>
              <p>Trash</p>
            </TooltipContent>
          </Tooltip>*/}
          <Link
            to="/dashboard/trash"
            activeOptions={{ exact: true }}
            className={buttonVariants({
              variant: 'ghost',
              className:
                'group size-9 gap-0 overflow-hidden px-0 transition-all duration-200 hover:w-25 hover:justify-center hover:gap-2 hover:px-3',
            })}
          >
            <span className="flex shrink-0 items-center justify-center">
              <Trash className="size-4" />
            </span>

            <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs opacity-0 transition-all duration-200 group-hover:max-w-12 group-hover:opacity-100">
              Trash
            </span>
          </Link>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
