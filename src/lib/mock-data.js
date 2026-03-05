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
        dogruCevap: 'A',
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
    sinif: '12-A',
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
          { konu: 'Sözcükte Anlam', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Cümlede Anlam', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Paragrafta Anlam', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Paragrafta Ana Düşünce', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Paragrafta Yardımcı Düşünce', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Paragrafta Yapı', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Dil Bilgisi', toplam: 1, dogru: 0, yanlis: 0, bos: 1 },
          { konu: 'Yazım Kuralları', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Noktalama İşaretleri', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Cümlenin Ögeleri', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Fiilimsiler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Fiiller', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'İsimler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Sıfatlar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Zamirler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Zarflar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Edat-Bağlaç-Ünlem', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Ses Bilgisi', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Anlatım Bozukluğu', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Metin Türleri', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
        ],
      },
      'Sosyal Bilgiler': {
        // 10 soru: 7D 2Y 1B → net = 7 - 2/4 = 6.5
        net: 6.5,
        dogru: 7,
        yanlis: 2,
        bos: 1,
        konuBazli: [
          { konu: 'Tarih', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Osmanlı Tarihi', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Türkiye Cumhuriyeti Tarihi', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Atatürk İlkeleri', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Coğrafya', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Türkiye Coğrafyası', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'İklim', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Nüfus', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Yerleşme', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Ekonomi', toplam: 1, dogru: 0, yanlis: 0, bos: 1 },
        ],
      },
      'Din Kültürü': {
        // 10 soru: 8D 1Y 1B → net = 8 - 1/4 = 7.75
        net: 7.75,
        dogru: 8,
        yanlis: 1,
        bos: 1,
        konuBazli: [
          { konu: 'İbadetler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Namaz', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Oruç', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Zekat', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Hac', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Peygamberler', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Kur\'an-ı Kerim', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'İnanç Esasları', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Ahlak', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'İslam Tarihi', toplam: 1, dogru: 0, yanlis: 0, bos: 1 },
        ],
      },
      İngilizce: {
        // 10 soru: 6D 3Y 1B → net = 6 - 3/4 = 5.25
        net: 5.25,
        dogru: 6,
        yanlis: 3,
        bos: 1,
        konuBazli: [
          { konu: 'Vocabulary', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Reading', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Grammar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Tenses', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Modal Verbs', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Conditionals', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Passive Voice', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Relative Clauses', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Phrasal Verbs', toplam: 1, dogru: 0, yanlis: 0, bos: 1 },
          { konu: 'Writing', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
        ],
      },
      Matematik: {
        // 20 soru: 15D 4Y 1B → net = 15 - 4/4 = 14
        net: 14,
        dogru: 15,
        yanlis: 4,
        bos: 1,
        konuBazli: [
          { konu: 'Temel İşlemler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Üslü Sayılar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Köklü Sayılar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Çarpanlar ve Katlar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Ondalık Gösterim', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Yüzdeler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Denklemler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Eşitsizlikler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Problemler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Geometri', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Üçgenler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Dörtgenler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Çember ve Daire', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Dönüşüm Geometrisi', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Veri Analizi', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Olasılık', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'İstatistik', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Cebirsel İfadeler', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Fonksiyonlar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Oran-Orantı', toplam: 1, dogru: 0, yanlis: 0, bos: 1 },
        ],
      },
      'Fen Bilgisi': {
        // 20 soru: 14D 5Y 1B → net = 14 - 5/4 = 12.75
        net: 12.75,
        dogru: 14,
        yanlis: 5,
        bos: 1,
        konuBazli: [
          { konu: 'Madde ve Isı', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Maddenin Yapısı', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Kuvvet ve Hareket', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Enerji Dönüşümleri', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Elektrik', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Manyetizma', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Canlılar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Hücre', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Sistemler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Genetik', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Evrim', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Ekoloji', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Fiziksel Olaylar', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Kimyasal Tepkimeler', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Asitler ve Bazlar', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Basınç', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Ses', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Işık', toplam: 1, dogru: 0, yanlis: 1, bos: 0 },
          { konu: 'Yer Kabuğu', toplam: 1, dogru: 1, yanlis: 0, bos: 0 },
          { konu: 'Güneş Sistemi', toplam: 1, dogru: 0, yanlis: 0, bos: 1 },
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
  {
    sira: 1,
    studentId: '4',
    adSoyad: 'Zeynep Arslan',
    net: 92.5,
    sinif: '12-A',
    sinifSira: 1,
    sinifToplam: 28,
    kurumSira: 1,
    kurumToplam: 140,
    ilceSira: 3,
    ilceToplam: 620,
    ilSira: 5,
    ilToplam: 3100,
  },
  {
    sira: 2,
    studentId: '5',
    adSoyad: 'Ali Özkan',
    net: 90,
    sinif: '12-B',
    sinifSira: 2,
    sinifToplam: 27,
    kurumSira: 2,
    kurumToplam: 140,
    ilceSira: 8,
    ilceToplam: 620,
    ilSira: 18,
    ilToplam: 3100,
  },
  {
    sira: 3,
    studentId: '1',
    adSoyad: 'Ayşe Yılmaz',
    net: 85.5,
    sinif: '12-A',
    sinifSira: 5,
    sinifToplam: 28,
    kurumSira: 28,
    kurumToplam: 140,
    ilceSira: 245,
    ilceToplam: 620,
    ilSira: 1011,
    ilToplam: 3100,
  },
  {
    sira: 4,
    studentId: '2',
    adSoyad: 'Mehmet Kaya',
    net: 84,
    sinif: '12-B',
    sinifSira: 4,
    sinifToplam: 27,
    kurumSira: 9,
    kurumToplam: 140,
    ilceSira: 30,
    ilceToplam: 620,
    ilSira: 65,
    ilToplam: 3100,
  },
  {
    sira: 5,
    studentId: '3',
    adSoyad: 'Elif Demir',
    net: 82,
    sinif: '12-A',
    sinifSira: 3,
    sinifToplam: 24,
    kurumSira: 14,
    kurumToplam: 140,
    ilceSira: 52,
    ilceToplam: 620,
    ilSira: 120,
    ilToplam: 3100,
  },
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

