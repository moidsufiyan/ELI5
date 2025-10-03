import React from 'react'
import { cn } from '@/lib/utils'

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helperText?: string
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-4 py-3 text-base rounded-xl border-2 transition-all duration-200',
            'bg-neutral-50 dark:bg-neutral-900',
            'border-neutral-200 dark:border-neutral-700',
            'text-neutral-900 dark:text-neutral-100',
            'placeholder:text-neutral-400 dark:placeholder:text-neutral-500',
            'focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-neutral-800',
            'hover:border-neutral-300 dark:hover:border-neutral-600',
            'resize-none',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/10',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm font-medium text-error-600 dark:text-error-400 flex items-center">
            <span className="mr-1">⚠️</span> {error}
          </p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

TextArea.displayName = 'TextArea'
