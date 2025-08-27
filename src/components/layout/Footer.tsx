import React from 'react'
import { theme } from '../../styles/theme'

export function Footer() {
  const currentYear = new Date().getFullYear()

  // 심플한 푸터 스타일 정의
  const footerStyles = {
    footer: {
      background: `linear-gradient(135deg, ${theme.colors.neutral[900]} 0%, ${theme.colors.neutral[950]} 100%)`,
      color: theme.colors.neutral[100],
      marginTop: theme.spacing[20],
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    container: {
      maxWidth: theme.components.container.maxWidth,
      margin: theme.components.container.margin,
      padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
      position: 'relative' as const,
      zIndex: 1,
    },
    content: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap' as const,
      gap: theme.spacing[6],
      paddingBottom: theme.spacing[4],
      borderBottom: `1px solid ${theme.colors.neutral[700]}`,
    },
    leftSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[6],
    },
    rightSection: {
      display: 'flex',
      gap: theme.spacing[6],
    },
    brandTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      fontSize: theme.typography.fontSize.xl,
      fontWeight: theme.typography.fontWeight.bold,
      fontFamily: theme.typography.fontFamily.display.join(', '),
      color: theme.colors.neutral[0],
      margin: 0,
    },
    brandIcon: {
      fontSize: theme.typography.fontSize['2xl'],
      background: theme.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    socialSection: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[3],
    },
    socialLink: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: theme.borderRadius.lg,
      backgroundColor: theme.colors.neutral[800],
      color: theme.colors.neutral[300],
      textDecoration: 'none',
      fontSize: theme.typography.fontSize.base,
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
    },
    navLink: {
      color: theme.colors.neutral[300],
      textDecoration: 'none',
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
    },
    disclaimer: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.neutral[400],
      textAlign: 'center' as const,
      paddingTop: theme.spacing[4],
      lineHeight: theme.typography.lineHeight.relaxed,
      margin: 0,
    },
    copyright: {
      fontSize: theme.typography.fontSize.xs,
      color: theme.colors.neutral[500],
      textAlign: 'center' as const,
      paddingTop: theme.spacing[2],
      margin: 0,
    },
    decorativeElements: {
      position: 'absolute' as const,
      top: theme.spacing[8],
      right: theme.spacing[8],
      width: '120px',
      height: '120px',
      background: theme.gradients.primarySoft,
      borderRadius: theme.borderRadius.full,
      opacity: 0.1,
      filter: 'blur(40px)',
      pointerEvents: 'none' as const,
    },
  }

  const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, isHover: boolean) => {
    if (e.currentTarget.dataset.type === 'social') {
      e.currentTarget.style.backgroundColor = isHover ? theme.colors.primary[500] : theme.colors.neutral[800]
      e.currentTarget.style.color = isHover ? theme.colors.neutral[0] : theme.colors.neutral[300]
      e.currentTarget.style.transform = isHover ? 'translateY(-2px)' : 'translateY(0)'
    } else {
      e.currentTarget.style.color = isHover ? theme.colors.primary[400] : theme.colors.neutral[300]
    }
  }

  return (
    <footer style={footerStyles.footer}>
      {/* 장식 요소 */}
      <div style={footerStyles.decorativeElements} />
      
      <div style={footerStyles.container}>
        <div style={footerStyles.content}>
          {/* 로고와 소셜 링크 */}
          <div style={footerStyles.leftSection}>
            <h3 style={footerStyles.brandTitle}>
              <span style={footerStyles.brandIcon}>📊</span>
              Finance Link
            </h3>
            <div style={footerStyles.socialSection}>
              <a 
                href="mailto:daesung75@naver.com"
                style={footerStyles.socialLink}
                data-type="social"
                onMouseOver={(e) => handleHover(e, true)}
                onMouseOut={(e) => handleHover(e, false)}
                title="문의하기"
              >
                📧
              </a>
            </div>
          </div>

          {/* 애드센스 필수 정책 링크 */}
          <div style={footerStyles.rightSection}>
            <a 
              href="/about" 
              style={footerStyles.navLink}
              onMouseOver={(e) => handleHover(e, true)}
              onMouseOut={(e) => handleHover(e, false)}
            >
              서비스 소개
            </a>
            <a 
              href="/terms" 
              style={footerStyles.navLink}
              onMouseOver={(e) => handleHover(e, true)}
              onMouseOut={(e) => handleHover(e, false)}
            >
              이용약관
            </a>
            <a 
              href="/privacy" 
              style={footerStyles.navLink}
              onMouseOver={(e) => handleHover(e, true)}
              onMouseOut={(e) => handleHover(e, false)}
            >
              개인정보처리방침
            </a>
          </div>
        </div>
        
        {/* 투자 면책사항 및 저작권 */}
        <div style={footerStyles.disclaimer}>
          본 사이트는 투자 정보 제공 목적의 서비스입니다. 모든 투자 결정은 개인의 판단과 책임하에 이루어져야 합니다.
        </div>
        <div style={footerStyles.copyright}>
          © {currentYear} Finance Link. All rights reserved.
        </div>
      </div>
    </footer>
  )
}