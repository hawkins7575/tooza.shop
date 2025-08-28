import React, { useState, useEffect } from 'react'
import { theme } from '../styles/theme'

export function ImportantInfoPage() {
  const [isMobile, setIsMobile] = useState(false)
  // 경제캘린더만 사용하므로 상태 관리 단순화
  
  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pageStyles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.neutral[25]} 0%, ${theme.colors.neutral[50]} 50%, ${theme.colors.primary[25]} 100%)`,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    contentWrapper: {
      maxWidth: theme.components.container.maxWidth,
      margin: theme.components.container.margin,
      padding: `${theme.spacing[6]} ${theme.spacing[6]}`,
      display: 'flex',
      gap: theme.spacing[8],
      flexDirection: isMobile ? 'column' as const : 'row' as const,
      position: 'relative' as const,
      zIndex: 1,
    },
    sidebar: {
      width: isMobile ? '100%' : '320px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing[6],
    },
    menuPanel: {
      backgroundColor: theme.colors.neutral[0],
      borderRadius: theme.borderRadius['2xl'],
      border: `1px solid ${theme.colors.neutral[200]}`,
      padding: theme.spacing[6],
      boxShadow: theme.shadows.lg,
    },
    menuTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.neutral[800],
      marginBottom: theme.spacing[4],
    },
    menuList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing[2],
    },
    menuItem: {
      display: 'block',
      padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
      borderRadius: theme.borderRadius.lg,
      textDecoration: 'none',
      color: theme.colors.neutral[700],
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
    },
    activeMenuItem: {
      backgroundColor: theme.colors.primary[100],
      color: theme.colors.primary[700],
    },
    mainContent: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing[8],
    },
    calendarContainer: {
      backgroundColor: theme.colors.neutral[0],
      borderRadius: theme.borderRadius['2xl'],
      border: `1px solid ${theme.colors.neutral[200]}`,
      padding: theme.spacing[6],
      boxShadow: theme.shadows.lg,
      overflow: 'hidden',
    },
    calendarWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    iframe: {
      width: '100%',
      minHeight: '600px',
      border: 'none',
      borderRadius: theme.borderRadius.lg,
    },
    backgroundDecoration: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.4,
      pointerEvents: 'none' as const,
      background: `radial-gradient(circle at 20% 20%, ${theme.colors.primary[100]} 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, ${theme.colors.accent.purple[100]} 0%, transparent 50%),
                  radial-gradient(circle at 60% 40%, ${theme.colors.success[100]} 0%, transparent 50%)`,
    },
  }

  return (
    <div style={pageStyles.container}>
      {/* 배경 장식 */}
      <div style={pageStyles.backgroundDecoration} />
      
      {/* 메인 콘텐츠 */}
      <div style={pageStyles.contentWrapper}>
        {/* 사이드바 */}
        <aside style={pageStyles.sidebar}>
          {/* 메뉴 패널 */}
          <div style={pageStyles.menuPanel}>
            <h2 style={pageStyles.menuTitle}>📊 주요정보</h2>
            <div style={pageStyles.menuList}>
              <div style={{
                ...pageStyles.menuItem,
                ...pageStyles.activeMenuItem,
                cursor: 'default'
              }}>
                📅 경제캘린더
              </div>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main style={pageStyles.mainContent}>
          {/* 경제캘린더 위젯 */}
          <div style={pageStyles.calendarContainer}>
            <div style={pageStyles.calendarWrapper}>
              <iframe
                src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=today&timeZone=21&lang=18"
                style={pageStyles.iframe}
                title="경제캘린더"
                allowTransparency={true}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}