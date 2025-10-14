import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'floating' | 'glass'
  hover?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = 'default', hover = true, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-large',
      elevated: 'bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/50 dark:border-neutral-700/50 shadow-large',
      floating: 'bg-white/95 dark:bg-neutral-800/95 backdrop-blur-sm rounded-3xl border border-white/20 dark:border-neutral-700/30 shadow-large',
      glass: 'bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md rounded-3xl border border-white/20 dark:border-neutral-700/50 shadow-large'
    }

    return (
      <div
        ref={ref}
        className={cn(
          variants[variant],
          hover && 'hover:shadow-xl-soft transition-all duration-300 hover:scale-[1.01]',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-6 pb-4', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardHeader.displayName = 'CardHeader'

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-6 pt-0', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardContent.displayName = 'CardContent'

export const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-4 sm:p-6 pt-4', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)

CardFooter.displayName = 'CardFooter'

export const CardTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-tight', className)}
        {...props}
      >
        {children}
      </h3>
    )
  }
)

CardTitle.displayName = 'CardTitle'

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2 leading-relaxed', className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)

CardDescription.displayName = 'CardDescription'
