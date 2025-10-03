import type { NextApiRequest, NextApiResponse } from 'next'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const response = await fetch(`${BACKEND_URL}/api/simplify-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return res.status(response.status).json(errorData)
    }

    // Set headers for server-sent events
    res.setHeader('Content-Type', 'text/event-stream')
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('Connection', 'keep-alive')
    res.setHeader('Access-Control-Allow-Origin', '*')

    // Pipe the streaming response
    if (response.body) {
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          res.write(chunk)
        }
      } finally {
        reader.releaseLock()
      }
    }

    res.end()
  } catch (error) {
    console.error('Streaming API Error:', error)
    res.status(500).json({ 
      error: 'Failed to connect to the backend service',
      detail: 'Please make sure the Python backend is running'
    })
  }
}

// Disable body parsing for streaming
export const config = {
  api: {
    responseLimit: false,
  },
}