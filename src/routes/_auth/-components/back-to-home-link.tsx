import { buttonVariants } from '#/components/ui/button'
import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

function BackToHomeLink() {
  return (
    <Link
      to="/"
      className={buttonVariants({
        variant: 'link',
        className:
          'absolute top-3.5 left-3 inline-flex items-center justify-center gap-1',
      })}
    >
      <IconArrowLeft className="size-4" />
      <span>Home</span>
    </Link>
  )
}

export default BackToHomeLink
