import { createFileRoute } from '@tanstack/react-router'
import { Hero } from './(marketing)/-components/hero'
import { Nav } from './(marketing)/-components/nav'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <div className="">
      <Nav />
      <Hero />
    </div>
  )
}
