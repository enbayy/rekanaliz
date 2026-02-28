'use client'

import { useState, useEffect } from 'react'
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
import type { Exam, ExamResult, RankingRow, SoruIstatistik } from '@/lib/types'
import { getQuestionByQuestionId, DERS_RENKLERI } from '@/lib/mock-data'

/** Uzun ders adını mobilde iki satıra böler (bar altında sığsın diye) */
function dersLabelSatirlari(ders: string): [string, string | null] {
  if (ders === 'Sosyal Bilgiler') return ['Sosyal', 'Bilgiler']
  if (ders === 'Din Kültürü') return ['Din', 'Kültürü']
  if (ders === 'Fen Bilgisi') return ['Fen', 'Bilgisi']
  if (ders === 'Fen Bilimleri') return ['Fen', 'Bilimleri']
  return [ders, null]
}

/** Ders bazlı grafik XAxis: her barın tam altında ders adı, mobilde iki satır */
function DersBarXAxisTick(props: {
  x?: number
  y?: number
  payload?: { value: string }
  width?: number
  fill?: string
  fontSize?: number
}) {
  const { x = 0, y = 0, payload, fill = '#ffffff', fontSize = 10 } = props
  if (!payload?.value) return null
  const [line1, line2] = dersLabelSatirlari(payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text textAnchor="middle" fill={fill} fontSize={fontSize} dy={line2 ? 0 : 4}>
        {line1}
      </text>
      {line2 && (
        <text textAnchor="middle" fill={fill} fontSize={fontSize} dy={fontSize + 6}>
          {line2}
        </text>
      )}
    </g>
  )
}

interface QuestionOrderItem {
  questionId: string
  bookletSira: number
}

interface DenemeSonucContentProps {
  studentId: string
  studentName: string
  exam: Exam
  result: ExamResult
  ranking: RankingRow[]
  currentStudentSira: number | undefined
  questionOrder: QuestionOrderItem[]
  soruIstatistik: SoruIstatistik[]
  breadcrumbLinks:
    | { type: 'profil'; profilHref: string; profilLabel: string }
    | { type: 'ogrenci'; ogrenciHref: string; ogrenciName: string }
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
}: DenemeSonucContentProps) {
  const [activeTab, setActiveTab] = useState<'siralama' | 'kitapcik' | 'analiz'>('siralama')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [dersAxisFontSize, setDersAxisFontSize] = useState(10)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const update = () => setDersAxisFontSize(mq.matches ? 13 : 10)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const currentOrderItem = questionOrder[currentQuestionIndex]
  const question = currentOrderItem ? getQuestionByQuestionId(currentOrderItem.questionId) : null
  const bookletSira = currentOrderItem?.bookletSira ?? 0
  const studentCevap = currentOrderItem ? result.cevaplar[String(currentOrderItem.bookletSira)] : ''
  const stat = currentOrderItem
    ? soruIstatistik.find((s) => s.questionId === currentOrderItem.questionId)
    : null

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
            <Link href={breadcrumbLinks.ogrenciHref} className="truncate transition hover:text-primary">
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
          { id: 'siralama' as const, label: 'Sıralama' },
          { id: 'kitapcik' as const, label: 'Kitapçık' },
          { id: 'analiz' as const, label: 'Analiz' },
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
          <h2 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">Sıralama Tablosu</h2>
          <p className="mb-3 text-xs text-gray-400 sm:mb-4 sm:text-sm">
            Bu denemede tüm öğrencilerin sıralaması (mevcut öğrenci vurgulu)
          </p>
          <div className="-mx-2 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[320px] text-left text-xs sm:min-w-[400px] sm:text-sm">
              <thead>
                <tr className="border-b border-dark-lighter text-gray-400">
                  <th className="pb-3 pr-4 font-medium">Sıra</th>
                  <th className="pb-3 pr-4 font-medium">Ad Soyad</th>
                  <th className="pb-3 pr-4 font-medium">Net</th>
                  <th className="pb-3 font-medium">Sınıf</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((row) => (
                  <tr
                    key={row.studentId}
                    className={`border-b border-dark-lighter ${
                      row.studentId === studentId
                        ? 'bg-primary/10 text-primary'
                        : 'text-gray-300'
                    }`}
                  >
                    <td className="py-3 pr-4 font-medium">{row.sira}</td>
                    <td className="py-3 pr-4">{row.adSoyad}</td>
                    <td className="py-3 pr-4">{row.net}</td>
                    <td className="py-3">{row.sinif}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {activeTab === 'kitapcik' && (
        <section className="rounded-xl border border-dark-lighter bg-dark-light p-4 sm:p-6">
          <h2 className="mb-3 text-base font-semibold text-white sm:mb-4 sm:text-lg">
            Sınav Kitapçığı (Soru soru)
          </h2>
          <p className="mb-4 text-xs text-gray-400 sm:text-sm">
            Kitapçık {result.kitapcik} sırasına göre sorular
          </p>

          {questionOrder.length > 0 ? (
            <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
              {/* Sol: Soru resim gösterimi */}
              <div className="min-w-0 flex-1">
                {question ? (
                  <>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 sm:text-sm">
                      <span>
                        Soru {bookletSira} / {questionOrder.length}
                      </span>
                      {stat && (
                        <span className="rounded bg-dark-lighter px-2 py-1">
                          Bu soruyu %{stat.dogruYuzde} doğru yaptı
                        </span>
                      )}
                    </div>
                    {/* Resim alanı — soru görseli burada gösterilecek */}
                    <div className="overflow-hidden rounded-lg border-2 border-dark-lighter bg-[#1a2342] shadow-lg ring-1 ring-black/20">
                      <div className="border-b border-dark-lighter bg-dark/40 px-4 py-2 text-xs font-medium text-gray-400">
                        Soru {bookletSira}
                        {question.ders && (
                          <span style={{ color: DERS_RENKLERI[question.ders] ?? '#9ca3af' }}> · {question.ders}</span>
                        )}
                      </div>
                      <div className="flex min-h-[320px] w-full items-center justify-center bg-dark/30 sm:min-h-[400px]">
                        {/* Görsel URL geldiğinde: <img src={question.imageUrl} alt={`Soru ${bookletSira}`} className="max-h-full w-full object-contain" /> */}
                        <p className="text-sm text-gray-500">Soru görseli</p>
                      </div>
                    </div>
                    {/* Önceki / Sonraki — resmin altında, ortada yan yana */}
                    <div className="mt-3 flex items-center justify-center gap-2 sm:mt-4">
                      <button
                        type="button"
                        onClick={() => setCurrentQuestionIndex((i) => Math.max(0, i - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="rounded-lg bg-dark-lighter p-2.5 text-gray-300 hover:bg-primary hover:text-white disabled:opacity-50"
                        title="Önceki soru"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setCurrentQuestionIndex((i) => Math.min(questionOrder.length - 1, i + 1))
                        }
                        disabled={currentQuestionIndex >= questionOrder.length - 1}
                        className="rounded-lg bg-dark-lighter p-2.5 text-gray-300 hover:bg-primary hover:text-white disabled:opacity-50"
                        title="Sonraki soru"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[200px] items-center justify-center text-gray-500">
                    Soru bulunamadı.
                  </div>
                )}
              </div>

              {/* Sağ: Navigasyon - Dersler ve soru numaraları */}
              <aside className="w-full shrink-0 lg:w-56">
                <div className="rounded-lg border border-dark-lighter bg-dark/50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-white">Dersler</h3>
                  <div className="space-y-4">
                    {(() => {
                      const byDers: Record<string, number[]> = {}
                      questionOrder.forEach((item) => {
                        const q = getQuestionByQuestionId(item.questionId)
                        const ders = q?.ders ?? 'Diğer'
                        if (!byDers[ders]) byDers[ders] = []
                        byDers[ders].push(item.bookletSira)
                      })
                      return Object.entries(byDers).map(([ders, siralar]) => (
                        <div key={ders}>
                          <p className="mb-2 text-xs font-medium" style={{ color: DERS_RENKLERI[ders] ?? '#9ca3af' }}>{ders}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {siralar.map((sira) => {
                              const isActive = currentOrderItem?.bookletSira === sira
                              const idx = questionOrder.findIndex((o) => o.bookletSira === sira)
                              return (
                                <button
                                  key={sira}
                                  type="button"
                                  onClick={() => typeof idx === 'number' && idx >= 0 && setCurrentQuestionIndex(idx)}
                                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-sm font-medium transition sm:h-8 sm:w-8 ${
                                    isActive
                                      ? 'border-primary bg-primary text-white'
                                      : 'border-dark-lighter bg-dark-light text-gray-400 hover:border-primary/50 hover:text-white'
                                  }`}
                                >
                                  {sira}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </aside>
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center text-gray-500">
              Soru bulunamadı.
            </div>
          )}
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
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
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
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
                  <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" />
                  </svg>
                ),
              },
            ].map((item) => {
              const total = result.dogru + result.yanlis + result.bos || 1
              const pct = item.label === 'Net' ? Math.min(100, (Number(result.net) / total) * 25) : (Number(item.value) / total) * 100
              return (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-2xl border border-dark-lighter bg-dark-light p-5 shadow-lg sm:p-6"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 sm:text-sm">{item.label}</p>
                      <p className={`mt-1 text-2xl font-bold sm:text-3xl ${item.color}`}>{item.value}</p>
                    </div>
                    <div className={`opacity-80 ${item.color}`}>{item.icon}</div>
                  </div>
                  {item.label !== 'Net' && (
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-dark-lighter">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.label === 'Doğru' ? 'bg-emerald-500' : item.label === 'Yanlış' ? 'bg-rose-500' : 'bg-amber-500'
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
              <h2 className="mb-1 text-lg font-semibold text-white sm:text-xl">Ders Bazlı Analiz</h2>
              <p className="mb-4 text-xs text-gray-400 sm:text-sm">Derslere göre net ve cevap dağılımı</p>

              {(() => {
                const dersBazliData = Object.entries(result.dersBazli).map(([ders, d]) => ({ ders, net: d.net, dogru: d.dogru, yanlis: d.yanlis, bos: d.bos }))
                return (
              <div className="mb-6 h-64 sm:h-72 lg:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dersBazliData}
                    margin={{ top: 12, right: 12, left: 0, bottom: 56 }}
                  >
                    <XAxis
                      dataKey="ders"
                      interval={0}
                      tick={<DersBarXAxisTick fill="#ffffff" fontSize={dersAxisFontSize} />}
                      axisLine={{ stroke: '#263356' }}
                      tickLine={false}
                    />
                    <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1e2a4a', border: '1px solid #263356', borderRadius: '12px' }}
                      labelStyle={{ color: '#e5e7eb' }}
                      formatter={(value: number) => [value, '']}
                      labelFormatter={(label) => `Ders: ${label}`}
                    />
                    <Bar dataKey="net" name="Net" radius={[6, 6, 0, 0]}>
                      {dersBazliData.map((entry, index) => (
                        <Cell key={index} fill={DERS_RENKLERI[entry.ders] ?? '#9ca3af'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
                )
              })()}

              <div className="overflow-x-auto rounded-xl border border-dark-lighter">
                <table className="w-full min-w-[300px] table-fixed text-left text-xs sm:text-sm">
                  <colgroup>
                    <col style={{ width: '38%' }} />
                    <col style={{ width: '15.5%' }} />
                    <col style={{ width: '15.5%' }} />
                    <col style={{ width: '15.5%' }} />
                    <col style={{ width: '15.5%' }} />
                  </colgroup>
                  <thead>
                    <tr className="border-b border-dark-lighter bg-dark/50 text-gray-400">
                      <th className="px-3 py-3 text-left font-semibold sm:px-4">Ders</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Net</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Doğru</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Yanlış</th>
                      <th className="px-2 py-3 text-center font-semibold sm:px-3">Boş</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result.dersBazli).map(([ders, d]) => (
                      <tr key={ders} className="border-b border-dark-lighter text-gray-300 last:border-0 hover:bg-dark-lighter/50">
                        <td className="px-3 py-3 font-medium sm:px-4" style={{ color: DERS_RENKLERI[ders] ?? '#fff' }}>{ders}</td>
                        <td className="px-2 py-3 text-center text-primary sm:px-3">{d.net}</td>
                        <td className="px-2 py-3 text-center text-emerald-400 sm:px-3">{d.dogru}</td>
                        <td className="px-2 py-3 text-center text-rose-400 sm:px-3">{d.yanlis}</td>
                        <td className="px-2 py-3 text-center text-amber-400 sm:px-3">{d.bos}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Soru Bazlı Analiz — Doğru % çubuk grafik + stacked bar + tablo */}
          <div className="rounded-2xl border border-dark-lighter bg-dark-light p-4 shadow-lg sm:p-6">
            <h2 className="mb-1 text-lg font-semibold text-white sm:text-xl">Soru Bazlı Analiz</h2>
            <p className="mb-4 text-xs text-gray-400 sm:text-sm">
              Her soruda kaç kişi doğru / yanlış / boş bıraktı (soru kimliğine göre)
            </p>

            {/* Doğru % bar chart */}
            <div className="mb-6 h-56 sm:h-64">
              <p className="mb-2 text-sm font-medium text-gray-400">Soru bazında doğru cevaplama oranı</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={soruIstatistik.map((s) => ({ soru: s.questionId, 'Doğru %': s.dogruYuzde }))}
                  layout="vertical"
                  margin={{ top: 4, right: 24, left: 36, bottom: 4 }}
                >
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 11 }} unit="%" axisLine={{ stroke: '#263356' }} tickLine={false} />
                  <YAxis type="category" dataKey="soru" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2a4a', border: '1px solid #263356', borderRadius: '12px' }}
                    formatter={(value: number) => [`%${value}`, 'Doğru']}
                    labelFormatter={(label) => `Soru ${label}`}
                  />
                  <Bar dataKey="Doğru %" fill="#b086fb" radius={[0, 6, 6, 0]} maxBarSize={28} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Stacked: Doğru / Yanlış / Boş sayıları */}
            <div className="mb-6 h-56 sm:h-64">
              <p className="mb-2 text-sm font-medium text-gray-400">Soru bazında cevap dağılımı</p>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={soruIstatistik.map((s) => ({
                    soru: s.questionId,
                    Doğru: s.dogruSayisi,
                    Yanlış: s.yanlisSayisi,
                    Boş: s.bosSayisi,
                  }))}
                  margin={{ top: 8, right: 12, left: 8, bottom: 8 }}
                >
                  <XAxis dataKey="soru" tick={{ fill: '#9ca3af', fontSize: 12 }} axisLine={{ stroke: '#263356' }} tickLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e2a4a', border: '1px solid #263356', borderRadius: '12px' }}
                    labelStyle={{ color: '#e5e7eb' }}
                    labelFormatter={(label) => `Soru ${label}`}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} formatter={(value) => <span className="text-gray-400">{value}</span>} />
                  <Bar dataKey="Doğru" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Yanlış" stackId="a" fill="#f87171" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Boş" stackId="a" fill="#fbbf24" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Tablo */}
            <div className="overflow-hidden rounded-xl border border-dark-lighter">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-dark-lighter bg-dark/50 text-gray-400">
                    <th className="px-4 py-3 font-semibold">Soru</th>
                    <th className="px-4 py-3 font-semibold">Doğru</th>
                    <th className="px-4 py-3 font-semibold">Yanlış</th>
                    <th className="px-4 py-3 font-semibold">Boş</th>
                    <th className="px-4 py-3 font-semibold">Doğru %</th>
                  </tr>
                </thead>
                <tbody>
                  {soruIstatistik.map((s) => (
                    <tr key={s.questionId} className="border-b border-dark-lighter text-gray-300 last:border-0 hover:bg-dark-lighter/50">
                      <td className="px-4 py-3 font-medium text-white">{s.questionId}</td>
                      <td className="px-4 py-3 text-emerald-400">{s.dogruSayisi}</td>
                      <td className="px-4 py-3 text-rose-400">{s.yanlisSayisi}</td>
                      <td className="px-4 py-3 text-amber-400">{s.bosSayisi}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="inline-block h-2 w-12 overflow-hidden rounded-full bg-dark-lighter">
                            <span
                              className="block h-full rounded-full bg-primary"
                              style={{ width: `${s.dogruYuzde}%` }}
                            />
                          </span>
                          <span className="font-semibold text-primary">%{s.dogruYuzde}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
