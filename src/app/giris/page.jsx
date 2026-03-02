'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function GirisPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [no, setNo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    // Şimdilik şart yok: direkt ana sayfaya geç (mock kullanıcı ile giriş sayılsın)
    login('101', '1')
    router.push('/')
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-x-hidden px-4 py-6 sm:px-5 sm:py-8 md:px-6">
      <div className="w-full max-w-md min-w-0">
        <div className="rounded-2xl border border-dark-lighter bg-dark-light p-4 shadow-xl sm:p-6 md:p-8">
          <div className="mb-5 flex flex-col items-center text-center sm:mb-6 md:mb-8">
            <Image
              src="/rbdlogo.png"
              alt="Rekabetçi Denemeleri"
              width={100}
              height={100}
              className="mb-3 h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20 md:mb-4 md:h-24 md:w-24"
              unoptimized
            />
            <h1 className="text-base font-bold uppercase tracking-wide text-white sm:text-lg md:text-xl lg:text-2xl">
              Rekabetçi Denemeleri
            </h1>
            <p className="mt-1 text-xs font-medium text-primary sm:text-sm">
              Analiz Sistemi
            </p>
            <p className="mt-2 text-xs text-gray-400 sm:mt-3 sm:text-sm">
              Öğrenci numaranız ve şifrenizle giriş yapın
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {error && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-xs text-red-400 sm:text-sm">
                {error}
              </p>
            )}
            <div className="min-w-0">
              <label
                htmlFor="no"
                className="mb-1.5 block text-xs font-medium text-gray-300 sm:text-sm"
              >
                Öğrenci Numarası
              </label>
              <input
                id="no"
                type="text"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                placeholder="Örn. 101"
                className="w-full min-w-0 rounded-lg border border-dark-lighter bg-dark px-3 py-3 text-base text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 min-h-[2.75rem] sm:min-h-[3rem] sm:px-4"
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="password"
                className="mb-1.5 block text-xs font-medium text-gray-300 sm:text-sm"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full min-w-0 rounded-lg border border-dark-lighter bg-dark px-3 py-3 text-base text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30 min-h-[2.75rem] sm:min-h-[3rem] sm:px-4"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[2.75rem] rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark active:scale-[0.98] sm:min-h-[3rem] sm:text-base"
            >
              Giriş Yap
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 sm:mt-6 sm:text-sm">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="font-medium text-primary hover:underline">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  )
}

