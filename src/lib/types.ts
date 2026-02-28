/**
 * Veritabanı tasarımına uygun tipler.
 * Gerçek veri API'den gelecek; şimdilik mock ile kullanılıyor.
 */

export type KitapcikTuru = 'A' | 'B'

export interface School {
  id: string
  ad: string
}

export interface Student {
  id: string
  schoolId: string
  no: string
  adSoyad: string
  sinif: string
  /** Şifre hash (gerçekte backend'de saklanacak) */
  passwordHash?: string
}

export interface Question {
  id: string
  /** Soru kimliği (canonical), örn. Q1, T1, M1 */
  questionId: string
  metin: string
  /** A, B, C, D, E */
  siklar: string[]
  /** Doğru şık (A/B kitapçığında aynı soru aynı cevap) */
  dogruCevap: string
  /** Hangi ders (analiz gruplaması için) */
  ders?: string
}

/** Sınavdaki soru: sıra A ve B kitapçığına göre farklı */
export interface ExamQuestion {
  examId: string
  questionId: string
  /** A kitapçığında kaçıncı sırada (1 tabanlı) */
  orderA: number
  /** B kitapçığında kaçıncı sırada (1 tabanlı) */
  orderB: number
}

export interface Exam {
  id: string
  schoolId: string | null
  ad: string
  tarih: string
  /** Sınavdaki soru kimlikleri ve sıraları (orderA, orderB) */
  questions: ExamQuestion[]
}

/** Tek bir soru için öğrenci cevabı (pozisyon veya questionId ile) */
export type CevapMap = Record<string, string>

export interface ExamResult {
  id: string
  studentId: string
  examId: string
  kitapcik: KitapcikTuru
  /** Pozisyon (1,2,3...) -> şık (A,B,C,D,E veya boş) */
  cevaplar: CevapMap
  net: number
  dogru: number
  yanlis: number
  bos: number
  /** Ders bazlı özet: dersAdi -> { net, dogru, yanlis, bos } */
  dersBazli?: Record<string, { net: number; dogru: number; yanlis: number; bos: number }>
}

/** Soru bazlı istatistik (tüm öğrenciler için) */
export interface SoruIstatistik {
  questionId: string
  dogruSayisi: number
  yanlisSayisi: number
  bosSayisi: number
  toplam: number
  /** 0-100 */
  dogruYuzde: number
}

export interface RankingRow {
  sira: number
  studentId: string
  adSoyad: string
  net: number
  sinif: string
}
