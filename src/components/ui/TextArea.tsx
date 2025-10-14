import React from 'react'
import { cn } from '@/lib/utils'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
  variant?: 'default' | 'modern'
  size?: 'sm' | 'md' | 'lg'
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, variant = 'modern', size = 'md', ...props }, ref) => {
    const variants = {
      default: 'border border-neutral-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500',
      modern: 'border-2 border-neutral-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 shadow-soft focus:shadow-medium'
    }

    const sizes = {
      sm: 'px-4 py-3 text-sm min-h-[80px]',
      md: 'px-6 py-4 text-base min-h-[120px]',
      lg: 'px-6 py-4 text-lg min-h-[160px]'
    }

    return (
      <div className="form-group">
        {label && (
          <label className="form-label">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full transition-all duration-300 resize-none bg-neutral-50/80 hover:bg-white focus:bg-white placeholder:text-neutral-400 dark:bg-neutral-800/80 dark:border-neutral-700 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800',
            variants[variant],
            sizes[size],
            error && 'border-error-500 focus:ring-error-500/10 focus:border-error-500 animate-error-shake',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <p className="form-error">
            <span className="text-lg mr-2">⚠️</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
