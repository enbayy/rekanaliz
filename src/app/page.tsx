'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  MOCK_SCHOOLS,
  MOCK_EXAMS,
  MOCK_STUDENTS,
  getExamsForStudent,
  getRanking,
} from '@/lib/mock-data'

export default function HomePage() {
  const { user, isReady } = useAuth()
  const [schoolId, setSchoolId] = useState('')
  const [examId, setExamId] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  // Giriş yoksa direkt giriş sayfasına yönlendir
  useEffect(() => {
    if (isReady && !user) {
      window.location.replace('/giris')
      return
    }
  }, [isReady, user])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setHasSearched(true)
  }

  // Giriş yoksa yönlendirme yapılıyor (boş veya loading)
  if (!isReady || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Yönlendiriliyor...</p>
      </div>
    )
  }

  // Giriş yapmış öğrenci: sadece kendi denemeleri kart olarak
  if (user) {
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

  // Giriş yok: okul, deneme seç, öğrenci ara
  const showResults = hasSearched && schoolId && examId
  const results = showResults
    ? MOCK_STUDENTS.filter(
        (s) =>
          s.schoolId === schoolId &&
          (s.adSoyad.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
            !searchQuery.trim())
      )
    : []

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mb-6 text-center sm:mb-10">
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            REKABETÇİ DENEMELERİ
          </h1>
          <p className="mt-2 text-sm text-gray-400 sm:text-base">
            Analiz Sistemi — Okul ve deneme seçin, öğrenci adıyla arayın
          </p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 sm:space-y-6">
          <div className="rounded-xl border border-dark-lighter bg-dark-light p-4 sm:rounded-2xl sm:p-6">
            <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400 sm:mb-4 sm:text-sm">
              Filtreler
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="school"
                  className="mb-1.5 block text-sm font-medium text-gray-300"
                >
                  Okul
                </label>
                <select
                  id="school"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-2.5 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Okul seçin</option>
                  {MOCK_SCHOOLS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.ad}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="exam"
                  className="mb-1.5 block text-sm font-medium text-gray-300"
                >
                  Deneme
                </label>
                <select
                  id="exam"
                  value={examId}
                  onChange={(e) => setExamId(e.target.value)}
                  className="w-full rounded-lg border border-dark-lighter bg-dark px-4 py-2.5 text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Deneme seçin</option>
                  {MOCK_EXAMS.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.ad} ({e.tarih})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="search"
                  className="mb-1.5 block text-sm font-medium text-gray-300"
                >
                  Öğrenci ara (ad / soyad)
                </label>
                <div className="flex flex-col gap-2 sm:flex-row sm:gap-2">
                  <input
                    id="search"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Örn. Ayşe, Mehmet..."
                    className="min-w-0 flex-1 rounded-lg border border-dark-lighter bg-dark px-4 py-2.5 text-white placeholder-gray-500 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary px-5 py-2.5 font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-dark active:scale-[0.98] sm:w-auto"
                  >
                    Ara
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        {showResults && (
          <div className="mt-6 sm:mt-8">
            <h2 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
              Öğrenciler
            </h2>
            <p className="mb-3 text-xs text-gray-400 sm:mb-4 sm:text-sm">
              Profiline girmek için öğrenciye tıklayın
            </p>
            <ul className="space-y-2 sm:space-y-3">
              {results.map((student) => (
                <li key={student.id}>
                  <Link
                    href={`/ogrenci/${student.id}`}
                    className="block rounded-xl border border-dark-lighter bg-dark-light p-3 transition hover:border-primary/50 hover:bg-dark-lighter active:scale-[0.99] sm:p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-white">
                          {student.adSoyad}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-gray-400 sm:text-sm">
                          {student.sinif} · No: {student.no}
                        </p>
                      </div>
                      <span className="flex-shrink-0 text-primary">Profil →</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
            {results.length === 0 && (
              <div className="rounded-xl border border-dark-lighter bg-dark-light p-6 text-center text-sm text-gray-500 sm:p-8">
                Bu kriterlere uygun öğrenci bulunamadı.
              </div>
            )}
          </div>
        )}

        {!hasSearched && (
          <p className="mt-6 text-center text-xs text-gray-500 sm:mt-8 sm:text-sm">
            Okul ve deneme seçip öğrenci adı yazarak arama yapın.
          </p>
        )}
      </div>
    </div>
  )
}
