import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { Navbar, Footer } from '@/components/layout'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/lib/auth'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: 'Restiqo - Premium Travel & Accommodation Booking',
  description: 'Discover amazing apartments, hotels, and tours. Your perfect stay and experience awaits you in Bangladesh and beyond.',
  keywords: ['travel', 'booking', 'apartments', 'hotels', 'tours', 'Bangladesh', 'accommodation'],
  authors: [{ name: 'Restiqo Team' }],
  openGraph: {
    title: 'Restiqo - Premium Travel & Accommodation Booking',
    description: 'Discover amazing apartments, hotels, and tours. Your perfect stay and experience awaits you in Bangladesh and beyond.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Restiqo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Restiqo - Premium Travel & Accommodation Booking',
    description: 'Discover amazing apartments, hotels, and tours. Your perfect stay and experience awaits you in Bangladesh and beyond.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '16px',
                boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.4), -8px -8px 16px rgba(255, 255, 255, 0.8)',
              },
              success: {
                iconTheme: {
                  primary: '#88C51C',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  )
}
