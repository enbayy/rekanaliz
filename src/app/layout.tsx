import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Rekabetçi Denemeleri | Analiz Sistemi',
  description: 'Profesyonel rekabetçi denemeleri analiz sistemi — sonuçlar, sıralama ve soru bazlı analiz.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen bg-dark font-sans">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-3.5rem)] min-w-0">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
