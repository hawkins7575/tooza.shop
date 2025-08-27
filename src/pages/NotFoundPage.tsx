import React from 'react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <div style={{
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{marginBottom: '2rem'}}>
        <h1 style={{
          fontSize: '4rem', 
          fontWeight: 'bold', 
          color: '#2563eb', 
          margin: 0, 
          marginBottom: '1rem'
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: '#111827', 
          margin: 0, 
          marginBottom: '1rem'
        }}>
          페이지를 찾을 수 없습니다
        </h2>
        <p style={{color: '#6b7280', lineHeight: '1.6', marginBottom: '2rem'}}>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
      </div>

      <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
        <Link 
          to="/" 
          style={{
            display: 'inline-block',
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            transition: 'background-color 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
        >
          홈으로 돌아가기
        </Link>
        
        <Link 
          to="/dashboard" 
          style={{
            display: 'inline-block',
            border: '1px solid #d1d5db',
            color: '#374151',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500',
            backgroundColor: 'white',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#f9fafb'
            e.currentTarget.style.borderColor = '#9ca3af'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'white'
            e.currentTarget.style.borderColor = '#d1d5db'
          }}
        >
          대시보드
        </Link>
      </div>

      {/* 추천 링크 */}
      <div style={{marginTop: '3rem', maxWidth: '600px'}}>
        <h3 style={{fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem'}}>
          추천 페이지
        </h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
          <Link to="/" style={{color: '#2563eb', textDecoration: 'none', padding: '0.5rem', textAlign: 'center', borderRadius: '6px', border: '1px solid #e5e7eb'}}>
            📊 투자 사이트
          </Link>
          <Link to="/blog" style={{color: '#2563eb', textDecoration: 'none', padding: '0.5rem', textAlign: 'center', borderRadius: '6px', border: '1px solid #e5e7eb'}}>
            📝 블로그
          </Link>
          <Link to="/about" style={{color: '#2563eb', textDecoration: 'none', padding: '0.5rem', textAlign: 'center', borderRadius: '6px', border: '1px solid #e5e7eb'}}>
            ℹ️ 소개
          </Link>
        </div>
      </div>
    </div>
  )
}