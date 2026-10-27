import type { CSSProperties } from 'react'
import { createFileRoute, Outlet } from '@tanstack/react-router'
import { AppSidebar } from './-components/sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'

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
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger aria-label="Toggle sidebar" />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 pt-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
