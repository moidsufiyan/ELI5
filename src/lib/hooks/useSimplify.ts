import { useState, useCallback, useRef } from 'react'
import { useAppStore, type ComplexityLevel } from '../store'

// ── Types ─────────────────────────────────────────────────────────────────────

interface SimplifyResponse {
  simplified_text: string
  used_wiki: boolean
  wiki_title?: string
  metrics?: {
    original_length: number
    simplified_length: number
    reduction_percentage?: number
    processing_time_ms?: number
  }
}

interface UseSimplifyState {
  isLoading: boolean
  error: string | null
  result: SimplifyResponse | null
  retryCount: number
  isRetrying: boolean
}

export interface SimplifyParams {
  text: string
  complexity: ComplexityLevel
  useWikipedia: boolean
  topic: string
}

interface UseSimplifyReturn {
  isLoading: boolean
  error: string | null
  result: SimplifyResponse | null
  retryCount: number
  isRetrying: boolean
  lastParams: SimplifyParams | null
  simplify: (params: SimplifyParams) => Promise<void>
  retry: () => Promise<void>
  clearError: () => void
  clearResult: () => void
  reset: () => void
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000
const TIMEOUT_MS = 30_000

const INITIAL_STATE: UseSimplifyState = {
  isLoading: false,
  error: null,
  result: null,
  retryCount: 0,
  isRetrying: false,
}

// ── Core fetch helper ─────────────────────────────────────────────────────────

async function makeRequest(params: SimplifyParams): Promise<SimplifyResponse> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const response = await fetch('/api/simplify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      throw new Error(errorData.message || errorData.error || 'Request failed')
    }

    return await response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again.')
    }
    throw error
  }
}

// ── Main hook ─────────────────────────────────────────────────────────────────
// Previously this file had two near-identical hooks (485 lines). They are now
// merged into a single hook that always tracks `lastParams` for retry support.

export function useSimplify(): UseSimplifyReturn {
  const [state, setState] = useState<UseSimplifyState>(INITIAL_STATE)
  const lastParamsRef = useRef<SimplifyParams | null>(null)
  const { setIsProcessing, addToHistory } = useAppStore()

  const clearError = useCallback(() => setState(prev => ({ ...prev, error: null })), [])
  const clearResult = useCallback(() => setState(prev => ({ ...prev, result: null })), [])
  const reset = useCallback(() => {
    setState(INITIAL_STATE)
    lastParamsRef.current = null
  }, [])

  const simplify = useCallback(async (params: SimplifyParams) => {
    if (!params.text?.trim()) {
      setState(prev => ({ ...prev, error: 'Please enter some text to simplify', isLoading: false }))
      return
    }
    if (params.text.length > 5000) {
      setState(prev => ({ ...prev, error: 'Text is too long. Maximum 5000 characters allowed.', isLoading: false }))
      return
    }

    lastParamsRef.current = params
    setState({ isLoading: true, error: null, result: null, retryCount: 0, isRetrying: false })
    setIsProcessing(true)

    try {
      const result = await makeRequest(params)
      setState({ isLoading: false, error: null, result, retryCount: 0, isRetrying: false })
      addToHistory({
        originalText: params.text,
        simplifiedText: result.simplified_text,
        complexity: params.complexity,
        wordCount: result.simplified_text.split(/\s+/).length,
        usedWiki: result.used_wiki,
        wikiTitle: result.wiki_title,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        result: null,
        isRetrying: false,
      }))
    } finally {
      setIsProcessing(false)
    }
  }, [setIsProcessing, addToHistory])

  const retry = useCallback(async () => {
    const params = lastParamsRef.current
    if (!state.error || !params || state.retryCount >= MAX_RETRIES) return

    setState(prev => ({ ...prev, isRetrying: true, error: null, retryCount: prev.retryCount + 1 }))

    // Exponential backoff
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * Math.pow(2, state.retryCount)))

    setIsProcessing(true)
    try {
      const result = await makeRequest(params)
      setState(prev => ({ ...prev, isRetrying: false, error: null, result, retryCount: 0 }))
      addToHistory({
        originalText: params.text,
        simplifiedText: result.simplified_text,
        complexity: params.complexity,
        wordCount: result.simplified_text.split(/\s+/).length,
        usedWiki: result.used_wiki,
        wikiTitle: result.wiki_title,
      })
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRetrying: false,
        error: error instanceof Error ? error.message : 'Retry failed',
      }))
    } finally {
      setIsProcessing(false)
    }
  }, [state.error, state.retryCount, setIsProcessing, addToHistory])

  return {
    isLoading: state.isLoading,
    error: state.error,
    result: state.result,
    retryCount: state.retryCount,
    isRetrying: state.isRetrying,
    lastParams: lastParamsRef.current,
    simplify,
    retry,
    clearError,
    clearResult,
    reset,
  }
}

// ── Backward-compat alias ─────────────────────────────────────────────────────
// SimplifyTest.tsx imports useSimplifyWithRetry — keep it pointing to the same hook.
export const useSimplifyWithRetry = useSimplify
