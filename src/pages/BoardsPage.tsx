import React from 'react'
import { theme } from '../styles/theme'
import { styles } from '../styles/components'

const BOARDS = [
  {
    type: 'free',
    title: '자유게시판',
    description: '자유롭게 이야기를 나누어보세요',
    icon: '💬',
    color: '#3b82f6'
  },
  {
    type: 'investment',
    title: '투자정보',
    description: '투자 정보와 경험을 공유해보세요',
    icon: '📈',
    color: '#10b981'
  },
  {
    type: 'qna',
    title: '질문답변',
    description: '궁금한 점을 질문하고 답변을 받아보세요',
    icon: '❓',
    color: '#f59e0b'
  },
  {
    type: 'notice',
    title: '공지사항',
    description: '중요한 공지사항을 확인하세요',
    icon: '📢',
    color: '#ef4444'
  }
]

export function BoardsPage() {
  return (
    <div style={{
      backgroundColor: theme.colors.neutral[50],
      minHeight: '100vh',
    }}>
      <div style={styles.sectionContainer}>
        {/* 헤더 */}
        <div style={styles.pageHeader}>
          <h1 style={{
            ...styles.pageTitle,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[3],
          }}>
            <span style={{
              background: `linear-gradient(135deg, ${theme.colors.primary[500]}, ${theme.colors.primary[600]})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: theme.typography.fontSize['5xl'],
            }}>📋</span>
            게시판
          </h1>
          <p style={styles.pageSubtitle}>
            다양한 주제로 소통하고 정보를 공유해보세요
          </p>
        </div>

        {/* 게시판 그리드 */}
        <div style={{
          ...styles.grid,
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        }}>
          {BOARDS.map((board) => (
            <div
              key={board.type}
              onClick={() => window.location.href = `/boards/${board.type}`}
              style={{
                ...styles.cardHover,
                padding: theme.spacing[8],
                background: `linear-gradient(135deg, ${theme.colors.neutral[0]} 0%, ${theme.colors.neutral[50]} 100%)`,
                borderRadius: theme.borderRadius['2xl'],
                position: 'relative' as const,
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)'
                e.currentTarget.style.boxShadow = theme.shadows.xl
                e.currentTarget.style.borderColor = board.color
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = theme.shadows.sm
                e.currentTarget.style.borderColor = theme.colors.neutral[200]
              }}
            >
              {/* 배경 아이콘 */}
              <div style={{
                position: 'absolute',
                top: theme.spacing[4],
                right: theme.spacing[4],
                fontSize: theme.typography.fontSize['6xl'],
                opacity: 0.05,
                pointerEvents: 'none',
              }}>
                {board.icon}
              </div>
              
              <div style={{ textAlign: 'center' as const, position: 'relative' as const }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '80px',
                  height: '80px',
                  backgroundColor: `${board.color}15`,
                  borderRadius: theme.borderRadius.full,
                  marginBottom: theme.spacing[6],
                  fontSize: theme.typography.fontSize['4xl'],
                }}>
                  {board.icon}
                </div>
                
                <h3 style={{
                  fontSize: theme.typography.fontSize.xl,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.neutral[900],
                  marginBottom: theme.spacing[3],
                }}>
                  {board.title}
                </h3>
                
                <p style={{
                  color: theme.colors.neutral[600],
                  fontSize: theme.typography.fontSize.base,
                  lineHeight: theme.typography.lineHeight.relaxed,
                  marginBottom: theme.spacing[6],
                }}>
                  {board.description}
                </p>
                
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                  backgroundColor: `${board.color}10`,
                  borderRadius: theme.borderRadius.xl,
                  color: board.color,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                }}>
                  게시판 보기
                  <span style={{ 
                    fontSize: theme.typography.fontSize.xs,
                    transform: 'translateX(2px)',
                  }}>→</span>
                </div>
              </div>
            </div>
          ))}
      </div>

        {/* 하단 안내 */}
        <div style={{
          ...styles.card,
          marginTop: theme.spacing[12],
          padding: theme.spacing[8],
          textAlign: 'center' as const,
          backgroundColor: theme.colors.primary[50],
          borderColor: theme.colors.primary[200],
          background: `linear-gradient(135deg, ${theme.colors.primary[50]} 0%, ${theme.colors.primary[100]} 100%)`,
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: theme.colors.primary[500],
            borderRadius: theme.borderRadius.full,
            marginBottom: theme.spacing[4],
            fontSize: theme.typography.fontSize['2xl'],
          }}>
            📋
          </div>
          
          <h3 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[4],
          }}>
            게시판 이용 안내
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: theme.spacing[4],
            marginTop: theme.spacing[6],
          }}>
            <div style={{
              padding: theme.spacing[4],
              backgroundColor: theme.colors.neutral[0],
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.neutral[200]}`,
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.xl,
                marginBottom: theme.spacing[2],
              }}>🔐</div>
              <p style={{
                color: theme.colors.neutral[700],
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.relaxed,
                margin: 0,
              }}>
                로그인 후 게시물을 작성할 수 있습니다
              </p>
            </div>
            
            <div style={{
              padding: theme.spacing[4],
              backgroundColor: theme.colors.neutral[0],
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.neutral[200]}`,
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.xl,
                marginBottom: theme.spacing[2],
              }}>✍️</div>
              <p style={{
                color: theme.colors.neutral[700],
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.relaxed,
                margin: 0,
              }}>
                마크다운 문법을 지원하여 풍부한 표현이 가능합니다
              </p>
            </div>
            
            <div style={{
              padding: theme.spacing[4],
              backgroundColor: theme.colors.neutral[0],
              borderRadius: theme.borderRadius.xl,
              border: `1px solid ${theme.colors.neutral[200]}`,
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.xl,
                marginBottom: theme.spacing[2],
              }}>🤝</div>
              <p style={{
                color: theme.colors.neutral[700],
                fontSize: theme.typography.fontSize.sm,
                lineHeight: theme.typography.lineHeight.relaxed,
                margin: 0,
              }}>
                건전한 토론 문화를 만들어가요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}