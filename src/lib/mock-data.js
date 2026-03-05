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

// LGS konuları - her ders için
export const LGS_KONULARI = {
  Türkçe: [
    'Sözcükte Anlam',
    'Cümlede Anlam',
    'Paragrafta Anlam',
    'Paragrafta Ana Düşünce',
    'Paragrafta Yardımcı Düşünce',
    'Paragrafta Yapı',
    'Dil Bilgisi',
    'Yazım Kuralları',
    'Noktalama İşaretleri',
    'Cümlenin Ögeleri',
    'Fiilimsiler',
    'Fiiller',
    'İsimler',
    'Sıfatlar',
    'Zamirler',
    'Zarflar',
    'Edat-Bağlaç-Ünlem',
    'Ses Bilgisi',
    'Anlatım Bozukluğu',
    'Metin Türleri',
  ],
  Matematik: [
    'Temel İşlemler',
    'Üslü Sayılar',
    'Köklü Sayılar',
    'Çarpanlar ve Katlar',
    'Ondalık Gösterim',
    'Yüzdeler',
    'Denklemler',
    'Eşitsizlikler',
    'Problemler',
    'Geometri',
    'Üçgenler',
    'Dörtgenler',
    'Çember ve Daire',
    'Dönüşüm Geometrisi',
    'Veri Analizi',
    'Olasılık',
    'İstatistik',
    'Cebirsel İfadeler',
    'Fonksiyonlar',
    'Oran-Orantı',
  ],
  'Fen Bilgisi': [
    'Madde ve Isı',
    'Maddenin Yapısı',
    'Kuvvet ve Hareket',
    'Enerji Dönüşümleri',
    'Elektrik',
    'Manyetizma',
    'Canlılar',
    'Hücre',
    'Sistemler',
    'Genetik',
    'Evrim',
    'Ekoloji',
    'Fiziksel Olaylar',
    'Kimyasal Tepkimeler',
    'Asitler ve Bazlar',
    'Basınç',
    'Ses',
    'Işık',
    'Yer Kabuğu',
    'Güneş Sistemi',
  ],
  'Sosyal Bilgiler': [
    'Tarih',
    'Osmanlı Tarihi',
    'Türkiye Cumhuriyeti Tarihi',
    'Atatürk İlkeleri',
    'Coğrafya',
    'Türkiye Coğrafyası',
    'İklim',
    'Nüfus',
    'Yerleşme',
    'Ekonomi',
  ],
  'Din Kültürü': [
    'İbadetler',
    'Namaz',
    'Oruç',
    'Zekat',
    'Hac',
    'Peygamberler',
    'Kur\'an-ı Kerim',
    'İnanç Esasları',
    'Ahlak',
    'İslam Tarihi',
  ],
  İngilizce: [
    'Vocabulary',
    'Reading',
    'Grammar',
    'Tenses',
    'Modal Verbs',
    'Conditionals',
    'Passive Voice',
    'Relative Clauses',
    'Phrasal Verbs',
    'Writing',
  ],
}

const GENERATED_QUESTIONS = []

;(function generateQuestionsForAllDersler() {
  let globalIndex = 1
  const cevaplar = ['A', 'B', 'C', 'D']

  Object.entries(DERS_SORU_SAYILARI).forEach(([ders, adet]) => {
    const konular = LGS_KONULARI[ders] || []
    for (let i = 1; i <= adet; i += 1) {
      const questionId = `Q${globalIndex}`
      // Konuları döngüsel olarak dağıt
      const konu = konular.length > 0 ? konular[(i - 1) % konular.length] : 'Genel'
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
        dogruCevap: cevaplar[((globalIndex * 13 + i * 17 + ders.length * 7) % cevaplar.length)],
        ders,
        konu,
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
    id: '1001',
    schoolId: '1',
    no: '1001',
    tc: '10000001001',
    adSoyad: 'Ahmet Yılmaz',
    sinif: '12-A',
  },
  {
    id: '1002',
    schoolId: '1',
    no: '1002',
    tc: '10000001002',
    adSoyad: 'Ayşe Demir',
    sinif: '12-A',
  },
  {
    id: '1003',
    schoolId: '1',
    no: '1003',
    tc: '10000001003',
    adSoyad: 'Mehmet Kaya',
    sinif: '12-B',
  },
  {
    id: '1004',
    schoolId: '1',
    no: '1004',
    tc: '10000001004',
    adSoyad: 'Zeynep Şahin',
    sinif: '12-A',
  },
  {
    id: '1005',
    schoolId: '1',
    no: '1005',
    tc: '10000001005',
    adSoyad: 'Ali Çelik',
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
export const MOCK_EXAM_RESULTS = []


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
  // MOCK_EXAM_RESULTS'tan dinamik olarak sıralama oluştur
  const results = MOCK_EXAM_RESULTS.filter((r) => r.examId === examId)
  
  // Net'e göre azalan sırala (en yüksek net en üstte)
  const sortedResults = [...results].sort((a, b) => (b.net || 0) - (a.net || 0))
  
  // Sınıflara göre grupla
  const sinifGruplari = {}
  sortedResults.forEach((result) => {
    const student = getStudent(result.studentId)
    if (student) {
      const sinif = student.sinif || 'Bilinmeyen'
      if (!sinifGruplari[sinif]) {
        sinifGruplari[sinif] = []
      }
      sinifGruplari[sinif].push(result)
    }
  })
  
  // Her sınıf içinde net'e göre sırala
  Object.keys(sinifGruplari).forEach((sinif) => {
    sinifGruplari[sinif].sort((a, b) => (b.net || 0) - (a.net || 0))
  })
  
  // Sıralama verilerini oluştur
  const ranking = sortedResults.map((result, index) => {
    const student = getStudent(result.studentId)
    const sinif = student?.sinif || 'Bilinmeyen'
    const sinifSonuclari = sinifGruplari[sinif] || []
    const sinifSira = sinifSonuclari.findIndex((r) => r.studentId === result.studentId) + 1
    
    return {
      sira: index + 1,
      studentId: result.studentId,
      adSoyad: student?.adSoyad || 'Bilinmeyen',
      net: result.net || 0,
      sinif,
      sinifSira,
      sinifToplam: sinifSonuclari.length,
      kurumSira: index + 1,
      kurumToplam: sortedResults.length,
      ilceSira: index + 1,
      ilceToplam: sortedResults.length,
      ilSira: index + 1,
      ilToplam: sortedResults.length,
    }
  })
  
  return ranking
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

/**
 * Optik okuyucudan gelen cevapları öğrenci profiline yerleştirir ve tüm istatistikleri hesaplar.
 * 
 * @param {Object} optikVeri - Optik okuyucudan gelen veri
 * @param {string} optikVeri.studentId - Öğrenci ID'si
 * @param {string} optikVeri.examId - Deneme ID'si
 * @param {string} optikVeri.kitapcik - Kitapçık tipi ('A' veya 'B')
 * @param {Object} optikVeri.cevaplar - Pozisyon (1 tabanlı) -> şık eşlemesi, örn: { 1: 'A', 2: 'B', 3: 'C' }
 * @returns {Object} Oluşturulan veya güncellenen exam result objesi
 */
export function processOptikOkuyucuVerisi({ studentId, examId, kitapcik, cevaplar }) {
  // Exam bilgisini al
  const exam = getExam(examId)
  if (!exam) {
    throw new Error(`Exam bulunamadı: ${examId}`)
  }

  // Kitapçık sırasını al
  const questionOrder = getExamQuestionOrderForBooklet(exam, kitapcik)
  
  // Ders bazlı istatistikleri hesapla
  const dersBazli = {}
  const dersSoruSayilari = {}
  
  // Her soru için kontrol et
  let toplamDogru = 0
  let toplamYanlis = 0
  let toplamBos = 0

  questionOrder.forEach(({ questionId, bookletSira }) => {
    const soru = getQuestionByQuestionId(questionId)
    if (!soru) return

    const ders = soru.ders
    const konu = soru.konu
    const dogruCevap = soru.dogruCevap
    const ogrenciCevabi = cevaplar[bookletSira]

    // Ders bazlı başlangıç
    if (!dersBazli[ders]) {
      dersBazli[ders] = {
        dogru: 0,
        yanlis: 0,
        bos: 0,
        konuBazli: {},
      }
      dersSoruSayilari[ders] = 0
    }

    dersSoruSayilari[ders] += 1

    // Konu bazlı başlangıç
    if (!dersBazli[ders].konuBazli[konu]) {
      dersBazli[ders].konuBazli[konu] = {
        konu,
        toplam: 0,
        dogru: 0,
        yanlis: 0,
        bos: 0,
      }
    }

    dersBazli[ders].konuBazli[konu].toplam += 1

    // Cevap kontrolü
    if (!ogrenciCevabi || ogrenciCevabi.trim() === '') {
      // Boş
      toplamBos += 1
      dersBazli[ders].bos += 1
      dersBazli[ders].konuBazli[konu].bos += 1
    } else if (ogrenciCevabi.toUpperCase() === dogruCevap.toUpperCase()) {
      // Doğru
      toplamDogru += 1
      dersBazli[ders].dogru += 1
      dersBazli[ders].konuBazli[konu].dogru += 1
    } else {
      // Yanlış
      toplamYanlis += 1
      dersBazli[ders].yanlis += 1
      dersBazli[ders].konuBazli[konu].yanlis += 1
    }
  })

  // Net hesapla: net = doğru - (yanlış / 4)
  const toplamNet = toplamDogru - toplamYanlis / 4

  // Ders bazlı net hesapla ve konuBazli'yi array'e çevir
  Object.keys(dersBazli).forEach((ders) => {
    const d = dersBazli[ders]
    d.net = d.dogru - d.yanlis / 4
    // konuBazli objesini array'e çevir
    d.konuBazli = Object.values(d.konuBazli)
  })

  // Mevcut result'ı kontrol et
  const mevcutIndex = MOCK_EXAM_RESULTS.findIndex(
    (r) => r.studentId === studentId && r.examId === examId
  )

  const resultObj = {
    id: mevcutIndex >= 0 ? MOCK_EXAM_RESULTS[mevcutIndex].id : `r${Date.now()}`,
    studentId,
    examId,
    kitapcik,
    cevaplar,
    net: toplamNet,
    dogru: toplamDogru,
    yanlis: toplamYanlis,
    bos: toplamBos,
    dersBazli,
  }

  // Güncelle veya ekle
  if (mevcutIndex >= 0) {
    MOCK_EXAM_RESULTS[mevcutIndex] = resultObj
  } else {
    MOCK_EXAM_RESULTS.push(resultObj)
  }
  return resultObj
}

// CSV verilerinden öğrenci cevaplarını parse et ve işle
;(function processCsvStudentAnswers() {
  // CSV verileri: OgrenciNo,AdSoyad,S1-S90
  const csvData = [
    {
      ogrenciNo: '1001',
      adSoyad: 'Ahmet Yılmaz',
      cevaplar: 'A,C,B,D,A,C,D,B,A,C,D,B,A,C,B,D,A,C,B,D,C,B,A,D,B,A,C,D,B,A,C,A,D,B,C,A,B,D,C,A,A,D,C,B,A,C,D,B,A,C,B,A,D,C,B,A,C,B,D,A,C,B,A,C,D,B,A,C,B,D,A,C,B,A,D,C,B,A,C',
    },
    {
      ogrenciNo: '1002',
      adSoyad: 'Ayşe Demir',
      cevaplar: 'B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,A,C,D,B,A,C,B,D,A,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D',
    },
    {
      ogrenciNo: '1003',
      adSoyad: 'Mehmet Kaya',
      cevaplar: 'C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B,A,C,D,B',
    },
    {
      ogrenciNo: '1004',
      adSoyad: 'Zeynep Şahin',
      cevaplar: 'D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D,A,C,B,D',
    },
    {
      ogrenciNo: '1005',
      adSoyad: 'Ali Çelik',
      cevaplar: 'A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,A,B,C,D,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A,D,C,B,A',
    },
  ]

  csvData.forEach((row) => {
    // Cevapları parse et: S1-S90 -> { 1: 'A', 2: 'C', ... }
    const cevaplarArray = row.cevaplar.split(',')
    const cevaplar = {}
    cevaplarArray.forEach((cevap, index) => {
      const soruNo = index + 1
      const temizCevap = cevap.trim().toUpperCase()
      if (temizCevap && ['A', 'B', 'C', 'D'].includes(temizCevap)) {
        cevaplar[soruNo] = temizCevap
      }
    })

    // processOptikOkuyucuVerisi fonksiyonunu kullanarak net hesapla
    try {
      processOptikOkuyucuVerisi({
        studentId: row.ogrenciNo,
        examId: '1',
        kitapcik: 'A',
        cevaplar,
      })
    } catch (error) {
      console.error(`Öğrenci ${row.ogrenciNo} için hata:`, error)
    }
  })
})()
