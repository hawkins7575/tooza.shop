import React, { useEffect } from 'react'
import { theme } from '../styles/theme'

export function TermsPage() {
  useEffect(() => {
    document.title = '이용약관 | Finance Link - 투자 정보 사이트 모음'
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
          }}>
            📋 이용약관
          </h1>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.neutral[600],
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            Finance Link 서비스 이용약관 (2024년 8월 26일 시행)
          </p>
        </header>

        <div style={{
          backgroundColor: theme.colors.neutral[50], 
          borderRadius: theme.borderRadius.xl, 
          padding: theme.spacing[8], 
          marginBottom: theme.spacing[8], 
          boxShadow: theme.shadows.sm, 
          border: `1px solid ${theme.colors.neutral[200]}`
        }}>
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>제1조 (목적)</h2>
          <p style={{color: '#4b5563', lineHeight: '1.6', marginBottom: '2rem'}}>
            본 약관은 파이낸스 링크(이하 "회사")가 제공하는 투자 정보 플랫폼 서비스(이하 "서비스")의 
            이용조건 및 절차, 회사와 이용자의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
          </p>

          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>제2조 (정의)</h2>
          <ul style={{color: '#4b5563', lineHeight: '1.6', paddingLeft: '1.5rem', marginBottom: '2rem'}}>
            <li style={{marginBottom: '0.5rem'}}>"서비스"란 회사가 제공하는 투자 정보 사이트 모음 플랫폼을 의미합니다.</li>
            <li style={{marginBottom: '0.5rem'}}>"이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및 비회원을 말합니다.</li>
            <li style={{marginBottom: '0.5rem'}}>"회원"이란 서비스에 개인정보를 제공하여 회원등록을 한 자를 말합니다.</li>
          </ul>

          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>제3조 (면책사항)</h2>
          <p style={{color: '#4b5563', lineHeight: '1.6', marginBottom: '2rem'}}>
            회사는 투자 정보 사이트의 링크를 제공할 뿐이며, 해당 사이트의 내용이나 투자 결과에 대해서는 
            책임을 지지 않습니다. 모든 투자 결정은 이용자 본인의 책임하에 이루어져야 합니다.
          </p>

          <footer style={{
            textAlign: 'center' as const,
            marginTop: theme.spacing[10],
            padding: theme.spacing[6],
            backgroundColor: theme.colors.neutral[50],
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.neutral[200]}`,
          }}>
            <h3 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.neutral[900],
              marginBottom: theme.spacing[3],
            }}>
              📞 문의처
            </h3>
            <div style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.neutral[600],
              lineHeight: theme.typography.lineHeight.relaxed,
            }}>
              <p style={{margin: 0, marginBottom: theme.spacing[2]}}>
                이메일: daesung75@naver.com
              </p>
              <p style={{margin: 0}}>
                시행일자: 2024년 8월 26일
              </p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}