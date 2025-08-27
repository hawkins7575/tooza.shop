import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

interface LoginFormProps {
  onSuccess?: () => void
  onToggleMode?: () => void
}

export function LoginForm({ onSuccess, onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        onSuccess?.()
      }
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{width: '100%'}}>
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
        <div>
          <label htmlFor="email" style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px'}}>
            이메일 주소
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{display: 'block', width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease', backgroundColor: '#f8fafc'}}
            placeholder="example@email.com"
            onFocus={(e) => {e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'}}
            onBlur={(e) => {e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'}}
          />
        </div>

        <div>
          <label htmlFor="password" style={{display: 'block', fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px'}}>
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{display: 'block', width: '100%', padding: '12px 16px', border: '2px solid #e2e8f0', borderRadius: '12px', fontSize: '16px', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s ease', backgroundColor: '#f8fafc'}}
            placeholder="비밀번호 입력"
            onFocus={(e) => {e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'}}
            onBlur={(e) => {e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none'}}
          />
        </div>

        {error && (
          <div style={{color: '#ef4444', fontSize: '14px', backgroundColor: '#fef2f2', padding: '12px 16px', borderRadius: '12px', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '8px'}}>
            <svg style={{width: '16px', height: '16px', color: '#ef4444'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{width: '100%', backgroundColor: loading ? '#94a3b8' : '#2563eb', color: 'white', padding: '14px 16px', borderRadius: '12px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '16px', transition: 'all 0.2s ease', boxShadow: loading ? 'none' : '0 4px 12px rgba(37, 99, 235, 0.3)'}}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#1d4ed8'
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(37, 99, 235, 0.4)'
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)'
            }
          }}
        >
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div style={{textAlign: 'center', marginTop: '16px'}}>
          <span style={{color: '#64748b', fontSize: '14px'}}>계정이 없으신가요? </span>
          <button
            type="button"
            onClick={onToggleMode}
            style={{color: '#2563eb', fontSize: '14px', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', fontWeight: '600', textDecoration: 'none'}}
            onMouseOver={(e) => {e.currentTarget.style.color = '#1d4ed8'; e.currentTarget.style.textDecoration = 'underline'}}
            onMouseOut={(e) => {e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.textDecoration = 'none'}}
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  )
}