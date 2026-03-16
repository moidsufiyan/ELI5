import React, { useState } from 'react'
import { useSimplifyWithRetry } from '../lib/hooks/useSimplify'
import { type ComplexityLevel } from '../lib/store'
import { Button } from './ui/Button'
import { TextArea } from './ui/TextArea'
import { Card } from './ui/Card'

export function SimplifyTest() {
  const [text, setText] = useState('')
  const [complexity, setComplexity] = useState<ComplexityLevel>('ELI5')
  const [useWikipedia, setUseWikipedia] = useState(true)
  const [topic, setTopic] = useState('')

  const {
    isLoading,
    error,
    result,
    retryCount,
    isRetrying,
    simplify,
    retry,
    clearError,
    clearResult,
    reset
  } = useSimplifyWithRetry()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!text.trim()) {
      return
    }

    await simplify({
      text,
      complexity,
      useWikipedia,
      topic
    })
  }

  const handleRetry = async () => {
    await retry()
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Test Simplify API Integration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="text" className="block text-sm font-medium mb-2">
              Text to Simplify
            </label>
            <TextArea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to simplify..."
              rows={4}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="complexity" className="block text-sm font-medium mb-2">
                Complexity Level
              </label>
              <select
                id="complexity"
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as ComplexityLevel)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="ELI5">ELI5 (Like I'm 5)</option>
                <option value="ELI15">ELI15 (Like I'm 15)</option>
                <option value="normal">Normal (Adult Level)</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useWikipedia}
                  onChange={(e) => setUseWikipedia(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Use Wikipedia</span>
              </label>
            </div>

            <div>
              <label htmlFor="topic" className="block text-sm font-medium mb-2">
                Topic (for Wikipedia)
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., quantum physics"
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!useWikipedia}
              />
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              type="submit"
              disabled={isLoading || !text.trim()}
              className="flex-1"
            >
              {isLoading ? 'Simplifying...' : 'Simplify Text'}
            </Button>
            
            {error && retryCount < 3 && (
              <Button
                type="button"
                onClick={handleRetry}
                disabled={isRetrying}
                variant="outline"
              >
                {isRetrying ? 'Retrying...' : `Retry (${retryCount}/3)`}
              </Button>
            )}
          </div>
        </form>
      </Card>

      {}
      {error && (
        <Card className="p-6 border-red-200 bg-red-50">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
              <p className="text-red-700">{error}</p>
              {retryCount > 0 && (
                <p className="text-sm text-red-600 mt-2">
                  Retry attempts: {retryCount}/3
                </p>
              )}
            </div>
            <Button
              onClick={clearError}
              variant="outline"
              size="sm"
              className="text-red-700 border-red-300 hover:bg-red-100"
            >
              Dismiss
            </Button>
          </div>
        </Card>
      )}

      {}
      {result && (
        <Card className="p-6 border-green-200 bg-green-50">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-semibold text-green-800">Simplified Text</h3>
            <Button
              onClick={clearResult}
              variant="outline"
              size="sm"
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              Clear
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-md border">
              <p className="text-gray-800 whitespace-pre-wrap">
                {result.simplified_text}
              </p>
            </div>

            {}
            {result.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-gray-800">
                    {result.metrics.original_length}
                  </div>
                  <div className="text-gray-600">Original Length</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-gray-800">
                    {result.metrics.simplified_length}
                  </div>
                  <div className="text-gray-600">Simplified Length</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-gray-800">
                    {result.metrics.reduction_percentage}%
                  </div>
                  <div className="text-gray-600">Reduction</div>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <div className="font-semibold text-gray-800">
                    {result.metrics.processing_time_ms}ms
                  </div>
                  <div className="text-gray-600">Processing Time</div>
                </div>
              </div>
            )}

            {}
            {result.used_wiki && result.wiki_title && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Wikipedia context used:</span> {result.wiki_title}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {}
      <div className="text-center">
        <Button
          onClick={reset}
          variant="outline"
          className="text-gray-600"
        >
          Reset All
        </Button>
      </div>
    </div>
  )
}

