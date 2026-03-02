import { Roboto } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import { AuthProvider } from '@/contexts/AuthContext'

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '700'],
})

export const metadata = {
  title: 'Rekabetçi Denemeleri | Analiz Sistemi',
  description:
    'Profesyonel rekabetçi denemeleri analiz sistemi — sonuçlar, sıralama ve soru bazlı analiz.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={roboto.variable}>
      <body className="min-h-screen bg-dark font-sans">
        <AuthProvider>
          <Header />
          <main className="min-h-[calc(100vh-3.5rem)] min-w-0">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}

