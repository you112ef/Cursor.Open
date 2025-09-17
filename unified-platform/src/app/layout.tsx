import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { QueryProvider } from '@/components/query-provider'
import { SocketProvider } from '@/components/socket-provider'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Dish Platform - Advanced AI Development Environment',
  description: 'A comprehensive full-stack development environment with AI integration, real-time collaboration, and advanced tooling',
  keywords: ['AI', 'code editor', 'development platform', 'collaboration', 'TypeScript', 'React'],
  authors: [{ name: 'Dish Platform Team' }],
  creator: 'Dish Platform Team',
  publisher: 'Dish Platform',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://dish-platform.dev',
    title: 'Dish Platform - Advanced AI Development Environment',
    description: 'A comprehensive full-stack development environment with AI integration, real-time collaboration, and advanced tooling',
    siteName: 'Dish Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dish Platform - Advanced AI Development Environment',
    description: 'A comprehensive full-stack development environment with AI integration, real-time collaboration, and advanced tooling',
    creator: '@dishplatform',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <SocketProvider>
              {children}
              <Toaster />
            </SocketProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}