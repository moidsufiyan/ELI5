import React, { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Brain, Moon, Sun, Menu, X, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useSession, signIn, signOut } from 'next-auth/react'

export function Header() {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Try It', href: '/simplify' },
    { name: 'About', href: '/about' },
    { name: 'Settings', href: '/settings' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/50 dark:border-neutral-800/50 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md shadow-soft" role="banner">
      <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group" aria-label="Go to homepage">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-xl sm:text-2xl font-bold gradient-text">
              ELI5
            </span>
          </Link>

          {}
          <nav className="hidden md:flex items-center space-x-6" aria-label="Primary Navigation">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors duration-200 hover:scale-105"
              >
                {item.name}
              </Link>
            ))}
            
            {}
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
                  "text-neutral-700 dark:text-neutral-300",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-105 active:scale-95"
                )}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
            
            {/* Auth Button Desktop */}
            {mounted && (
              status === 'loading' ? (
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
              ) : session?.user ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 shadow-sm transition-all text-sm font-medium text-neutral-700 dark:text-neutral-300 group"
                  aria-label="Sign out"
                >
                  {session.user.image ? (
                    <img src={session.user.image} alt={session.user.name || 'User'} className="w-6 h-6 rounded-full" />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{session.user.name?.split(' ')[0] || 'User'}</span>
                  <LogOut className="w-4 h-4 text-neutral-400 group-hover:text-red-500 transition-colors ml-1" />
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium text-sm hover:scale-105 active:scale-95 transition-all shadow-md"
                >
                  Sign In
                </button>
              )
            )}
          </nav>

          {}
          <div className="flex items-center space-x-2 md:hidden">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={cn(
                  "p-2 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
                  "text-neutral-700 dark:text-neutral-300",
                  "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "p-2 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center",
                "text-neutral-700 dark:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-neutral-200/50 dark:border-neutral-800/50 pt-4">
            <nav className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-neutral-700 dark:text-neutral-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium transition-colors duration-200 rounded-xl"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Auth Button Mobile */}
              {mounted && (
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 mt-2">
                  {status === 'loading' ? (
                    <div className="w-full h-12 rounded-xl bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                  ) : session ? (
                    <button
                      onClick={() => { setMobileMenuOpen(false); signOut(); }}
                      className="flex w-full items-center justify-between px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 font-medium transition-colors duration-200 rounded-xl"
                    >
                      Sign Out
                      <LogOut className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => { setMobileMenuOpen(false); signIn(); }}
                      className="flex w-full items-center justify-center px-4 py-3 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium rounded-xl shadow-md"
                    >
                      Sign In
                    </button>
                  )}
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
