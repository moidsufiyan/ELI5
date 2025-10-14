import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Inter } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { useRouter } from 'next/router'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider>
        <div className={inter.className}>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-neutral-900 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
          >
            Skip to content
          </a>
          {/* Register service worker */}
          <Script id="sw-register" strategy="afterInteractive">
            {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function () {
                navigator.serviceWorker.register('/sw.js');
              });
            }
            `}
          </Script>
          <AnimatePresence mode="wait" initial={false}>
            <motion.main
              key={router.asPath}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              id="main-content"
            >
              <Component {...pageProps} />
            </motion.main>
          </AnimatePresence>
        </div>
      </ThemeProvider>
    </>
  )
}
