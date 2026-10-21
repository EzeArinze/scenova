import { cn } from 'cn'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

const logoVariants = cva('', {
  variants: {
    size: {
      sm: 'size-4',
      default: 'size-6',
      lg: 'size-8',
      xl: 'size-10',
      '2xl': 'size-12',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

type LogoProps = VariantProps<typeof logoVariants> & {
  className?: string
}

export function Logo({ className, size, ...props }: LogoProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)} {...props}>
      <img
        src="/favicon.svg"
        alt=""
        className={cn(logoVariants({ size }), 'object-cover')}
      />
      <span className="text-xl font-bold leading-none tracking-[-0.03em]">
        Scenova
      </span>
    </span>
  )
}
