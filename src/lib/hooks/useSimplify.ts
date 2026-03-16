import { useState, useCallback } from 'react'
import { useAppStore, type ComplexityLevel } from '../store'


interface SimplifyResponse {
  simplified_text: string
  used_wiki: boolean
  wiki_title?: string
  metrics?: {
    original_length: number
    simplified_length: number
    reduction_percentage: number
    processing_time_ms: number
  }
}

interface ApiError {
  error: string
  message: string
  status?: number
  detail?: string
}


interface UseSimplifyState {
  isLoading: boolean
  error: string | null
  result: SimplifyResponse | null
  retryCount: number
  isRetrying: boolean
}


interface UseSimplifyReturn {
  
  isLoading: boolean
  error: string | null
  result: SimplifyResponse | null
  retryCount: number
  isRetrying: boolean
  
  
  simplify: (params: SimplifyParams) => Promise<void>
  retry: () => Promise<void>
  clearError: () => void
  clearResult: () => void
  reset: () => void
}


interface SimplifyParams {
  text: string
  complexity: ComplexityLevel
  useWikipedia: boolean
  topic: string
}


const MAX_RETRIES = 3
const RETRY_DELAY = 1000 
const TIMEOUT_DURATION = 30000 

export function useSimplify(): UseSimplifyReturn {
  const [state, setState] = useState<UseSimplifyState>({
    isLoading: false,
    error: null,
    result: null,
    retryCount: 0,
    isRetrying: false,
  })

  const { setIsProcessing, addToHistory } = useAppStore()

  
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  
  const clearResult = useCallback(() => {
    setState(prev => ({ ...prev, result: null }))
  }, [])

  
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      retryCount: 0,
      isRetrying: false,
    })
  }, [])

  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  
  const makeRequest = async (params: SimplifyParams): Promise<SimplifyResponse> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION)

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Unknown error',
          message: 'Failed to parse error response'
        }))
        
        throw new Error(errorData.message || errorData.error || 'Request failed')
      }

      const data: SimplifyResponse = await response.json()
      return data

    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.')
        }
        throw error
      }
      
      throw new Error('An unexpected error occurred')
    }
  }

  
  const simplify = useCallback(async (params: SimplifyParams) => {
    
    if (!params.text?.trim()) {
      setState(prev => ({
        ...prev,
        error: 'Please enter some text to simplify',
        isLoading: false
      }))
      return
    }

    if (params.text.length > 5000) {
      setState(prev => ({
        ...prev,
        error: 'Text is too long. Maximum 5000 characters allowed.',
        isLoading: false
      }))
      return
    }

    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null,
      retryCount: 0,
      isRetrying: false
    }))

    setIsProcessing(true)

    try {
      const result = await makeRequest(params)
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        result,
        retryCount: 0,
        isRetrying: false
      }))

      
      addToHistory({
        originalText: params.text,
        simplifiedText: result.simplified_text,
        complexity: params.complexity,
        wordCount: result.metrics?.simplified_length || result.simplified_text.length,
        usedWiki: result.used_wiki,
        wikiTitle: result.wiki_title
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        result: null,
        retryCount: 0,
        isRetrying: false
      }))
    } finally {
      setIsProcessing(false)
    }
  }, [setIsProcessing, addToHistory])

  
  const retry = useCallback(async () => {
    if (!state.error || state.retryCount >= MAX_RETRIES) {
      return
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      error: null,
      retryCount: prev.retryCount + 1
    }))

    
    await sleep(RETRY_DELAY * state.retryCount)

    try {
      
      
      setState(prev => ({
        ...prev,
        isRetrying: false,
        error: 'Cannot retry: original parameters not available. Please try again with new input.'
      }))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Retry failed'
      
      setState(prev => ({
        ...prev,
        isRetrying: false,
        error: errorMessage
      }))
    }
  }, [state.error, state.retryCount])

  return {
    
    isLoading: state.isLoading,
    error: state.error,
    result: state.result,
    retryCount: state.retryCount,
    isRetrying: state.isRetrying,
    
    
    simplify,
    retry,
    clearError,
    clearResult,
    reset,
  }
}


export function useSimplifyWithRetry(): UseSimplifyReturn & { lastParams: SimplifyParams | null } {
  const [lastParams, setLastParams] = useState<SimplifyParams | null>(null)
  const [state, setState] = useState<UseSimplifyState>({
    isLoading: false,
    error: null,
    result: null,
    retryCount: 0,
    isRetrying: false,
  })

  const { setIsProcessing, addToHistory } = useAppStore()

  
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }))
  }, [])

  
  const clearResult = useCallback(() => {
    setState(prev => ({ ...prev, result: null }))
  }, [])

  
  const reset = useCallback(() => {
    setState({
      isLoading: false,
      error: null,
      result: null,
      retryCount: 0,
      isRetrying: false,
    })
    setLastParams(null)
  }, [])

  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  
  const makeRequest = async (params: SimplifyParams): Promise<SimplifyResponse> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION)

    try {
      const response = await fetch('/api/simplify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
          error: 'Unknown error',
          message: 'Failed to parse error response'
        }))
        
        throw new Error(errorData.message || errorData.error || 'Request failed')
      }

      const data: SimplifyResponse = await response.json()
      return data

    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.')
        }
        throw error
      }
      
      throw new Error('An unexpected error occurred')
    }
  }

  
  const simplify = useCallback(async (params: SimplifyParams) => {
    
    if (!params.text?.trim()) {
      setState(prev => ({
        ...prev,
        error: 'Please enter some text to simplify',
        isLoading: false
      }))
      return
    }

    if (params.text.length > 5000) {
      setState(prev => ({
        ...prev,
        error: 'Text is too long. Maximum 5000 characters allowed.',
        isLoading: false
      }))
      return
    }

    
    setLastParams(params)

    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      result: null,
      retryCount: 0,
      isRetrying: false
    }))

    setIsProcessing(true)

    try {
      const result = await makeRequest(params)
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: null,
        result,
        retryCount: 0,
        isRetrying: false
      }))

      
      addToHistory({
        originalText: params.text,
        simplifiedText: result.simplified_text,
        complexity: params.complexity,
        wordCount: result.metrics?.simplified_length || result.simplified_text.length,
        usedWiki: result.used_wiki,
        wikiTitle: result.wiki_title
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        result: null,
        retryCount: 0,
        isRetrying: false
      }))
    } finally {
      setIsProcessing(false)
    }
  }, [setIsProcessing, addToHistory])

  
  const retry = useCallback(async () => {
    if (!state.error || !lastParams || state.retryCount >= MAX_RETRIES) {
      return
    }

    setState(prev => ({
      ...prev,
      isRetrying: true,
      error: null,
      retryCount: prev.retryCount + 1
    }))

    
    await sleep(RETRY_DELAY * Math.pow(2, state.retryCount - 1))

    try {
      const result = await makeRequest(lastParams)
      
      setState(prev => ({
        ...prev,
        isRetrying: false,
        error: null,
        result,
        retryCount: 0
      }))

      
      addToHistory({
        originalText: lastParams.text,
        simplifiedText: result.simplified_text,
        complexity: lastParams.complexity,
        wordCount: result.metrics?.simplified_length || result.simplified_text.length,
        usedWiki: result.used_wiki,
        wikiTitle: result.wiki_title
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Retry failed'
      
      setState(prev => ({
        ...prev,
        isRetrying: false,
        error: errorMessage
      }))
    }
  }, [state.error, state.retryCount, lastParams, addToHistory])

  return {
    
    isLoading: state.isLoading,
    error: state.error,
    result: state.result,
    retryCount: state.retryCount,
    isRetrying: state.isRetrying,
    lastParams,
    
    
    simplify,
    retry,
    clearError,
    clearResult,
    reset,
  }
}

