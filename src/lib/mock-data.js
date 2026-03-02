/** Tüm soru havuzu (sınavlar bu id'lerle referans verir) */
export const DERSLER = ['Türkçe', 'Sosyal Bilgiler', 'Din Kültürü', 'İngilizce', 'Matematik', 'Fen Bilgisi']

/** Ders adı -> renk (hex). Grafik ve arayüzde kullanılır. */
export const DERS_RENKLERI = {
  Türkçe: '#ef4444',
  'Sosyal Bilgiler': '#f97316',
  'Din Kültürü': '#fef3c7',
  İngilizce: '#c4b5fd',
  Matematik: '#1e40af',
  'Fen Bilgisi': '#22c55e',
  'Fen Bilimleri': '#22c55e', // alternatif isim
}

// Kitapçık ekranındaki sabit ders-soru adetlerine göre soru havuzunu üretelim
const DERS_SORU_SAYILARI = {
  Türkçe: 20,
  'Sosyal Bilgiler': 10,
  'Din Kültürü': 10,
  İngilizce: 10,
  Matematik: 20,
  'Fen Bilgisi': 20,
}

const GENERATED_QUESTIONS = []

;(function generateQuestionsForAllDersler() {
  let globalIndex = 1

  Object.entries(DERS_SORU_SAYILARI).forEach(([ders, adet]) => {
    for (let i = 1; i <= adet; i += 1) {
      const questionId = `Q${globalIndex}`
      GENERATED_QUESTIONS.push({
        id: `q${globalIndex}`,
        questionId,
        metin: `${ders} ${i}. soru metni (görsel placeholder).`,
        siklar: [
          'A) Şık 1',
          'B) Şık 2',
          'C) Şık 3',
          'D) Şık 4',
          'E) Şık 5',
        ],
        dogruCevap: 'A',
        ders,
      })

      globalIndex += 1
    }
  })
})()

export const MOCK_QUESTIONS = GENERATED_QUESTIONS

export const MOCK_SCHOOLS = [
  { id: '1', ad: 'Merkez Anadolu Lisesi' },
  { id: '2', ad: 'Şehit Mehmet Lisesi' },
]

// Not: Gerçek sistemde bu bilgiler CSV / veritabanından gelecektir.
// Burada sadece TC + okul numarasına göre giriş akışını simüle ediyoruz.
export const MOCK_STUDENTS = [
  {
    id: '1',
    schoolId: '1',
    no: '101', // okul numarası
    tc: '10000000001',
    adSoyad: 'Ayşe Yılmaz',
    sinif: '12-A',
  },
  {
    id: '2',
    schoolId: '1',
    no: '205',
    tc: '10000000002',
    adSoyad: 'Mehmet Kaya',
    sinif: '12-B',
  },
  {
    id: '3',
    schoolId: '1',
    no: '312',
    tc: '10000000003',
    adSoyad: 'Elif Demir',
    sinif: '11-A',
  },
  {
    id: '4',
    schoolId: '1',
    no: '108',
    tc: '10000000004',
    adSoyad: 'Zeynep Arslan',
    sinif: '12-A',
  },
  {
    id: '5',
    schoolId: '1',
    no: '210',
    tc: '10000000005',
    adSoyad: 'Ali Özkan',
    sinif: '12-B',
  },
]

/** Deneme 1: kitapçık A ve B'de 90 soruluk sabit sıra (optik örnekleri için yeterli) */
const exam1Questions = Array.from({ length: GENERATED_QUESTIONS.length }).map((_, index) => ({
  examId: '1',
  questionId: `Q${index + 1}`,
  orderA: index + 1,
  orderB: index + 1,
}))

export const MOCK_EXAMS = [
  {
    id: '1',
    schoolId: '1',
    ad: '1. Dönem Deneme',
    tarih: 'Şubat 2025',
    questions: exam1Questions,
  },
  {
    id: '2',
    schoolId: '1',
    ad: '2. Dönem Deneme',
    tarih: 'Mart 2025',
    questions: exam1Questions,
  },
]

/** Cevaplar: pozisyon (1 tabanlı) -> şık. A kitapçığında 1. soru Q1, 2. soru Q2... */
export const MOCK_EXAM_RESULTS = [
  {
    id: 'r1',
    studentId: '1',
    examId: '1',
    kitapcik: 'A',
    cevaplar: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'A' },
    // Toplam 90 soru: Türkçe 20, Sosyal 10, Din 10, İngilizce 10, Matematik 20, Fen 20
    // Bu örnekte: 66 doğru, 18 yanlış, 6 boş → net = 66 - 18/4 = 61.5
    net: 61.5,
    dogru: 66,
    yanlis: 18,
    bos: 6,
    dersBazli: {
      Türkçe: {
        // 20 soru: 16D 3Y 1B → net = 16 - 3/4 = 15.25
        net: 15.25,
        dogru: 16,
        yanlis: 3,
        bos: 1,
        konuBazli: [
          { konu: 'Sözcükte Anlam', toplam: 4, dogru: 3, yanlis: 1, bos: 0 },
          { konu: 'Paragrafta Anlam', toplam: 6, dogru: 5, yanlis: 1, bos: 0 },
          { konu: 'Paragrafta Ana Düşünce', toplam: 5, dogru: 4, yanlis: 1, bos: 0 },
          { konu: 'Dil Bilgisi', toplam: 5, dogru: 4, yanlis: 0, bos: 1 },
        ],
      },
      'Sosyal Bilgiler': {
        // 10 soru: 7D 2Y 1B → net = 7 - 2/4 = 6.5
        net: 6.5,
        dogru: 7,
        yanlis: 2,
        bos: 1,
        konuBazli: [
          { konu: 'Tarih', toplam: 5, dogru: 4, yanlis: 1, bos: 0 },
          { konu: 'Coğrafya', toplam: 5, dogru: 3, yanlis: 1, bos: 1 },
        ],
      },
      'Din Kültürü': {
        // 10 soru: 8D 1Y 1B → net = 8 - 1/4 = 7.75
        net: 7.75,
        dogru: 8,
        yanlis: 1,
        bos: 1,
        konuBazli: [
          { konu: 'İbadetler', toplam: 5, dogru: 4, yanlis: 0, bos: 1 },
          { konu: 'Peygamberler', toplam: 5, dogru: 4, yanlis: 1, bos: 0 },
        ],
      },
      İngilizce: {
        // 10 soru: 6D 3Y 1B → net = 6 - 3/4 = 5.25
        net: 5.25,
        dogru: 6,
        yanlis: 3,
        bos: 1,
        konuBazli: [
          { konu: 'Vocabulary', toplam: 5, dogru: 3, yanlis: 1, bos: 1 },
          { konu: 'Reading', toplam: 5, dogru: 3, yanlis: 2, bos: 0 },
        ],
      },
      Matematik: {
        // 20 soru: 15D 4Y 1B → net = 15 - 4/4 = 14
        net: 14,
        dogru: 15,
        yanlis: 4,
        bos: 1,
        konuBazli: [
          { konu: 'Temel İşlemler', toplam: 8, dogru: 6, yanlis: 1, bos: 1 },
          { konu: 'Denklemler', toplam: 6, dogru: 5, yanlis: 1, bos: 0 },
          { konu: 'Problemler', toplam: 6, dogru: 4, yanlis: 2, bos: 0 },
        ],
      },
      'Fen Bilgisi': {
        // 20 soru: 14D 5Y 1B → net = 14 - 5/4 = 12.75
        net: 12.75,
        dogru: 14,
        yanlis: 5,
        bos: 1,
        konuBazli: [
          { konu: 'Madde ve Isı', toplam: 8, dogru: 6, yanlis: 1, bos: 1 },
          { konu: 'Canlılar', toplam: 6, dogru: 4, yanlis: 2, bos: 0 },
          { konu: 'Fiziksel Olaylar', toplam: 6, dogru: 4, yanlis: 2, bos: 0 },
        ],
      },
    },
  },
  {
    id: 'r2',
    studentId: '2',
    examId: '1',
    kitapcik: 'B',
    cevaplar: { 1: 'A', 2: 'B', 3: 'C', 4: 'B', 5: 'A' },
    net: 84,
    dogru: 3,
    yanlis: 1,
    bos: 1,
    dersBazli: {},
  },
  {
    id: 'r3',
    studentId: '3',
    examId: '1',
    kitapcik: 'A',
    cevaplar: { 1: 'B', 2: 'C', 3: 'A', 4: 'B', 5: 'A' },
    net: 82,
    dogru: 4,
    yanlis: 1,
    bos: 0,
    dersBazli: {},
  },
  {
    id: 'r4',
    studentId: '4',
    examId: '1',
    kitapcik: 'A',
    cevaplar: { 1: 'B', 2: 'C', 3: 'C', 4: 'B', 5: 'A' },
    net: 92.5,
    dogru: 5,
    yanlis: 0,
    bos: 0,
    dersBazli: {},
  },
  {
    id: 'r5',
    studentId: '5',
    examId: '1',
    kitapcik: 'B',
    cevaplar: { 1: 'A', 2: 'C', 3: 'C', 4: 'B', 5: 'A' },
    net: 90,
    dogru: 4,
    yanlis: 0,
    bos: 1,
    dersBazli: {},
  },
  {
    id: 'r6',
    studentId: '1',
    examId: '2',
    kitapcik: 'A',
    cevaplar: {},
    net: 0,
    dogru: 0,
    yanlis: 0,
    bos: 5,
    dersBazli: {},
  },
]

/** Deneme 1 sıralaması (net'e göre) */
export const MOCK_RANKING_EXAM1 = [
  { sira: 1, studentId: '4', adSoyad: 'Zeynep Arslan', net: 92.5, sinif: '12-A' },
  { sira: 2, studentId: '5', adSoyad: 'Ali Özkan', net: 90, sinif: '12-B' },
  { sira: 3, studentId: '1', adSoyad: 'Ayşe Yılmaz', net: 85.5, sinif: '12-A' },
  { sira: 4, studentId: '2', adSoyad: 'Mehmet Kaya', net: 84, sinif: '12-B' },
  { sira: 5, studentId: '3', adSoyad: 'Elif Demir', net: 82, sinif: '11-A' },
]

/** Deneme 1 soru bazlı istatistik (soru kimliğine göre) */
export const MOCK_SORU_ISTATISTIK_EXAM1 = [
  { questionId: 'Q1', dogruSayisi: 4, yanlisSayisi: 1, bosSayisi: 0, toplam: 5, dogruYuzde: 80 },
  { questionId: 'Q2', dogruSayisi: 3, yanlisSayisi: 1, bosSayisi: 1, toplam: 5, dogruYuzde: 60 },
  { questionId: 'Q3', dogruSayisi: 4, yanlisSayisi: 1, bosSayisi: 0, toplam: 5, dogruYuzde: 80 },
  { questionId: 'Q4', dogruSayisi: 5, yanlisSayisi: 0, bosSayisi: 0, toplam: 5, dogruYuzde: 100 },
  { questionId: 'Q5', dogruSayisi: 4, yanlisSayisi: 0, bosSayisi: 1, toplam: 5, dogruYuzde: 80 },
]

// --- Yardımcı getter'lar (ileride API ile değişecek) ---

export function getSchool(id) {
  return MOCK_SCHOOLS.find((s) => s.id === id)
}

export function getStudent(id) {
  return MOCK_STUDENTS.find((s) => s.id === id)
}

export function getExam(id) {
  return MOCK_EXAMS.find((e) => e.id === id)
}

export function getQuestionByQuestionId(questionId) {
  return MOCK_QUESTIONS.find((q) => q.questionId === questionId)
}

export function getExamResult(studentId, examId) {
  return MOCK_EXAM_RESULTS.find((r) => r.studentId === studentId && r.examId === examId)
}

export function getExamResultsByExam(examId) {
  return MOCK_EXAM_RESULTS.filter((r) => r.examId === examId)
}

/** Öğrencinin bir denemede gördüğü soru sırası (kitapçığına göre): [questionId, bookletSira][] */
export function getExamQuestionOrderForBooklet(exam, kitapcik) {
  const orderKey = kitapcik === 'A' ? 'orderA' : 'orderB'
  return exam.questions
    .map((eq) => ({
      questionId: eq.questionId,
      bookletSira: eq[orderKey],
    }))
    .sort((a, b) => a.bookletSira - b.bookletSira)
}

/** Kitapçık sırasındaki N. sorunun questionId'si */
export function getQuestionIdAtPosition(exam, kitapcik, position) {
  const order = getExamQuestionOrderForBooklet(exam, kitapcik)
  return order.find((o) => o.bookletSira === position)?.questionId
}

export function getRanking(examId) {
  if (examId === '1') return MOCK_RANKING_EXAM1
  return []
}

export function getSoruIstatistik(examId) {
  if (examId === '1') return MOCK_SORU_ISTATISTIK_EXAM1
  return []
}

/** Öğrencinin o denemede girdiği exam result listesi (profil "denemelerim" için) */
export function getExamsForStudent(studentId) {
  const results = MOCK_EXAM_RESULTS.filter((r) => r.studentId === studentId)
  return results
    .map((r) => {
      const exam = getExam(r.examId)
      return exam ? { exam, result: r } : null
    })
    .filter((x) => x !== null)
}

