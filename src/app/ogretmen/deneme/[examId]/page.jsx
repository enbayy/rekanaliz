'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { getExam, getRanking } from '@/lib/mock-data'

export default function OgretmenDenemeDetayPage({ params }) {
  const { examId } = params
  const exam = getExam(examId)
  const ranking = getRanking(examId) || []

  const { byClass, schoolRanking } = useMemo(() => {
    const grouped = {}

    // Öğrencileri sınıflara göre grupla
    ranking.forEach((row) => {
      if (!grouped[row.sinif]) grouped[row.sinif] = []
      grouped[row.sinif].push(row)
    })

    // Her sınıfı net'e göre azalan sırala (1. en yüksek net)
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => (b.net || 0) - (a.net || 0))
    })

    // Okul genelinde de net'e göre azalan sırala (1. en yüksek net)
    const school = [...ranking].sort((a, b) => (b.net || 0) - (a.net || 0))

    return { byClass: grouped, schoolRanking: school }
  }, [ranking])

  if (!exam) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 py-10">
        <div className="max-w-md rounded-2xl border border-dark-lighter bg-dark-light p-6 text-center sm:p-8">
          <p className="text-sm text-gray-300">Deneme bulunamadı.</p>
          <Link
            href="/ogretmen"
            className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:bg-primary/90 sm:text-sm"
          >
            Öğretmen paneline dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary sm:text-sm">
              Öğretmen Paneli · Deneme
            </p>
            <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              {exam.ad}
            </h1>
            <p className="mt-1 text-sm text-gray-400">{exam.tarih}</p>
          </div>
          <Link
            href="/ogretmen"
            className="inline-flex items-center justify-center rounded-lg border border-dark-lighter bg-dark px-3 py-2 text-xs font-medium text-gray-200 transition hover:border-primary hover:text-primary sm:px-4 sm:text-sm"
          >
            ← Tüm denemelere dön
          </Link>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)] lg:gap-6">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-200 sm:mb-4 sm:text-base">
              Sınıf Sıralamaları
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-2 sm:gap-4">
              {Object.keys(byClass).map((sinif) => (
                <div
                  key={sinif}
                  className="flex flex-col rounded-xl border border-dark-lighter bg-dark-light p-4 sm:p-5"
                >
                  <div className="mb-3 flex items-baseline justify-between gap-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
                        Sınıf
                      </p>
                      <h3 className="text-base font-semibold text-white sm:text-lg">
                        {sinif}
                      </h3>
                    </div>
                    <span className="rounded-full bg-dark px-3 py-1 text-[0.65rem] font-medium uppercase tracking-wide text-gray-400">
                      Öğrenci: {byClass[sinif].length}
                    </span>
                  </div>
                  <div className="space-y-1.5 overflow-hidden rounded-lg border border-dark bg-dark">
                    {byClass[sinif].map((row, index) => (
                      <div
                        key={row.studentId}
                        className="flex items-center justify-between gap-2 px-3 py-2 text-xs sm:px-3.5 sm:py-2.5 sm:text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary/20 text-[0.7rem] font-semibold text-primary sm:h-7 sm:w-7 sm:text-xs">
                            {index + 1}
                          </span>
                          <span className="font-medium text-gray-100">
                            {row.adSoyad}
                          </span>
                        </div>
                        <div className="flex flex-col items-end text-[0.7rem] sm:text-xs">
                          <span className="font-semibold text-primary">
                            {row.net.toFixed ? row.net.toFixed(1) : row.net}
                          </span>
                          <span className="text-[0.65rem] text-gray-400">
                            Okul Sırası: {row.kurumSira}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {Object.keys(byClass).length === 0 && (
                <div className="rounded-xl border border-dark-lighter bg-dark-light p-6 text-center text-sm text-gray-400 sm:p-8">
                  Bu deneme için henüz sınıf sıralaması bulunmuyor.
                </div>
              )}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-gray-200 sm:mb-4 sm:text-base">
              Okul Sıralaması
            </h2>
              <div className="rounded-xl border border-dark-lighter bg-dark-light p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2 text-xs text-gray-400 sm:mb-4 sm:text-sm">
                <span>Okuldaki tüm öğrenciler nete göre sıralanmıştır.</span>
                <span className="whitespace-nowrap rounded-full bg-dark px-2.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide sm:px-3 sm:py-1 sm:text-[0.65rem]">
                  Toplam {schoolRanking.length} öğrenci
                </span>
              </div>
              <div className="max-h-[480px] space-y-1.5 overflow-y-auto rounded-lg border border-dark bg-dark">
                {schoolRanking.map((row, index) => (
                  <div
                    key={row.studentId}
                    className="flex items-center justify-between gap-2 px-3 py-2 text-xs sm:px-3.5 sm:py-2.5 sm:text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[0.7rem] font-semibold text-white sm:h-7 sm:w-7 sm:text-xs">
                        {index + 1}
                      </span>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-100">
                          {row.adSoyad}
                        </span>
                        <span className="text-[0.65rem] text-gray-400">
                          {row.sinif}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end text-[0.7rem] sm:text-xs">
                      <span className="font-semibold text-primary">
                        {row.net.toFixed ? row.net.toFixed(1) : row.net}
                      </span>
                      <span className="text-[0.65rem] text-gray-400">
                        Genel Sıra: {index + 1}
                      </span>
                    </div>
                  </div>
                ))}

                {schoolRanking.length === 0 && (
                  <div className="px-4 py-6 text-center text-xs text-gray-400 sm:text-sm">
                    Bu deneme için okul sıralaması bulunmuyor.
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

