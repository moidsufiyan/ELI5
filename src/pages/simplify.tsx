import React from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import SimplificationForm from '@/components/SimplificationForm'

export default function SimplifyPage() {
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
            <SimplificationForm />
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  )
}
