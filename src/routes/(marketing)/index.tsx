import { createFileRoute } from '@tanstack/react-router'
import { Hero } from './-components/hero'
import Features from './-components/features'

export const Route = createFileRoute('/(marketing)/')({ component: Home })

function Home() {
  return (
    <>
      <Hero />
      <Features />
    </>
  )
}
