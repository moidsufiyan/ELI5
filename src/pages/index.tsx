import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { ArrowRight, Brain, Sparkles, Target, BookOpen } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>ELI5 AI Simplifier - Professional Text Simplification</title>
        <meta name="description" content="Transform complex information into accessible, clear communication through AI-powered simplification. Professional text simplification for everyone." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI, text simplification, explain simply, ELI5, education, learning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          <div className="container mx-auto px-6 py-20">
            {/* Hero Section - Focused and Simple */}
            <div className="text-center max-w-4xl mx-auto mb-20">
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-6 shadow-lg animate-fade-in">
                <Brain className="w-10 h-10 text-white" />
              </div>
              
              {/* Main Headline */}
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-neutral-900 dark:text-neutral-100 animate-fade-in">
                <span className="bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                  ELI5 AI Simplifier
                </span>
              </h1>
              
              {/* Subtitle - Clear Value Proposition */}
              <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed animate-fade-in">
                Transform complex information into accessible, clear communication
              </p>
              
              {/* Single Primary CTA */}
              <Link href="/simplify">
                <button className="group inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200 animate-fade-in">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try It Now
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            {/* Essential Features - Only 3 Core Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
              {/* Feature 1: AI-Powered */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">AI-Powered Simplification</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">Advanced Google Gemini AI intelligently transforms complex text into clear, understandable explanations</p>
              </div>
              
              {/* Feature 2: Multiple Complexity Levels */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '100ms' }}>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Three Complexity Levels</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">Choose from Simple, General, or Professional explanations tailored to your audience and needs</p>
              </div>
              
              {/* Feature 3: Wikipedia Context */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 border border-neutral-200 dark:border-neutral-700 shadow-lg hover:shadow-xl transition-all duration-300 animate-slide-up" style={{ animationDelay: '200ms' }}>
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">Optional Wikipedia Context</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">Enhance explanations with additional context from Wikipedia for richer understanding</p>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
