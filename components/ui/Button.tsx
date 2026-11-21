import { cn } from '@/lib/utils'
import { forwardRef, type ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/60 disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985] cursor-pointer',
          variant === 'primary' &&
            'bg-[var(--accent)] text-[var(--accent-foreground)] hover:opacity-90',
          variant === 'secondary' &&
            'border border-white/10 bg-white/[0.04] text-[var(--text-primary)] hover:border-white/20 hover:bg-white/[0.08]',
          variant === 'ghost' &&
            'text-[var(--text-secondary)] hover:bg-white/[0.05] hover:text-[var(--text-primary)]',
          variant === 'danger' &&
            'border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20',
          size === 'sm' && 'h-9 px-3.5 text-xs',
          size === 'md' && 'min-h-[48px] px-5 text-sm',
          size === 'lg' && 'min-h-[52px] px-6 text-sm',
          className
        )}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
