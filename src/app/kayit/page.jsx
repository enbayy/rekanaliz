'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function KayitPage() {
  const router = useRouter()
  const [no, setNo] = useState('')
  const [adSoyad, setAdSoyad] = useState('')
  const [sinif, setSinif] = useState('')
  const [password, setPassword] = useState('')
  const [passwordAgain, setPasswordAgain] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!no.trim() || !adSoyad.trim() || !sinif.trim() || !password || !passwordAgain) {
      setError('Tüm alanları doldurun.')
      return
    }
    if (password !== passwordAgain) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    if (password.length < 4) {
      setError('Şifre en az 4 karakter olmalıdır.')
      return
    }

    // Şimdilik sadece tasarım — kayıt API'ye bağlanacak
    setSuccess(true)
    setTimeout(() => router.push('/giris'), 1500)
  }

  if (success) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4 py-8">
        <div className="w-full max-w-md rounded-2xl border border-dark-lighter bg-dark-light p-6 text-center sm:p-8">
          <p className="text-base font-semibold text-primary sm:text-lg">Kayıt başarılı!</p>
          <p className="mt-2 text-xs text-gray-400 sm:text-sm">
            Giriş sayfasına yönlendiriliyorsunuz...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-3 py-6 sm:px-4 sm:py-8">
      <div className="w-full max-w-md px-1">
        <div className="rounded-2xl border border-dark-lighter bg-dark-light p-5 shadow-xl sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center sm:mb-8">
            <Image
              src="/rbdlogo.png"
              alt="Rekabetçi Denemeleri"
              width={80}
              height={80}
              className="mb-3 h-16 w-16 object-contain sm:mb-4 sm:h-20 sm:w-20"
              unoptimized
            />
            <h1 className="text-lg font-bold uppercase tracking-wide text-white sm:text-xl md:text-2xl">
              Kayıt Ol
            </h1>
            <p className="mt-1 text-xs font-medium text-primary sm:text-sm">
              Rekabetçi Denemeleri Analiz Sistemi
            </p>
            <p className="mt-2 text-xs text-gray-400 sm:mt-3 sm:text-sm">
              Hesap oluşturarak deneme sonuçlarınıza erişin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {error && (
              <p className="rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}
            <div>
              <label
                htmlFor="no"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Öğrenci Numarası
              </label>
              <input
                id="no"
                type="text"
                value={no}
                onChange={(e) => setNo(e.target.value)}
                placeholder="Örn. 101"
                className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="adSoyad"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Ad Soyad
              </label>
              <input
                id="adSoyad"
                type="text"
                value={adSoyad}
                onChange={(e) => setAdSoyad(e.target.value)}
                placeholder="Örn. Ayşe Yılmaz"
                className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="sinif"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Sınıf
              </label>
              <input
                id="sinif"
                type="text"
                value={sinif}
                onChange={(e) => setSinif(e.target.value)}
                placeholder="Örn. 12-A"
                className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Şifre
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="En az 4 karakter"
                className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label
                htmlFor="passwordAgain"
                className="mb-1.5 block text-sm font-medium text-gray-300"
              >
                Şifre Tekrar
              </label>
              <input
                id="passwordAgain"
                type="password"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
                placeholder="Şifrenizi tekrar girin"
                className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark active:scale-[0.98]"
            >
              Kayıt Ol
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500 sm:mt-6 sm:text-sm">
          Zaten hesabınız var mı?{' '}
          <Link href="/giris" className="font-medium text-primary hover:underline">
            Giriş yapın
          </Link>
        </p>
      </div>
    </div>
  )
}

