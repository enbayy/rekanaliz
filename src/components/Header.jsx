'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, logout, isReady } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-dark-lighter bg-dark/95 backdrop-blur">
      <div className="mx-auto flex min-h-14 max-w-7xl flex-wrap items-center justify-between gap-2 px-3 py-2 sm:h-16 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0 lg:px-8">
        <Link href={user ? '/' : '/giris'} className="flex min-w-0 flex-shrink-0 items-center gap-2 sm:gap-3">
          <Image
            src="/rbdlogo.png"
            alt="Rekabetçi Denemeleri"
            width={64}
            height={64}
            className="h-12 w-12 shrink-0 object-contain sm:h-14 sm:w-14 md:h-16 md:w-16"
            unoptimized
          />
          <div className="hidden min-w-0 sm:block">
            <span className="block truncate text-xs font-bold tracking-tight text-white md:text-sm">
              REKABETÇİ DENEMELERİ
            </span>
            <span className="block text-[10px] font-medium text-gray-400 md:text-[12px]">
              Analiz Sistemi
            </span>
          </div>
          <span className="block truncate text-xs font-bold tracking-tight text-white sm:hidden">
            REKABETÇİ DENEMELERİ
          </span>
        </Link>
        <nav className="flex flex-shrink-0 items-center gap-2 sm:gap-4">
          <Link
            href={user ? '/' : '/giris'}
            className="rounded-lg px-2 py-2.5 text-xs font-medium text-gray-400 transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-0 sm:py-0 sm:text-sm"
          >
            Ana Sayfa
          </Link>
          {isReady &&
            (user ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-lg bg-dark-lighter px-2.5 py-2 text-xs font-medium text-gray-300 transition hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-3 sm:text-sm"
              >
                Çıkış
              </button>
            ) : (
              <>
                <Link
                  href="/kayit"
                  className="rounded-lg px-2 py-2.5 text-xs font-medium text-gray-400 transition hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-0 sm:py-0 sm:text-sm"
                >
                  Kayıt Ol
                </Link>
                <Link
                  href="/giris"
                  className="rounded-lg bg-primary px-2.5 py-2 text-xs font-medium text-white transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 sm:px-3 sm:text-sm"
                >
                  Giriş Yap
                </Link>
              </>
            ))}
        </nav>
      </div>
    </header>
  )
}

