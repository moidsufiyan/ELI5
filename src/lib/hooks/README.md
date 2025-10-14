# useSimplify Hook

A custom React hook for simplifying text using the ELI5 API with comprehensive error handling, retry logic, and loading states.

## Features

- ✅ **Loading States**: Track processing status
- ✅ **Error Handling**: User-friendly error messages
- ✅ **Retry Logic**: Automatic retry with exponential backoff
- ✅ **Timeout Handling**: 30-second request timeout
- ✅ **Input Validation**: Client-side validation
- ✅ **History Integration**: Automatically saves to app history
- ✅ **Metrics**: Processing time and text reduction metrics
- ✅ **Wikipedia Integration**: Optional Wikipedia context

## Usage

### Basic Usage

```tsx
import { useSimplify } from '../lib/hooks/useSimplify'

function MyComponent() {
  const {
    isLoading,
    error,
    result,
    simplify,
    clearError,
    retry
  } = useSimplify()

  const handleSimplify = async () => {
    await simplify({
      text: "Your complex text here",
      complexity: "ELI5",
      useWikipedia: true,
      topic: "quantum physics"
    })
  }

  return (
    <div>
      <button onClick={handleSimplify} disabled={isLoading}>
        {isLoading ? 'Simplifying...' : 'Simplify'}
      </button>
      
      {error && (
        <div className="error">
          {error}
          <button onClick={retry}>Retry</button>
        </div>
      )}
      
      {result && (
        <div className="result">
          {result.simplified_text}
        </div>
      )}
    </div>
  )
}
```

### Advanced Usage with Retry

```tsx
import { useSimplifyWithRetry } from '../lib/hooks/useSimplify'

function MyComponent() {
  const {
    isLoading,
    error,
    result,
    retryCount,
    isRetrying,
    simplify,
    retry,
    lastParams
  } = useSimplifyWithRetry()

  // This version stores the last parameters for retry functionality
  // and provides additional retry state information
}
```

## API Reference

### Parameters

```typescript
interface SimplifyParams {
  text: string                    // Text to simplify (max 5000 chars)
  complexity: 'ELI5' | 'ELI15' | 'normal'  // Complexity level
  useWikipedia: boolean          // Whether to use Wikipedia context
  topic: string                  // Topic for Wikipedia lookup
}
```

### Return Value

```typescript
interface UseSimplifyReturn {
  // State
  isLoading: boolean             // Whether request is in progress
  error: string | null          // Error message if any
  result: SimplifyResponse | null // API response
  retryCount: number            // Number of retry attempts
  isRetrying: boolean           // Whether currently retrying
  
  // Actions
  simplify: (params: SimplifyParams) => Promise<void>
  retry: () => Promise<void>    // Retry last request
  clearError: () => void        // Clear error state
  clearResult: () => void       // Clear result
  reset: () => void            // Reset all state
}
```

### Response Format

```typescript
interface SimplifyResponse {
  simplified_text: string       // The simplified text
  used_wiki: boolean           // Whether Wikipedia was used
  wiki_title?: string          // Wikipedia article title
  metrics?: {                  // Processing metrics
    original_length: number
    simplified_length: number
    reduction_percentage: number
    processing_time_ms: number
  }
}
```

## Error Handling

The hook handles various error scenarios:

- **Input Validation**: Empty text, text too long
- **Network Errors**: Connection failures, timeouts
- **API Errors**: Backend errors, invalid responses
- **Retry Logic**: Automatic retry with exponential backoff (max 3 attempts)

## Configuration

Default configuration can be modified in the hook:

```typescript
const MAX_RETRIES = 3           // Maximum retry attempts
const RETRY_DELAY = 1000        // Base retry delay (ms)
const TIMEOUT_DURATION = 30000  // Request timeout (ms)
```

## Integration with Store

The hook automatically integrates with the Zustand store:

- Updates `isProcessing` state
- Adds results to history
- Persists user preferences

## Testing

Use the test component at `/test-api` to verify the integration:

```tsx
import { SimplifyTest } from '../components/SimplifyTest'

// Renders a complete test interface
<SimplifyTest />
```

