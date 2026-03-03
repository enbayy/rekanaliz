'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function GirisPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [noOrTc, setNoOrTc] = useState('')
  const [error, setError] = useState('')

  const handleStudentSubmit = (e) => {
    e.preventDefault()

    // Şuanlık: her tıkta direkt giriş (mock veri: 101 numaralı öğrenci)
    login('101')
    router.push('/')
  }

  const handleTeacherClick = () => {
    router.push('/ogretmen/giris')
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-x-hidden px-4 py-6 sm:px-5 sm:py-8 md:px-6">
      <div className="w-full max-w-md min-w-0 space-y-4 sm:space-y-5 md:space-y-6">
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
              Öğrenci numaranız veya TC kimlik numaranız ile giriş yapın
            </p>
          </div>

          <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 sm:mb-4 sm:text-[0.7rem]">
            <span className="text-primary">Öğrenci Girişi</span>
            <span className="h-px flex-1 bg-gray-700 ml-3" />
          </div>

          <form onSubmit={handleStudentSubmit} className="space-y-4 sm:space-y-5">
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
                Öğrenci No / TC
              </label>
              <input
                id="no"
                type="text"
                value={noOrTc}
                onChange={(e) => setNoOrTc(e.target.value)}
                placeholder="Örn. 101 veya 10000000001"
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

        <div className="rounded-2xl border border-dark-lighter bg-dark-light p-4 sm:p-5 md:p-6">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-gray-400 sm:mb-4 sm:text-[0.7rem]">
            <span className="text-primary">Öğretmen Girişi</span>
            <span className="h-px flex-1 bg-gray-700 ml-3" />
          </div>
          <p className="mb-3 text-xs text-gray-400 sm:text-sm">
            Okulunuz için tanımlanan öğretmen kullanıcı adı ve şifresi ile giriş
            yapabilirsiniz.
          </p>
          <button
            type="button"
            onClick={handleTeacherClick}
            className="w-full min-h-[2.75rem] rounded-lg border border-primary/70 bg-dark py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark active:scale-[0.98] sm:min-h-[3rem] sm:text-base"
          >
            Öğretmen Paneline Giriş
          </button>
        </div>

        <p className="text-center text-xs text-gray-500 sm:text-sm">
          Hesabınız yok mu?{' '}
          <Link href="/kayit" className="font-medium text-primary hover:underline">
            Kayıt olun
          </Link>
        </p>
      </div>
    </div>
  )
}

