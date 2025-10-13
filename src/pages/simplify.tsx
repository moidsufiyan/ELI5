import React from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import SimplificationForm from '@/components/SimplificationForm'
import { useAppStore } from '@/lib/store'
import { formatDate, truncateText } from '@/lib/utils'
import { History } from 'lucide-react'

export default function SimplifyPage() {
  const { history, removeFromHistory, draftText, setDraftText } = useAppStore()

  return (
    <>
      <Head>
        <title>Simplify - ELI5 AI Simplifier</title>
        <meta name="description" content="Use our AI-powered text simplification tool to transform complex topics into easy-to-understand explanations." />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Form */}
              <div className="lg:col-span-8">
                <SimplificationForm />
              </div>

              {/* Right: Recent History */}
              <aside className="lg:col-span-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <History className="w-5 h-5 text-primary-600" />
                      <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">Recent</h2>
                    </div>
                    {history.length > 0 && (
                      <span className="text-xs text-neutral-500">{history.length} items</span>
                    )}
                  </div>

                  {history.length === 0 ? (
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">No recent items yet. Run a simplification to see it here.</p>
                  ) : (
                    <ul className="space-y-3">
                      {history.map((item) => (
                        <li key={item.id} className="group border border-neutral-200 dark:border-neutral-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                          <button
                            className="w-full text-left"
                            onClick={() => setDraftText(item.originalText)}
                            title="Load text into editor"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="text-sm text-neutral-500 mb-1">{formatDate(item.timestamp)} • {item.complexity}</div>
                                <div className="text-neutral-800 dark:text-neutral-200 text-sm">{truncateText(item.originalText, 120)}</div>
                              </div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
