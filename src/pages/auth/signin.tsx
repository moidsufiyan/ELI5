import React, { useState } from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { Brain, Github } from 'lucide-react'
import Head from 'next/head'
import { motion } from 'framer-motion'

export default function SignIn({ providers }: any) {
  const [isLoading, setIsLoading] = useState(false)

  const handleOAuth = (id: string) => {
    setIsLoading(true)
    signIn(id, { callbackUrl: '/simplify' })
  }

  return (
    <>
      <Head><title>Welcome to ELI5 - Sign In</title></Head>
      
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950">
        
        {/* Left Canvas (Branding) */}
        <div className="hidden md:flex flex-1 flex-col justify-center px-12 lg:px-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-glow-lg mb-8">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight mb-4 tracking-tight">
              Unlock the power of <span className="gradient-text">Simplicity.</span>
            </h1>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-8">
              Join ELI5 to break down complex topics into perfectly understandable insights. Your advanced AI processing gateway.
            </p>
          </motion.div>
        </div>

        {/* Right Canvas (Auth Box) */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden bg-white/30 dark:bg-neutral-950/30 backdrop-blur-xl border-l border-white/20 dark:border-neutral-800/50 shadow-soft">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="w-full max-w-md bg-white/80 dark:bg-neutral-900/80 backdrop-blur-2xl p-8 sm:p-10 rounded-[2rem] border border-white/50 dark:border-neutral-800 shadow-2xl relative z-10"
          >
            <div className="flex justify-center md:hidden mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">Sign In to ELI5</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Choose an option below to access your workspace.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              {Object.values(providers || {}).map((provider: any) => {
                if (provider.name === "Credentials") return null
                const isGoogle = provider.name === 'Google'
                
                return (
                  <button
                    key={provider.name}
                    onClick={() => handleOAuth(provider.id)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-3 w-full px-6 py-4 text-base font-semibold rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 text-neutral-800 dark:text-neutral-200 shadow-sm"
                  >
                    {isGoogle ? (
                      <span className="text-lg">🌐</span>
                    ) : (
                      <Github className="w-5 h-5 text-neutral-800 dark:text-neutral-200" />
                    )}
                    Continue with {provider.name}
                  </button>
                )
              })}
            </div>

            <p className="text-center text-xs text-neutral-500 mt-8">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>

          </motion.div>
        </div>
      </div>
    </>
  )
}


export const getServerSideProps: GetServerSideProps = async () => {
  const providers = await getProviders()
  return {
    props: { providers: providers ?? {} },
  }
}
