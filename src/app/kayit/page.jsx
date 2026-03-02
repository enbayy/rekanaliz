'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function KayitPage() {
  const router = useRouter()

  useEffect(() => {
    // Artık ayrı kayıt akışı yok; kullanıcıyı doğrudan giriş sayfasına yönlendir.
    router.replace('/giris')
  }, [router])

  return null
}

