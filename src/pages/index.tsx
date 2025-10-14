import React from 'react'
import Head from 'next/head'
import { SEO } from '@/components/SEO'
import Link from 'next/link'
import { ArrowRight, Brain, Sparkles, Target, BookOpen } from 'lucide-react'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <>
      <SEO
        title="ELI5 AI Simplifier - Professional Text Simplification"
        description="Transform complex information into accessible, clear communication through AI-powered simplification."
        type="website"
        canonical={typeof window !== 'undefined' ? window.location.origin + '/' : undefined}
        image="/og.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'ELI5 AI Simplifier',
          url: typeof window !== 'undefined' ? window.location.origin : undefined
        }}
      />
      <Head>
        <title>ELI5 AI Simplifier - Professional Text Simplification</title>
        <meta name="description" content="Transform complex information into accessible, clear communication through AI-powered simplification. Professional text simplification for everyone." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI, text simplification, explain simply, ELI5, education, learning" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
            {/* Hero Section - Focused and Simple */}
            <motion.div
              className="text-center max-w-4xl mx-auto mb-16 sm:mb-20"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            >
              {/* Logo */}
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 sm:mb-6 shadow-large animate-fade-in">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-neutral-900 dark:text-neutral-100 animate-fade-in leading-tight">
                <span className="gradient-text">
                  ELI5 AI Simplifier
                </span>
              </h1>
              
              {/* Subtitle - Clear Value Proposition */}
              <p className="text-lg sm:text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 mb-6 sm:mb-8 leading-relaxed animate-fade-in max-w-3xl mx-auto">
                Transform complex information into accessible, clear communication
              </p>
              
              {/* Single Primary CTA */}
              <Link href="/simplify">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="group inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 rounded-2xl shadow-large hover:shadow-glow-lg hover:from-primary-700 hover:via-primary-800 hover:to-primary-900 transform transition-all duration-200 animate-fade-in min-h-[44px] touch-manipulation"
                >
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Try It Now
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>

            {/* Essential Features - Only 3 Core Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16 sm:mb-20">
              {/* Feature 1: AI-Powered */}
              <motion.div
                className="card-elevated p-6 sm:p-8 animate-slide-up"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.05 }}
                whileHover={{ y: -3 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">AI-Powered Simplification</h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">Advanced Google Gemini AI intelligently transforms complex text into clear, understandable explanations</p>
              </motion.div>
              
              {/* Feature 2: Multiple Complexity Levels */}
              <motion.div
                className="card-elevated p-6 sm:p-8 animate-slide-up"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                whileHover={{ y: -3 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">Three Complexity Levels</h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">Choose from Simple, General, or Professional explanations tailored to your audience and needs</p>
              </motion.div>
              
              {/* Feature 3: Wikipedia Context */}
              <motion.div
                className="card-elevated p-6 sm:p-8 animate-slide-up"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                whileHover={{ y: -3 }}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2 sm:mb-3">Optional Wikipedia Context</h3>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">Enhance explanations with additional context from Wikipedia for richer understanding</p>
              </motion.div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
