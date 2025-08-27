import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SEOHead } from '../components/SEOHead'

interface BlogPost {
  id: string
  title: string
  content: string
  slug: string
  published: boolean
  created_at: string
  updated_at: string
  user_id: string
}

export function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchBlogPosts()
  }, [])

  const fetchBlogPosts = async () => {
    if (!supabase) {
      setError('데이터베이스 연결을 확인해주세요.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setBlogPosts(data || [])
    } catch (err: any) {
      setError(err.message || '블로그 포스트를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h2 style={{color: '#64748b'}}>블로그 포스트를 불러오는 중...</h2>
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
      "url": `https://finance-link.com/blog/${post.slug}`,
      "datePublished": post.created_at,
      "dateModified": post.updated_at,
      "author": {
        "@type": "Organization",
        "name": "Finance Link"
      }
    }))
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '2rem'}}>
      <SEOHead
        title="주식 투자 블로그 - 초보자를 위한 투자 가이드"
        description="주식 투자 초보자를 위한 전문 블로그. 투자 가이드, 시장 전망, 투자 전략 등 검증된 투자 정보를 제공합니다. 국내외 주식 투자부터 ETF, 배당주 투자까지 모든 정보를 한 곳에서."
        keywords="주식 투자, 투자 가이드, 주식 초보자, 투자 전략, ETF 투자, 배당주 투자, 미국 주식, 국내 주식, 투자 분석, 재테크"
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
          margin: '0 auto',
          lineHeight: '1.7'
        }}>
          초보자도 쉽게 따라할 수 있는 주식 투자 가이드와 전문가 인사이트를 제공합니다
        </p>
      </div>

      {blogPosts.length === 0 ? (
        <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
          <h3 style={{color: '#64748b', marginBottom: '1rem'}}>아직 블로그 포스트가 없습니다</h3>
          <p style={{color: '#94a3b8'}}>곧 유용한 투자 정보를 제공하는 블로그 포스트가 업데이트됩니다!</p>
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
              <Link 
                key={post.id}
                to={`/blog/${post.slug}`}
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
                  {/* Image Placeholder */}
                  <div style={{
                    height: '200px',
                    backgroundColor: '#f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}>
                    <span style={{
                      fontSize: '3rem',
                      color: '#94a3b8'
                    }}>📝</span>
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '20px',
                      fontSize: '0.875rem',
                      fontWeight: '600'
                    }}>
                      블로그
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
                      {post.title}
                    </h2>

                    <p style={{
                      fontSize: '1rem',
                      color: '#64748b',
                      lineHeight: '1.7',
                      marginBottom: '1.5rem',
                      flex: '1'
                    }}>
                      {post.content.substring(0, 150)}...
                    </p>

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
                        <span>📅 {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                        <span>📄 {post.published ? '게시됨' : '임시저장'}</span>
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
                        자세히 읽기 →
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8'
                      }}>
                        👤 Finance Link
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
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
          더 많은 투자 정보가 필요하신가요?
        </h3>
        <p style={{
          fontSize: '1rem',
          color: '#64748b',
          lineHeight: '1.6',
          marginBottom: '2rem',
          maxWidth: '500px',
          margin: '0 auto 2rem auto'
        }}>
          Finance Link에서 제공하는 개인 맞춤형 투자 분석과 포트폴리오 관리 서비스를 경험해보세요
        </p>
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
          대시보드 시작하기 →
        </button>
      </div>
    </div>
  )
}