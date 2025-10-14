import React from 'react'
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, RefreshCw, ExternalLink } from 'lucide-react'

interface StatusMessageProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
  }
  suggestions?: string[]
  className?: string
  onDismiss?: () => void
}

export function StatusMessage({
  type,
  title,
  message,
  action,
  suggestions = [],
  className = '',
  onDismiss
}: StatusMessageProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }

  const Icon = icons[type]

  const baseClasses = 'rounded-2xl p-6 border-2 animate-fade-in-up'
  const typeClasses = {
    success: 'status-success',
    error: 'status-error',
    warning: 'status-warning',
    info: 'status-info'
  }

  const iconClasses = {
    success: 'text-success-600 dark:text-success-400',
    error: 'text-error-600 dark:text-error-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-primary-600 dark:text-primary-400'
  }

  return (
    <div className={cn(baseClasses, typeClasses[type], className)}>
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <Icon className={cn('h-6 w-6 animate-success-check', iconClasses[type])} />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="text-lg font-semibold mb-2">
              {title}
            </h3>
          )}
          
          <p className="text-sm leading-relaxed mb-4">
            {message}
          </p>

          {suggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Suggestions:</h4>
              <ul className="text-sm space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary-500 mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {action && (
            <button
              onClick={action.onClick}
              className={cn(
                'inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 hover:scale-105 active:scale-95',
                action.variant === 'secondary'
                  ? 'bg-white/80 text-neutral-700 hover:bg-white border border-neutral-300 dark:bg-neutral-800/80 dark:text-neutral-300 dark:border-neutral-600'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg hover:shadow-xl'
              )}
            >
              {action.label}
              <RefreshCw className="w-4 h-4 ml-2" />
            </button>
          )}
        </div>

        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            aria-label="Dismiss"
          >
            <XCircle className="h-5 w-5 text-neutral-500" />
          </button>
        )}
      </div>
    </div>
  )
}

// Specialized error message with retry functionality
interface ErrorMessageProps {
  title?: string
  message: string
  onRetry?: () => void
  onDismiss?: () => void
  suggestions?: string[]
  className?: string
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  onRetry,
  onDismiss,
  suggestions = [],
  className = ''
}: ErrorMessageProps) {
  const defaultSuggestions = [
    'Check your internet connection',
    'Try refreshing the page',
    'Make sure the backend service is running'
  ]

  return (
    <StatusMessage
      type="error"
      title={title}
      message={message}
      suggestions={suggestions.length > 0 ? suggestions : defaultSuggestions}
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
        variant: 'primary'
      } : undefined}
      onDismiss={onDismiss}
      className={cn('animate-error-shake', className)}
    />
  )
}

// Success message with celebration
interface SuccessMessageProps {
  title?: string
  message: string
  onAction?: () => void
  actionLabel?: string
  onDismiss?: () => void
  className?: string
}

export function SuccessMessage({
  title = 'Success!',
  message,
  onAction,
  actionLabel = 'Continue',
  onDismiss,
  className = ''
}: SuccessMessageProps) {
  return (
    <StatusMessage
      type="success"
      title={title}
      message={message}
      action={onAction ? {
        label: actionLabel,
        onClick: onAction,
        variant: 'primary'
      } : undefined}
      onDismiss={onDismiss}
      className={cn('animate-success-check', className)}
    />
  )
}

// Warning message
interface WarningMessageProps {
  title?: string
  message: string
  onAction?: () => void
  actionLabel?: string
  onDismiss?: () => void
  className?: string
}

export function WarningMessage({
  title = 'Warning',
  message,
  onAction,
  actionLabel = 'Learn More',
  onDismiss,
  className = ''
}: WarningMessageProps) {
  return (
    <StatusMessage
      type="warning"
      title={title}
      message={message}
      action={onAction ? {
        label: actionLabel,
        onClick: onAction,
        variant: 'secondary'
      } : undefined}
      onDismiss={onDismiss}
      className={className}
    />
  )
}

// Info message
interface InfoMessageProps {
  title?: string
  message: string
  onAction?: () => void
  actionLabel?: string
  onDismiss?: () => void
  className?: string
}

export function InfoMessage({
  title = 'Information',
  message,
  onAction,
  actionLabel = 'Learn More',
  onDismiss,
  className = ''
}: InfoMessageProps) {
  return (
    <StatusMessage
      type="info"
      title={title}
      message={message}
      action={onAction ? {
        label: actionLabel,
        onClick: onAction,
        variant: 'secondary'
      } : undefined}
      onDismiss={onDismiss}
      className={className}
    />
  )
}

// Toast notification component
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onDismiss: () => void
  duration?: number
  className?: string
}

export function Toast({
  type,
  message,
  onDismiss,
  duration = 5000,
  className = ''
}: ToastProps) {
  React.useEffect(() => {
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [onDismiss, duration])

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info
  }

  const Icon = icons[type]

  const typeClasses = {
    success: 'bg-success-50 border-success-200 text-success-800 dark:bg-success-900/20 dark:border-success-800 dark:text-success-200',
    error: 'bg-error-50 border-error-200 text-error-800 dark:bg-error-900/20 dark:border-error-800 dark:text-error-200',
    warning: 'bg-warning-50 border-warning-200 text-warning-800 dark:bg-warning-900/20 dark:border-warning-800 dark:text-warning-200',
    info: 'bg-primary-50 border-primary-200 text-primary-800 dark:bg-primary-900/20 dark:border-primary-800 dark:text-primary-200'
  }

  const iconClasses = {
    success: 'text-success-600 dark:text-success-400',
    error: 'text-error-600 dark:text-error-400',
    warning: 'text-warning-600 dark:text-warning-400',
    info: 'text-primary-600 dark:text-primary-400'
  }

  return (
    <div className={cn(
      'fixed top-4 right-4 z-50 max-w-sm w-full bg-white dark:bg-neutral-800 rounded-2xl border-2 shadow-large p-4 animate-slide-down',
      typeClasses[type],
      className
    )}>
      <div className="flex items-center space-x-3">
        <Icon className={cn('h-5 w-5 flex-shrink-0', iconClasses[type])} />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        >
          <XCircle className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

