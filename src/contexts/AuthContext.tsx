'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import type { Student } from '@/lib/types'
import { getStudent, MOCK_STUDENTS } from '@/lib/mock-data'

const STORAGE_KEY = 'rekanaliz_student_id'

interface AuthContextType {
  user: Student | null
  login: (no: string, password: string) => boolean
  logout: () => void
  isReady: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Student | null>(null)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
    if (stored) {
      const s = getStudent(stored)
      if (s) setUser(s)
    }
    setIsReady(true)
  }, [])

  const login = useCallback((no: string, password: string): boolean => {
    const student = MOCK_STUDENTS.find((s) => s.no === no)
    if (!student) return false
    if (password !== '1') return false
    setUser(student)
    if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, student.id)
    return true
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, isReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
