import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Laundry Tracker - Professional Laundry Management System',
  description: 'Complete laundry management solution for businesses and customers. Track orders, manage appointments, and streamline operations.',
  keywords: 'laundry, management, tracking, orders, appointments, business',
  authors: [{ name: 'Laundry Tracker Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Meta tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#3b82f6" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div id="root">
          {children}
        </div>

        {/* Portal for modals */}
        <div id="modal-root"></div>

        {/* Global loading indicator */}
        <div id="loading-indicator" className="hidden fixed top-4 right-4 z-50">
          <div className="bg-white shadow-lg rounded-lg p-3 flex items-center space-x-2">
            <div className="spinner"></div>
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
      </body>
    </html>
  )
}