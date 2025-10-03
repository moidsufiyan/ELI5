import React from 'react'
import Head from 'next/head'
import SimplificationForm from '@/components/SimplificationForm'

export default function Home() {
  return (
    <>
      <Head>
        <title>ELI5 AI Simplifier - Make Complex Topics Simple</title>
        <meta name="description" content="Transform complex topics into easy-to-understand explanations using AI. Choose from ELI5, ELI15, or Normal complexity levels." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI, simplifier, ELI5, text simplification, education, learning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block p-4 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mb-6">
              <span className="text-4xl">🧠</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ELI5 AI Simplifier
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Transform complex topics into <span className="font-semibold text-blue-600">crystal-clear explanations</span> using the power of AI ✨
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
                <span className="mr-2">🤖</span>
                <span>AI-Powered</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
                <span className="mr-2">⚡</span>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
                <span className="mr-2">🎯</span>
                <span>3 Complexity Levels</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border">
                <span className="mr-2">📱</span>
                <span>Mobile Friendly</span>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="animate-slide-up">
            <SimplificationForm />
          </div>

          {/* Footer */}
          <footer className="text-center mt-20 animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-center items-center space-x-6 mb-6">
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">🚀</span>
                  <span className="text-sm">Powered by Google Gemini AI</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="mr-2">⭐</span>
                  <span className="text-sm">Built with Next.js & Tailwind</span>
                </div>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">
                Making learning accessible to everyone, one explanation at a time. 
                <br />
                From complex research papers to quantum physics - we make it simple! 💡
              </p>
            </div>
          </footer>
        </div>
      </main>
    </>
  )
}