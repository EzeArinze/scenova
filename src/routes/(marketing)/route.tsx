import { createFileRoute, Outlet } from '@tanstack/react-router'
import { Nav } from './-components/nav'
import { Footer } from './-components/footer'

export const Route = createFileRoute('/(marketing)')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <Nav />
      <main
        aria-labelledby="marketing-page"
        className="relative overflow-x-clip pb-16 pt-28 sm:pt-32 lg:pb-24"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}
