import React, { useEffect } from 'react'
import { theme } from '../styles/theme'

export function PrivacyPage() {
  useEffect(() => {
    document.title = '개인정보처리방침 | Finance Link - 투자 정보 사이트 모음'
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
            🔒 개인정보처리방침
          </h1>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.neutral[600],
            lineHeight: theme.typography.lineHeight.relaxed,
          }}>
            Finance Link 개인정보처리방침 (2024년 8월 26일 시행)
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
          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>1. 개인정보 수집 및 이용목적</h2>
          <p style={{color: '#4b5563', lineHeight: '1.6', marginBottom: '1.5rem'}}>
            파이낸스 링크는 다음의 목적을 위해 개인정보를 처리합니다:
          </p>
          <ul style={{color: '#4b5563', lineHeight: '1.6', paddingLeft: '1.5rem', marginBottom: '2rem'}}>
            <li style={{marginBottom: '0.5rem'}}>서비스 제공 및 계정 관리</li>
            <li style={{marginBottom: '0.5rem'}}>개인화된 콘텐츠 및 서비스 제공</li>
            <li style={{marginBottom: '0.5rem'}}>서비스 개선 및 새로운 서비스 개발</li>
            <li style={{marginBottom: '0.5rem'}}>고객 지원 및 문의 응답</li>
            <li style={{marginBottom: '0.5rem'}}>법적 의무 이행</li>
          </ul>

          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>2. 수집하는 개인정보 항목</h2>
          <div style={{marginBottom: '2rem'}}>
            <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem'}}>필수 수집 정보</h3>
            <ul style={{color: '#4b5563', lineHeight: '1.6', paddingLeft: '1.5rem', marginBottom: '1rem'}}>
              <li>이메일 주소</li>
              <li>비밀번호 (암호화 저장)</li>
            </ul>
            
            <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem'}}>자동 수집 정보</h3>
            <ul style={{color: '#4b5563', lineHeight: '1.6', paddingLeft: '1.5rem'}}>
              <li>접속 IP 주소</li>
              <li>브라우저 종류 및 버전</li>
              <li>운영체제 정보</li>
              <li>서비스 이용 기록</li>
              <li>쿠키 및 세션 정보</li>
            </ul>
          </div>

          <h2 style={{fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>3. 개인정보 보유 및 이용기간</h2>
          <p style={{color: '#4b5563', lineHeight: '1.6', marginBottom: '2rem'}}>
            회원 탈퇴 시까지 또는 수집 목적 달성 시까지 보유합니다. 단, 법령에서 정한 보존 의무가 있는 경우 해당 기간 동안 보존합니다.
          </p>

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
              📧 개인정보보호 문의
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