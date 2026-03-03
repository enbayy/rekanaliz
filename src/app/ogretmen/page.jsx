'use client'

import Link from 'next/link'
import { MOCK_EXAMS } from '@/lib/mock-data'

export default function OgretmenHomePage() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
        <header className="mb-6 flex flex-col gap-2 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary sm:text-sm">
              Rekabetçi Denemeleri
            </p>
            <h1 className="mt-1 text-xl font-bold text-white sm:text-2xl">
              Öğretmen Paneli
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Okulunuzda uygulanan denemeleri kartlar halinde görebilir, her deneme için
              sınıf ve okul sıralamalarını inceleyebilirsiniz.
            </p>
          </div>
        </header>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-gray-200 sm:mb-4 sm:text-base">
            Denemeler
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {MOCK_EXAMS.map((exam) => (
              <Link
                key={exam.id}
                href={`/ogretmen/deneme/${exam.id}`}
                className="group flex flex-col justify-between rounded-xl border border-dark-lighter bg-dark-light p-4 transition hover:border-primary/60 hover:bg-dark-lighter active:scale-[0.99] sm:p-5"
              >
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
                    Deneme
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-white group-hover:text-primary sm:text-lg">
                    {exam.ad}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400 sm:text-sm">{exam.tarih}</p>
                </div>
                <p className="mt-3 text-xs font-medium text-primary sm:mt-4 sm:text-sm">
                  Sınıf ve okul sıralamasını gör →
                </p>
              </Link>
            ))}
          </div>

          {MOCK_EXAMS.length === 0 && (
            <div className="mt-4 rounded-xl border border-dark-lighter bg-dark-light p-6 text-center text-sm text-gray-400 sm:mt-6 sm:p-8">
              Henüz tanımlı deneme bulunmuyor.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

