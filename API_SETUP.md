# API Integration Setup Guide

This guide explains how to set up and test the ELI5 API integration.

## Environment Setup

### 1. Backend Environment

Create a `.env` file in the `backend/` directory:

```bash
# backend/.env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Frontend Environment

Create a `.env.local` file in the root directory:

```bash
# .env.local
BACKEND_URL=http://localhost:8000
NODE_ENV=development
```

## Running the Application

### 1. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The backend will start on `http://localhost:8000`

### 2. Start the Frontend

```bash
npm install
npm run dev
```

The frontend will start on `http://localhost:3000`

## Testing the Integration

### 1. Test Page

Visit `http://localhost:3000/test-api` to access the comprehensive test interface.

### 2. API Endpoints

- **POST** `/api/simplify` - Main simplification endpoint
- **GET** `/api/health` - Health check endpoint

### 3. Backend Endpoints

- **POST** `/api/simplify` - Main simplification endpoint
- **POST** `/api/simplify-stream` - Streaming simplification endpoint
- **GET** `/api/wiki/{topic}` - Wikipedia lookup endpoint
- **GET** `/api/health` - Health check endpoint

## API Usage Examples

### Frontend Hook Usage

```tsx
import { useSimplifyWithRetry } from '../lib/hooks/useSimplify'

function MyComponent() {
  const { isLoading, error, result, simplify } = useSimplifyWithRetry()

  const handleSimplify = async () => {
    await simplify({
      text: "Quantum mechanics is a fundamental theory in physics...",
      complexity: "ELI5",
      useWikipedia: true,
      topic: "quantum mechanics"
    })
  }

  return (
    <div>
      <button onClick={handleSimplify} disabled={isLoading}>
        {isLoading ? 'Simplifying...' : 'Simplify'}
      </button>
      
      {error && <div className="error">{error}</div>}
      {result && <div className="result">{result.simplified_text}</div>}
    </div>
  )
}
```

### Direct API Call

```typescript
const response = await fetch('/api/simplify', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: "Your complex text here",
    complexity: "ELI5",
    useWikipedia: true,
    topic: "your topic"
  })
})

const result = await response.json()
```

## Error Handling

The integration includes comprehensive error handling:

- **Input Validation**: Text length, required fields
- **Network Errors**: Connection failures, timeouts
- **API Errors**: Backend errors, invalid responses
- **Retry Logic**: Automatic retry with exponential backoff

## Features Implemented

### ✅ API Endpoint (`/pages/api/simplify.ts`)
- Proper POST request handling
- CORS configuration
- Input validation
- Timeout handling (30 seconds)
- Error handling with user-friendly messages
- Metrics calculation

### ✅ Custom Hook (`useSimplify`)
- Loading state management
- Error handling with retry logic
- Timeout handling
- Input validation
- Store integration
- History management

### ✅ Backend Integration
- Gemini AI API integration
- Wikipedia context integration
- Streaming support
- Comprehensive error handling
- Metrics calculation

### ✅ Testing Components
- Complete test interface at `/test-api`
- Error simulation
- Retry testing
- Metrics display

## Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure Python backend is running on port 8000
   - Check `BACKEND_URL` environment variable

2. **Gemini API Error**
   - Verify `GEMINI_API_KEY` is set correctly
   - Check API key permissions and quotas

3. **Wikipedia Integration Issues**
   - Ensure topic names are valid Wikipedia articles
   - Check network connectivity

4. **CORS Issues**
   - Backend includes CORS middleware
   - Frontend API route includes CORS headers

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages in the frontend.

## Performance Considerations

- **Timeout**: 30-second request timeout
- **Retry**: Maximum 3 retry attempts with exponential backoff
- **Text Limit**: 5000 characters maximum
- **History**: Limited to 50 items in local storage

## Security Notes

- API keys should be stored in environment variables
- CORS is configured for development (adjust for production)
- Input validation prevents injection attacks
- Rate limiting should be added for production use

