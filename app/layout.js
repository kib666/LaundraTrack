import { Inter } from 'next/font/google'
import './globals.css'
import NextAuthSessionProvider from '@/components/common/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Laundry Tracker - Professional Laundry Management System',
  description: 'Complete laundry management solution for businesses and customers. Track orders, manage appointments, and streamline operations.',
  keywords: 'laundry, management, tracking, orders, appointments, business',
  authors: [{ name: 'Laundry Tracker Team' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
      </body>
    </html>
  )
}