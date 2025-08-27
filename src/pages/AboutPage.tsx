import React, { useEffect } from 'react'
import { theme } from '../styles/theme'

export function AboutPage() {
  useEffect(() => {
    document.title = '서비스 소개 | Finance Link - 투자 정보 사이트 모음'
  }, [])

  return (
    <div style={{
      backgroundColor: theme.colors.neutral[50],
      minHeight: '100vh',
      padding: `${theme.spacing[16]} ${theme.spacing[6]}`,
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: theme.colors.neutral[0],
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing[10],
        boxShadow: theme.shadows.lg,
        border: `1px solid ${theme.colors.neutral[200]}`,
      }}>
        <header style={{
          textAlign: 'center' as const,
          marginBottom: theme.spacing[10],
        }}>
          <h1 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[4],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing[3],
          }}>
            <span style={{fontSize: '2.5rem'}}>📊</span>
            Finance Link 소개
          </h1>
          <p style={{
            fontSize: theme.typography.fontSize.lg,
            color: theme.colors.neutral[600],
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            투자자들을 위한 신뢰할 수 있는 투자 정보 사이트 모음 플랫폼
          </p>
        </header>

        <section style={{marginBottom: theme.spacing[10]}}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[6],
            borderBottom: `2px solid ${theme.colors.primary[500]}`,
            paddingBottom: theme.spacing[2],
          }}>
            🎯 서비스 목적
          </h2>
          <div style={{
            backgroundColor: theme.colors.primary[50],
            padding: theme.spacing[6],
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.primary[100]}`,
            marginBottom: theme.spacing[6],
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.neutral[700],
              lineHeight: theme.typography.lineHeight.relaxed,
              margin: 0,
            }}>
              Finance Link는 투자자들이 신뢰할 수 있는 투자 정보를 쉽게 찾을 수 있도록 
              엄선된 투자 관련 사이트들을 체계적으로 분류하여 제공하는 플랫폼입니다.
              전문가들이 검증한 양질의 투자 정보 사이트만을 수록하여 투자 결정에 도움을 드립니다.
            </p>
          </div>
        </section>

        <section style={{marginBottom: theme.spacing[10]}}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[6],
            borderBottom: `2px solid ${theme.colors.warning[500]}`,
            paddingBottom: theme.spacing[2],
          }}>
            ⚠️ 중요 안내사항
          </h2>
          <div style={{
            backgroundColor: theme.colors.warning[50],
            padding: theme.spacing[6],
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.warning[100]}`,
          }}>
            <ul style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.neutral[700],
              lineHeight: theme.typography.lineHeight.relaxed,
              paddingLeft: theme.spacing[6],
            }}>
              <li style={{marginBottom: theme.spacing[2]}}>
                본 사이트는 투자 정보 제공을 목적으로 하며, <strong>투자 권유나 투자 상담을 제공하지 않습니다</strong>.
              </li>
              <li style={{marginBottom: theme.spacing[2]}}>
                모든 투자 결정은 <strong>개인의 책임</strong>하에 이루어져야 하며, 투자 손실에 대한 책임은 투자자 본인에게 있습니다.
              </li>
              <li style={{marginBottom: theme.spacing[2]}}>
                제공되는 사이트 링크들은 정보 제공 목적이며, 해당 사이트의 내용이나 서비스에 대해서는 책임을 지지 않습니다.
              </li>
              <li>
                투자 전에는 반드시 <strong>전문가와 상담</strong>하시기를 권장합니다.
              </li>
            </ul>
          </div>
        </section>

        <footer style={{
          textAlign: 'center' as const,
          padding: theme.spacing[6],
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.primary[100]}`,
        }}>
          <h3 style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.neutral[900],
            marginBottom: theme.spacing[3],
          }}>
            📧 문의사항이 있으시나요?
          </h3>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.neutral[600],
            marginBottom: theme.spacing[4],
          }}>
            서비스 개선을 위한 제안이나 문의사항은 언제든 연락주세요.
          </p>
          <a
            href="mailto:daesung75@naver.com"
            style={{
              display: 'inline-block',
              backgroundColor: theme.colors.primary[600],
              color: theme.colors.neutral[0],
              padding: `${theme.spacing[3]} ${theme.spacing[6]}`,
              borderRadius: theme.borderRadius.lg,
              textDecoration: 'none',
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.medium,
              transition: 'background-color 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary[700]}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = theme.colors.primary[600]}
          >
            문의하기
          </a>
        </footer>
      </div>
    </div>
  )
}