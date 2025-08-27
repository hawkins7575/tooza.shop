import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { AuthModal } from '../auth/AuthModal'
import { theme } from '../../styles/theme'
import { styles } from '../../styles/components'

export function Header() {
  const { user, signOut, isAdmin } = useAuth()
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    console.log('🔽 Header: 로그아웃 버튼 클릭')
    
    try {
      await signOut()
      console.log('🔽 Header: 로그아웃 성공')
    } catch (error) {
      console.error('🔽 Header: 로그아웃 실패:', error)
      alert('로그아웃 중 오류가 발생했습니다.')
    } finally {
      setIsSigningOut(false)
    }
  }

  // 스타일 정의
  const headerStyles = {
    header: {
      backgroundColor: `rgba(${parseInt(theme.colors.neutral[0].slice(1, 3), 16)}, ${parseInt(theme.colors.neutral[0].slice(3, 5), 16)}, ${parseInt(theme.colors.neutral[0].slice(5, 7), 16)}, 0.95)`,
      boxShadow: theme.shadows.lg,
      borderBottom: `1px solid ${theme.colors.neutral[200]}`,
      backdropFilter: 'blur(20px)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
      transition: `all ${theme.animation.duration.normal} ${theme.animation.easing.smooth}`,
    },
    container: {
      maxWidth: theme.components.container.maxWidth,
      margin: theme.components.container.margin,
      padding: `0 ${theme.spacing[8]}`,
    },
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '80px',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
    },
    logoLink: {
      textDecoration: 'none',
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
    },
    logoText: {
      fontSize: theme.typography.fontSize['2xl'],
      fontWeight: theme.typography.fontWeight.bold,
      fontFamily: theme.typography.fontFamily.display.join(', '),
      color: theme.colors.neutral[900],
      margin: 0,
      letterSpacing: theme.typography.letterSpacing.tight,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    logoIcon: {
      fontSize: theme.typography.fontSize['3xl'],
      background: theme.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    navigation: {
      display: 'flex',
      gap: theme.spacing[2],
      alignItems: 'center',
    },
    navLink: {
      ...styles.navLink,
      fontWeight: theme.typography.fontWeight.semibold,
      fontSize: theme.typography.fontSize.base,
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[4],
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
      background: theme.gradients.primarySoft,
      borderRadius: theme.borderRadius['2xl'],
      border: `1px solid ${theme.colors.primary[200]}`,
    },
    statusDot: {
      width: '10px',
      height: '10px',
      backgroundColor: theme.colors.success[500],
      borderRadius: theme.borderRadius.full,
      boxShadow: `0 0 0 2px ${theme.colors.success[100]}`,
    },
    userName: {
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.primary[700],
      fontWeight: theme.typography.fontWeight.semibold,
    },
    authButtons: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
  }

  return (
    <header role="banner" style={headerStyles.header}>
      <div style={headerStyles.container}>
        <div style={headerStyles.nav}>
          {/* 로고 */}
          <div style={headerStyles.logo}>
            <a 
              href="/" 
              style={headerStyles.logoLink}
              aria-label="Finance Link 홈페이지로 이동"
            >
              <h1 style={headerStyles.logoText}>
                <span style={headerStyles.logoIcon} aria-hidden="true">📊</span>
                Finance Link
              </h1>
            </a>
          </div>

          {/* 주요 네비게이션 */}
          <nav role="navigation" aria-label="주요 메뉴" style={headerStyles.navigation}>
            <a href="/" className="btn btn-ghost">홈</a>
            <a href="/important-info" className="btn btn-ghost">주요정보</a>
            <a href="/boards" className="btn btn-ghost">게시판</a>
            <a href="/blog" className="btn btn-ghost">블로그</a>
            {user && (
              <button
                onClick={() => window.location.href = '/dashboard'}
                className="btn btn-ghost"
              >
                대시보드
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => window.location.href = '/admin'}
                className="btn btn-ghost"
                style={{ color: theme.colors.warning[600] }}
              >
                관리자
              </button>
            )}
          </nav>

          {/* 사용자 메뉴 */}
          <div style={headerStyles.userSection}>
            {user ? (
              <div style={headerStyles.userSection}>
                <div style={headerStyles.userInfo}>
                  <div style={headerStyles.statusDot}></div>
                  <span style={headerStyles.userName}>
                    {user.user_metadata?.username || user.email?.split('@')[0]}님
                  </span>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                  className={`btn ${isSigningOut ? 'btn-secondary' : 'btn-secondary'}`}
                  style={isSigningOut ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                >
                  {isSigningOut ? '로그아웃 중...' : '로그아웃'}
                </button>
              </div>
            ) : (
              <div style={headerStyles.authButtons}>
                <button
                  onClick={() => handleAuthClick('login')}
                  className="btn btn-ghost"
                >
                  로그인
                </button>
                <button
                  onClick={() => handleAuthClick('register')}
                  className="btn btn-primary"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </header>
  )
}