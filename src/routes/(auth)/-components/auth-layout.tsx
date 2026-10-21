import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'
import { FieldDescription } from '@/components/ui/field'
import type { ComponentProps, ReactNode } from 'react'
import { Link } from '@tanstack/react-router'

type AuthLayoutProps = ComponentProps<'div'> & {
  children: ReactNode
  imageSrc?: string
  showLegalNotice?: boolean
}

export function AuthLayout({
  children,
  className,
  imageSrc = 'https://res.cloudinary.com/t44uxef1/image/upload/v1792583075/Scenova_Coastal_Skincare_Ad_Studio.png',
  showLegalNotice = true,
  ...props
}: AuthLayoutProps) {
  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          {children}

          <div className="relative hidden min-h-140 bg-muted md:block">
            <img
              src={imageSrc}
              alt={'Scenova auth workspace'}
              className="absolute inset-0 size-full object-cover"
            />
          </div>
        </CardContent>
      </Card>

      {showLegalNotice && (
        <FieldDescription className="px-6 text-center">
          By continuing, you agree to our{' '}
          <Link
            to="/"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Privacy Policy
          </Link>
          .
        </FieldDescription>
      )}
    </div>
  )
}
