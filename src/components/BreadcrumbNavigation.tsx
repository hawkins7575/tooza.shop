import React from 'react'
import { Link } from 'react-router-dom'

interface BreadcrumbItem {
  name: string
  href?: string
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[]
}

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.href && { "item": `https://finance-link.com${item.href}` })
    }))
  }

  return (
    <nav 
      aria-label="Breadcrumb"
      style={{
        marginBottom: '2rem',
        padding: '0.75rem 0',
        borderBottom: '1px solid #e5e7eb'
      }}
    >
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }} 
      />
      
      <ol style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.875rem',
        color: '#64748b',
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {index > 0 && (
              <span style={{ color: '#cbd5e1' }}>›</span>
            )}
            
            {item.href ? (
              <Link
                to={item.href}
                style={{
                  color: '#2563eb',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = '#1d4ed8'}
                onMouseOut={(e) => e.currentTarget.style.color = '#2563eb'}
              >
                {item.name}
              </Link>
            ) : (
              <span style={{ color: '#374151', fontWeight: '500' }}>
                {item.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}