import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'error' | 'warning'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    disabled, 
    children, 
    leftIcon,
    rightIcon,
    fullWidth = false,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none touch-manipulation select-none'
    
    const variants = {
      primary: 'bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 text-white hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 focus:ring-primary-500/30 shadow-large hover:shadow-glow-lg hover:scale-105 active:scale-95',
      secondary: 'bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-800 hover:from-neutral-200 hover:to-neutral-300 focus:ring-neutral-500/20 border border-neutral-300 shadow-soft hover:shadow-medium dark:from-neutral-700 dark:to-neutral-600 dark:text-neutral-200 dark:border-neutral-600',
      outline: 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500/30 shadow-soft hover:shadow-medium dark:text-primary-400 dark:hover:bg-primary-950 dark:border-primary-600',
      ghost: 'text-neutral-700 hover:bg-neutral-100 focus:ring-neutral-500/20 dark:text-neutral-300 dark:hover:bg-neutral-800',
      success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-600 hover:to-success-700 focus:ring-success-500/30 shadow-large hover:shadow-lg hover:scale-105 active:scale-95',
      error: 'bg-gradient-to-r from-error-500 to-error-600 text-white hover:from-error-600 hover:to-error-700 focus:ring-error-500/30 shadow-large hover:shadow-lg hover:scale-105 active:scale-95',
      warning: 'bg-gradient-to-r from-warning-500 to-warning-600 text-white hover:from-warning-600 hover:to-warning-700 focus:ring-warning-500/30 shadow-large hover:shadow-lg hover:scale-105 active:scale-95',
    }
    
    const sizes = {
      xs: 'px-3 py-2 text-xs min-h-[32px]',
      sm: 'px-4 py-2.5 text-sm min-h-[36px]',
      md: 'px-6 py-3 text-base min-h-[44px]', 
      lg: 'px-8 py-4 text-lg min-h-[52px]',
      xl: 'px-10 py-5 text-xl min-h-[60px]',
    }
    
    return (
      <button
        ref={ref}
        className={cn(
          baseStyles, 
          variants[variant], 
          sizes[size], 
          fullWidth && 'w-full',
          isLoading && 'animate-pulse-subtle',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : leftIcon ? (
          <span className="mr-2">{leftIcon}</span>
        ) : null}
        
        <span className="flex-1">{children}</span>
        
        {rightIcon && !isLoading && (
          <span className="ml-2">{rightIcon}</span>
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
