import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Settings as SettingsIcon, Save, RotateCcw } from 'lucide-react'
import { useAppStore, ComplexityLevel } from '@/lib/store'
import { complexityLevels } from '@/lib/utils'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const { preferences, setPreferences } = useAppStore()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)

  const [localPrefs, setLocalPrefs] = useState(preferences)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    setLocalPrefs(preferences)
  }, [preferences])

  const handleSave = () => {
    setPreferences(localPrefs)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleReset = () => {
    const defaults = {
      defaultComplexity: 'ELI5' as ComplexityLevel,
      enableWikipedia: true,
    }
    setLocalPrefs(defaults)
    setPreferences(defaults)
  }

  if (!mounted) {
    return null
  }

  return (
    <>
      <Head>
        <title>Settings - ELI5 AI Simplifier</title>
        <meta name="description" content="Manage your preferences for ELI5 AI Simplifier" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/30 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          <div className="container mx-auto px-6 py-16">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-600 to-primary-700 rounded-2xl mb-4 shadow-lg">
                  <SettingsIcon className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                  Settings
                </h1>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Manage your preferences
                </p>
              </div>

              {/* Theme Settings */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Choose your preferred theme</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setTheme('light')}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200",
                        theme === 'light'
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                      )}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                          <span className="text-2xl">☀️</span>
                        </div>
                      </div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">Light Mode</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Bright and clear</p>
                    </button>
                    
                    <button
                      onClick={() => setTheme('dark')}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all duration-200",
                        theme === 'dark'
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                          : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                      )}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-800 flex items-center justify-center">
                          <span className="text-2xl">🌙</span>
                        </div>
                      </div>
                      <p className="font-semibold text-neutral-900 dark:text-neutral-100">Dark Mode</p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">Easy on the eyes</p>
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Default Complexity Level */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Default Complexity Level</CardTitle>
                  <CardDescription>Choose your preferred starting complexity level</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {complexityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() => setLocalPrefs({ ...localPrefs, defaultComplexity: level.value })}
                        className={cn(
                          "p-4 rounded-xl border-2 transition-all duration-200 text-center",
                          localPrefs.defaultComplexity === level.value
                            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
                        )}
                      >
                        <div className="text-3xl mb-2">{level.emoji}</div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                          {level.label}
                        </p>
                        <p className="text-xs text-neutral-600 dark:text-neutral-400">
                          {level.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Wikipedia Integration */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Wikipedia Integration</CardTitle>
                  <CardDescription>Enhance explanations with Wikipedia context</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                        Enable Wikipedia Context
                      </p>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Automatically add relevant Wikipedia information to explanations
                      </p>
                    </div>
                    <button
                      onClick={() => setLocalPrefs({ ...localPrefs, enableWikipedia: !localPrefs.enableWikipedia })}
                      className={cn(
                        "relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-200",
                        localPrefs.enableWikipedia
                          ? "bg-primary-600"
                          : "bg-neutral-300 dark:bg-neutral-600"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200",
                          localPrefs.enableWikipedia ? "translate-x-7" : "translate-x-1"
                        )}
                      />
                    </button>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-4">
                <Button variant="outline" onClick={handleReset} size="lg">
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset to Defaults
                </Button>
                <Button onClick={handleSave} size="lg" className="min-w-[140px]">
                  {saved ? (
                    <>
                      <span className="mr-2">✓</span> Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  )
}
