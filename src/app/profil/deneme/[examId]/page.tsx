'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
  getExam,
  getExamResult,
  getStudent,
  getRanking,
  getExamQuestionOrderForBooklet,
  getSoruIstatistik,
} from '@/lib/mock-data'
import DenemeSonucContent from '@/components/DenemeSonucContent'

export default function ProfilDenemePage() {
  const params = useParams()
  const examId = params.examId as string
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

  const exam = getExam(examId)
  const result = getExamResult(user.id, examId)

  if (!exam || !result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-400">Bu denemeye ait sonuç bulunamadı.</p>
        <Link href="/profil" className="mt-4 inline-block text-primary hover:underline">
          Denemelerime dön
        </Link>
      </div>
    )
  }

  const ranking = getRanking(examId)
  const myRow = ranking.find((r) => r.studentId === user.id)
  const questionOrder = getExamQuestionOrderForBooklet(exam, result.kitapcik)
  const soruIstatistik = getSoruIstatistik(examId)

  return (
    <DenemeSonucContent
      studentId={user.id}
      studentName={user.adSoyad}
      exam={exam}
      result={result}
      ranking={ranking}
      currentStudentSira={myRow?.sira}
      questionOrder={questionOrder}
      soruIstatistik={soruIstatistik}
      breadcrumbLinks={{ type: 'profil', profilHref: '/profil', profilLabel: 'Denemelerim' }}
    />
  )
}
