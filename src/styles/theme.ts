// 현대적이고 세련된 디자인 시스템 및 테마 정의
export const theme = {
  colors: {
    // Primary Colors - 모던 블루 그라데이션 브랜드 컬러
    primary: {
      25: '#fbfcff',
      50: '#f0f4ff',
      100: '#e0edff',
      200: '#c7dbff',
      300: '#a4c1ff',
      400: '#7d9dff',
      500: '#5b7bff',
      600: '#4d61f5',
      700: '#424ae6',
      800: '#3539d1',
      900: '#2d2fa7',
      950: '#1e1f5c',
    },
    
    // Neutral Colors - 따뜻한 그레이스케일
    neutral: {
      0: '#ffffff',
      25: '#fdfdfd',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    
    // Accent Colors - 보조 색상
    accent: {
      purple: {
        50: '#faf5ff',
        100: '#f3e8ff',
        500: '#a855f7',
        600: '#9333ea',
        700: '#7c3aed',
      },
      emerald: {
        50: '#ecfdf5',
        100: '#d1fae5',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
      },
      orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
      }
    },
    
    // Semantic Colors - 의미론적 색상
    success: {
      25: '#f6fef9',
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
    
    warning: {
      25: '#fffcf5',
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
    
    error: {
      25: '#fffbfa',
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    
    info: {
      25: '#f8fafc',
      50: '#f1f5f9',
      100: '#e2e8f0',
      200: '#cbd5e1',
      300: '#94a3b8',
      400: '#64748b',
      500: '#475569',
      600: '#334155',
      700: '#1e293b',
      800: '#0f172a',
      900: '#020617',
      950: '#02050a',
    }
  },

  // 그라데이션 정의
  gradients: {
    primary: 'linear-gradient(135deg, #5b7bff 0%, #4d61f5 50%, #424ae6 100%)',
    primarySoft: 'linear-gradient(135deg, #f0f4ff 0%, #e0edff 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    glass: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    overlay: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%)',
  },
  
  typography: {
    fontFamily: {
      sans: ['Inter', 'Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      mono: ['JetBrains Mono', 'SF Mono', 'Monaco', 'Fira Code', 'Roboto Mono', 'monospace'],
      display: ['Inter Display', 'Inter', 'Pretendard', 'system-ui', 'sans-serif'],
    },
    
    fontSize: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
      '8xl': '6rem',      // 96px
      '9xl': '8rem',      // 128px
    },
    
    fontWeight: {
      thin: 100,
      extralight: 200,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    }
  },
  
  spacing: {
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    18: '4.5rem',     // 72px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
  },
  
  borderRadius: {
    none: '0',
    xs: '0.125rem',   // 2px
    sm: '0.25rem',    // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.5rem',  // 24px
    '4xl': '2rem',    // 32px
    full: '9999px',
  },
  
  // 현대적인 그림자 시스템
  shadows: {
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)',
    // 컬러 그림자
    primary: '0 10px 15px -3px rgba(91, 123, 255, 0.2), 0 4px 6px -4px rgba(91, 123, 255, 0.2)',
    success: '0 10px 15px -3px rgba(16, 185, 129, 0.2), 0 4px 6px -4px rgba(16, 185, 129, 0.2)',
    warning: '0 10px 15px -3px rgba(245, 158, 11, 0.2), 0 4px 6px -4px rgba(245, 158, 11, 0.2)',
    error: '0 10px 15px -3px rgba(239, 68, 68, 0.2), 0 4px 6px -4px rgba(239, 68, 68, 0.2)',
  },

  // 애니메이션 및 트랜지션
  animation: {
    duration: {
      fastest: '0.1s',
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
      slowest: '0.8s',
    },
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    }
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  
  // 컴포넌트별 스타일 정의
  components: {
    // 컨테이너
    container: {
      xs: '100%',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1400px',
      maxWidth: '1400px',
      margin: '0 auto',
      padding: {
        mobile: '0 1rem',
        desktop: '0 2rem',
      }
    },
    
    // 카드 컴포넌트
    card: {
      base: {
        backgroundColor: '#ffffff',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        border: '1px solid #e5e5e5',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      elevated: {
        backgroundColor: '#ffffff',
        borderRadius: '1.25rem',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        border: 'none',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '1rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }
    },
    
    // 버튼 컴포넌트
    button: {
      primary: {
        base: {
          background: 'linear-gradient(135deg, #5b7bff 0%, #4d61f5 100%)',
          color: '#ffffff',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          boxShadow: '0 4px 6px -1px rgba(91, 123, 255, 0.3)',
          transform: 'translateY(0px)',
        },
        hover: {
          background: 'linear-gradient(135deg, #424ae6 0%, #3539d1 100%)',
          boxShadow: '0 8px 15px -3px rgba(91, 123, 255, 0.4)',
          transform: 'translateY(-2px)',
        },
        disabled: {
          background: '#a3a3a3',
          cursor: 'not-allowed',
          boxShadow: 'none',
          transform: 'translateY(0px)',
        }
      },
      
      secondary: {
        base: {
          backgroundColor: '#ffffff',
          color: '#404040',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          border: '2px solid #e5e5e5',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          transform: 'translateY(0px)',
        },
        hover: {
          backgroundColor: '#fafafa',
          color: '#171717',
          borderColor: '#d4d4d4',
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        }
      },

      ghost: {
        base: {
          backgroundColor: 'transparent',
          color: '#525252',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.75rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        },
        hover: {
          backgroundColor: '#f5f5f5',
          color: '#171717',
        }
      }
    },

    // 입력 필드
    input: {
      base: {
        padding: '0.75rem 1rem',
        borderRadius: '0.75rem',
        fontSize: '0.875rem',
        border: '2px solid #e5e5e5',
        backgroundColor: '#ffffff',
        transition: 'all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        outline: 'none',
      },
      focus: {
        borderColor: '#5b7bff',
        boxShadow: '0 0 0 3px rgba(91, 123, 255, 0.1)',
      },
      error: {
        borderColor: '#ef4444',
        boxShadow: '0 0 0 3px rgba(239, 68, 68, 0.1)',
      }
    }
  }
}

// CSS Variables 생성 함수
export const createCSSVariables = () => {
  return `
    :root {
      /* Primary Colors */
      --color-primary-50: ${theme.colors.primary[50]};
      --color-primary-100: ${theme.colors.primary[100]};
      --color-primary-500: ${theme.colors.primary[500]};
      --color-primary-600: ${theme.colors.primary[600]};
      --color-primary-700: ${theme.colors.primary[700]};
      
      /* Neutral Colors */
      --color-neutral-0: ${theme.colors.neutral[0]};
      --color-neutral-25: ${theme.colors.neutral[25]};
      --color-neutral-50: ${theme.colors.neutral[50]};
      --color-neutral-100: ${theme.colors.neutral[100]};
      --color-neutral-200: ${theme.colors.neutral[200]};
      --color-neutral-300: ${theme.colors.neutral[300]};
      --color-neutral-400: ${theme.colors.neutral[400]};
      --color-neutral-500: ${theme.colors.neutral[500]};
      --color-neutral-600: ${theme.colors.neutral[600]};
      --color-neutral-700: ${theme.colors.neutral[700]};
      --color-neutral-800: ${theme.colors.neutral[800]};
      --color-neutral-900: ${theme.colors.neutral[900]};
      
      /* Semantic Colors */
      --color-success-50: ${theme.colors.success[50]};
      --color-success-500: ${theme.colors.success[500]};
      --color-success-600: ${theme.colors.success[600]};
      --color-warning-50: ${theme.colors.warning[50]};
      --color-warning-500: ${theme.colors.warning[500]};
      --color-error-50: ${theme.colors.error[50]};
      --color-error-500: ${theme.colors.error[500]};
      
      /* Gradients */
      --gradient-primary: ${theme.gradients.primary};
      --gradient-primary-soft: ${theme.gradients.primarySoft};
      --gradient-glass: ${theme.gradients.glass};
      
      /* Typography */
      --font-family-sans: ${theme.typography.fontFamily.sans.join(', ')};
      --font-family-display: ${theme.typography.fontFamily.display.join(', ')};
      --font-size-xs: ${theme.typography.fontSize.xs};
      --font-size-sm: ${theme.typography.fontSize.sm};
      --font-size-base: ${theme.typography.fontSize.base};
      --font-size-lg: ${theme.typography.fontSize.lg};
      --font-size-xl: ${theme.typography.fontSize.xl};
      --font-size-2xl: ${theme.typography.fontSize['2xl']};
      --font-size-3xl: ${theme.typography.fontSize['3xl']};
      --font-size-4xl: ${theme.typography.fontSize['4xl']};
      
      /* Spacing */
      --spacing-1: ${theme.spacing[1]};
      --spacing-2: ${theme.spacing[2]};
      --spacing-3: ${theme.spacing[3]};
      --spacing-4: ${theme.spacing[4]};
      --spacing-5: ${theme.spacing[5]};
      --spacing-6: ${theme.spacing[6]};
      --spacing-8: ${theme.spacing[8]};
      --spacing-10: ${theme.spacing[10]};
      --spacing-12: ${theme.spacing[12]};
      --spacing-16: ${theme.spacing[16]};
      
      /* Border Radius */
      --border-radius-sm: ${theme.borderRadius.sm};
      --border-radius-md: ${theme.borderRadius.md};
      --border-radius-lg: ${theme.borderRadius.lg};
      --border-radius-xl: ${theme.borderRadius.xl};
      --border-radius-2xl: ${theme.borderRadius['2xl']};
      --border-radius-3xl: ${theme.borderRadius['3xl']};
      --border-radius-full: ${theme.borderRadius.full};
      
      /* Shadows */
      --shadow-xs: ${theme.shadows.xs};
      --shadow-sm: ${theme.shadows.sm};
      --shadow-base: ${theme.shadows.base};
      --shadow-md: ${theme.shadows.md};
      --shadow-lg: ${theme.shadows.lg};
      --shadow-xl: ${theme.shadows.xl};
      --shadow-primary: ${theme.shadows.primary};
      
      /* Animation */
      --duration-fast: ${theme.animation.duration.fast};
      --duration-normal: ${theme.animation.duration.normal};
      --duration-slow: ${theme.animation.duration.slow};
      --easing-smooth: ${theme.animation.easing.smooth};
      --easing-spring: ${theme.animation.easing.spring};
    }
  `;
}

// 반응형 헬퍼 함수
export const mediaQuery = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
  '2xl': `@media (min-width: ${theme.breakpoints['2xl']})`,
}