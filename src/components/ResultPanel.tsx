import React, { useRef, useEffect } from 'react'
import { Copy, Download, RotateCcw, Loader2, CheckCircle, Clock, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ComplexityLevel } from '@/lib/store'
import { Skeleton, TextSkeleton, LoadingSpinner, TypingIndicator } from './ui/LoadingSkeleton'
import { ErrorMessage, SuccessMessage } from './ui/StatusMessage'
import { motion, AnimatePresence } from 'framer-motion'

interface ResultPanelProps {
  result: string
  streamingText: string
  isStreaming: boolean
  isLoading: boolean
  error: string
  selectedComplexity: ComplexityLevel
  originalWordCount: number
  simplifiedWordCount: number
  processingTime?: number
  usedWiki: boolean
  wikiTitle?: string
  onCopy: () => void
  onTryDifferentLevel: () => void
  onExport: () => void
  onExportFormatted?: () => void
  copied: boolean
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-center space-x-3">
      <Skeleton className="w-8 h-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
    
    <TextSkeleton lines={4} />
    <TextSkeleton lines={2} lastLineWidth="60%" />
  </div>
)

const MetricsBox = ({ 
  originalWordCount, 
  simplifiedWordCount, 
  processingTime,
  usedWiki,
  wikiTitle 
}: {
  originalWordCount: number
  simplifiedWordCount: number
  processingTime?: number
  usedWiki: boolean
  wikiTitle?: string
}) => {
  const reduction = originalWordCount > 0 ? Math.round(((originalWordCount - simplifiedWordCount) / originalWordCount) * 100) : 0
  
  return (
    <div className="bg-white/60 dark:bg-neutral-800/60 rounded-xl p-3 sm:p-4 border border-neutral-200 dark:border-neutral-700">
      <h4 className="text-xs sm:text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 sm:mb-3 flex items-center">
        <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
        Text Analysis
      </h4>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
        <div>
          <div className="text-neutral-500 dark:text-neutral-400">Original</div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{originalWordCount} words</div>
        </div>
        <div>
          <div className="text-neutral-500 dark:text-neutral-400">Simplified</div>
          <div className="font-semibold text-neutral-900 dark:text-neutral-100">{simplifiedWordCount} words</div>
        </div>
        <div>
          <div className="text-neutral-500 dark:text-neutral-400">Reduction</div>
          <div className={`font-semibold ${reduction > 0 ? 'text-success-600' : 'text-neutral-600'}`}>
            {reduction > 0 ? `-${reduction}%` : '0%'}
          </div>
        </div>
        {processingTime && (
          <div>
            <div className="text-neutral-500 dark:text-neutral-400">Processing</div>
            <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {processingTime}s
            </div>
          </div>
        )}
      </div>
      
      {usedWiki && wikiTitle && (
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center text-xs text-primary-600 dark:text-primary-400">
            <span className="mr-1">📚</span>
            Enhanced with Wikipedia: {wikiTitle}
          </div>
        </div>
      )}
    </div>
  )
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  streamingText,
  isStreaming,
  isLoading,
  error,
  selectedComplexity,
  originalWordCount,
  simplifiedWordCount,
  processingTime,
  usedWiki,
  wikiTitle,
  onCopy,
  onTryDifferentLevel,
  onExport,
  onExportFormatted,
  copied
}) => {
  const resultRef = useRef<HTMLDivElement>(null)
  const complexityLevels = {
    'ELI5': { emoji: '🧸', label: "Like I'm 5" },
    'ELI15': { emoji: '🎓', label: "Like I'm 15" },
    'normal': { emoji: '📚', label: 'Normal' }
  }
  
  const selectedLevel = complexityLevels[selectedComplexity]

  
  useEffect(() => {
    if (resultRef.current && isStreaming) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight
    }
  }, [streamingText, isStreaming])

  if (isLoading && !result && !streamingText) {
    return (
      <motion.div className="card-floating p-6 sm:p-8" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
        <div className="text-center mb-4 sm:mb-6">
          <div className="flex items-center justify-center mb-3 sm:mb-4">
            <LoadingSpinner size="lg" />
          </div>
          <h3 className="text-lg sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Processing Your Text
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            AI is analyzing and simplifying your content...
          </p>
        </div>
        <LoadingSkeleton />
      </motion.div>
    )
  }

  if (error) {
    return (
      <ErrorMessage
        title="Something went wrong"
        message={error}
        suggestions={[
          'Check your internet connection',
          'Try refreshing the page',
          'Make sure the backend service is running'
        ]}
      />
    )
  }

  if (!result && !streamingText) {
    return (
      <div className="card-floating p-6 sm:p-8">
        <div className="text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Ready to Simplify
          </h3>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
            Enter your text and select a complexity level to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-2 border-success-200 dark:border-success-800 rounded-3xl p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      role="region"
      aria-labelledby="result-heading"
    >
      {}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
        <div className="flex items-center">
          <span className="text-2xl sm:text-3xl mr-3 sm:mr-4">{selectedLevel.emoji}</span>
          <div>
            <h3 id="result-heading" className="text-lg sm:text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              {selectedLevel.label} Explanation
            </h3>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center">
                📊 {simplifiedWordCount} words
              </span>
              <span className="flex items-center">
                ⏱️ {Math.ceil(simplifiedWordCount / 200)} min read
              </span>
              {isStreaming && (
                <span className="flex items-center text-primary-600 dark:text-primary-400 font-medium">
                  <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 animate-spin" />
                  Streaming...
                </span>
              )}
            </div>
          </div>
        </div>
        
        {}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <motion.button
            onClick={onCopy}
            disabled={!(result || streamingText)}
            className={cn(
              "flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 min-h-[44px] touch-manipulation",
              "border-2 hover:scale-105 active:scale-95",
              copied 
                ? "bg-success-100 border-success-300 text-success-700 dark:bg-success-900/30 dark:border-success-700 dark:text-success-300"
                : "bg-white border-success-300 text-success-700 hover:bg-success-50 dark:bg-neutral-800 dark:border-success-600 dark:text-success-300 dark:hover:bg-success-900/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            )}
            title="Copy to clipboard"
            aria-label={copied ? 'Result copied' : 'Copy simplified result'}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            {copied ? (
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            ) : (
              <Copy className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            )}
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy Result'}</span>
            <span className="sm:hidden">{copied ? 'Copied!' : 'Copy'}</span>
          </motion.button>
          
          <motion.button
            onClick={onExport}
            disabled={!result}
            className={cn(
              "flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 min-h-[44px] touch-manipulation",
              "border-2 hover:scale-105 active:scale-95",
              "bg-white border-success-300 text-success-700 hover:bg-success-50 dark:bg-neutral-800 dark:border-success-600 dark:text-success-300 dark:hover:bg-success-900/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            )}
            title="Export as text file"
            aria-label="Export result as text"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Export</span>
          </motion.button>

          {onExportFormatted && (
            <motion.button
              onClick={onExportFormatted}
              disabled={!result}
              className={cn(
                "flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 min-h-[44px] touch-manipulation",
                "border-2 hover:scale-105 active:scale-95",
                "bg-white border-success-300 text-success-700 hover:bg-success-50 dark:bg-neutral-800 dark:border-success-600 dark:text-success-300 dark:hover:bg-success-900/20",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              )}
              title="Export formatted"
              aria-label="Export result as formatted text"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
            >
              <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export (formatted)</span>
              <span className="sm:hidden">Formatted</span>
            </motion.button>
          )}
          
          <motion.button
            onClick={onTryDifferentLevel}
            disabled={!result}
            className={cn(
              "flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-200 min-h-[44px] touch-manipulation",
              "border-2 hover:scale-105 active:scale-95",
              "bg-white border-success-300 text-success-700 hover:bg-success-50 dark:bg-neutral-800 dark:border-success-600 dark:text-success-300 dark:hover:bg-success-900/20",
              "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            )}
            title="Try a different complexity level"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
          >
            <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Try Different Level</span>
            <span className="sm:hidden">Try Different</span>
          </motion.button>
        </div>
      </div>
      
      {}
      <motion.div className="mb-4 sm:mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        <MetricsBox
          originalWordCount={originalWordCount}
          simplifiedWordCount={simplifiedWordCount}
          processingTime={processingTime}
          usedWiki={usedWiki}
          wikiTitle={wikiTitle}
        />
      </motion.div>
      
      {}
      <motion.div 
        ref={resultRef}
        className="bg-white/80 dark:bg-neutral-800/80 rounded-xl p-4 sm:p-6 max-h-64 sm:max-h-96 overflow-y-auto shadow-soft"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        role="region"
        aria-live="polite"
        aria-busy={isStreaming}
      >
        <div className="prose prose-sm sm:prose-lg max-w-none dark:prose-invert">
          <div className="text-neutral-800 dark:text-neutral-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            <AnimatePresence mode="wait">
              {isStreaming && streamingText ? (
                <motion.span
                  key="streaming"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {streamingText}
                  <span className="inline-block w-2 h-4 sm:h-6 bg-primary-500 animate-pulse ml-1"></span>
                </motion.span>
              ) : (
                <motion.span
                  key="result"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {result}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
