'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getExamsForStudent, getRanking } from '@/lib/mock-data'
import GirisPage from './giris/page'

export default function HomePage() {
  const { user, isReady } = useAuth()

  // Context hazır olmadan önce kısa bir loading göster
  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Yükleniyor...</p>
      </div>
    )
  }

  // Giriş yapmamış kullanıcı: doğrudan giriş sayfası gözüksün
  if (!user) {
    return <GirisPage />
  }

  // Giriş yapmış öğrenci: sadece kendi denemeleri kart olarak
  const examsWithResults = getExamsForStudent(user.id)

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-medium uppercase tracking-wider text-primary sm:text-sm">
            Rekabetçi Denemeleri Analiz Sistemi
          </p>
          <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">Denemelerim</h1>
          <p className="mt-1 text-sm text-gray-400">
            {user.adSoyad} · No: {user.no} · {user.sinif}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
          {examsWithResults.map(({ exam, result }) => {
            const ranking = getRanking(exam.id)
            const myRow = ranking.find((r) => r.studentId === user.id)
            return (
              <Link
                key={exam.id}
                href={`/profil/deneme/${exam.id}`}
                className="group block rounded-xl border border-dark-lighter bg-dark-light p-4 transition hover:border-primary/50 hover:bg-dark-lighter active:scale-[0.99] sm:p-6"
              >
                <h2 className="text-base font-semibold text-white group-hover:text-primary sm:text-lg">
                  {exam.ad}
                </h2>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">{exam.tarih}</p>
                <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-4">
                  <span className="rounded-lg bg-dark px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm">
                    <span className="text-gray-400">Net </span>
                    <span className="font-semibold text-primary">{result.net}</span>
                  </span>
                  <span className="rounded-lg bg-dark px-2.5 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm">
                    <span className="text-gray-400">Sıra </span>
                    <span className="font-semibold text-primary">
                      {myRow ? myRow.sira : '—'}
                    </span>
                  </span>
                </div>
                <p className="mt-3 text-xs text-primary sm:mt-4 sm:text-sm">Sonuç ve analiz →</p>
              </Link>
            )
          })}
        </div>

        {examsWithResults.length === 0 && (
          <div className="rounded-xl border border-dark-lighter bg-dark-light p-8 text-center text-sm text-gray-500 sm:p-12">
            Henüz deneme sonucunuz yok.
          </div>
        )}
      </div>
    </div>
  )
}

