import type { CSSProperties, ReactNode } from 'react'
import type { MotionValue } from 'motion/react'
import { cn } from 'cn'
import { Parallax } from './parallax'

export function Float({
  className,
  delay,
  depth,
  tilt = 0,
  entrance = 'animate-pop-in',
  x,
  y,
  children,
}: {
  className: string
  delay: number
  depth: number
  tilt?: number
  entrance?: 'animate-pop-in' | 'animate-rise-in'
  x: MotionValue<number>
  y: MotionValue<number>
  children: ReactNode
}) {
  return (
    <div
      className={cn('absolute [animation-delay:var(--d)]', entrance, className)}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      <div style={{ transform: tilt ? `rotate(${tilt}deg)` : undefined }}>
        <Parallax depth={depth} x={x} y={y}>
          {children}
        </Parallax>
      </div>
    </div>
  )
}
