import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// Request payload interface
interface SimplifyRequest {
  text: string
  complexity: 'ELI5' | 'ELI15' | 'normal'
  useWikipedia: boolean
  topic: string
}

// Response interface
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'Only POST requests are supported'
    })
  }

  try {
    // Validate request body
    const { text, complexity, useWikipedia, topic }: SimplifyRequest = req.body

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        error: 'Invalid input',
        message: 'Text is required and cannot be empty'
      })
    }

    if (text.length > 5000) {
      return res.status(400).json({
        error: 'Text too long',
        message: 'Maximum 5000 characters allowed'
      })
    }

    if (!complexity || !['ELI5', 'ELI15', 'normal'].includes(complexity)) {
      return res.status(400).json({
        error: 'Invalid complexity level',
        message: 'Complexity must be one of: ELI5, ELI15, normal'
      })
    }

    // Transform frontend payload to backend format
    const backendPayload = {
      text: text.trim(),
      level: complexity,
      use_wiki: Boolean(useWikipedia),
      topic: topic?.trim() || ''
    }

    const startTime = Date.now()

    // Make request to backend with timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    const response = await fetch(`${BACKEND_URL}/api/simplify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(backendPayload),
      signal: controller.signal
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: 'Backend error',
        message: errorData.detail || 'Failed to process request',
        status: response.status
      })
    }

    const data: SimplifyResponse = await response.json()
    const processingTime = Date.now() - startTime

    // Add metrics to response
    const enhancedResponse = {
      ...data,
      metrics: {
        original_length: text.length,
        simplified_length: data.simplified_text?.length || 0,
        reduction_percentage: data.simplified_text 
          ? Math.round(((text.length - data.simplified_text.length) / text.length) * 100)
          : 0,
        processing_time_ms: processingTime
      }
    }

    res.status(200).json(enhancedResponse)

  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return res.status(408).json({
          error: 'Request timeout',
          message: 'The request took too long to process. Please try again.'
        })
      }
    }

    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to connect to the backend service. Please make sure the Python backend is running.',
      detail: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
    })
  }
}