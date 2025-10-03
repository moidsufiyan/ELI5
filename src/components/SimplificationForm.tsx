import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Sparkles, Copy, Volume2, CheckCircle } from 'lucide-react'
import { complexityLevels, type ComplexityLevel, cn } from '@/lib/utils'

// Form schema
const formSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters').max(5000, 'Text is too long'),
  complexity: z.enum(['ELI5', 'ELI15', 'normal'])
})

type FormData = z.infer<typeof formSchema>

// API response interface
interface SimplificationResult {
  success: boolean
  simplified_text?: string
  error?: string
  word_count?: number
  reading_time?: number
}

const SimplificationForm: React.FC = () => {
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [wordCount, setWordCount] = useState<number>(0)
  const [readingTime, setReadingTime] = useState<number>(0)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      complexity: 'ELI5'
    }
  })

  const selectedComplexity = watch('complexity')
  const textValue = watch('text')
  const selectedLevel = complexityLevels.find(level => level.value === selectedComplexity)

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError('')
    setResult('')

    try {
      // Call FastAPI backend
      const response = await fetch('http://localhost:8000/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data.text,
          level: data.complexity,
          use_wiki: true,
          topic: data.text.split(' ').slice(0, 3).join(' '), // Extract first few words as potential topic
        }),
      })

      const result = await response.json()

      if (response.ok && result.simplified_text) {
        setResult(result.simplified_text)
        // Calculate stats from the result
        const words = result.simplified_text.split(/\s+/).length
        setWordCount(words)
        setReadingTime(Math.ceil(words / 200))
      } else {
        setError(result.detail || result.error || 'Failed to simplify text')
      }
    } catch (err) {
      setError('Network error. Please make sure the Python backend is running on port 8000.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleSpeak = () => {
    if (result && 'speechSynthesis' in window) {
      // Stop any ongoing speech
      speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(result)
      utterance.rate = 0.8
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const loadExample = (exampleText: string) => {
    setValue('text', exampleText)
    setResult('')
    setError('')
  }

  const examples = [
    'Explain quantum physics and how particles can exist in multiple states simultaneously',
    'How does photosynthesis work and why is it essential for life on Earth?',
    'What is machine learning and how do neural networks process information?'
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Main Form */}
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Text Input */}
          <div>
            <label htmlFor="text" className="block text-sm font-semibold text-gray-700 mb-3">
              What would you like to understand? ✨
            </label>
            <textarea
              id="text"
              {...register('text')}
              rows={6}
              className="textarea"
              placeholder="Enter complex text here... For example: 'Explain quantum mechanics' or paste a scientific article"
            />
            {errors.text && (
              <p className="mt-2 text-sm text-red-600 flex items-center">
                ⚠️ {errors.text.message}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-500">
              {textValue?.length || 0}/5000 characters
            </div>
          </div>

          {/* Complexity Level Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Choose your explanation level 🎯
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {complexityLevels.map((level) => (
                <label
                  key={level.value}
                  className={cn(
                    "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200 hover:scale-105",
                    selectedComplexity === level.value
                      ? level.activeColor + ' shadow-md'
                      : level.color + ' hover:border-gray-300'
                  )}
                >
                  <input
                    type="radio"
                    {...register('complexity')}
                    value={level.value}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-3xl mb-2">{level.emoji}</div>
                    <div className="font-semibold text-sm mb-1">{level.label}</div>
                    <div className="text-xs opacity-90">{level.description}</div>
                  </div>
                  {selectedComplexity === level.value && (
                    <div className="absolute -top-2 -right-2">
                      <CheckCircle className="w-6 h-6 text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading || !textValue?.trim()}
              className={cn(
                "btn btn-primary px-8 py-4 text-lg font-semibold min-w-[200px] transition-all duration-200",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:scale-105 active:scale-95",
                isLoading ? "animate-pulse" : ""
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Simplifying...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Simplify with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="card border-red-200 bg-red-50 animate-slide-up">
          <div className="flex items-center text-red-800">
            <div className="flex-shrink-0 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="font-semibold">Oops! Something went wrong</h3>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="card border-green-200 bg-green-50 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <span className="text-2xl mr-3">{selectedLevel?.emoji}</span>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Simplified Explanation ({selectedLevel?.label})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  📊 {wordCount} words • ⏱️ {readingTime} min read
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCopy}
                className={cn(
                  "btn btn-secondary text-sm transition-all duration-200",
                  copied ? "bg-green-200 text-green-800" : ""
                )}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 mr-1" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleSpeak}
                className="btn btn-secondary text-sm"
                title="Read aloud"
              >
                <Volume2 className="w-4 h-4 mr-1" />
                Listen
              </button>
            </div>
          </div>
          
          <div className="prose prose-green max-w-none">
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
              {result}
            </div>
          </div>
        </div>
      )}

      {/* Examples Section */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🚀 Try these examples to get started:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examples.map((example, index) => (
            <button
              key={index}
              onClick={() => loadExample(example)}
              className="p-4 text-left bg-white hover:bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-center mb-2">
                <span className="text-lg mr-2">💡</span>
                <span className="font-medium text-sm text-primary-600">Example {index + 1}</span>
              </div>
              <p className="text-sm text-gray-700 line-clamp-3">{example}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SimplificationForm