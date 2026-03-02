'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { getExamsForStudent, getRanking } from '@/lib/mock-data'

export default function ProfilPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-400">Giriş yapmanız gerekiyor.</p>
        <Link href="/giris" className="mt-4 inline-block text-primary hover:underline">
          Giriş sayfasına git
        </Link>
      </div>
    )
  }

  const examsWithResults = getExamsForStudent(user.id)

  return (
    <div className="mx-auto min-w-0 max-w-4xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <nav className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 sm:mb-6 sm:text-sm">
        <Link href="/" className="transition hover:text-primary">
          Ana Sayfa
        </Link>
        <span>/</span>
        <span className="text-white">Denemelerim</span>
      </nav>

      <div className="mb-6 rounded-xl border border-dark-lighter bg-dark-light p-4 sm:mb-8 sm:p-6">
        <h1 className="text-lg font-bold text-white sm:text-xl">{user.adSoyad}</h1>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400 sm:gap-4 sm:text-sm">
          <span>Sınıf: {user.sinif}</span>
          <span>No: {user.no}</span>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
          Denemelerim
        </h2>
        <p className="mb-3 text-xs text-gray-400 sm:mb-4 sm:text-sm">
          Denemeye tıklayarak sıralama tablosu ve kendi analizinizi görün
        </p>
        <ul className="space-y-2 sm:space-y-3">
          {examsWithResults.map(({ exam, result }) => {
            const ranking = getRanking(exam.id)
            const myRow = ranking.find((r) => r.studentId === user.id)
            return (
              <li key={exam.id}>
                <Link
                  href={`/profil/deneme/${exam.id}`}
                  className="block rounded-xl border border-dark-lighter bg-dark-light p-3 transition hover:border-primary/50 hover:bg-dark-lighter active:scale-[0.99] sm:p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4">
                    <div className="min-w-0">
                      <p className="font-medium text-white">{exam.ad}</p>
                      <p className="mt-0.5 text-xs text-gray-400 sm:text-sm">{exam.tarih}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:gap-6 sm:text-sm">
                      <span className="text-gray-400">
                        Net:{' '}
                        <span className="font-medium text-primary">
                          {result.net}
                        </span>
                      </span>
                      <span className="text-gray-400">
                        Sıra:{' '}
                        <span className="font-medium text-primary">
                          {myRow ? myRow.sira : '—'}
                        </span>
                      </span>
                      <span className="text-primary">Detay →</span>
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
        {examsWithResults.length === 0 && (
          <div className="rounded-xl border border-dark-lighter bg-dark-light p-8 text-center text-gray-500">
            Henüz deneme sonucunuz yok.
          </div>
        )}
      </section>
    </div>
  )
}

