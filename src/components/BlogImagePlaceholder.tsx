import React from 'react'

interface BlogImagePlaceholderProps {
  alt: string
  className?: string
  style?: React.CSSProperties
}

export function BlogImagePlaceholder({ alt, className, style }: BlogImagePlaceholderProps) {
  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        minHeight: '200px',
        margin: '1.5rem 0',
        border: '2px dashed #cbd5e1',
        color: '#64748b',
        fontSize: '1rem',
        fontWeight: '500',
        textAlign: 'center',
        padding: '2rem',
        ...style
      }}
    >
      <div>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📈</div>
        <div>{alt || 'Blog Image'}</div>
        <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          이미지 준비 중입니다
        </div>
      </div>
    </div>
  )
}