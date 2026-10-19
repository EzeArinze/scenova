import { useEffect, useState } from 'react'
import type { Tone } from '../product-art'
import { cn } from 'cn'
import type { ReactNode } from 'react'

export function Crossfade({
  tone,
  className,
  children,
}: {
  tone: Tone
  className?: string
  children: (tone: Tone) => ReactNode
}) {
  const [slots, setSlots] = useState<[Tone, Tone]>([tone, tone])
  const [active, setActive] = useState<0 | 1>(0)

  useEffect(() => {
    if (slots[active].name === tone.name) return
    const next: 0 | 1 = active === 0 ? 1 : 0
    setSlots((current) => {
      const copy: [Tone, Tone] = [current[0], current[1]]
      copy[next] = tone
      return copy
    })
    setActive(next)
  }, [tone, slots, active])

  return (
    <div className={className}>
      {([0, 1] as const).map((index) => (
        <div
          key={index}
          aria-hidden="true"
          className={cn(
            'absolute inset-0 transition-[opacity,filter] duration-(--duration-slow) ease-out',
            active === index ? 'opacity-100 blur-0' : 'opacity-0 blur-[2px]',
          )}
        >
          {children(slots[index])}
        </div>
      ))}
    </div>
  )
}
