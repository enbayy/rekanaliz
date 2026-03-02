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

export const MOCK_QUESTIONS = [
  {
    id: 'q1',
    questionId: 'Q1',
    metin: 'Aşağıdaki cümlelerin hangisinde yazım yanlışı vardır?',
    siklar: ['A) Yanlış seçenek', 'B) Doğru seçenek', 'C) Diğer', 'D) Diğer', 'E) Diğer'],
    dogruCevap: 'B',
    ders: 'Türkçe',
  },
  {
    id: 'q2',
    questionId: 'Q2',
    metin: '2. soru metni buraya gelecek. Şıklar aşağıda.',
    siklar: ['A) Birinci şık', 'B) İkinci şık', 'C) Üçüncü şık', 'D) Dördüncü şık', 'E) Beşinci şık'],
    dogruCevap: 'C',
    ders: 'Sosyal Bilgiler',
  },
  {
    id: 'q3',
    questionId: 'Q3',
    metin: 'Matematik sorusu: x + 2 = 5 ise x kaçtır?',
    siklar: ['A) 1', 'B) 2', 'C) 3', 'D) 4', 'E) 5'],
    dogruCevap: 'C',
    ders: 'Matematik',
  },
  {
    id: 'q4',
    questionId: 'Q4',
    metin: "Fen bilgisi sorusu: Suyun kaynama noktası kaç °C'dir?",
    siklar: ['A) 90', 'B) 100', 'C) 110', 'D) 120', 'E) 80'],
    dogruCevap: 'B',
    ders: 'Fen Bilgisi',
  },
  {
    id: 'q5',
    questionId: 'Q5',
    metin: 'Beşinci soru metni. A kitapçığında 5., B kitapçığında 1. sırada.',
    siklar: ['A) Şık 1', 'B) Şık 2', 'C) Şık 3', 'D) Şık 4', 'E) Şık 5'],
    dogruCevap: 'A',
    ders: 'İngilizce',
  },
]

export const MOCK_SCHOOLS = [
  { id: '1', ad: 'Merkez Anadolu Lisesi' },
  { id: '2', ad: 'Şehit Mehmet Lisesi' },
]

export const MOCK_STUDENTS = [
  { id: '1', schoolId: '1', no: '101', adSoyad: 'Ayşe Yılmaz', sinif: '12-A' },
  { id: '2', schoolId: '1', no: '205', adSoyad: 'Mehmet Kaya', sinif: '12-B' },
  { id: '3', schoolId: '1', no: '312', adSoyad: 'Elif Demir', sinif: '11-A' },
  { id: '4', schoolId: '1', no: '108', adSoyad: 'Zeynep Arslan', sinif: '12-A' },
  { id: '5', schoolId: '1', no: '210', adSoyad: 'Ali Özkan', sinif: '12-B' },
]

/** Deneme 1: A'da sıra Q1,Q2,Q3,Q4,Q5; B'de sıra Q5,Q1,Q2,Q3,Q4 (örnek) */
const exam1Questions = [
  { examId: '1', questionId: 'Q1', orderA: 1, orderB: 2 },
  { examId: '1', questionId: 'Q2', orderA: 2, orderB: 3 },
  { examId: '1', questionId: 'Q3', orderA: 3, orderB: 4 },
  { examId: '1', questionId: 'Q4', orderA: 4, orderB: 5 },
  { examId: '1', questionId: 'Q5', orderA: 5, orderB: 1 },
]

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
    net: 85.5,
    dogru: 4,
    yanlis: 1,
    bos: 0,
    dersBazli: {
      Türkçe: { net: 2, dogru: 2, yanlis: 0, bos: 0 },
      'Sosyal Bilgiler': { net: 0, dogru: 0, yanlis: 0, bos: 0 },
      'Din Kültürü': { net: 0, dogru: 0, yanlis: 0, bos: 0 },
      İngilizce: { net: 0, dogru: 0, yanlis: 0, bos: 0 },
      Matematik: { net: 1, dogru: 1, yanlis: 0, bos: 0 },
      'Fen Bilgisi': { net: 1, dogru: 1, yanlis: 0, bos: 0 },
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

