import React from 'react'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
  children?: React.ReactNode
}

export function Skeleton({ className, children, ...props }: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'skeleton skeleton-shimmer rounded-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Text skeleton variants
export function TextSkeleton({ 
  lines = 1, 
  className = '',
  lastLineWidth = '75%' 
}: { 
  lines?: number
  className?: string
  lastLineWidth?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            'h-4',
            i === lines - 1 && lastLineWidth !== '100%' ? `w-[${lastLineWidth}]` : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

// Card skeleton
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('card-elevated p-6 space-y-4', className)}>
      <Skeleton className="h-6 w-3/4" />
      <TextSkeleton lines={3} />
      <div className="flex space-x-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  )
}

// Form skeleton
export function FormSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-32 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
      <Skeleton className="h-12 w-full" />
    </div>
  )
}

// Result skeleton for loading states
export function ResultSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={cn('card-elevated p-6 space-y-4', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-3">
        <TextSkeleton lines={4} />
        <TextSkeleton lines={3} lastLineWidth="60%" />
      </div>
    </div>
  )
}

// Button skeleton
export function ButtonSkeleton({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-12 w-32',
    lg: 'h-14 w-40'
  }
  
  return (
    <Skeleton className={cn('rounded-2xl', sizeClasses[size], className)} />
  )
}

// Avatar skeleton
export function AvatarSkeleton({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }
  
  return (
    <Skeleton className={cn('rounded-full', sizeClasses[size], className)} />
  )
}

// Table skeleton
export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number
  columns?: number
  className?: string
}) {
  return (
    <div className={cn('space-y-3', className)}>
      {/* Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-full" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} className="h-4 w-full" />
          ))}
        </div>
      ))}
    </div>
  )
}

// Loading spinner with professional styling
export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }
  
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-neutral-300 border-t-primary-600',
        sizeClasses[size],
        className
      )}
    />
  )
}

// Pulse loading indicator
export function PulseLoader({ 
  className = '' 
}: { 
  className?: string
}) {
  return (
    <div className={cn('flex space-x-1', className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-2 w-2 bg-primary-600 rounded-full animate-bounce"
          style={{ animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  )
}

// Typing indicator
export function TypingIndicator({ 
  className = '' 
}: { 
  className?: string
}) {
  return (
    <div className={cn('flex items-center space-x-1', className)}>
      <span className="text-neutral-600 dark:text-neutral-400 text-sm">AI is thinking</span>
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-1 w-1 bg-primary-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  )
}

