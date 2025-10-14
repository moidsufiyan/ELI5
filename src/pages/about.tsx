import React from 'react'
import Head from 'next/head'
import { SEO } from '@/components/SEO'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Brain, Target, BookOpen, Sparkles } from 'lucide-react'

export default function About() {
  return (
    <>
      <SEO
        title="About - ELI5 AI Simplifier"
        description="Learn about ELI5 AI Simplifier - a professional text simplification tool powered by AI"
        type="article"
        canonical={typeof window !== 'undefined' ? window.location.origin + '/about' : undefined}
        image="/og.png"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'AboutPage',
          name: 'About - ELI5 AI Simplifier'
        }}
      />
      <Head>
        <title>About - ELI5 AI Simplifier</title>
        <meta name="description" content="Learn about ELI5 AI Simplifier - a professional text simplification tool powered by AI" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-6 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  About ELI5 AI Simplifier
                </h1>
                <p className="text-xl text-neutral-600 dark:text-neutral-300">
                  Professional text simplification for everyone
                </p>
              </div>

              {/* Main Content */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-8 md:p-12 mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
                  What is ELI5?
                </h2>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                  ELI5 AI Simplifier is a professional-grade text simplification platform that operates entirely as a frontend application. 
                  Our tool transforms complex information into accessible, clear communication through AI-powered simplification.
                </p>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Whether you need to explain quantum physics to a child, break down technical documentation for a general audience, 
                  or create professional summaries, ELI5 adapts to your needs.
                </p>
              </div>

              {/* Core Features */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-8 md:p-12 mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  Core Features
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        AI-Powered Simplification
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Powered by Google Gemini AI, our tool understands context and intelligently transforms complex text 
                        into clear, understandable explanations while preserving meaning.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Three Complexity Levels
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">
                        Choose the perfect explanation level for your audience:
                      </p>
                      <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                        <li><strong>Simple:</strong> Easy-to-understand explanations using simple words</li>
                        <li><strong>General:</strong> Clear explanations with moderate complexity</li>
                        <li><strong>Professional:</strong> Comprehensive adult-level explanations</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                        Optional Wikipedia Context
                      </h3>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Enhance your explanations with additional context from Wikipedia for richer, more comprehensive understanding 
                        of complex topics.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* How It Works */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-lg p-8 md:p-12 mb-8">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">
                  How It Works
                </h2>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white font-bold rounded-full mr-4 flex-shrink-0">
                      1
                    </span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Enter Your Text</h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Paste or type any complex text you want to simplify - scientific articles, technical documentation, or academic content.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white font-bold rounded-full mr-4 flex-shrink-0">
                      2
                    </span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Choose Complexity Level</h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Select Simple, General, or Professional based on your target audience.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex items-center justify-center w-8 h-8 bg-primary-600 text-white font-bold rounded-full mr-4 flex-shrink-0">
                      3
                    </span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">Get Your Simplified Text</h4>
                      <p className="text-neutral-600 dark:text-neutral-400">
                        Receive a clear, understandable explanation that maintains the original meaning while being accessible to your chosen audience.
                      </p>
                    </div>
                  </li>
                </ol>
              </div>

              {/* CTA */}
              <div className="text-center">
                <Link href="/simplify">
                  <button className="inline-flex items-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl shadow-lg hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transform hover:scale-105 transition-all duration-200">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Try It Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
