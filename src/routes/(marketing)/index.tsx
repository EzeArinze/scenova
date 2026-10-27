// import { createFileRoute } from '@tanstack/react-router'
// // import { Hero } from './-components/hero'
// import Features from './-components/features'
// import { NewHero } from './-components/new-hero'

// export const Route = createFileRoute('/(marketing)/')({ component: Home })

// function Home() {
//   return (
//     <>
//       <NewHero />
//       <Features />
//     </>
//   )
// }

import { createFileRoute } from '@tanstack/react-router'
import Features from './-components/features'
import { NewHero } from './-components/new-hero'

export const Route = createFileRoute('/(marketing)/')({ component: Home })

function Home() {
  return (
    <>
      <NewHero />

      <div className="mx-auto mt-16 grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:mt-24 lg:grid-cols-[1fr_1.05fr] lg:gap-6">
        <Features />
      </div>
    </>
  )
}
