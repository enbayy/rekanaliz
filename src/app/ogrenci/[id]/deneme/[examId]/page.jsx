'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  getExam,
  getExamResult,
  getStudent,
  getRanking,
  getExamQuestionOrderForBooklet,
  getSoruIstatistik,
} from '@/lib/mock-data'
import DenemeSonucContent from '@/components/DenemeSonucContent'

export default function OgrenciDenemeSonucPage() {
  const params = useParams()
  const studentId = params.id
  const examId = params.examId

  const student = getStudent(studentId)
  const exam = getExam(examId)
  const result = getExamResult(studentId, examId)

  if (!student || !exam || !result) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-gray-400">Öğrenci veya deneme sonucu bulunamadı.</p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Ana Sayfaya dön
        </Link>
      </div>
    )
  }

  const ranking = getRanking(examId)
  const myRow = ranking.find((r) => r.studentId === studentId)
  const questionOrder = getExamQuestionOrderForBooklet(exam, result.kitapcik)
  const soruIstatistik = getSoruIstatistik(examId)

  return (
    <DenemeSonucContent
      studentId={studentId}
      studentName={student.adSoyad}
      exam={exam}
      result={result}
      ranking={ranking}
      currentStudentSira={myRow?.sira}
      questionOrder={questionOrder}
      soruIstatistik={soruIstatistik}
      breadcrumbLinks={{
        type: 'ogrenci',
        ogrenciHref: `/ogrenci/${studentId}`,
        ogrenciName: student.adSoyad,
      }}
    />
  )
}

