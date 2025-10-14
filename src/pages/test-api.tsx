import React from 'react'
import Head from 'next/head'
import { SimplifyTest } from '../components/SimplifyTest'

export default function TestApiPage() {
  return (
    <>
      <Head>
        <title>API Integration Test - ELI5</title>
        <meta name="description" content="Test the ELI5 API integration" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              API Integration Test
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Test the complete API integration including the useSimplify hook, 
              error handling, retry logic, and backend communication.
            </p>
          </div>

          <SimplifyTest />
        </div>
      </div>
    </>
  )
}

