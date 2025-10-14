import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Sparkles, Copy, CheckCircle, Send, RotateCcw } from 'lucide-react'
import { complexityLevels, type ComplexityLevel, cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'

// Form schema
const formSchema = z.object({
  text: z.string().min(10, 'Text must be at least 10 characters').max(5000, 'Text is too long'),
  complexity: z.enum(['ELI5', 'ELI15', 'normal'])
})

type FormData = z.infer<typeof formSchema>

// Streaming response interfaces
interface StreamChunk {
  type: 'metadata' | 'content' | 'complete' | 'error'
  word?: string
  current_text?: string
  word_index?: number
  is_complete?: boolean
  used_wiki?: boolean
  wiki_title?: string
  total_words?: number
  final_text?: string
  error?: string
}

const SimplificationForm: React.FC = () => {
  const {
    preferences,
    setIsProcessing,
    addToHistory,
    draftText,
    setDraftText,
  } = useAppStore()
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [wordCount, setWordCount] = useState<number>(0)
  const [readingTime, setReadingTime] = useState<number>(0)
  const [streamingText, setStreamingText] = useState<string>('')
  const [wikiInfo, setWikiInfo] = useState<{ used_wiki: boolean, wiki_title?: string }>({ used_wiki: false })
  const resultRef = useRef<HTMLDivElement>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: draftText || '',
      complexity: preferences.defaultComplexity,
    }
  })

  const selectedComplexity = watch('complexity')
  const textValue = watch('text')
  const selectedLevel = complexityLevels.find(level => level.value === selectedComplexity)

  // Auto-scroll to bottom during streaming
  useEffect(() => {
    if (resultRef.current && isStreaming) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight
    }
  }, [streamingText, isStreaming])

  const handleStreamingResponse = async (data: FormData) => {
    setIsLoading(true)
    setIsStreaming(true)
    setError('')
    setResult('')
    setStreamingText('')
    setWikiInfo({ used_wiki: false })
    setIsProcessing(true)

    try {
      const response = await fetch('/api/simplify-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data.text,
          level: data.complexity,
          use_wiki: preferences.enableWikipedia,
          topic: data.text.split(' ').slice(0, 3).join(' '),
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No reader available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim()
              if (jsonStr) {
                const chunk: StreamChunk = JSON.parse(jsonStr)
                
                switch (chunk.type) {
                  case 'metadata':
                    setWikiInfo({ 
                      used_wiki: chunk.used_wiki || false, 
                      wiki_title: chunk.wiki_title 
                    })
                    break
                    
                  case 'content':
                    if (chunk.current_text) {
                      setStreamingText(chunk.current_text)
                    }
                    break
                    
                  case 'complete':
                    if (chunk.final_text) {
                      setResult(chunk.final_text)
                      const words = chunk.final_text.split(/\s+/).length
                      setWordCount(words)
                      setReadingTime(Math.ceil(words / 200))

                      // Save to history
                      addToHistory({
                        originalText: data.text,
                        simplifiedText: chunk.final_text,
                        complexity: data.complexity,
                        wordCount: words,
                        usedWiki: wikiInfo.used_wiki,
                        wikiTitle: wikiInfo.wiki_title,
                      })
                    }
                    break
                    
                  case 'error':
                    setError(chunk.error || 'An error occurred')
                    break
                }
              }
            } catch (e) {
              console.error('Error parsing chunk:', e)
            }
          }
        }
      }
    } catch (err) {
      console.error('Stream error:', err)
      setError('Failed to generate explanation. Please check your internet connection and try again.')
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setIsProcessing(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    setIsProcessing(true)
    if (data.complexity === 'normal') {
      // Use streaming for normal (adult) explanations
      await handleStreamingResponse(data)
    } else {
      // Use regular API for ELI5 and ELI15
      setIsLoading(true)
      setError('')
      setResult('')
      setStreamingText('')

      try {
        const response = await fetch('/api/simplify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.text,
            complexity: data.complexity,
            useWikipedia: preferences.enableWikipedia,
            topic: data.text.split(' ').slice(0, 3).join(' '),
          }),
        })

        const result = await response.json()

        if (response.ok && result.simplified_text) {
          setResult(result.simplified_text)
          setWikiInfo({ 
            used_wiki: result.used_wiki || false, 
            wiki_title: result.wiki_title 
          })
          const words = result.simplified_text.split(/\s+/).length
          setWordCount(words)
          setReadingTime(Math.ceil(words / 200))

          // Save to history
          addToHistory({
            originalText: data.text,
            simplifiedText: result.simplified_text,
            complexity: data.complexity,
            wordCount: words,
            usedWiki: !!result.used_wiki,
            wikiTitle: result.wiki_title,
          })
        } else {
          setError(result.detail || result.error || 'Failed to simplify text')
        }
      } catch (err) {
        setError('Failed to generate explanation. Please check your internet connection and try again.')
      } finally {
        setIsLoading(false)
        setIsProcessing(false)
      }
    }
  }

  const handleCopy = async () => {
    const textToCopy = result || streamingText
    if (textToCopy) {
      try {
        await navigator.clipboard.writeText(textToCopy)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
      }
    }
  }

  const handleReset = () => {
    setResult('')
    setStreamingText('')
    setError('')
    setWordCount(0)
    setReadingTime(0)
    setWikiInfo({ used_wiki: false })
    setValue('text', '')
    setDraftText('')
  }

  const loadExample = (exampleText: string) => {
    setValue('text', exampleText)
    setDraftText(exampleText)
    setResult('')
    setStreamingText('')
    setError('')
  }

  const examples = [
    'Explain quantum physics and how particles can exist in multiple states simultaneously',
    'How does machine learning work and how do neural networks process information?',
    'What is blockchain technology and how does cryptocurrency mining work?'
  ]

  return (
    <div className="max-w-5xl mx-auto">
      {/* Main Form Card */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-8 mb-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Transform Complex Ideas
            </h2>
            <p className="text-slate-600">Enter any complex text and get a clear, understandable explanation</p>
          </div>

          {/* Text Input */}
          <div className="space-y-3">
            <label htmlFor="text" className="block text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              What would you like to understand? ✨
            </label>
            <textarea
              id="text"
              {...register('text', {
                onChange: (e) => setDraftText(e.target.value),
              })}
              rows={6}
              className="w-full px-6 py-4 text-lg border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 resize-none bg-neutral-50 dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-800 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100"
              placeholder="Enter complex text here... For example: 'Explain quantum mechanics', 'How does machine learning work?', or paste a scientific article"
            />
            {errors.text && (
              <p className="text-error-600 dark:text-error-400 text-sm font-medium flex items-center">
                <span className="text-lg mr-2">⚠️</span> {errors.text.message}
              </p>
            )}
            <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
              <span>{textValue?.length || 0}/5000 characters</span>
              <button
                type="button"
                onClick={handleReset}
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Clear
              </button>
            </div>
          </div>

          {/* Complexity Level Selection */}
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Choose your explanation level 🎯
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {complexityLevels.map((level) => (
                <label
                  key={level.value}
                  className={cn(
                    "relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg",
                    selectedComplexity === level.value
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg ring-4 ring-primary-500/10"
                      : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  <input
                    type="radio"
                    {...register('complexity')}
                    value={level.value}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-3">{level.emoji}</div>
                    <div className="font-bold text-lg mb-2 text-neutral-900 dark:text-neutral-100">{level.label}</div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">{level.description}</div>
                    {level.value === 'normal' && (
                      <div className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                        ✨ Streaming Response
                      </div>
                    )}
                  </div>
                  {selectedComplexity === level.value && (
                    <div className="absolute -top-3 -right-3">
                      <CheckCircle className="w-8 h-8 text-primary-500 bg-white dark:bg-neutral-900 rounded-full shadow-lg" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isLoading || !textValue?.trim()}
              className={cn(
                "inline-flex items-center px-12 py-4 text-xl font-bold text-white rounded-2xl shadow-xl transition-all duration-200",
                "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                "hover:scale-105 hover:shadow-primary-500/25 active:scale-95",
                isLoading ? "animate-pulse-subtle" : ""
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  {isStreaming ? 'Generating...' : 'Processing...'}
                </>
              ) : (
                <>
                  <Send className="w-6 h-6 mr-3" />
                  Simplify with AI
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 mb-8 animate-slide-up">
          <div className="flex items-start">
            <div className="flex-shrink-0 text-2xl mr-4">❌</div>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-2">Something went wrong</h3>
              <p className="text-red-700 leading-relaxed">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {(result || streamingText || isStreaming) && (
        <div className="bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 rounded-2xl p-8 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <span className="text-3xl mr-4">{selectedLevel?.emoji}</span>
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-1">
                  {selectedLevel?.label} Explanation
                </h3>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    📊 {wordCount} words
                  </span>
                  <span className="flex items-center">
                    ⏱️ {readingTime} min read
                  </span>
                  {wikiInfo.used_wiki && wikiInfo.wiki_title && (
                    <span className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">
                      📚 Enhanced with Wikipedia: {wikiInfo.wiki_title}
                    </span>
                  )}
                  {isStreaming && (
                    <span className="flex items-center text-blue-600 font-medium">
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Streaming...
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleCopy}
                disabled={!(result || streamingText)}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200",
                  "border-2 hover:scale-105 active:scale-95",
                  copied 
                    ? "bg-green-100 border-green-300 text-green-700"
                    : "bg-white border-emerald-300 text-emerald-700 hover:bg-emerald-50",
                  "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                )}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div 
            ref={resultRef}
            className="bg-white/80 rounded-xl p-6 max-h-96 overflow-y-auto"
          >
            <div className="prose prose-lg max-w-none">
              <div className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                {isStreaming && streamingText ? (
                  <>
                    {streamingText}
                    <span className="inline-block w-2 h-6 bg-blue-500 animate-pulse ml-1"></span>
                  </>
                ) : (
                  result
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Examples Section */}
      {!result && !streamingText && !isLoading && (
        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">
            🚀 Try these examples to get started:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <button
                key={index}
                onClick={() => loadExample(example)}
                className="p-6 text-left bg-white/80 backdrop-blur-sm hover:bg-white rounded-2xl border-2 border-slate-200 hover:border-blue-300 transition-all duration-300 hover:scale-105 hover:shadow-lg group"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">💡</span>
                  <span className="font-bold text-blue-600 group-hover:text-blue-700">Example {index + 1}</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">{example}</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SimplificationForm