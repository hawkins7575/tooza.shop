import React, { useState, useEffect } from 'react'
import { theme } from '../styles/theme'
import { TradingViewHeatmap } from '../components/TradingViewHeatmap'

export function ImportantInfoPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeWidget, setActiveWidget] = useState<'calendar' | 'heatmap'>('calendar')
  
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
              <button
                style={{
                  ...pageStyles.menuItem,
                  ...(activeWidget === 'calendar' ? pageStyles.activeMenuItem : {})
                }}
                onClick={() => setActiveWidget('calendar')}
              >
                📅 경제캘린더
              </button>
              <button
                style={{
                  ...pageStyles.menuItem,
                  ...(activeWidget === 'heatmap' ? pageStyles.activeMenuItem : {})
                }}
                onClick={() => setActiveWidget('heatmap')}
              >
                🇺🇸 미국주식 히트맵
              </button>
              <button
                style={pageStyles.menuItem}
                disabled
              >
                📰 경제뉴스 (준비 중)
              </button>
              <button
                style={pageStyles.menuItem}
                disabled
              >
                📊 거래량분석 (준비 중)
              </button>
            </div>
          </div>
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main style={pageStyles.mainContent}>
          {/* 경제캘린더 위젯 */}
          {activeWidget === 'calendar' && (
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
          )}

          {/* 미국주식 히트맵 위젯 */}
          {activeWidget === 'heatmap' && (
            <>
              <div style={pageStyles.calendarContainer}>
                <div style={{
                  ...pageStyles.calendarWrapper,
                  minHeight: isMobile ? '600px' : '800px'
                }}>
                  <TradingViewHeatmap
                    width="100%"
                    height={isMobile ? "600" : "800"}
                    colorTheme="light"
                    dataSource="SPX500"
                    grouping="sector"
                    blockSize="market_cap_basic"
                    blockColor="change"
                    locale="en"
                    hasTopBar={false}
                    isZoomEnabled={true}
                    hasSymbolTooltip={true}
                  />
                </div>
              </div>

              {/* 히트맵 사용법 안내 */}
              <div style={{
                backgroundColor: theme.colors.neutral[0],
                borderRadius: theme.borderRadius['2xl'],
                border: `1px solid ${theme.colors.neutral[200]}`,
                padding: theme.spacing[6],
                boxShadow: theme.shadows.lg,
              }}>
                <h3 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.bold,
                  color: theme.colors.neutral[800],
                  marginBottom: theme.spacing[4],
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2]
                }}>
                  📋 히트맵 사용법
                </h3>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                  gap: theme.spacing[4],
                  marginBottom: theme.spacing[6]
                }}>
                  {/* 기본 사용법 */}
                  <div style={{
                    padding: theme.spacing[4],
                    backgroundColor: theme.colors.primary[50],
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.primary[200]}`
                  }}>
                    <h4 style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.primary[700],
                      marginBottom: theme.spacing[3],
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2]
                    }}>
                      🎯 기본 조작법
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{color: theme.colors.primary[500], fontWeight: 'bold'}}>•</span>
                        <span><strong>클릭:</strong> 종목 상세정보 확인</span>
                      </li>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{color: theme.colors.primary[500], fontWeight: 'bold'}}>•</span>
                        <span><strong>마우스 오버:</strong> 종목명 및 수익률 표시</span>
                      </li>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{color: theme.colors.primary[500], fontWeight: 'bold'}}>•</span>
                        <span><strong>휠 스크롤:</strong> 확대/축소</span>
                      </li>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{color: theme.colors.primary[500], fontWeight: 'bold'}}>•</span>
                        <span><strong>드래그:</strong> 화면 이동</span>
                      </li>
                    </ul>
                  </div>

                  {/* 색상 해석 */}
                  <div style={{
                    padding: theme.spacing[4],
                    backgroundColor: theme.colors.success[50],
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.success[200]}`
                  }}>
                    <h4 style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.success[700],
                      marginBottom: theme.spacing[3],
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing[2]
                    }}>
                      🎨 색상 의미
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0
                    }}>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#22c55e',
                          borderRadius: '2px'
                        }}></span>
                        <span><strong>초록색:</strong> 상승 (+)</span>
                      </li>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#ef4444',
                          borderRadius: '2px'
                        }}></span>
                        <span><strong>빨간색:</strong> 하락 (-)</span>
                      </li>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{
                          width: '12px',
                          height: '12px',
                          backgroundColor: '#6b7280',
                          borderRadius: '2px'
                        }}></span>
                        <span><strong>회색:</strong> 보합 (0%)</span>
                      </li>
                      <li style={{
                        padding: `${theme.spacing[2]} 0`,
                        color: theme.colors.neutral[600],
                        fontSize: theme.typography.fontSize.sm,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: theme.spacing[2]
                      }}>
                        <span style={{color: theme.colors.success[500], fontWeight: 'bold'}}>📏</span>
                        <span><strong>박스 크기:</strong> 시가총액 비례</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 추가 팁 */}
                <div style={{
                  padding: theme.spacing[4],
                  backgroundColor: theme.colors.accent.purple[50],
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.accent.purple[100]}`
                }}>
                  <h4 style={{
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.accent.purple[700],
                    marginBottom: theme.spacing[3],
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[2]
                  }}>
                    💡 투자 활용 팁
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: theme.spacing[3]
                  }}>
                    <div style={{
                      padding: theme.spacing[3],
                      backgroundColor: theme.colors.neutral[0],
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.neutral[200]}`
                    }}>
                      <div style={{
                        fontSize: theme.typography.fontSize.lg,
                        marginBottom: theme.spacing[1]
                      }}>📊</div>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.neutral[600],
                        fontWeight: theme.typography.fontWeight.medium
                      }}>섹터별 트렌드 파악</div>
                    </div>
                    <div style={{
                      padding: theme.spacing[3],
                      backgroundColor: theme.colors.neutral[0],
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.neutral[200]}`
                    }}>
                      <div style={{
                        fontSize: theme.typography.fontSize.lg,
                        marginBottom: theme.spacing[1]
                      }}>🔍</div>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.neutral[600],
                        fontWeight: theme.typography.fontWeight.medium
                      }}>강세/약세 종목 발굴</div>
                    </div>
                    <div style={{
                      padding: theme.spacing[3],
                      backgroundColor: theme.colors.neutral[0],
                      borderRadius: theme.borderRadius.md,
                      border: `1px solid ${theme.colors.neutral[200]}`
                    }}>
                      <div style={{
                        fontSize: theme.typography.fontSize.lg,
                        marginBottom: theme.spacing[1]
                      }}>⚖️</div>
                      <div style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.neutral[600],
                        fontWeight: theme.typography.fontWeight.medium
                      }}>포트폴리오 균형 조정</div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}