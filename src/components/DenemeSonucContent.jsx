'use client'

import { useState, useEffect, Fragment } from 'react'
import Link from 'next/link'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import {
  getQuestionByQuestionId,
  DERS_RENKLERI,
  LGS_KONULARI,
  getExam,
} from '@/lib/mock-data'

const KITAPCIK_DERSLER = [
  { ad: 'Türkçe', soruSayisi: 20 },
  { ad: 'Sosyal Bilgiler', soruSayisi: 10 },
  { ad: 'Din Kültürü', soruSayisi: 10 },
  { ad: 'İngilizce', soruSayisi: 10 },
  { ad: 'Matematik', soruSayisi: 20 },
  { ad: 'Fen Bilgisi', soruSayisi: 20 },
]

function buildKitapcikSorulariByDers(questionOrder) {
  if (!questionOrder || !Array.isArray(questionOrder)) return {}

  const grouped = {}

  questionOrder
    .map(({ questionId, bookletSira }) => {
      const soru = getQuestionByQuestionId(questionId)
      if (!soru) return null
      return { ...soru, questionId, bookletSira }
    })
    .filter(Boolean)
    .forEach((soru) => {
      if (!grouped[soru.ders]) grouped[soru.ders] = []
      grouped[soru.ders].push(soru)
    })

  Object.keys(grouped).forEach((ders) => {
    grouped[ders].sort((a, b) => a.bookletSira - b.bookletSira)
  })

  return grouped
}

/** Uzun ders adını mobilde iki satıra böler (bar altında sığsın diye) */
function dersLabelSatirlari(ders) {
  if (ders === 'Sosyal Bilgiler') return ['Sosyal', 'Bilgiler']
  if (ders === 'Din Kültürü') return ['Din', 'Kültürü']
  if (ders === 'Fen Bilgisi') return ['Fen', 'Bilgisi']
  if (ders === 'Fen Bilimleri') return ['Fen', 'Bilimleri']
  return [ders, null]
}

/** Ders bazlı grafik XAxis: her barın tam altında ders adı, mobilde iki satır */
function DersBarXAxisTick(props) {
  const { x = 0, y = 0, payload, fill = '#ffffff', fontSize = 10 } = props
  if (!payload?.value) return null
  const [line1, line2] = dersLabelSatirlari(payload.value)
  return (
    // Y değerini biraz aşağı alarak bar ile yazı arasında boşluk bırak
    <g transform={`translate(${x},${y + 8})`}>
      <text textAnchor="middle" fill={fill} fontSize={fontSize} dy={line2 ? 0 : 4}>
        {line1}
      </text>
      {line2 && (
        <text textAnchor="middle" fill={fill} fontSize={fontSize} dy={fontSize + 8}>
          {line2}
        </text>
      )}
    </g>
  )
}

export default function DenemeSonucContent({
  studentId,
  studentName,
  exam,
  result,
  ranking,
  currentStudentSira,
  questionOrder,
  soruIstatistik,
  breadcrumbLinks,
}) {
  const [activeTab, setActiveTab] = useState('siralama')
  const [dersAxisFontSize, setDersAxisFontSize] = useState(10)
  const [expandedDers, setExpandedDers] = useState(null)
  const [isAiCommentLoading, setIsAiCommentLoading] = useState(false)
  const [aiComment, setAiComment] = useState('')
  const [selectedKitapcikDers, setSelectedKitapcikDers] = useState(null)
  const [selectedKitapcikIndex, setSelectedKitapcikIndex] = useState(0)
  const [expandedKitapcikDers, setExpandedKitapcikDers] = useState(null)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setDersAxisFontSize(mq.matches ? 13 : 10)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const grouped = buildKitapcikSorulariByDers(questionOrder)
    const firstDersWithQuestion = KITAPCIK_DERSLER.find(
      (d) => grouped[d.ad] && grouped[d.ad].length > 0
    )?.ad

    if (firstDersWithQuestion) {
      setSelectedKitapcikDers(firstDersWithQuestion)
      setSelectedKitapcikIndex(0)
      setExpandedKitapcikDers(firstDersWithQuestion)
    }
  }, [questionOrder])

  return (
    <div className="mx-auto min-w-0 max-w-7xl px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <nav className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-400 sm:mb-6 sm:text-sm">
        <Link href="/" className="transition hover:text-primary">
          Ana Sayfa
        </Link>
        <span>/</span>
        {breadcrumbLinks.type === 'profil' ? (
          <>
            <Link href={breadcrumbLinks.profilHref} className="transition hover:text-primary">
              {breadcrumbLinks.profilLabel}
            </Link>
            <span>/</span>
          </>
        ) : (
          <>
            <Link
              href={breadcrumbLinks.ogrenciHref}
              className="truncate transition hover:text-primary"
            >
              {breadcrumbLinks.ogrenciName}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="truncate text-white">{exam.ad}</span>
      </nav>

      <div className="mb-4 sm:mb-6">
        <h1 className="truncate text-xl font-bold text-white sm:text-2xl">{exam.ad}</h1>
        <p className="mt-1 text-sm text-gray-400">
          {exam.tarih} · Kitapçık {result.kitapcik}
        </p>
      </div>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg bg-dark-light p-1 sm:mb-6 sm:overflow-visible">
        {[
          { id: 'siralama', label: 'Sıralama' },
          { id: 'kitapcik', label: 'Kitapçık' },
          { id: 'analiz', label: 'Analiz' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-w-0 flex-1 shrink-0 rounded-md px-3 py-2 text-xs font-medium transition sm:px-4 sm:py-2.5 sm:text-sm ${
              activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'siralama' && (
        <section className="rounded-xl border border-dark-lighter bg-dark-light p-4 sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
            Öğrenci Sıralama Özeti
          </h2>
          <p className="mb-3 text-xs text-gray-400 sm:mb-4 sm:text-sm">
            Bu denemede öğrencinin farklı düzeylerdeki sıralaması ve genel net/cevap dağılımı.
          </p>
          {(() => {
            const myRow =
              Array.isArray(ranking) && ranking.length > 0
                ? ranking.find((r) => r.studentId === studentId)
                : null

            return (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-dark-lighter bg-dark">
                  <table className="w-full min-w-[320px] text-left text-xs sm:text-sm">
                    <thead>
                      <tr className="border-b border-dark-lighter bg-dark/60 text-gray-400">
                        <th className="px-3 py-3 font-semibold sm:px-4">Düzey</th>
                        <th className="px-2 py-3 text-center font-semibold sm:px-3">
                          Sıralama
                        </th>
                        <th className="px-2 py-3 text-left font-semibold sm:px-3">Açıklama</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-dark-lighter text-gray-200">
                        <td className="px-3 py-3 font-medium sm:px-4">Sınıf</td>
                        <td className="px-2 py-3 text-center sm:px-3">
                          {myRow?.sinifSira && myRow?.sinifToplam
                            ? `${myRow.sinifSira} / ${myRow.sinifToplam}`
                            : '-'}
                        </td>
                        <td className="px-2 py-3 text-left text-gray-300 sm:px-3">
                          {myRow?.sinif ?? 'Sınıf bilgisi'}
                        </td>
                      </tr>
                      <tr className="border-b border-dark-lighter text-gray-200">
                        <td className="px-3 py-3 font-medium sm:px-4">Kurum</td>
                        <td className="px-2 py-3 text-center sm:px-3">
                          {myRow?.kurumSira && myRow?.kurumToplam
                            ? `${myRow.kurumSira} / ${myRow.kurumToplam}`
                            : '-'}
                        </td>
                        <td className="px-2 py-3 text-left text-gray-300 sm:px-3">
                          Okul bazında sıralama
                        </td>
                      </tr>
                      <tr className="border-b border-dark-lighter text-gray-200">
                        <td className="px-3 py-3 font-medium sm:px-4">İlçe</td>
                        <td className="px-2 py-3 text-center sm:px-3">
                          {myRow?.ilceSira && myRow?.ilceToplam
                            ? `${myRow.ilceSira} / ${myRow.ilceToplam}`
                            : '-'}
                        </td>
                        <td className="px-2 py-3 text-left text-gray-300 sm:px-3">İlçe geneli</td>
                      </tr>
                      <tr className="text-gray-200">
                        <td className="px-3 py-3 font-medium sm:px-4">İl</td>
                        <td className="px-2 py-3 text-center sm:px-3">
                          {myRow?.ilSira && myRow?.ilToplam
                            ? `${myRow.ilSira} / ${myRow.ilToplam}`
                            : '-'}
                        </td>
                        <td className="px-2 py-3 text-left text-gray-300 sm:px-3">İl geneli</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="grid gap-3 sm:grid-cols-4">
                  {[
                    { label: 'Doğru', value: result.dogru, color: 'text-emerald-400' },
                    { label: 'Yanlış', value: result.yanlis, color: 'text-rose-400' },
                    { label: 'Boş', value: result.bos, color: 'text-amber-400' },
                    { label: 'Net', value: result.net, color: 'text-primary' },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl border border-dark-lighter bg-dark px-4 py-3 sm:py-4"
                    >
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400 sm:text-xs">
                        {item.label}
                      </p>
                      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${item.color}`}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </section>
      )}

      {activeTab === 'kitapcik' && (
        <section className="rounded-xl border border-dark-lighter bg-dark-light p-4 sm:p-6">
          {(() => {
            const kitapcikSorulariByDers = buildKitapcikSorulariByDers(questionOrder)
            const cevaplar = (result && result.cevaplar) || {}
            const soruIstatistikMap =
              (soruIstatistik || []).reduce((acc, item) => {
                acc[item.questionId] = item
                return acc
              }, {}) || {}

            // Cevap anahtarını oluştur
            const getAnswerKey = (examId, kitapcik) => {
              const exam = getExam(examId)
              if (!exam) return {}
              const cevapAnahtari = {}
              exam.questions.forEach((eq) => {
                const soru = getQuestionByQuestionId(eq.questionId)
                if (soru) {
                  const orderKey = kitapcik === 'A' ? 'orderA' : 'orderB'
                  cevapAnahtari[eq[orderKey]] = soru.dogruCevap
                }
              })
              return cevapAnahtari
            }
            const cevapAnahtari = getAnswerKey(exam.id, result.kitapcik)

            // Her soru için öğrencinin cevabını kontrol et ve durumunu belirle
            const soruDurumlari = {} // { ders: { soruIndex: 'dogru'|'yanlis'|'bos' } }
            
            KITAPCIK_DERSLER.forEach(({ ad: ders }) => {
              const sorular = kitapcikSorulariByDers[ders] || []
              soruDurumlari[ders] = {}
              
              sorular.forEach((soru, index) => {
                if (!soru) {
                  soruDurumlari[ders][index] = null
                  return
                }
                
                const ogrenciCevabi = cevaplar[soru.bookletSira]
                const dogruCevap = cevapAnahtari[soru.bookletSira]
                
                if (!ogrenciCevabi || ogrenciCevabi.trim() === '') {
                  soruDurumlari[ders][index] = 'bos'
                } else if (ogrenciCevabi.toUpperCase() === dogruCevap?.toUpperCase()) {
                  soruDurumlari[ders][index] = 'dogru'
                } else {
                  soruDurumlari[ders][index] = 'yanlis'
                }
              })
            })

            const firstDersWithQuestion = KITAPCIK_DERSLER.find((d) => {
              const dersAd = d.ad
              return kitapcikSorulariByDers[dersAd] && kitapcikSorulariByDers[dersAd].length > 0
            })?.ad

            const aktifDers = selectedKitapcikDers || firstDersWithQuestion || null
            const aktifIndex = selectedKitapcikIndex || 0

            const aktifSoru =
              aktifDers && kitapcikSorulariByDers[aktifDers]
                ? kitapcikSorulariByDers[aktifDers][aktifIndex] || null
                : null

            const aktifDersRenk =
              (aktifSoru && DERS_RENKLERI[aktifSoru.ders]) || '#3b82f6'

            return (
              <div className="grid gap-6 lg:grid-cols-[minmax(0,2.1fr)_minmax(0,1.2fr)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h2 className="text-base font-semibold text-white sm:text-lg">
                        Kitapçık Soru Görüntüleme
                      </h2>
                      <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                        Sağdaki navigasyondan ders ve soru numarasını seçtiğinde, ilgili soru burada
                        görüntülenir.
                      </p>
                    </div>
                    <div className="rounded-full bg-dark px-3 py-1 text-[11px] font-medium text-gray-300 ring-1 ring-dark-lighter sm:text-xs">
                      Kitapçık{' '}
                      <span className="font-semibold text-primary">
                        {result?.kitapcik || '-'}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dark-lighter bg-dark p-4 sm:p-5">
                    {aktifSoru ? (
                      <div className="space-y-4 sm:space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-primary/40 sm:text-xs"
                              style={{ color: aktifDersRenk }}
                            >
                              <span
                                className="inline-flex h-1.5 w-1.5 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                style={{ backgroundColor: aktifDersRenk }}
                              />
                              {aktifSoru.ders}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-1 text-[11px] font-medium text-gray-200 ring-1 ring-slate-700/80 sm:text-xs">
                              <span className="font-semibold">
                                {aktifIndex + 1}. soru
                              </span>
                              {aktifSoru.konu && (
                                <>
                                  <span className="text-gray-400">·</span>
                                  <span className="text-gray-300">{aktifSoru.konu}</span>
                                </>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-3 py-3 sm:px-4 sm:py-4">
                            <div className="pointer-events-none absolute -left-10 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                            <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-sky-500/10 blur-3xl" />
                            <div className="relative flex flex-col items-center justify-center gap-3 py-6 sm:py-10">
                              <div className="mt-1 flex h-40 w-full max-w-xl items-center justify-center rounded-xl bg-slate-900/80 text-center text-xs text-gray-400 ring-1 ring-slate-800/80 sm:h-60 sm:text-sm">
                                <p className="mx-6 leading-relaxed text-gray-200">
                                  {aktifSoru.metin}
                                </p>
                              </div>
                              {cevapAnahtari[aktifSoru.bookletSira] && (
                                <div className="mt-2 flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-1.5 ring-1 ring-primary/30">
                                  <span className="text-xs font-semibold text-primary sm:text-sm">
                                    Cevap:
                                  </span>
                                  <span className="text-xs font-bold text-primary sm:text-sm">
                                    {cevapAnahtari[aktifSoru.bookletSira]}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Soru istatistiği bloğu isteğe göre gizlendi */}
                      </div>
                    ) : (
                      <div className="flex min-h-[160px] flex-col items-center justify-center gap-2 text-center text-sm text-gray-400">
                        <p>Bu deneme için tanımlı soru bulunamadı.</p>
                        <p className="text-xs text-gray-500">
                          Soru havuzu veya kitapçık sırası veri kaynağından gelmediğinde bu alan
                          boş görünür.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <aside className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-white sm:text-base">
                      Ders ve Soru Navigasyonu
                    </h3>
                    <p className="mt-1 text-[11px] text-gray-400 sm:text-xs">
                      Bir dersi açıp ilgili soru numarasına tıklayarak solda o soruyu
                      görüntüleyebilirsin.
                    </p>
                  </div>

                  <div className="space-y-3 rounded-2xl border border-dark-lighter bg-dark p-3 sm:p-4">
                    {KITAPCIK_DERSLER.map(({ ad: ders, soruSayisi }) => {
                      const sorular = kitapcikSorulariByDers[ders] || []
                      const isExpanded = expandedKitapcikDers === ders
                      const renk = DERS_RENKLERI[ders] || '#64748b'

                      return (
                        <div
                          key={ders}
                          className="rounded-xl border border-dark-lighter bg-slate-950/60"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setExpandedKitapcikDers((prev) => (prev === ders ? null : ders))
                              if (sorular.length > 0 && !selectedKitapcikDers) {
                                setSelectedKitapcikDers(ders)
                                setSelectedKitapcikIndex(0)
                              }
                            }}
                            className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left hover:bg-slate-900/80 sm:px-4"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: renk }}
                              />
                              <span
                                className="text-xs font-medium sm:text-sm"
                                style={{ color: renk }}
                              >
                                {ders}
                              </span>
                              <span className="text-[11px] text-gray-400 sm:text-xs">
                                ({soruSayisi} soru)
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-gray-400">
                                {isExpanded ? 'Gizle' : 'Göster'}
                              </span>
                              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-gray-300 ring-1 ring-slate-700/80">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                  className={`h-3 w-3 transform transition-transform duration-150 ${
                                    isExpanded ? 'rotate-180' : 'rotate-0'
                                  }`}
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                          </button>

                          {isExpanded && soruSayisi > 0 && (
                            <div className="border-t border-dark-lighter px-3 pb-3 pt-2 sm:px-4 sm:pb-4">
                              <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10 sm:gap-2">
                                {Array.from({ length: soruSayisi }).map((_, index) => {
                                  const soru = sorular[index] || null
                                  const durum = soruDurumlari[ders]?.[index] || null

                                  let bg = 'bg-slate-900/80'
                                  let border = 'border-slate-700'
                                  let text = 'text-gray-200'

                                  if (!soru) {
                                    bg = 'bg-slate-900/40'
                                    border = 'border-slate-800'
                                    text = 'text-gray-500'
                                  } else if (durum === 'bos') {
                                    bg = 'bg-amber-500/10'
                                    border = 'border-amber-500/60'
                                    text = 'text-amber-100'
                                  } else if (durum === 'dogru') {
                                    bg = 'bg-emerald-500/10'
                                    border = 'border-emerald-500/70'
                                    text = 'text-emerald-100'
                                  } else if (durum === 'yanlis') {
                                    bg = 'bg-rose-500/10'
                                    border = 'border-rose-500/70'
                                    text = 'text-rose-100'
                                  }

                                  const isActive =
                                    selectedKitapcikDers === ders &&
                                    selectedKitapcikIndex === index

                                  if (isActive) {
                                    border = 'border-primary/90'
                                    text = 'text-primary-foreground'
                                  }

                                  return (
                                    <button
                                      type="button"
                                      key={`${ders}-${index}`}
                                      onClick={() => {
                                        setSelectedKitapcikDers(ders)
                                        setSelectedKitapcikIndex(index)
                                      }}
                                      className={`flex h-7 items-center justify-center rounded-md border text-[10px] font-semibold transition hover:brightness-110 ${bg} ${border} ${text}`}
                                    >
                                      {index + 1}
                                    </button>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {isExpanded && sorular.length === 0 && (
                            <div className="border-t border-dark-lighter px-3 py-2 text-[11px] text-gray-500 sm:px-4 sm:py-2.5">
                              Bu derse ait tanımlı soru bulunmuyor.
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </aside>
              </div>
            )
          })()}
        </section>
      )}

      {activeTab === 'analiz' && (
        <section className="space-y-6 sm:space-y-8">
          {/* Özet kartları — görsel daire + değerler */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {[
              {
                label: 'Net',
                value: result.net,
                color: 'text-primary',
                bgRing: 'stroke-primary/30',
                fillRing: 'stroke-primary',
                icon: (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                    />
                  </svg>
                ),
              },
              {
                label: 'Doğru',
                value: result.dogru,
                color: 'text-emerald-400',
                bgRing: 'stroke-emerald-500/30',
                fillRing: 'stroke-emerald-500',
                icon: (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                label: 'Yanlış',
                value: result.yanlis,
                color: 'text-rose-400',
                bgRing: 'stroke-rose-500/30',
                fillRing: 'stroke-rose-500',
                icon: (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                label: 'Boş',
                value: result.bos,
                color: 'text-amber-400',
                bgRing: 'stroke-amber-500/30',
                fillRing: 'stroke-amber-500',
                icon: (
                  <svg
                    className="h-5 w-5 sm:h-6 sm:w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z"
                    />
                  </svg>
                ),
              },
            ].map((item) => {
              const total = result.dogru + result.yanlis + result.bos || 1
              const pct =
                item.label === 'Net'
                  ? Math.min(100, (Number(result.net) / total) * 25)
                  : (Number(item.value) / total) * 100
              return (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-2xl border border-dark-lighter bg-dark-light p-5 shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 sm:text-sm">
                        {item.label}
                      </p>
                      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${item.color}`}>
                        {item.value}
                      </p>
                    </div>
                    <div className={`opacity-80 ${item.color}`}>{item.icon}</div>
                  </div>
                  {item.label !== 'Net' && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-dark-lighter">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.label === 'Doğru'
                            ? 'bg-emerald-500'
                            : item.label === 'Yanlış'
                            ? 'bg-rose-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Ders Bazlı Analiz — grafik + tablo */}
          {result.dersBazli && Object.keys(result.dersBazli).length > 0 && (
            <div className="rounded-2xl border border-dark-lighter bg-dark-light p-4 shadow-lg sm:p-6">
              <h2 className="mb-1 text-lg font-semibold text-white sm:text-xl">
                Ders Bazlı Analiz
              </h2>
              <p className="mb-4 text-xs text-gray-400 sm:text-sm">
                Derslere göre net ve cevap dağılımı
              </p>

              {(() => {
                const dersSoruMap = Object.fromEntries(
                  KITAPCIK_DERSLER.map((d) => [d.ad, d.soruSayisi])
                )

                const dersBazliData = KITAPCIK_DERSLER.map(({ ad }) => {
                  const d = (result.dersBazli && result.dersBazli[ad]) || {}
                  const dogru = Number(d.dogru || 0)
                  const yanlis = Number(d.yanlis || 0)
                  const bos = Number(d.bos || 0)

                  const net =
                    typeof d.net !== 'undefined' && d.net !== null
                      ? Number(d.net)
                      : dogru - yanlis / 4

                  return {
                    ders: ad,
                    net,
                    dogru,
                    yanlis,
                    bos,
                    soruSayisi: dersSoruMap[ad],
                  }
                })

                return (
                  <div className="mb-6 h-64 sm:h-72 lg:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dersBazliData}
                        margin={{ top: 12, right: 8, left: 0, bottom: 56 }}
                        barCategoryGap="45%"
                      >
                        <XAxis
                          dataKey="ders"
                          interval={0}
                          tick={
                            <DersBarXAxisTick
                              fill="#ffffff"
                              fontSize={dersAxisFontSize}
                            />
                          }
                          axisLine={{ stroke: '#263356' }}
                          tickLine={false}
                        />
                        <YAxis
                          tick={{ fill: '#9ca3af', fontSize: 11 }}
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e2a4a',
                            border: '1px solid #263356',
                            borderRadius: '12px',
                          }}
                          labelStyle={{ color: '#e5e7eb' }}
                          formatter={(value, _name, props) => {
                            const soruSayisi = props?.payload?.soruSayisi
                            return soruSayisi
                              ? [`${value} net (Toplam ${soruSayisi} soru)`, '']
                              : [value, '']
                          }}
                          labelFormatter={(label) => `Ders: ${label}`}
                        />
                        <Bar
                          dataKey="net"
                          name="Net"
                          radius={[6, 6, 0, 0]}
                          maxBarSize={22}
                        >
                          {dersBazliData.map((entry, index) => (
                            <Cell
                              // eslint-disable-next-line react/no-array-index-key
                              key={index}
                              fill={DERS_RENKLERI[entry.ders] ?? '#9ca3af'}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )
              })()}

              <div className="overflow-x-auto rounded-xl border border-dark-lighter">
                <table className="w-full min-w-[320px] table-fixed text-left text-xs sm:text-sm">
                  <colgroup>
                    <col style={{ width: '34%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '13%' }} />
                    <col style={{ width: '14%' }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-dark-lighter bg-dark/50 text-gray-400">
                      <th className="px-3 py-3 text-left font-semibold sm:px-4">Ders</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Soru</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Net</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Doğru</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Yanlış</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Boş</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      let genelToplamSoru = 0
                      let genelToplamNet = 0
                      let genelToplamDogru = 0
                      let genelToplamYanlis = 0
                      let genelToplamBos = 0

                      // questionOrder'dan soruları ders bazında grupla
                      const kitapcikSorulariByDers = buildKitapcikSorulariByDers(questionOrder)
                      const cevaplar = result?.cevaplar || {}

                      const rows = Object.entries(result.dersBazli).map(([ders, d]) => {
                        const isExpanded = expandedDers === ders
                        const konuBazli = d.konuBazli || d.konular || []
                        const lgsKonulari = LGS_KONULARI[ders] || []
                        
                        // Bu derse ait soruları al
                        const dersSorulari = kitapcikSorulariByDers[ders] || []
                        
                        // LGS konularına göre konu istatistiklerini oluştur
                        const konuIstatistikleri = lgsKonulari.map((konuAdi) => {
                          // Bu konuya ait soruları bul
                          const konuSorulari = dersSorulari.filter((soru) => soru.konu === konuAdi)
                          
                          let toplam = konuSorulari.length
                          let dogru = 0
                          let yanlis = 0
                          let bos = 0
                          
                          // Her soru için cevap durumunu kontrol et
                          konuSorulari.forEach((soru) => {
                            const soruCevap = cevaplar[soru.bookletSira]
                            if (soruCevap) {
                              if (soruCevap === soru.dogruCevap) {
                                dogru += 1
                              } else {
                                yanlis += 1
                              }
                            } else {
                              bos += 1
                            }
                          })
                          
                          return {
                            konu: konuAdi,
                            toplam,
                            dogru,
                            yanlis,
                            bos,
                          }
                        })
                        
                        // Konu bazlı veri varsa, onu kullan (LGS konularıyla eşleştir)
                        const gosterilecekKonular = konuBazli.length > 0
                          ? konuBazli.map((kb) => ({
                              konu: kb.konu,
                              toplam: kb.toplam || 0,
                              dogru: kb.dogru || 0,
                              yanlis: kb.yanlis || 0,
                              bos: kb.bos || 0,
                            }))
                          : konuIstatistikleri

                        // TOPLAM satırı için hesap (varsa konu bazlı veriden, yoksa ders bazlıdan)
                        const toplamFromKonular =
                          konuBazli && konuBazli.length > 0
                            ? konuBazli.reduce(
                                (acc, k) => ({
                                  dogru: acc.dogru + (Number(k.dogru) || 0),
                                  yanlis: acc.yanlis + (Number(k.yanlis) || 0),
                                  bos: acc.bos + (Number(k.bos) || 0),
                                  toplam: acc.toplam + (Number(k.toplam) || 0),
                                }),
                                { dogru: 0, yanlis: 0, bos: 0, toplam: 0 }
                              )
                            : null

                        const toplamDogru = toplamFromKonular?.dogru ?? d.dogru ?? 0
                        const toplamYanlis = toplamFromKonular?.yanlis ?? d.yanlis ?? 0
                        const toplamBos = toplamFromKonular?.bos ?? d.bos ?? 0
                        const planlananSoruSayisi =
                          KITAPCIK_DERSLER.find((x) => x.ad === ders)?.soruSayisi ?? null
                        const toplamSoru =
                          planlananSoruSayisi ??
                          (toplamFromKonular?.toplam ?? toplamDogru + toplamYanlis + toplamBos)

                        const net =
                          typeof d.net !== 'undefined'
                            ? d.net
                            : toplamDogru - toplamYanlis / 4

                        // LGS konuları varsa tıklanabilir
                        const isClickable = lgsKonulari.length > 0

                        // Genel toplamlar
                        genelToplamSoru += Number(toplamSoru) || 0
                        genelToplamNet += Number(net) || 0
                        genelToplamDogru += Number(toplamDogru) || 0
                        genelToplamYanlis += Number(toplamYanlis) || 0
                        genelToplamBos += Number(toplamBos) || 0

                        return (
                          <Fragment key={ders}>
                            <tr
                              className={`border-b border-dark-lighter text-gray-300 hover:bg-dark-lighter/50 ${
                                isClickable ? 'cursor-pointer' : ''
                              }`}
                              onClick={() => {
                                if (!isClickable) return
                                setExpandedDers((prev) => (prev === ders ? null : ders))
                              }}
                            >
                              <td
                                className="px-3 py-3 font-medium sm:px-4"
                                style={{ color: DERS_RENKLERI[ders] ?? '#fff' }}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{ders}</span>
                                  {lgsKonulari.length > 0 && (
                                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-dark-lighter/80 text-gray-300">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        className={`h-3 w-3 transform transition-transform duration-200 ${
                                          isExpanded ? 'rotate-180' : 'rotate-0'
                                        }`}
                                        aria-hidden="true"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-2 py-3 text-center text-gray-200 sm:px-3">
                                {toplamSoru}
                              </td>
                              <td className="px-2 py-3 text-center text-primary sm:px-3">
                                {Number(net).toFixed(2)}
                              </td>
                              <td className="px-2 py-3 text-center text-emerald-400 sm:px-3">
                                {toplamDogru}
                              </td>
                              <td className="px-2 py-3 text-center text-rose-400 sm:px-3">
                                {toplamYanlis}
                              </td>
                              <td className="px-2 py-3 text-center text-amber-400 sm:px-3">
                                {toplamBos}
                              </td>
                            </tr>

                            {isExpanded && lgsKonulari.length > 0 && (
                              <tr className="border-b border-dark-lighter bg-dark/40 text-gray-300 last:border-0">
                                <td colSpan={6} className="px-3 pb-4 pt-2 sm:px-4">
                                  <div className="rounded-xl border border-dark-lighter bg-dark/60 p-3 sm:p-4">
                                    <p className="mb-2 text-xs font-semibold text-gray-300 sm:text-sm">
                                      Konu Bazlı İstatistikler - {ders}
                                    </p>
                                    <div className="overflow-x-auto rounded-lg border border-dark-lighter">
                                      <table className="w-full min-w-[320px] table-fixed text-left text-[11px] sm:text-xs">
                                        <colgroup>
                                          <col style={{ width: '40%' }} />
                                          <col style={{ width: '15%' }} />
                                          <col style={{ width: '15%' }} />
                                          <col style={{ width: '15%' }} />
                                          <col style={{ width: '15%' }} />
                                        </colgroup>
                                        <thead>
                                          <tr className="border-b border-dark-lighter bg-dark/70 text-gray-400">
                                            <th className="px-2 py-2 text-left font-medium sm:px-3">
                                              Konu
                                            </th>
                                            <th className="px-2 py-2 text-center font-medium sm:px-3">
                                              Toplam
                                            </th>
                                            <th className="px-2 py-2 text-center font-medium sm:px-3">
                                              Doğru
                                            </th>
                                            <th className="px-2 py-2 text-center font-medium sm:px-3">
                                              Yanlış
                                            </th>
                                            <th className="px-2 py-2 text-center font-medium sm:px-3">
                                              Boş
                                            </th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {gosterilecekKonular.map((k) => (
                                            <tr
                                              key={k.konu}
                                              className="border-b border-dark-lighter text-gray-300 last:border-0"
                                            >
                                              <td className="px-2 py-2 sm:px-3">{k.konu}</td>
                                              <td className="px-2 py-2 text-center sm:px-3">
                                                {k.toplam}
                                              </td>
                                              <td className="px-2 py-2 text-center text-emerald-400 sm:px-3">
                                                {k.dogru}
                                              </td>
                                              <td className="px-2 py-2 text-center text-rose-400 sm:px-3">
                                                {k.yanlis}
                                              </td>
                                              <td className="px-2 py-2 text-center text-amber-400 sm:px-3">
                                                {k.bos}
                                              </td>
                                            </tr>
                                          ))}
                                          <tr className="bg-dark-lighter/40 text-gray-200">
                                            <td className="px-2 py-2 font-semibold sm:px-3">
                                              TOPLAM
                                            </td>
                                            <td className="px-2 py-2 text-center font-semibold sm:px-3">
                                              {toplamSoru}
                                            </td>
                                            <td className="px-2 py-2 text-center font-semibold text-emerald-400 sm:px-3">
                                              {toplamDogru}
                                            </td>
                                            <td className="px-2 py-2 text-center font-semibold text-rose-400 sm:px-3">
                                              {toplamYanlis}
                                            </td>
                                            <td className="px-2 py-2 text-center font-semibold text-amber-400 sm:px-3">
                                              {toplamBos}
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        )
                      })

                      return (
                        <>
                          {rows}
                          <tr className="bg-gradient-to-r from-primary/20 via-emerald-500/15 to-amber-500/20 text-gray-100 border-t border-primary/40">
                            <td className="px-3 py-3 font-semibold uppercase tracking-wide sm:px-4">
                              Genel Toplam
                            </td>
                            <td className="px-2 py-3 text-center font-semibold text-gray-100 sm:px-3">
                              {genelToplamSoru}
                            </td>
                            <td className="px-2 py-3 text-center font-semibold text-primary sm:px-3">
                              {genelToplamNet.toFixed(2)}
                            </td>
                            <td className="px-2 py-3 text-center font-semibold text-emerald-300 sm:px-3">
                              {genelToplamDogru}
                            </td>
                            <td className="px-2 py-3 text-center font-semibold text-rose-300 sm:px-3">
                              {genelToplamYanlis}
                            </td>
                            <td className="px-2 py-3 text-center font-semibold text-amber-300 sm:px-3">
                              {genelToplamBos}
                            </td>
                          </tr>
                        </>
                      )
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* En Çok Hata Yapılan Konular */}
          <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-gradient-to-br from-[#020617] via-[#020617] to-[#020617] p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] sm:p-6">
            <div className="pointer-events-none absolute -right-10 top-0 h-40 w-40 rounded-full bg-primary/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 bottom-0 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />

            <div className="relative flex items-center justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary ring-1 ring-primary/40 sm:text-[11px]">
                  <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                  Kritik Geri Bildirim Alanı
                </div>
                <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
                  En Çok Hata Yapılan Konular
                </h2>
                <p className="mt-1 text-xs text-gray-400 sm:text-sm">
                  Bu denemede en çok zorlandığın ve yeniden çalışırsan en hızlı gelişim görebileceğin konu başlıkları.
                </p>
              </div>
              <div className="hidden items-center gap-1 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-[11px] font-medium text-primary shadow-sm shadow-primary/30 sm:inline-flex">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                Odaklanman gereken alanlar
              </div>
            </div>

            <div className="relative mt-4 overflow-hidden rounded-xl border border-dark-lighter/80 bg-gradient-to-br from-slate-900/80 via-slate-950/80 to-slate-900/80">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-dark-lighter/80 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 text-[11px] uppercase tracking-wide text-gray-400 sm:text-[11px]">
                    <th className="px-4 py-3 text-left font-semibold">Konu</th>
                    <th className="px-4 py-3 text-center font-semibold">Toplam</th>
                    <th className="px-4 py-3 text-center font-semibold">Doğru</th>
                    <th className="px-4 py-3 text-center font-semibold">Yanlış</th>
                    <th className="px-4 py-3 text-center font-semibold">Boş</th>
                    <th className="px-4 py-3 text-center font-semibold">Hata %</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    // Tüm derslerden konu bazlı verileri topla
                    const tumKonular = []
                    
                    if (result.dersBazli) {
                      Object.entries(result.dersBazli).forEach(([ders, d]) => {
                        const konuBazli = d.konuBazli || d.konular || []
                        konuBazli.forEach((k) => {
                          const toplam = Number(k.toplam) || 0
                          const dogru = Number(k.dogru) || 0
                          const yanlis = Number(k.yanlis) || 0
                          const bos = Number(k.bos) || 0
                          const hataToplam = yanlis + bos
                          const hataYuzde = toplam > 0 ? (hataToplam / toplam) * 100 : 0
                          
                          // Sadece hata olan konuları ekle (yanlış veya boş varsa)
                          if (toplam > 0 && hataToplam > 0) {
                            tumKonular.push({
                              konu: k.konu,
                              toplam,
                              dogru,
                              yanlis,
                              bos,
                              hataYuzde,
                              ders,
                            })
                          }
                        })
                      })
                    }
                    
                    // Hata yüzdesine göre sırala (yüksekten düşüğe)
                    tumKonular.sort((a, b) => {
                      // Önce hata yüzdesine göre
                      if (b.hataYuzde !== a.hataYuzde) {
                        return b.hataYuzde - a.hataYuzde
                      }
                      // Sonra toplam hataya göre (yanlış + boş)
                      const hataA = a.yanlis + a.bos
                      const hataB = b.yanlis + b.bos
                      if (hataB !== hataA) {
                        return hataB - hataA
                      }
                      // Son olarak toplam soru sayısına göre
                      return b.toplam - a.toplam
                    })
                    
                    // En çok hata yapılan 10 konuyu göster
                    const gosterilecekKonular = tumKonular.slice(0, 10)
                    
                    return gosterilecekKonular.length > 0 ? (
                      gosterilecekKonular.map((row, index) => {
                        // İlk 3 konuya starred ekle (en yüksek hata yüzdesine sahip olanlar)
                        const starred = index < 3 && row.hataYuzde >= 50
                        const severityColor =
                          row.hataYuzde >= 75
                            ? 'from-rose-500/80 via-amber-400/80 to-amber-300/80'
                            : row.hataYuzde >= 25
                            ? 'from-amber-400/80 via-emerald-400/80 to-emerald-300/80'
                            : 'from-emerald-400/80 via-sky-400/80 to-sky-300/80'

                        const severityBorder =
                          row.hataYuzde >= 75
                            ? 'border-l-4 border-l-rose-500/80'
                            : row.hataYuzde >= 25
                            ? 'border-l-4 border-l-amber-400/80'
                            : 'border-l-4 border-l-emerald-400/70'

                        const medalBg =
                          index === 0
                            ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-slate-900'
                            : index === 1
                            ? 'bg-gradient-to-br from-gray-200 to-slate-300 text-slate-900'
                            : index === 2
                            ? 'bg-gradient-to-br from-orange-300 to-orange-500 text-slate-900'
                            : 'bg-dark-lighter text-gray-200'

                        return (
                          <tr
                            key={row.konu}
                            className={`border-b border-dark-lighter/70 text-gray-200 last:border-0 transition-colors ${severityBorder} ${
                              index % 2 === 0 ? 'bg-slate-950/40' : 'bg-slate-900/40'
                            } hover:bg-slate-800/60`}
                          >
                            <td className="px-4 py-3 font-medium text-white">
                              <span className="flex items-center gap-2">
                                <span className="flex h-7 min-w-0 items-center gap-2">
                                  <span
                                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-bold ring-1 ring-dark-lighter/80 shadow-sm ${medalBg}`}
                                  >
                                    {index + 1}
                                  </span>
                                  <span className="flex flex-col">
                                    <span className="truncate">{row.konu}</span>
                                    <span className="mt-0.5 text-[10px] font-normal uppercase tracking-wide text-gray-500">
                                      {row.hataYuzde >= 75
                                        ? 'Kritik odak alanı'
                                        : row.hataYuzde >= 25
                                        ? 'Öncelikli geliştirme alanı'
                                        : 'Destekleyici tekrar alanı'}
                                    </span>
                                  </span>
                                </span>
                                {starred && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary ring-1 ring-primary/40">
                                    <span>⭐</span>
                                    <span>Öncelikli</span>
                                  </span>
                                )}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-100">{row.toplam}</td>
                            <td className="px-4 py-3 text-center text-emerald-400">
                              {row.dogru}
                            </td>
                            <td className="px-4 py-3 text-center text-rose-400">{row.yanlis}</td>
                            <td className="px-4 py-3 text-center text-amber-400">{row.bos}</td>
                            <td className="px-4 py-3 text-center">
                              <div className="flex flex-col items-center gap-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="inline-flex h-2.5 w-16 overflow-hidden rounded-full bg-slate-800/90 ring-1 ring-slate-700/80">
                                    <span
                                      className={`block h-full bg-gradient-to-r ${severityColor}`}
                                      style={{ width: `${Math.min(row.hataYuzde, 100)}%` }}
                                    />
                                  </span>
                                  <span className="text-[11px] font-semibold text-primary">
                                    %{row.hataYuzde.toFixed(1)}
                                  </span>
                                </div>
                                <span className="text-[10px] uppercase tracking-wide text-gray-500">
                                  {row.hataYuzde >= 75
                                    ? 'Kritik'
                                    : row.hataYuzde >= 25
                                    ? 'Orta'
                                    : 'Düşük'}
                                </span>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                          <p className="text-sm">Henüz hata yapılan konu bulunmamaktadır.</p>
                        </td>
                      </tr>
                    )
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Yapay Zeka Deneme Yorumu */}
          <div className="mt-6 rounded-2xl border border-primary/40 bg-gradient-to-br from-[#111827] via-[#020617] to-[#020617] p-4 shadow-[0_18px_45px_rgba(15,23,42,0.9)] sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 ring-2 ring-primary/40 sm:h-11 sm:w-11">
                  <span className="text-lg sm:text-xl">🤖</span>
                  <span className="absolute inset-0 -z-10 animate-pulse rounded-2xl bg-primary/10 blur-sm" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-primary sm:text-base">
                    Yapay Zeka Deneme Yorumu
                  </h2>
                  <p className="text-[11px] text-gray-400 sm:text-xs">
                    Ders, net ve konu dağılımını birlikte inceleyerek sana özel, detaylı bir değerlendirme üretir.
                  </p>

                  {result.dersBazli && Object.keys(result.dersBazli).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {Object.entries(result.dersBazli).map(([ders, d]) => {
                        const toplamDersSoru =
                          (d.dogru || 0) + (d.yanlis || 0) + (d.bos || 0)
                        const konuSayisi = (d.konuBazli || d.konular || []).length
                        const hasData = toplamDersSoru > 0 || konuSayisi > 0
                        if (!hasData) return null

                        return (
                          <span
                            key={ders}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 px-2.5 py-0.5 text-[10px] font-medium text-gray-200 ring-1 ring-slate-700/80"
                          >
                            <span
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: DERS_RENKLERI[ders] ?? '#64748b' }}
                            />
                            <span className="truncate max-w-[80px] sm:max-w-[110px]">
                              {ders}
                            </span>
                            {konuSayisi > 0 && (
                              <span className="text-[9px] text-gray-400">
                                {konuSayisi} konu
                              </span>
                            )}
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAiCommentLoading(true)
                  setAiComment('')

                  const toplamSoru = result.dogru + result.yanlis + result.bos
                  const genelBasari =
                    toplamSoru > 0 ? ((result.dogru / toplamSoru) * 100).toFixed(1) : '0.0'

                  const yorumParagraflari = []

                  // Ders ve konu bazlı analizler (her ders için ayrı ayrı)
                  const dersAnalizleri = []
                  if (result.dersBazli && Object.keys(result.dersBazli).length > 0) {
                    Object.entries(result.dersBazli).forEach(([ders, d]) => {
                      const toplamDersSoru = (d.dogru || 0) + (d.yanlis || 0) + (d.bos || 0)
                      const dersBasari =
                        toplamDersSoru > 0
                          ? ((Number(d.dogru || 0) / toplamDersSoru) * 100).toFixed(1)
                          : '0.0'

                      const konuBazli = d.konuBazli || d.konular || []
                      const konuHatalari = []

                      konuBazli.forEach((k) => {
                        const toplam = k.toplam || 0
                        const yanlis = k.yanlis || 0
                        const bos = k.bos || 0
                        const hataToplam = yanlis + bos
                        const hataYuzde = toplam > 0 ? (hataToplam / toplam) * 100 : 0

                        if (toplam > 0 && hataToplam > 0) {
                          konuHatalari.push({
                            konu: k.konu,
                            toplam,
                            yanlis,
                            bos,
                            hataYuzde,
                          })
                        }
                      })

                      // Konu sıralı çalışma önerisi
                      let konuOneriMetni = null
                      if (konuHatalari.length > 0) {
                        const siraliKonuHatalari = [...konuHatalari].sort(
                          (a, b) => b.hataYuzde - a.hataYuzde
                        )

                        const grupByPrefix = {}
                        siraliKonuHatalari.forEach((item) => {
                          const prefix = item.konu.split(' ')[0]
                          const key = `${ders}::${prefix}`
                          if (!grupByPrefix[key]) grupByPrefix[key] = []
                          grupByPrefix[key].push(item)
                        })

                        const oneriler = []
                        let onerilerSayac = 0

                        Object.values(grupByPrefix).forEach((grup) => {
                          if (grup.length <= 1) {
                            const k = grup[0]
                            const siraIndex = onerilerSayac % 3
                            onerilerSayac += 1

                            let cumle
                            if (siraIndex === 0) {
                              cumle = `“${k.konu}” bu denemede biraz zorlandığın bir konu gibi görünüyor. Bu konuda önce temel kavramları sakin bir şekilde gözden geçirip ardından bol soru çözümüyle pratiği güçlendirmek, ${ders} netine doğrudan katkı sağlayacaktır.`
                            } else if (siraIndex === 1) {
                              cumle = `“${k.konu}” sorularında küçük takılmalar olmuş. Konu anlatımını tekrar gözden geçirip, özellikle hatalı yaptığın soru tiplerini not alarak birkaç deneme daha çözmen, ${ders} performansını kısa sürede yukarı taşıyabilir.`
                            } else {
                              cumle = `“${k.konu}” için temeli biraz daha sağlamlaştırdığında, özellikle ${ders} netinde hızlı bir toparlanma görebilirsin. Önce örnek soru çözümlerini inceleyip, ardından benzer soruları kendi başına çözmeye çalışman faydalı olacaktır.`
                            }

                            oneriler.push(
                              cumle
                            )
                          } else {
                            const sirali = [...grup].sort(
                              (a, b) => a.konu.length - b.konu.length
                            )
                            const temelKonu = sirali[0]
                            const digerKonular = sirali.slice(1)
                            const digerIsimler = digerKonular
                              .map((k) => `“${k.konu}”`)
                              .join(', ')

                            oneriler.push(
                              `Bu denemede ${ders} içinde aynı kökten gelen konularda hatalar görülüyor. Önce “${temelKonu.konu}” temellerini oturtup, ardından ${digerIsimler} gibi bu temelin üzerine kurulan başlıklara geçmek daha sağlıklı olacaktır.`
                            )
                          }
                        })

                        konuOneriMetni =
                          'Konu bazlı dağılıma göre, özellikle şu başlıklar için hedefli bir sıralama önerilebilir:\n\n' +
                          oneriler.map((o, idx) => `${idx + 1}. ${o}`).join('\n')

                        dersAnalizleri.push({
                          ders,
                          dersBasari,
                          toplamDersSoru,
                          konuHatalari: siraliKonuHatalari,
                          konuOneriMetni,
                          dogru: d.dogru || 0,
                          yanlis: d.yanlis || 0,
                          bos: d.bos || 0,
                        })
                      } else {
                        dersAnalizleri.push({
                          ders,
                          dersBasari,
                          toplamDersSoru,
                          konuHatalari: [],
                          konuOneriMetni: null,
                          dogru: d.dogru || 0,
                          yanlis: d.yanlis || 0,
                          bos: d.bos || 0,
                        })
                      }
                    })
                  }

                  yorumParagraflari.push(
                    `Bu denemede toplam ${toplamSoru} sorudan ${result.dogru} doğru, ${result.yanlis} yanlış ve ${result.bos} boş ile yaklaşık %${genelBasari} genel başarı oranı yakalamışsın. Netin ${result.net}, şu anki seviyeni oldukça net gösteriyor; bundan sonrası, bu tabloyu adım adım nasıl yukarı taşıyacağına odaklanma süreci.`
                  )

                  // Her ders için ayrı ayrı detaylı yorum
                  if (dersAnalizleri.length > 0) {
                    dersAnalizleri.forEach((da) => {
                      yorumParagraflari.push(
                        `${da.ders} dersi tarafına ayrı baktığımızda, ${da.toplamDersSoru} sorudan ${da.dogru} doğru, ${da.yanlis} yanlış ve ${da.bos} boş ile yaklaşık %${da.dersBasari}’lik bir başarı oranı var. Yani bu derste genel tabloyu fena değil/iyi/geliştirilebilir seviyede görebiliriz; önemli olan, şimdi bu sonucu hangi konular üzerinden yukarı taşıyacağına odaklanmak.`
                      )

                      if (da.konuHatalari.length > 0) {
                        yorumParagraflari.push(
                          `${da.ders} içinde özellikle hata oranı yüksek olan bazı konu başlıkları öne çıkıyor: ` +
                            da.konuHatalari
                              .slice(0, 3)
                              .map((k) => `“${k.konu}”`)
                              .join(', ') +
                            '. Bu konularda yaptığın yanlış ve boşlar, çalışırken öncelik vermen gereken alanları işaret ediyor.'
                        )
                      } else {
                        yorumParagraflari.push(
                          `${da.ders} için konu bazlı yanlış/boş dağılımı düşük seviyede. Bu ders özelinde, mevcut kazanımları koruyup düzenli tekrar ve yeni nesil soru pratiği ile seviye yukarı çekilebilir.`
                        )
                      }

                      if (da.konuOneriMetni) {
                        yorumParagraflari.push(da.konuOneriMetni)
                      }
                    })
                  }

                  yorumParagraflari.push(
                    'Yanlış ve boş bırakılan her soru, aslında bir hata değil; doğru okunursa çok değerli bir geri bildirimdir. Bu soruların üzerinden tekrar geçip hangi bilgi eksikliği, hangi soru tipi ya da hangi dikkat hatasının öne çıktığını not almak, her denemeyi bir öğrenme fırsatına dönüştürür. Böylece denemeler arasındaki fark sadece netlerde değil, konu hâkimiyetinde de net biçimde hissedilir.'
                  )

                  yorumParagraflari.push(
                    'Genel tablo, düzenli deneme takibi ve planlı konu tekrarları ile netlerini istikrarlı şekilde artırabileceğini gösteriyor. Haftalık hedef net belirleme, ders bazlı çalışma listesi çıkarma ve deneme sonrası kendine kısa özet raporlar yazma alışkanlığı, seni sınav gününe daha kontrollü, özgüvenli ve hazır bir şekilde taşıyacaktır.'
                  )

                  const finalText = yorumParagraflari.join('\n\n')

                  setTimeout(() => {
                    setIsAiCommentLoading(false)
                    setAiComment(finalText)
                  }, 1800)
                }}
                disabled={isAiCommentLoading}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-primary/40 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/60 sm:px-5 sm:py-2.5 sm:text-sm"
              >
                {isAiCommentLoading ? (
                  <>
                    <span className="relative flex h-4 w-6 items-center justify-between">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/90 [animation-delay:-200ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80 [animation-delay:-80ms]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/70" />
                    </span>
                    <span>Yapay zeka düşünüyor...</span>
                  </>
                ) : (
                  <>
                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/10">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        className="h-3 w-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5 21 12l-7.5 7.5M3 12h18"
                        />
                      </svg>
                    </span>
                    <span>Denemeyi yorumla</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative mt-2 rounded-2xl border border-primary/20 bg-black/20 px-3 py-3 sm:mt-3 sm:px-4 sm:py-4">
              <div className="pointer-events-none absolute -left-1 top-2 h-10 w-10 rounded-full bg-primary/5 blur-2xl" />
              {isAiCommentLoading && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400 sm:text-sm">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary">
                      <span className="h-2 w-2 animate-ping rounded-full bg-primary/60" />
                    </span>
                    <span>Veriler analiz ediliyor, ders ve konu bazında güçlü/zayıf alanlar çıkarılıyor...</span>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-4/5 animate-pulse rounded-full bg-slate-700/60" />
                    <div className="h-2 w-[92%] animate-pulse rounded-full bg-slate-700/40" />
                    <div className="h-2 w-3/4 animate-pulse rounded-full bg-slate-700/50" />
                    <div className="h-2 w-[88%] animate-pulse rounded-full bg-slate-700/30" />
                  </div>
                </div>
              )}
              {!isAiCommentLoading && (
                <div className="space-y-3 text-xs leading-relaxed text-gray-200 sm:space-y-3.5 sm:text-sm">
                  {aiComment ? (
                    aiComment.split('\n\n').map((p, idx) => {
                      const isGenel = idx === 0
                      const isDersParagraf = p.includes(' dersi tarafına ayrı baktığımızda')
                      const isKapanis = p.startsWith('Genel tablo') || p.startsWith('Yanlış ve boş')

                      return (
                        <div
                          // eslint-disable-next-line react/no-array-index-key
                          key={idx}
                          className={`rounded-xl px-3 py-2.5 sm:px-3.5 sm:py-3 ${
                            isGenel
                              ? 'bg-slate-900/70 border border-slate-700/70'
                              : isDersParagraf
                              ? 'bg-slate-950/60 border-l-4 border-l-primary/70'
                              : isKapanis
                              ? 'bg-slate-900/40 border border-slate-800/70'
                              : 'bg-slate-950/40 border border-slate-900/70'
                          }`}
                        >
                          {isDersParagraf && (
                            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary/80 sm:text-xs">
                              Ders Bazlı Değerlendirme
                            </div>
                          )}
                          {!isDersParagraf && idx === 1 && (
                            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-300/80 sm:text-xs">
                              Ders ve Konu Analizleri
                            </div>
                          )}
                          {isKapanis && (
                            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-sky-300/80 sm:text-xs">
                              Çalışma Önerileri
                            </div>
                          )}
                          <p className="text-[11px] text-gray-200 sm:text-xs">{p}</p>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-400">
                      Henüz bir yorum oluşturulmadı. Yukarıdaki{' '}
                      <span className="font-semibold text-primary">“Denemeyi yorumla”</span>{' '}
                      butonuna tıklayarak, bu denemedeki performansın için yapay zeka destekli
                      detaylı bir değerlendirme alabilirsin.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

