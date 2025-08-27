import React from 'react'
import { Link, useLocation } from 'react-router-dom'

interface BreadcrumbItem {
  label: string
  path: string
}

const routeLabels: { [key: string]: string } = {
  '/': '홈',
  '/important-info': '주요정보',
  '/about': '서비스 소개',
  '/blog': '투자 블로그',
  '/dashboard': '대시보드',
  '/bookmarks': '북마크',
  '/admin': '관리자',
  '/privacy': '개인정보처리방침',
  '/terms': '이용약관'
}

export function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split('/').filter(x => x)
  
  const breadcrumbs: BreadcrumbItem[] = [
    { label: '홈', path: '/' }
  ]
  
  let currentPath = ''
  pathnames.forEach(pathname => {
    currentPath += `/${pathname}`
    const label = routeLabels[currentPath] || pathname
    breadcrumbs.push({ label, path: currentPath })
  })

  if (breadcrumbs.length <= 1) return null

  return (
    <nav style={{
      padding: '0.75rem 0',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '1.5rem'
    }}>
      <ol style={{
        display: 'flex',
        alignItems: 'center',
        margin: 0,
        padding: 0,
        listStyle: 'none',
        fontSize: '0.875rem'
      }}>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} style={{display: 'flex', alignItems: 'center'}}>
            {index > 0 && (
              <span style={{
                margin: '0 0.5rem',
                color: '#9ca3af'
              }}>
                /
              </span>
            )}
            {index === breadcrumbs.length - 1 ? (
              <span style={{
                color: '#374151',
                fontWeight: '500'
              }}>
                {breadcrumb.label}
              </span>
            ) : (
              <Link
                to={breadcrumb.path}
                style={{
                  color: '#6b7280',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'}
              >
                {breadcrumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
      
      {/* JSON-LD 구조화된 데이터 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((breadcrumb, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": breadcrumb.label,
              "item": `https://yoursite.com${breadcrumb.path}`
            }))
          })
        }}
      />
    </nav>
  )
}