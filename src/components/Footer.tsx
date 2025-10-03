import React from 'react'
import { Sparkles, Zap, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-4">
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <Sparkles className="w-4 h-4 mr-2 text-primary-600" />
            <span className="text-sm">Powered by Google Gemini AI</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <Zap className="w-4 h-4 mr-2 text-primary-600" />
            <span className="text-sm">Built with Next.js & Tailwind CSS</span>
          </div>
          <div className="flex items-center text-neutral-600 dark:text-neutral-400">
            <Heart className="w-4 h-4 mr-2 text-primary-600" />
            <span className="text-sm">Making learning accessible</span>
          </div>
        </div>
        <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
          Transforming complex knowledge into simple, understandable explanations
        </p>
      </div>
    </footer>
  )
}
