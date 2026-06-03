import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AppButtonProps = React.ComponentProps<typeof Button> & {
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  isLoading?: boolean
  loadingText?: string
}

export function AppButton({
  children,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  isLoading = false,
  loadingText,
  className,
  disabled,
  type='button',
  ...props
}: AppButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      className={cn('gap-2 h-9 px-4 py-2 cursor-pointer rounded-full', className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="h-4 w-4" />}
          {children}
          {RightIcon && <RightIcon className="h-4 w-4" />}
        </>
      )}
    </Button>
  )
}