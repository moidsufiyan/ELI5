import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const complexityLevels = [
  {
    value: 'ELI5' as const,
    label: "Like I'm 5",
    description: 'Very simple explanation for children',
    emoji: '🧸',
    color: 'border-blue-200 bg-blue-50 text-blue-800',
    activeColor: 'border-blue-500 bg-blue-100 text-blue-900'
  },
  {
    value: 'ELI15' as const,
    label: "Like I'm 15",
    description: 'Teen-friendly explanation',
    emoji: '🎓',
    color: 'border-green-200 bg-green-50 text-green-800',
    activeColor: 'border-green-500 bg-green-100 text-green-900'
  },
  {
    value: 'normal' as const,
    label: 'Normal',
    description: 'Adult-level explanation',
    emoji: '📚',
    color: 'border-purple-200 bg-purple-50 text-purple-800',
    activeColor: 'border-purple-500 bg-purple-100 text-purple-900'
  }
]

export type ComplexityLevel = typeof complexityLevels[number]['value']

export function getReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function getWordCount(text: string): number {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export function getCharacterCount(text: string): number {
  return text.length
}
