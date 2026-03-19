import React, { useState } from 'react'
import { getProviders, signIn } from 'next-auth/react'
import { GetServerSideProps } from 'next'
import { Brain, ArrowRight, Github, Mail, Loader2 } from 'lucide-react'
import Head from 'next/head'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function SignIn({ providers }: any) {
  const [email, setEmail] = useState('demo@eli5.ai')
  const [password, setPassword] = useState('password123')
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // The CredentialsProvider routes to our [...nextauth].ts backend verification magically
    const result = await signIn('credentials', {
      redirect: true,
      email,
      password,
      callbackUrl: '/simplify' // Sends us straight to the simplify app when authenticated!
    })

    if (result?.error) {
      setIsLoading(false)
      alert("Invalid Credentials")
    }
  }

  const handleOAuth = (id: string) => {
    setIsLoading(true)
    signIn(id, { callbackUrl: '/simplify' })
  }

  return (
    <>
      <Head><title>Welcome Back - ELI5 Simplifier</title></Head>
      
      {/* Universal Aurora Background matching Simplify.tsx */}
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
              <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white mb-2">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                {mode === 'login' ? 'Enter your details to sign in to your workspace' : 'Sign up for free and start simplifying everything'}
              </p>
            </div>

            <form onSubmit={handleCredentials} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1 ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-neutral-100 dark:bg-neutral-950 border border-transparent dark:border-neutral-800 rounded-xl focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-neutral-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-100 dark:bg-neutral-950 border border-transparent dark:border-neutral-800 rounded-xl focus:bg-white dark:focus:bg-neutral-900 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all placeholder:text-neutral-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "w-full flex items-center justify-center px-4 py-3.5 text-sm font-bold text-white rounded-xl shadow-glow transition-all duration-200 mt-6",
                  "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600",
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-95"
                )}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Sign In' : 'Create Account'}
                {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
              </button>
            </form>

            <div className="relative mt-8 flex items-center justify-center">
              <div className="absolute inset-x-0 h-px bg-neutral-200 dark:bg-neutral-800"></div>
              <span className="relative bg-white dark:bg-neutral-900 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              {Object.values(providers || {}).map((provider: any) => {
                if (provider.name === "Credentials") return null // We manually built this above
                const isGoogle = provider.name === 'Google'
                const ProviderIcon = isGoogle ? Brain : Github
                
                return (
                  <button
                    key={provider.name}
                    onClick={() => handleOAuth(provider.id)}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 text-neutral-800 dark:text-neutral-200"
                  >
                    {!isGoogle && <Github className="w-4 h-4" />}
                    {provider.name}
                  </button>
                )
              })}
            </div>

            <p className="text-center text-sm text-neutral-600 dark:text-neutral-400 mt-8 font-medium">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="ml-2 text-primary-600 font-bold hover:underline">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </button>
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
