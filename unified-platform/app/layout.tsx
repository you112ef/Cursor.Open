import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ProviderContextProvider } from '@/contexts/ProviderContext'
import { AppProvider } from '@/contexts/AppContext'
import { QueryProvider } from '@/contexts/QueryProvider'
import { SocketProvider } from '@/contexts/SocketProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Unified Platform - AI-Powered Development Environment',
  description: 'Comprehensive AI-powered development platform combining Agenticseek, Dish Platform, AI Assistant, and VibeCode Clone in one unified solution.',
  keywords: ['AI', 'development', 'code editor', 'collaboration', 'agents', 'automation', 'unified platform'],
  authors: [{ name: 'Unified Platform Team' }],
  creator: 'Unified Platform',
  publisher: 'Unified Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://unified-platform.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Unified Platform - AI-Powered Development Environment',
    description: 'Comprehensive AI-powered development platform with agentic capabilities',
    url: '/',
    siteName: 'Unified Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Unified Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unified Platform - AI-Powered Development Environment',
    description: 'Comprehensive AI-powered development platform with agentic capabilities',
    images: ['/og-image.png'],
    creator: '@unifiedplatform',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider>
          <QueryProvider>
            <SocketProvider>
              <ProviderContextProvider>
                <AppProvider>
                  <div className="app h-screen overflow-hidden bg-background text-foreground">
                    {children}
                  </div>
                </AppProvider>
              </ProviderContextProvider>
            </SocketProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}