import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { SEO } from '@/components/SEO'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Sparkles, Send, RotateCcw, History, ToggleLeft, ToggleRight } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import dynamic from 'next/dynamic'
const ResultPanel = dynamic(() => import('@/components/ResultPanel').then(m => m.ResultPanel), {
  ssr: true,
  loading: () => (
    <div className="card-floating p-6">
      <div className="h-6 w-32 bg-neutral-200 dark:bg-neutral-700 rounded mb-4 animate-pulse" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="h-4 w-11/12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
        <div className="h-4 w-10/12 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      </div>
    </div>
  )
})
import { motion } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { complexityLevels, type ComplexityLevel, cn, formatDate, truncateText } from '@/lib/utils'
import { Toast } from '@/components/ui/StatusMessage'

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

export default function SimplifyPage() {
  const {
    preferences,
    setIsProcessing,
    addToHistory,
    draftText,
    setDraftText,
    history,
  } = useAppStore()

  // Form state
  const [result, setResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null)
  const [wordCount, setWordCount] = useState<number>(0)
  const [originalWordCount, setOriginalWordCount] = useState<number>(0)
  const [processingTime, setProcessingTime] = useState<number>(0)
  const [streamingText, setStreamingText] = useState<string>('')
  const [wikiInfo, setWikiInfo] = useState<{ used_wiki: boolean, wiki_title?: string }>({ used_wiki: false })
  const [useWikipedia, setUseWikipedia] = useState(preferences.enableWikipedia)
  const resultRef = useRef<HTMLDivElement>(null)
  const startTime = useRef<number>(0)

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
    startTime.current = Date.now()

    try {
      const response = await fetch('/api/simplify-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: data.text,
          level: data.complexity,
          use_wiki: useWikipedia,
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
                      setProcessingTime(Math.round((Date.now() - startTime.current) / 1000))

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
    setOriginalWordCount(data.text.split(/\s+/).length)
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
      startTime.current = Date.now()

      try {
        const response = await fetch('/api/simplify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: data.text,
            complexity: data.complexity,
            useWikipedia: useWikipedia,
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
          setProcessingTime(Math.round((Date.now() - startTime.current) / 1000))

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
        setToast({ type: 'success', message: 'Result copied to clipboard' })
        setTimeout(() => setCopied(false), 2000)
      } catch (err) {
        console.error('Failed to copy:', err)
        setToast({ type: 'error', message: 'Copy failed' })
      }
    }
  }

  // Keyboard shortcuts: Ctrl+Enter to submit, Ctrl+C to copy result
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toLowerCase().includes('mac')
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey
      if (ctrlOrCmd && e.key.toLowerCase() === 'enter') {
        e.preventDefault()
        handleSubmit(onSubmit)()
      }
      if (ctrlOrCmd && e.key.toLowerCase() === 'c') {
        if (result || streamingText) {
          e.preventDefault()
          handleCopy()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [result, streamingText])

  const handleExport = () => {
    const textToExport = result || streamingText
    if (textToExport) {
      const blob = new Blob([textToExport], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eli5-simplified-${Date.now()}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setToast({ type: 'success', message: 'Exported as text file' })
    }
  }

  const handleExportFormatted = () => {
    const textToExport = result || streamingText
    if (!textToExport) return
    const formatted = `# ELI5 Simplification\n\n- Level: ${selectedComplexity}\n- Generated: ${new Date().toLocaleString()}\n${wikiInfo.used_wiki && wikiInfo.wiki_title ? `- Wikipedia: ${wikiInfo.wiki_title}\n` : ''}\n---\n\n${textToExport}`
    const blob = new Blob([formatted], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eli5-simplified-formatted-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    setToast({ type: 'success', message: 'Exported formatted text' })
  }

  const handleTryDifferentLevel = () => {
    // Reset result but keep the text
    setResult('')
    setStreamingText('')
    setError('')
    setWordCount(0)
    setProcessingTime(0)
    setWikiInfo({ used_wiki: false })
  }

  const handleReset = () => {
    setResult('')
    setStreamingText('')
    setError('')
    setWordCount(0)
    setOriginalWordCount(0)
    setProcessingTime(0)
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
    <>
      <SEO
        title="Simplify - ELI5 AI Simplifier"
        description="Use our AI-powered text simplification tool to transform complex topics into easy-to-understand explanations."
        type="article"
        canonical={typeof window !== 'undefined' ? window.location.origin + '/simplify' : undefined}
        image="/og.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Simplify - ELI5 AI Simplifier'
        }}
      />
      <Head>
        <title>Simplify - ELI5 AI Simplifier</title>
        <meta name="description" content="Use our AI-powered text simplification tool to transform complex topics into easy-to-understand explanations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          {toast && (
            <Toast
              type={toast.type}
              message={toast.message}
              onDismiss={() => setToast(null)}
              duration={2500}
            />
          )}
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            {/* Two-Column Grid Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              
              {/* Left Column: Input Form */}
              <div className="space-y-6">
                {/* Main Form Card */}
                <motion.div
                  className="card-floating p-6 sm:p-8"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    {/* Header */}
                    <div className="text-center mb-6 sm:mb-8">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2 sm:mb-3">
                        Transform Complex Ideas
                      </h2>
                      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Enter any complex text and get a clear, understandable explanation</p>
                    </div>

                    {/* Text Input */}
                    <div className="form-group">
                      <label htmlFor="text" className="form-label">
                        What would you like to understand? ✨
                      </label>
                      <textarea
                        id="text"
                        {...register('text', {
                          onChange: (e) => setDraftText(e.target.value),
                        })}
                        rows={6}
                        className="w-full px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg border-2 border-neutral-200 dark:border-neutral-700 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all duration-200 resize-none bg-neutral-50/80 dark:bg-neutral-800/80 hover:bg-white dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-800 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 text-neutral-900 dark:text-neutral-100 min-h-[200px] sm:min-h-[300px] shadow-soft focus:shadow-medium"
                        placeholder="Enter complex text to simplify... For example: 'Explain quantum mechanics', 'How does machine learning work?', or paste a scientific article"
                      />
                      {errors.text && (
                        <p className="form-error">
                          <span className="text-lg mr-2">⚠️</span> {errors.text.message}
                        </p>
                      )}
                      <div className="flex justify-between text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                        <span>{textValue?.length || 0}/5000 characters</span>
                        <motion.button
                          type="button"
                          onClick={handleReset}
                          className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center min-h-[44px] touch-manipulation"
                          whileTap={{ scale: 0.96 }}
                          aria-label="Clear input"
                        >
                          <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          Clear
                        </motion.button>
                      </div>
                    </div>

                    {/* Complexity Level Selection */}
                    <div className="form-group">
                      <label className="form-label">
                        Choose your explanation level 🎯
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        {complexityLevels.map((level) => (
                          <motion.label
                            key={level.value}
                            className={cn(
                              "relative cursor-pointer rounded-2xl border-2 p-3 sm:p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg min-h-[44px] touch-manipulation",
                              selectedComplexity === level.value
                                ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg ring-4 ring-primary-500/10"
                                : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            )}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <input
                              type="radio"
                              {...register('complexity')}
                              value={level.value}
                              className="sr-only"
                            />
                            <div className="text-center" role="radio" aria-checked={selectedComplexity === level.value}>
                              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">{level.emoji}</div>
                              <div className="font-bold text-sm sm:text-base mb-1 text-neutral-900 dark:text-neutral-100">{level.label}</div>
                              <div className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">{level.description}</div>
                              {level.value === 'normal' && (
                                <div className="mt-1 sm:mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium bg-primary-100 dark:bg-primary-900/30 px-2 py-1 rounded-full">
                                  ✨ Streaming Response
                                </div>
                              )}
                            </div>
                          </motion.label>
                        ))}
                      </div>
                    </div>

                    {/* Wikipedia Toggle */}
                    <div className="form-group">
                      <label className="form-label">
                        Wikipedia Enhancement 📚
                      </label>
                      <div className="flex items-center justify-between p-3 sm:p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700">
                        <div className="flex-1">
                          <p className="font-medium text-sm sm:text-base text-neutral-900 dark:text-neutral-100">Enable Wikipedia Context</p>
                          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">Add relevant Wikipedia information to enhance explanations</p>
                        </div>
                        <motion.button
                          type="button"
                          onClick={() => setUseWikipedia(!useWikipedia)}
                          className={cn(
                            "flex items-center justify-center w-12 h-6 rounded-full transition-colors duration-200 min-h-[44px] min-w-[44px] touch-manipulation",
                            useWikipedia ? "bg-primary-600" : "bg-neutral-300 dark:bg-neutral-600"
                          )}
                          whileTap={{ scale: 0.92 }}
                          role="switch"
                          aria-checked={useWikipedia}
                          aria-label="Toggle Wikipedia context"
                        >
                          {useWikipedia ? (
                            <ToggleRight className="w-5 h-5 text-white" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-white" />
                          )}
                        </motion.button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center pt-2 sm:pt-4">
                      <motion.button
                        type="submit"
                        disabled={isLoading || !textValue?.trim()}
                        className={cn(
                          "inline-flex items-center px-8 sm:px-12 py-3 sm:py-4 text-lg sm:text-xl font-bold text-white rounded-2xl shadow-large transition-all duration-200 min-h-[44px] touch-manipulation",
                          "bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 hover:from-primary-700 hover:via-primary-800 hover:to-primary-900",
                          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                          "hover:scale-105 hover:shadow-glow-lg active:scale-95",
                          isLoading ? "animate-pulse-subtle" : ""
                        )}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        aria-label="Simplify text"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 animate-spin" />
                            <span className="hidden sm:inline">{isStreaming ? 'Generating...' : 'Processing...'}</span>
                            <span className="sm:hidden">{isStreaming ? 'Generating...' : 'Processing...'}</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
                            <span className="hidden sm:inline">Simplify Text</span>
                            <span className="sm:hidden">Simplify</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </form>
                </motion.div>

                {/* Examples Section */}
                {!result && !streamingText && !isLoading && (
                  <motion.div
                    className="card-floating p-4 sm:p-6"
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.22 }}
                  >
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-800 dark:text-neutral-200 mb-3 sm:mb-4 text-center">
                      🚀 Try these examples to get started:
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:gap-4">
                      {examples.map((example, index) => (
                        <motion.button
                          key={index}
                          onClick={() => loadExample(example)}
                          className="p-3 sm:p-4 text-left bg-neutral-50 dark:bg-neutral-800 hover:bg-white dark:hover:bg-neutral-700 rounded-2xl border-2 border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-300 hover:scale-105 hover:shadow-lg group min-h-[44px] touch-manipulation"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center mb-1 sm:mb-2">
                            <span className="text-lg sm:text-xl mr-2">💡</span>
                            <span className="font-bold text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 text-sm sm:text-base">Example {index + 1}</span>
                          </div>
                          <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs sm:text-sm">{example}</p>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Right Column: Results Panel */}
              <div className="space-y-6">
                <ResultPanel
                  result={result}
                  streamingText={streamingText}
                  isStreaming={isStreaming}
                  isLoading={isLoading}
                  error={error}
                  selectedComplexity={selectedComplexity}
                  originalWordCount={originalWordCount}
                  simplifiedWordCount={wordCount}
                  processingTime={processingTime}
                  usedWiki={wikiInfo.used_wiki}
                  wikiTitle={wikiInfo.wiki_title}
                  onCopy={handleCopy}
                  onTryDifferentLevel={handleTryDifferentLevel}
                  onExport={handleExport}
                  onExportFormatted={handleExportFormatted}
                  copied={copied}
                />

                {/* Recent History */}
                <div className="card-floating p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                      <h2 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100">Recent</h2>
                    </div>
                    {history.length > 0 && (
                      <span className="text-xs text-neutral-500">{history.length} items</span>
                    )}
                  </div>

                    {history.length === 0 ? (
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">No recent items yet. Run a simplification to see it here.</p>
                  ) : (
                    <ul className="space-y-2 sm:space-y-3 max-h-48 sm:max-h-64 overflow-y-auto">
                      {history.slice(0, 5).map((item) => (
                        <li key={item.id} className="group border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 sm:p-4 hover:shadow-md transition-shadow">
                          <button
                            className="w-full text-left min-h-[44px] touch-manipulation"
                            onClick={() => setDraftText(item.originalText)}
                            title="Load text into editor"
                          >
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                              <div className="flex-1">
                                <div className="text-xs sm:text-sm text-neutral-500 mb-1">{formatDate(item.timestamp)} • {item.complexity}</div>
                                <div className="text-neutral-800 dark:text-neutral-200 text-xs sm:text-sm leading-relaxed">{truncateText(item.originalText, 100)}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); setValue('text', item.originalText); setDraftText(item.originalText); setResult(item.simplifiedText); setStreamingText(''); setError(''); }}
                                  className="text-primary-600 dark:text-primary-400 hover:underline text-xs"
                                  title="Quick load"
                                >
                                  Load
                                </button>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
