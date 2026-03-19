import React, { useState, useRef, useEffect } from 'react'
import Head from 'next/head'
import { SEO } from '@/components/SEO'
import { Loader2, Send, RotateCcw, Copy, CheckCircle, ToggleLeft, ToggleRight, Sparkles, ServerCrash } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/lib/store'
import { complexityLevels, type ComplexityLevel, cn } from '@/lib/utils'
import { Toast } from '@/components/ui/StatusMessage'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  error?: string
  complexity?: ComplexityLevel
  usedWiki?: boolean
  wikiTitle?: string
  metrics?: {
    originalWordCount: number
    simplifiedWordCount: number
    processingTime?: number
  }
}

export default function SimplifyPage() {
  const { preferences, draftText, setDraftText, addToHistory } = useAppStore()

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState(draftText || '')
  const [selectedComplexity, setSelectedComplexity] = useState<ComplexityLevel>(preferences.defaultComplexity)
  const [useWikipedia, setUseWikipedia] = useState(preferences.enableWikipedia)
  const [isLoading, setIsLoading] = useState(false)
  
  const [toast, setToast] = useState<{ type: 'success' | 'error' | 'info' | 'warning', message: string } | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [inputValue])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setToast({ type: 'success', message: 'Result copied to clipboard' })
    } catch (err) {
      setToast({ type: 'error', message: 'Copy failed' })
    }
  }

  const handleStreamingResponse = async (textToProcess: string, complexityToUse: ComplexityLevel, wikiToUse: boolean) => {
    const userMsgId = Date.now().toString()
    const assistantMsgId = (Date.now() + 1).toString()
    
    // Add user message and initial assistant message
    setMessages(prev => [
      ...prev, 
      { id: userMsgId, role: 'user', content: textToProcess },
      { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true, complexity: complexityToUse }
    ])

    const startTime = Date.now()

    try {
      const response = await fetch('/api/simplify-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: textToProcess,
          level: complexityToUse,
          use_wiki: wikiToUse,
          topic: textToProcess.split(' ').slice(0, 3).join(' '),
        }),
      })

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let buffer = ''
      let finalUsedWiki = false
      let finalWikiTitle: string | undefined = undefined

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim()
              if (!jsonStr || jsonStr === '[DONE]') continue
              const chunk = JSON.parse(jsonStr)
              
              if (chunk.type === 'metadata') {
                finalUsedWiki = chunk.used_wiki
                finalWikiTitle = chunk.wiki_title
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId ? { ...msg, usedWiki: finalUsedWiki, wikiTitle: finalWikiTitle } : msg
                ))
              }
              else if (chunk.type === 'content') {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId ? { ...msg, content: chunk.current_text } : msg
                ))
              }
              else if (chunk.type === 'complete') {
                const finalContent = chunk.final_text
                const words = finalContent.split(/\s+/).length
                const origWords = textToProcess.split(/\s+/).length
                const timeTaken = Math.round((Date.now() - startTime) / 1000)

                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMsgId ? { 
                    ...msg, 
                    content: finalContent, 
                    isStreaming: false,
                    metrics: { originalWordCount: origWords, simplifiedWordCount: words, processingTime: timeTaken }
                  } : msg
                ))

                addToHistory({
                  originalText: textToProcess,
                  simplifiedText: finalContent,
                  complexity: complexityToUse,
                  wordCount: words,
                  usedWiki: finalUsedWiki,
                  wikiTitle: finalWikiTitle,
                })
              }
              else if (chunk.type === 'error') {
                throw new Error(chunk.error)
              }
            } catch (e) {
              console.error('Error parsing chunk:', e)
            }
          }
        }
      }
    } catch (err: any) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, isStreaming: false, error: err.message || 'Stream failed' } : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNormalResponse = async (textToProcess: string, complexityToUse: ComplexityLevel, wikiToUse: boolean) => {
    const userMsgId = Date.now().toString()
    const assistantMsgId = (Date.now() + 1).toString()
    
    setMessages(prev => [
      ...prev, 
      { id: userMsgId, role: 'user', content: textToProcess },
      { id: assistantMsgId, role: 'assistant', content: '', isStreaming: true, complexity: complexityToUse }
    ])

    const startTime = Date.now()

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToProcess,
          complexity: complexityToUse,
          useWikipedia: wikiToUse,
          topic: textToProcess.split(' ').slice(0, 3).join(' '),
        }),
      })

      const result = await response.json()

      if (response.ok && result.simplified_text) {
        const finalContent = result.simplified_text
        const words = finalContent.split(/\s+/).length
        const origWords = textToProcess.split(/\s+/).length
        const timeTaken = Math.round((Date.now() - startTime) / 1000)

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMsgId ? { 
            ...msg, 
            content: finalContent, 
            isStreaming: false,
            usedWiki: result.used_wiki,
            wikiTitle: result.wiki_title,
            metrics: { originalWordCount: origWords, simplifiedWordCount: words, processingTime: timeTaken }
          } : msg
        ))

        addToHistory({
          originalText: textToProcess,
          simplifiedText: finalContent,
          complexity: complexityToUse,
          wordCount: words,
          usedWiki: !!result.used_wiki,
          wikiTitle: result.wiki_title,
        })
      } else {
        throw new Error(result.error || result.message || 'Failed to simplify text.')
      }
    } catch (err: any) {
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMsgId ? { ...msg, isStreaming: false, error: err.message || 'Error connecting to server' } : msg
      ))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const textToProcess = inputValue.trim()
    setInputValue('')
    setDraftText('')
    setIsLoading(true)
    
    // Simulate slight delay for natural chat feel
    await new Promise(resolve => setTimeout(resolve, 50))

    if (selectedComplexity === 'normal') {
      await handleStreamingResponse(textToProcess, selectedComplexity, useWikipedia)
    } else {
      await handleNormalResponse(textToProcess, selectedComplexity, useWikipedia)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleReset = () => {
    setMessages([])
    setInputValue('')
    setDraftText('')
  }

  return (
    <>
      <SEO title="Simplify Workspace - ELI5" description="Conversational AI text simplification workspace." />
      <Head>
        <title>Simplify - ELI5 AI Simplifier</title>
      </Head>
      
      <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        <Header />
        
        {toast && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50">
            <Toast type={toast.type} message={toast.message} onDismiss={() => setToast(null)} duration={2500} />
          </div>
        )}

        {/* Chat Log Area */}
        <main className="flex-1 overflow-y-auto w-full">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-32 space-y-6">
            
            {messages.length === 0 ? (
              <motion.div 
                className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-3xl flex items-center justify-center mb-6 shadow-glow">
                  <Sparkles className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">
                  How can I help you today?
                </h2>
                <p className="text-neutral-500 dark:text-neutral-400 max-w-lg mb-8">
                  Paste any complex text, article, or topic below. I'll break it down so it's simple to understand.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
                  {['Explain quantum physics simply', 'How do black holes work?', 'Summarize neural networks', 'What is blockchain technology?'].map((example, i) => (
                    <button 
                      key={i}
                      onClick={() => setInputValue(example)}
                      className="p-3 text-sm text-left border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-white dark:hover:bg-neutral-800 transition-colors dark:text-neutral-300"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="space-y-8">
                <AnimatePresence>
                  {messages.map((msg) => (
                    <motion.div 
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn("flex w-full", msg.role === 'user' ? "justify-end" : "justify-start")}
                    >
                      <div className={cn(
                        "max-w-[85%] sm:max-w-[75%] rounded-3xl p-5 text-sm sm:text-base leading-relaxed whitespace-pre-wrap shadow-sm",
                        msg.role === 'user' 
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-tr-sm"
                          : "bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-tl-sm backdrop-blur-md"
                      )}>
                        {msg.role === 'assistant' && (
                          <div className="flex items-center gap-2 mb-3 pb-3 border-b border-neutral-100 dark:border-neutral-800/50 text-xs font-semibold text-neutral-500">
                            <Sparkles className="w-4 h-4 text-primary-500" />
                            <span>ELI5 Assistant ({complexityLevels.find(l => l.value === msg.complexity)?.label || 'Normal'})</span>
                            {msg.usedWiki && <span className="text-primary-600 dark:text-primary-400 flex items-center gap-1">• 📚 {msg.wikiTitle}</span>}
                          </div>
                        )}
                        
                        {msg.content}
                        
                        {msg.isStreaming && <span className="inline-block w-2 h-4 sm:h-5 bg-primary-500 animate-pulse ml-1 align-middle"></span>}
                        {msg.error && (
                          <div className="text-red-500 flex items-center gap-2 mt-2 font-medium">
                            <ServerCrash className="w-4 h-4" /> {msg.error}
                          </div>
                        )}

                        {/* AI Metrics & Actions */}
                        {msg.role === 'assistant' && !msg.isStreaming && !msg.error && (
                          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/50 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
                            <div className="flex gap-4">
                              <span>Reduced from {msg.metrics?.originalWordCount} to {msg.metrics?.simplifiedWordCount} words</span>
                              {msg.metrics?.processingTime && <span>⏱️ {msg.metrics.processingTime}s</span>}
                            </div>
                            <button 
                              onClick={() => handleCopy(msg.content)}
                              className="flex items-center gap-1.5 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                            >
                              <Copy className="w-4 h-4" /> Copy
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </main>

        {/* Sticky Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white via-white to-transparent dark:from-neutral-950 dark:via-neutral-950 pt-20 pb-6 px-4 sm:px-6">
          <div className="max-w-3xl mx-auto">
            
            {/* Controls Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
              <div className="flex items-center gap-2 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full p-1 shadow-sm">
                {complexityLevels.map((level) => (
                  <button
                    key={level.value}
                    type="button"
                    onClick={() => setSelectedComplexity(level.value as ComplexityLevel)}
                    className={cn(
                      "px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200",
                      selectedComplexity === level.value
                        ? "bg-primary-500 text-white shadow-md scale-105"
                        : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    )}
                  >
                    <span className="mr-1.5 hidden sm:inline">{level.emoji}</span>
                    {level.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full px-3 py-1.5 shadow-sm">
                <span className="hidden sm:inline font-medium">Wiki Context</span>
                <span className="sm:hidden font-medium">Wiki</span>
                <button
                  type="button"
                  onClick={() => setUseWikipedia(!useWikipedia)}
                  className={cn("transition-colors duration-200", useWikipedia ? "text-primary-600" : "text-neutral-400")}
                >
                  {useWikipedia ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Input Wrapper */}
            <div className="relative flex items-end gap-2 bg-white dark:bg-neutral-900 border-2 border-neutral-200 dark:border-neutral-800 rounded-3xl p-2 shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-colors focus-within:border-primary-500 dark:focus-within:border-primary-600 focus-within:shadow-primary-500/10">
              <button
                type="button"
                onClick={handleReset}
                title="Clear Chat"
                className="p-3 text-neutral-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message ELI5..."
                className="flex-1 max-h-48 overflow-y-auto bg-transparent text-neutral-900 dark:text-neutral-100 py-3 px-2 resize-none focus:outline-none placeholder:text-neutral-400 text-base"
                rows={1}
                disabled={isLoading}
              />

              <button
                // Use onClick instead of form submit to prevent defaults easily
                onClick={handleSubmit} 
                disabled={!inputValue.trim() || isLoading}
                className={cn(
                  "p-3 rounded-full flex-shrink-0 transition-all duration-200",
                  inputValue.trim() && !isLoading
                    ? "bg-primary-600 hover:bg-primary-700 text-white shadow-glow hover:scale-105"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                )}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
            
            <p className="text-center text-[10px] text-neutral-400 mt-2">
              ELI5 AI can make mistakes. Consider verifying important information.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}
