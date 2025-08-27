import React, { useState } from 'react'
import { LoginForm } from './LoginForm'
import { RegisterForm } from './RegisterForm'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: 'login' | 'register'
}

export function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode)

  if (!isOpen) return null

  const handleSuccess = () => {
    onClose()
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
  }

  return (
    <div style={{position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', zIndex: 50, backdropFilter: 'blur(8px)', minHeight: '100vh'}}>
      <div style={{backgroundColor: 'var(--surface)', borderRadius: '16px', maxWidth: '400px', width: '100%', padding: '32px', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #e2e8f0', margin: 'auto', transform: 'translateY(0)'}}>
        <button
          onClick={onClose}
          style={{position: 'absolute', top: '16px', right: '16px', color: '#94a3b8', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s'}}
          onMouseOver={(e) => {e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.color = '#64748b'}}
          onMouseOut={(e) => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'}}
        >
          <svg style={{width: '20px', height: '20px'}} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div style={{marginBottom: '24px', textAlign: 'center'}}>
          <div style={{width: '48px', height: '48px', backgroundColor: '#2563eb', borderRadius: '12px', margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg style={{width: '24px', height: '24px', color: 'white'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h2 style={{fontSize: '24px', fontWeight: '700', textAlign: 'center', color: '#1a202c', margin: '0 0 8px 0', letterSpacing: '-0.5px'}}>
            {mode === 'login' ? '로그인' : '회원가입'}
          </h2>
          <p style={{textAlign: 'center', color: '#64748b', fontSize: '14px', lineHeight: '1.5', margin: 0}}>
            {mode === 'login' 
              ? '투자 정보와 즐겨찾기를 확인하세요' 
              : '맞춤형 투자 정보를 받아보세요'
            }
          </p>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
        ) : (
          <RegisterForm onSuccess={handleSuccess} onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  )
}