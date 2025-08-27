import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isAdmin: boolean
  signUp: (email: string, password: string, username: string) => Promise<any>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  
  // 관리자 권한 체크 - 환경 변수 기반으로 개선
  const adminEmails = (process.env.REACT_APP_ADMIN_EMAILS || 'daesung75@naver.com')
    .split(',')
    .map(email => email.trim())
  
  const isAdmin = user ? (
    // Supabase role 기반 권한 (우선)
    user.app_metadata?.role === 'admin' ||
    // 이메일 기반 권한 (백업)
    adminEmails.includes(user.email || '')
  ) : false

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    // 초기 세션 확인
    const getInitialSession = async () => {
      if (!supabase) return
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }
    
    getInitialSession()

    // 인증 상태 변화 감지 - supabase가 있을 때만
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log('🔥 Auth event:', event)
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )
      
      return () => subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, username: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }
    }
    
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    })
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: { message: 'Supabase가 설정되지 않았습니다.' } }
    }
    
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  }

  const signOut = async () => {
    if (!supabase) {
      setUser(null)
      setSession(null)
      return
    }
    
    console.log('🚪 로그아웃 시작')
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('❌ 로그아웃 오류:', error)
      throw error
    }
    
    // 로그아웃 성공 시 즉시 상태 초기화 (onAuthStateChange 대기하지 않음)
    setUser(null)
    setSession(null)
    console.log('✅ 로그아웃 완료')
  }

  const value = {
    user,
    session,
    loading,
    isAdmin,
    signUp,
    signIn,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}