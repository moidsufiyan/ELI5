import React from 'react'
import Head from 'next/head'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/Card'
import { TextArea } from '@/components/ui/TextArea'
import { Skeleton, TextSkeleton, CardSkeleton, FormSkeleton, LoadingSpinner, TypingIndicator } from '@/components/ui/LoadingSkeleton'
import { ErrorMessage, SuccessMessage, WarningMessage, InfoMessage, Toast } from '@/components/ui/StatusMessage'
import { Brain, Sparkles, Target, BookOpen, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'

export default function ResponsiveTestPage() {
  const [showToast, setShowToast] = React.useState(false)

  return (
    <>
      <Head>
        <title>Responsive Design Test - ELI5</title>
        <meta name="description" content="Test responsive design across all screen sizes" />
      </Head>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800">
          <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
            
            {/* Page Header */}
            <div className="text-center mb-8 sm:mb-12">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-4">
                Responsive Design Test
              </h1>
              <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                Test the responsive design across all screen sizes from 320px to 1920px
              </p>
            </div>

            {/* Screen Size Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-8">
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xs sm:text-sm font-semibold text-primary-800 dark:text-primary-200">Mobile</div>
                <div className="text-xs text-primary-600 dark:text-primary-400">320px - 640px</div>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xs sm:text-sm font-semibold text-primary-800 dark:text-primary-200">Tablet</div>
                <div className="text-xs text-primary-600 dark:text-primary-400">640px - 1024px</div>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xs sm:text-sm font-semibold text-primary-800 dark:text-primary-200">Desktop</div>
                <div className="text-xs text-primary-600 dark:text-primary-400">1024px - 1920px</div>
              </div>
              <div className="bg-primary-100 dark:bg-primary-900/30 rounded-lg p-2 sm:p-3 text-center">
                <div className="text-xs sm:text-sm font-semibold text-primary-800 dark:text-primary-200">Large</div>
                <div className="text-xs text-primary-600 dark:text-primary-400">1920px+</div>
              </div>
            </div>

            {/* Button Tests */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Button Components (Touch-friendly 44px minimum)
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Sizes</h3>
                  <div className="space-y-2">
                    <Button size="xs" fullWidth>Extra Small</Button>
                    <Button size="sm" fullWidth>Small</Button>
                    <Button size="md" fullWidth>Medium (44px)</Button>
                    <Button size="lg" fullWidth>Large</Button>
                    <Button size="xl" fullWidth>Extra Large</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Variants</h3>
                  <div className="space-y-2">
                    <Button variant="primary" fullWidth>Primary</Button>
                    <Button variant="secondary" fullWidth>Secondary</Button>
                    <Button variant="outline" fullWidth>Outline</Button>
                    <Button variant="ghost" fullWidth>Ghost</Button>
                    <Button variant="success" fullWidth>Success</Button>
                    <Button variant="error" fullWidth>Error</Button>
                    <Button variant="warning" fullWidth>Warning</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">States</h3>
                  <div className="space-y-2">
                    <Button fullWidth>Normal</Button>
                    <Button isLoading fullWidth>Loading</Button>
                    <Button disabled fullWidth>Disabled</Button>
                    <Button leftIcon={<Brain className="w-4 h-4" />} fullWidth>With Icon</Button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Responsive</h3>
                  <div className="space-y-2">
                    <Button className="hidden sm:block" fullWidth>Hidden on Mobile</Button>
                    <Button className="sm:hidden" fullWidth>Mobile Only</Button>
                    <Button className="text-xs sm:text-sm" fullWidth>Responsive Text</Button>
                  </div>
                </div>
              </div>
            </section>

            {/* Card Tests */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Card Components
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card variant="default">
                  <CardHeader>
                    <CardTitle>Default Card</CardTitle>
                    <CardDescription>Standard card with default styling</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This card demonstrates the default variant with proper spacing and shadows.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Elevated Card</CardTitle>
                    <CardDescription>Card with enhanced elevation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This card has enhanced shadows and elevation for better visual hierarchy.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="floating">
                  <CardHeader>
                    <CardTitle>Floating Card</CardTitle>
                    <CardDescription>Card with floating effect</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This card has a floating effect with backdrop blur and subtle transparency.
                    </p>
                  </CardContent>
                </Card>

                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Glass Card</CardTitle>
                    <CardDescription>Glass morphism effect</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      This card demonstrates the glass morphism effect with backdrop blur.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Form Tests */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Form Components
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>TextArea Component</CardTitle>
                    <CardDescription>Responsive text input with proper sizing</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <TextArea
                      label="Small TextArea"
                      size="sm"
                      placeholder="Small size textarea..."
                    />
                    <TextArea
                      label="Medium TextArea"
                      size="md"
                      placeholder="Medium size textarea..."
                    />
                    <TextArea
                      label="Large TextArea"
                      size="lg"
                      placeholder="Large size textarea..."
                    />
                    <TextArea
                      label="With Error"
                      error="This field is required"
                      placeholder="Textarea with error state..."
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Form Layout</CardTitle>
                    <CardDescription>Responsive form layout testing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="form-label">First Name</label>
                        <input className="form-input" placeholder="Enter first name" />
                      </div>
                      <div>
                        <label className="form-label">Last Name</label>
                        <input className="form-input" placeholder="Enter last name" />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="form-label">Email</label>
                        <input className="form-input" type="email" placeholder="Enter email" />
                      </div>
                      <div className="sm:col-span-2">
                        <Button fullWidth>Submit Form</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Loading States */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Loading States & Skeletons
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Loading Spinners</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <LoadingSpinner size="sm" />
                      <LoadingSpinner size="md" />
                      <LoadingSpinner size="lg" />
                    </div>
                    <TypingIndicator />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Text Skeletons</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TextSkeleton lines={3} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Card Skeleton</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardSkeleton />
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Status Messages */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Status Messages
              </h2>
              <div className="space-y-4">
                <SuccessMessage
                  title="Success!"
                  message="Your text has been successfully simplified. The AI has processed your request and provided a clear explanation."
                  onAction={() => setShowToast(true)}
                  actionLabel="View Result"
                />
                
                <ErrorMessage
                  title="Error occurred"
                  message="Failed to process your request. Please check your connection and try again."
                  onRetry={() => console.log('Retry clicked')}
                />
                
                <WarningMessage
                  title="Warning"
                  message="Your text is quite long. Processing may take longer than usual."
                />
                
                <InfoMessage
                  title="Information"
                  message="Wikipedia context has been added to enhance your explanation."
                />
              </div>
            </section>

            {/* Grid Layout Tests */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Grid Layout Tests
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="p-4">
                    <div className="text-center">
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3">
                        <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                        Feature {i + 1}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                        Responsive grid item that adapts to different screen sizes
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            {/* Typography Tests */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Typography & Spacing
              </h2>
              <Card>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">
                      Responsive Heading 1
                    </h1>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Responsive Heading 2
                    </h2>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Responsive Heading 3
                    </h3>
                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Responsive Heading 4
                    </h4>
                  </div>
                  
                  <div className="space-y-2 sm:space-y-3">
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                      This is a responsive paragraph that adjusts its font size based on screen size. 
                      On mobile devices, it uses smaller text for better readability, while on larger 
                      screens it uses larger text for better visual hierarchy.
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-500">
                      Small text that remains readable across all devices with proper line height and spacing.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Touch Target Tests */}
            <section className="mb-8 sm:mb-12">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 sm:mb-6">
                Touch Target Tests (44px minimum)
              </h2>
              <Card>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <button
                        key={i}
                        className="min-h-[44px] w-full bg-primary-100 dark:bg-primary-900/30 hover:bg-primary-200 dark:hover:bg-primary-900/50 rounded-xl transition-colors duration-200 flex items-center justify-center text-sm font-medium text-primary-800 dark:text-primary-200"
                      >
                        Touch {i + 1}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </section>

          </div>
        </main>
        
        <Footer />

        {/* Toast Test */}
        {showToast && (
          <Toast
            type="success"
            message="Toast notification test - responsive design working!"
            onDismiss={() => setShowToast(false)}
          />
        )}
      </div>
    </>
  )
}

