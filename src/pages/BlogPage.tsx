import React, { useState, useEffect } from 'react'
import { SEOHead } from '../components/SEOHead'
import { 
  fetchWordPressPosts, 
  WordPressPost, 
  WordPressResponse,
  createExcerpt,
  getRelativeTime,
  stripHtmlTags 
} from '../lib/wordpress'

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<WordPressPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [totalPosts, setTotalPosts] = useState(0)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async (search?: string) => {
    try {
      setLoading(true)
      const response: WordPressResponse = await fetchWordPressPosts(1, 12, search)
      
      setBlogPosts(response.posts || [])
      setTotalPosts(response.found || 0)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'WordPress 블로그 포스트를 불러오는데 실패했습니다.')
      setBlogPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchBlogPosts(searchTerm)
  }

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h2 style={{color: '#64748b'}}>WordPress 블로그 포스트를 불러오는 중...</h2>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h2 style={{color: '#ef4444', marginBottom: '1rem'}}>오류가 발생했습니다</h2>
        <p style={{color: '#64748b'}}>{error}</p>
      </div>
    )
  }

  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Finance Link 투자 블로그",
    "description": "주식 투자 초보자를 위한 전문 블로그. 투자 가이드, 시장 전망, 투자 전략 등 검증된 투자 정보를 제공합니다.",
    "url": "https://finance-link.com/blog",
    "author": {
      "@type": "Organization",
      "name": "Finance Link",
      "url": "https://finance-link.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Finance Link",
      "logo": {
        "@type": "ImageObject",
        "url": "https://finance-link.com/logo512.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://finance-link.com/blog"
    },
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "url": post.URL,
      "datePublished": post.date,
      "dateModified": post.date,
      "author": {
        "@type": "Person",
        "name": post.author?.name || "Finance Link"
      },
      "image": post.featured_image,
      "description": createExcerpt(post.excerpt || post.content, 160)
    }))
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
      <SEOHead
        title="주식 투자 블로그 - WordPress.com 연동"
        description="WordPress.com에서 제공하는 전문 투자 블로그 콘텐츠를 확인하세요. 투자 가이드, 시장 전망, 투자 전략 등 다양한 정보를 제공합니다."
        keywords="주식 투자, 투자 가이드, 주식 초보자, 투자 전략, ETF 투자, 배당주 투자, 미국 주식, 국내 주식, 투자 분석, 재테크, WordPress"
        canonicalUrl="https://finance-link.com/blog"
        ogType="website"
        structuredData={blogStructuredData}
      />

      {/* Header */}
      <div style={{textAlign: 'center', marginBottom: '4rem'}}>
        <h1 style={{
          fontSize: '2.25rem', 
          fontWeight: '700', 
          color: '#1a202c', 
          marginBottom: '1rem',
          lineHeight: '1.3'
        }}>
          📈 주식 투자 블로그
        </h1>
        <p style={{
          fontSize: '1.125rem', 
          color: '#64748b', 
          maxWidth: '600px', 
          margin: '0 auto 2rem auto',
          lineHeight: '1.7'
        }}>
          투자 전문가들의 인사이트와 가이드를 확인하세요 (샘플 데이터)
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} style={{
          maxWidth: '400px',
          margin: '0 auto',
          display: 'flex',
          gap: '0.5rem'
        }}>
          <input
            type="text"
            placeholder="블로그 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid #d1d5db',
              fontSize: '1rem'
            }}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '1rem',
              cursor: 'pointer'
            }}
          >
            검색
          </button>
        </form>
        
        {totalPosts > 0 && (
          <p style={{
            fontSize: '0.875rem',
            color: '#94a3b8',
            marginTop: '1rem'
          }}>
            총 {totalPosts.toLocaleString()}개의 포스트
          </p>
        )}
      </div>

      {blogPosts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
          <h3 style={{color: '#64748b', marginBottom: '1rem'}}>검색 결과가 없습니다</h3>
          <p style={{color: '#94a3b8'}}>다른 검색어를 입력해보거나 페이지를 새로고침해주세요!</p>
        </div>
      ) : (
        <>
          {/* Blog Posts Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: '2rem',
            marginBottom: '4rem'
          }}>
            {blogPosts.map(post => (
              <a
                key={post.ID}
                href={post.URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit'
                }}
              >
                <article 
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    overflow: 'hidden',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                >
                  {/* Featured Image */}
                  <div style={{
                    height: '200px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundImage: post.featured_image ? `url(${post.featured_image})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    {!post.featured_image && (
                      <span style={{
                        fontSize: '3rem',
                        color: '#94a3b8'
                      }}>📝</span>
                    )}
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: 'rgba(37, 99, 235, 0.9)',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      backdropFilter: 'blur(4px)'
                    }}>
                      WordPress
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{padding: '2rem', flex: '1', display: 'flex', flexDirection: 'column'}}>
                    <h2 style={{
                      fontSize: '1.375rem',
                      fontWeight: '600',
                      color: '#1a202c',
                      marginBottom: '1rem',
                      lineHeight: '1.4'
                    }}>
                      {stripHtmlTags(post.title)}
                    </h2>

                    <p style={{
                      fontSize: '1rem',
                      color: '#64748b',
                      lineHeight: '1.7',
                      marginBottom: '1.5rem',
                      flex: '1'
                    }}>
                      {createExcerpt(post.excerpt || post.content, 150)}
                    </p>

                    {/* Categories */}
                    {post.categories && Object.keys(post.categories).length > 0 && (
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1.5rem'
                      }}>
                        {Object.values(post.categories || {}).slice(0, 3).map((category: any) => (
                          <span
                            key={category.ID}
                            style={{
                              backgroundColor: '#f1f5f9',
                              color: '#475569',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '12px'
                            }}
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta Info */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.5rem',
                      fontSize: '0.875rem',
                      color: '#94a3b8'
                    }}>
                      <div style={{display: 'flex', gap: '1rem'}}>
                        <span>📅 {getRelativeTime(post.date)}</span>
                        <span>🌐 WordPress.com</span>
                      </div>
                    </div>

                    {/* Read More Button */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto'
                    }}>
                      <span style={{
                        color: '#2563eb',
                        fontSize: '0.875rem',
                        fontWeight: '600'
                      }}>
                        원문 보기 →
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8'
                      }}>
                        👤 {post.author?.name || 'WordPress'}
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Call to Action */}
      <div style={{
        backgroundColor: '#f8fafc',
        padding: '3rem 2rem',
        borderRadius: '16px',
        textAlign: 'center',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#1a202c',
          marginBottom: '1rem'
        }}>
          블로그 시스템 데모 완료! 🎉
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem auto'
        }}>
          외부 API 연동을 통한 블로그 시스템이 구현되었습니다. 
          실제 WordPress나 다른 CMS와 연동하여 실제 콘텐츠를 표시할 수 있습니다!
        </p>
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => window.location.href = '/dashboard'}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          >
            대시보드 이동 →
          </button>
          <button
            onClick={() => window.open('https://jsonplaceholder.typicode.com', '_blank')}
            style={{
              backgroundColor: 'white',
              color: '#2563eb',
              padding: '1rem 2rem',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              border: '2px solid #2563eb',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb'
              e.currentTarget.style.color = 'white'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'white'
              e.currentTarget.style.color = '#2563eb'
            }}
          >
            JSONPlaceholder API 보기
          </button>
        </div>
      </div>
    </div>
  )
}