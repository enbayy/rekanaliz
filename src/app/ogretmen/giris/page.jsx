'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function OgretmenGirisPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    // Şimdilik herhangi bir kontrol yapmadan direkt öğretmen paneline gönderiyoruz.
    // İleride burada gerçek kullanıcı adı / şifre doğrulaması yapılabilir.
    router.push('/ogretmen')
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-6 sm:px-5 sm:py-8 md:px-6">
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
              Öğretmen Paneli Girişi
            </p>
            <p className="mt-2 text-xs text-gray-400 sm:mt-3 sm:text-sm">
              Size verilen kullanıcı adı ve şifre ile öğretmen paneline giriş yapın.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div className="min-w-0">
              <label
                htmlFor="username"
                className="mb-1.5 block text-xs font-medium text-gray-300 sm:text-sm"
              >
                Kullanıcı Adı
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Örn. okuladi_hoca"
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
      </div>
    </div>
  )
}

