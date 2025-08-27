import { theme } from './theme'

// 현대적이고 세련된 컴포넌트 스타일 정의
export const styles = {
  // 페이지 컨테이너
  pageContainer: {
    maxWidth: theme.components.container.maxWidth,
    margin: theme.components.container.margin,
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${theme.colors.neutral[25]} 0%, ${theme.colors.neutral[50]} 100%)`,
    position: 'relative' as const,
  },
  
  // 섹션 컨테이너
  sectionContainer: {
    maxWidth: theme.components.container.maxWidth,
    margin: theme.components.container.margin,
    padding: `${theme.spacing[8]} ${theme.spacing[6]}`,
  },
  
  // 카드 스타일 - 모던한 디자인
  card: {
    ...theme.components.card.base,
    padding: theme.spacing[8],
    marginBottom: theme.spacing[8],
    position: 'relative' as const,
  },
  
  cardElevated: {
    ...theme.components.card.elevated,
    padding: theme.spacing[8],
    marginBottom: theme.spacing[8],
    position: 'relative' as const,
  },
  
  cardGlass: {
    ...theme.components.card.glass,
    padding: theme.spacing[8],
    marginBottom: theme.spacing[8],
    position: 'relative' as const,
  },
  
  cardHover: {
    ...theme.components.card.base,
    padding: theme.spacing[8],
    marginBottom: theme.spacing[8],
    cursor: 'pointer',
    position: 'relative' as const,
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: theme.shadows.xl,
      borderColor: theme.colors.primary[300],
    }
  },
  
  // 헤더 스타일 - 현대적인 타이포그래피
  pageHeader: {
    textAlign: 'center' as const,
    marginBottom: theme.spacing[16],
    padding: `${theme.spacing[12]} 0`,
    position: 'relative' as const,
  },
  
  pageTitle: {
    fontSize: theme.typography.fontSize['5xl'],
    fontWeight: theme.typography.fontWeight.extrabold,
    fontFamily: theme.typography.fontFamily.display.join(', '),
    background: theme.gradients.primary,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: theme.spacing[6],
    lineHeight: theme.typography.lineHeight.tight,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  
  pageSubtitle: {
    fontSize: theme.typography.fontSize.xl,
    color: theme.colors.neutral[600],
    lineHeight: theme.typography.lineHeight.relaxed,
    maxWidth: '700px',
    margin: '0 auto',
    fontWeight: theme.typography.fontWeight.medium,
  },
  
  // 섹션 헤더
  sectionTitle: {
    fontSize: theme.typography.fontSize['3xl'],
    fontWeight: theme.typography.fontWeight.bold,
    fontFamily: theme.typography.fontFamily.display.join(', '),
    color: theme.colors.neutral[900],
    marginBottom: theme.spacing[8],
    lineHeight: theme.typography.lineHeight.tight,
    letterSpacing: theme.typography.letterSpacing.tight,
    position: 'relative' as const,
  },
  
  // 버튼 스타일 - 현대적인 인터랙티브 디자인
  buttonPrimary: {
    ...theme.components.button.primary.base,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    textDecoration: 'none',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    '&:hover': theme.components.button.primary.hover,
    '&:disabled': theme.components.button.primary.disabled,
  },
  
  buttonSecondary: {
    ...theme.components.button.secondary.base,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    textDecoration: 'none',
    position: 'relative' as const,
    '&:hover': theme.components.button.secondary.hover,
  },

  buttonGhost: {
    ...theme.components.button.ghost.base,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing[2],
    textDecoration: 'none',
    '&:hover': theme.components.button.ghost.hover,
  },
  
  // 입력 필드 - 현대적인 폼 디자인
  inputField: {
    ...theme.components.input.base,
    width: '100%',
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    '&:focus': theme.components.input.focus,
    '&.error': theme.components.input.error,
  },
  
  // 텍스트 에리어
  textArea: {
    width: '100%',
    padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
    border: `1px solid ${theme.colors.neutral[300]}`,
    borderRadius: theme.borderRadius.lg,
    fontSize: theme.typography.fontSize.base,
    lineHeight: theme.typography.lineHeight.relaxed,
    backgroundColor: theme.colors.neutral[0],
    resize: 'vertical' as const,
    minHeight: '120px',
    fontFamily: theme.typography.fontFamily.sans.join(', '),
    transition: 'all 0.2s ease',
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary[500],
      boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`,
    }
  },
  
  // 라벨
  label: {
    display: 'block',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing[2],
  },
  
  // 네비게이션
  navLink: {
    color: theme.colors.neutral[600],
    textDecoration: 'none',
    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    borderRadius: theme.borderRadius.lg,
    transition: 'all 0.2s ease',
    '&:hover': {
      color: theme.colors.neutral[900],
      backgroundColor: theme.colors.neutral[100],
    }
  },
  
  navLinkActive: {
    color: theme.colors.primary[600],
    backgroundColor: theme.colors.primary[50],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  
  // 그리드 레이아웃 - 반응형 개선
  grid: {
    display: 'grid',
    gap: theme.spacing[8],
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    alignItems: 'start',
  },
  
  gridTight: {
    display: 'grid',
    gap: theme.spacing[6],
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    alignItems: 'start',
  },

  gridCompact: {
    display: 'grid',
    gap: theme.spacing[4],
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    alignItems: 'start',
  },
  
  // 테이블 스타일
  table: {
    width: '100%',
    backgroundColor: theme.colors.neutral[0],
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.neutral[200]}`,
  },
  
  tableHeader: {
    backgroundColor: theme.colors.neutral[50],
    padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[700],
    borderBottom: `1px solid ${theme.colors.neutral[200]}`,
  },
  
  tableRow: {
    padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
    borderBottom: `1px solid ${theme.colors.neutral[100]}`,
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.colors.neutral[50],
    },
    '&:last-child': {
      borderBottom: 'none',
    }
  },
  
  // 뱃지/태그 - 현대적인 디자인
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.neutral[100],
    color: theme.colors.neutral[700],
    border: `1px solid ${theme.colors.neutral[200]}`,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
  },
  
  badgePrimary: {
    background: theme.gradients.primarySoft,
    color: theme.colors.primary[700],
    border: `1px solid ${theme.colors.primary[200]}`,
  },
  
  badgeSuccess: {
    backgroundColor: theme.colors.success[50],
    color: theme.colors.success[700],
    border: `1px solid ${theme.colors.success[200]}`,
  },

  badgeWarning: {
    backgroundColor: theme.colors.warning[50],
    color: theme.colors.warning[700],
    border: `1px solid ${theme.colors.warning[200]}`,
  },

  badgeError: {
    backgroundColor: theme.colors.error[50],
    color: theme.colors.error[700],
    border: `1px solid ${theme.colors.error[200]}`,
  },
  
  // 로딩 상태 - 현대적인 애니메이션
  loading: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${theme.spacing[16]} 0`,
    color: theme.colors.neutral[500],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    gap: theme.spacing[4],
  },
  
  loadingSpinner: {
    width: '2.5rem',
    height: '2.5rem',
    border: `3px solid ${theme.colors.neutral[200]}`,
    borderTop: `3px solid ${theme.colors.primary[500]}`,
    borderRadius: theme.borderRadius.full,
    animation: 'spin 1s linear infinite',
  },

  loadingDots: {
    display: 'flex',
    gap: theme.spacing[1],
    alignItems: 'center',
  },
  
  // 빈 상태 - 개선된 UX
  emptyState: {
    textAlign: 'center' as const,
    padding: `${theme.spacing[20]} ${theme.spacing[6]}`,
    color: theme.colors.neutral[500],
    maxWidth: '500px',
    margin: '0 auto',
  },
  
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: theme.spacing[6],
    opacity: 0.6,
    filter: 'grayscale(20%)',
  },
  
  emptyStateTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.neutral[700],
    marginBottom: theme.spacing[3],
    lineHeight: theme.typography.lineHeight.snug,
  },
  
  emptyStateText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.neutral[500],
    lineHeight: theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing[6],
  },

  emptyStateAction: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[2],
    color: theme.colors.primary[600],
    textDecoration: 'none',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
    '&:hover': {
      color: theme.colors.primary[700],
    }
  },

  // 구분선
  divider: {
    height: '1px',
    backgroundColor: theme.colors.neutral[200],
    border: 'none',
    margin: `${theme.spacing[8]} 0`,
  },

  dividerVertical: {
    width: '1px',
    backgroundColor: theme.colors.neutral[200],
    border: 'none',
    margin: `0 ${theme.spacing[4]}`,
    alignSelf: 'stretch',
  },
}

// 확장된 반응형 유틸리티
export const responsive = {
  xs: `@media (max-width: ${theme.breakpoints.sm})`,
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
  mobile: `@media (max-width: ${theme.breakpoints.md})`,
  tablet: `@media (min-width: ${theme.breakpoints.md}) and (max-width: ${theme.breakpoints.lg})`,
  desktop: `@media (min-width: ${theme.breakpoints.lg})`,
  
  // 세밀한 제어를 위한 커스텀 브레이크포인트
  'mobile-sm': '@media (max-width: 480px)',
  'mobile-md': '@media (max-width: 640px)',
  'tablet-portrait': '@media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait)',
  'tablet-landscape': '@media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape)',
}

// 애니메이션 헬퍼
export const animations = {
  fadeIn: 'fadeIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  slideUp: 'slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  scaleIn: 'scaleIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  slideUpStagger: (delay: number) => `slideUp 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
}