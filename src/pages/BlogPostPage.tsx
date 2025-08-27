import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SEOHead } from '../components/SEOHead'
import { BreadcrumbNavigation } from '../components/BreadcrumbNavigation'
import { RelatedPosts } from '../components/RelatedPosts'

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

const formatContent = (content: string): string => {
  return content
    .replace(/\n/g, '<br>')
    .replace(/^# (.*$)/gm, '<h1 style="font-size: 1.875rem; font-weight: 800; color: #1a202c; margin: 2rem 0 1.5rem 0; line-height: 1.2;">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5rem; font-weight: 700; color: #1a202c; margin: 2rem 0 1rem 0; line-height: 1.3;">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; color: #374151; margin: 1.5rem 0 0.75rem 0;">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: 700; color: #1a202c;">$1</strong>')
    .replace(/^- (.*$)/gm, '<li style="margin: 0.75rem 0; padding-left: 0.5rem;">$1</li>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, `
      <div style="margin: 1.5rem 0; text-align: center;">
        <div style="display: inline-block; background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 2rem; color: #64748b; text-align: center; min-width: 300px;">
          <div style="font-size: 3rem; margin-bottom: 1rem;">📈</div>
          <div style="font-weight: 600; margin-bottom: 0.5rem;">$1</div>
          <div style="font-size: 0.875rem; color: #94a3b8;">이미지 준비 중입니다</div>
          <div style="font-size: 0.75rem; color: #cbd5e1; margin-top: 0.5rem;">($2)</div>
        </div>
      </div>
    `)
    .replace(/(<br>){2,}/g, '</p><p style="margin: 1.5rem 0; line-height: 1.8; font-size: 1rem;">')
}

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (slug) {
      fetchBlogPost(slug)
    }
  }, [slug])

  const fetchBlogPost = async (postSlug: string) => {
    if (!supabase) {
      setError('데이터베이스 연결을 확인해주세요.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .eq('published', true)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          setError('블로그 포스트를 찾을 수 없습니다.')
        } else {
          throw error
        }
        return
      }

      setPost(data)
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

  if (error || !post) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h1 style={{fontSize: '2rem', color: '#1a202c', marginBottom: '1rem'}}>
          {error || '블로그 포스트를 찾을 수 없습니다'}
        </h1>
        <p style={{color: '#64748b', marginBottom: '2rem'}}>
          요청하신 블로그 포스트가 존재하지 않습니다.
        </p>
        <Link 
          to="/blog" 
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block',
            fontWeight: '600'
          }}
        >
          ← 블로그 목록으로 돌아가기
        </Link>
      </div>
    )
  }

  // SEO용 메타 설명 생성 (마크다운 제거)
  const cleanDescription = post.content
    .replace(/#+\s/g, '') // 헤딩 제거
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 제거
    .replace(/\*\*(.*?)\*\*/g, '$1') // 볼드 제거
    .replace(/\n/g, ' ') // 줄바꿈 제거
    .substring(0, 160)

  // 키워드 추출 및 생성
  const generateKeywords = (title: string, content: string) => {
    const baseKeywords = ["주식투자", "투자가이드", "Finance Link", "재테크"]
    
    if (title.includes('국내') || title.includes('한국')) {
      baseKeywords.push("국내주식", "한국주식", "코스피", "코스닥")
    }
    if (title.includes('미국')) {
      baseKeywords.push("미국주식", "해외투자", "달러투자")
    }
    if (title.includes('초보')) {
      baseKeywords.push("주식초보", "투자입문", "투자교육")
    }
    if (title.includes('분석')) {
      baseKeywords.push("주식분석", "투자분석", "종목분석")
    }
    
    return baseKeywords.join(", ")
  }

  // 구조화된 데이터 생성
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": cleanDescription,
    "url": `https://finance-link.com/blog/${post.slug}`,
    "datePublished": post.created_at,
    "dateModified": post.updated_at,
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
      "@id": `https://finance-link.com/blog/${post.slug}`
    },
    "image": {
      "@type": "ImageObject",
      "url": "https://finance-link.com/images/blog-default.jpg",
      "width": 1200,
      "height": 630
    },
    "articleSection": "투자",
    "keywords": generateKeywords(post.title, post.content)
  }

  return (
    <div>
      <SEOHead
        title={post.title}
        description={cleanDescription}
        keywords={generateKeywords(post.title, post.content)}
        canonicalUrl={`https://finance-link.com/blog/${post.slug}`}
        ogType="article"
        publishedTime={post.created_at}
        modifiedTime={post.updated_at}
        structuredData={articleStructuredData}
      />

      <div style={{maxWidth: '800px', margin: '0 auto', padding: '2rem'}}>
        {/* 브레드크럼 네비게이션 */}
        <BreadcrumbNavigation 
          items={[
            { name: '홈', href: '/' },
            { name: '블로그', href: '/blog' },
            { name: post.title.length > 50 ? post.title.substring(0, 50) + '...' : post.title }
          ]}
        />

        {/* Featured Image Placeholder */}
        <div style={{
          height: '300px',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '12px',
          marginBottom: '2rem',
          position: 'relative'
        }}>
          <span style={{
            fontSize: '4rem',
            color: '#94a3b8'
          }}>📝</span>
          <div style={{
            position: 'absolute',
            bottom: '1rem',
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

        {/* Article Header */}
        <header style={{marginBottom: '3rem'}}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            {post.title}
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: '#64748b',
            marginBottom: '2rem',
            lineHeight: '1.7'
          }}>
            {post.content.substring(0, 200)}...
          </p>

          {/* Meta Info */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '2rem',
            fontSize: '0.875rem',
            color: '#94a3b8'
          }}>
            <span>📅 {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
            <span>📄 {post.published ? '게시됨' : '임시저장'}</span>
            <span>👤 Finance Link</span>
          </div>
        </header>

        {/* Article Content - SEO 최적화 */}
        <article 
          itemScope 
          itemType="https://schema.org/BlogPosting"
          style={{
            fontSize: '1rem',
            lineHeight: '1.8',
            color: '#374151'
          }}
        >
          {/* 숨겨진 메타데이터 */}
          <meta itemProp="headline" content={post.title} />
          <meta itemProp="description" content={cleanDescription} />
          <meta itemProp="datePublished" content={post.created_at} />
          <meta itemProp="dateModified" content={post.updated_at} />
          <meta itemProp="author" content="Finance Link" />
          <meta itemProp="publisher" content="Finance Link" />
          <meta itemProp="mainEntityOfPage" content={`https://finance-link.com/blog/${post.slug}`} />
          
          <div dangerouslySetInnerHTML={{
            __html: `<div style="font-size: 1rem; line-height: 1.8; margin: 1.5rem 0;">${formatContent(post.content)}</div>`
          }} />
          
          {/* 읽는 시간 표시 (사용자 경험 개선) */}
          <div style={{
            marginTop: '2rem',
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#64748b',
            borderLeft: '4px solid #2563eb'
          }}>
            <div style={{ marginBottom: '0.5rem', fontWeight: '600' }}>📖 읽는 시간</div>
            <div>약 {Math.ceil(post.content.length / 300)}분 소요 (한국어 기준 300자/분)</div>
          </div>
        </article>

        {/* Social Share & CTA */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          backgroundColor: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '1rem'
          }}>
            이 글이 도움이 되셨나요?
          </h3>
          <p style={{
            color: '#64748b',
            marginBottom: '1.5rem'
          }}>
            Finance Link에서 더 많은 투자 정보와 개인 맞춤형 포트폴리오 관리 서비스를 만나보세요.
          </p>
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
            <button
              onClick={() => window.location.href = '/dashboard'}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1d4ed8'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
            >
              대시보드 시작하기
            </button>
            <Link 
              to="/blog"
              style={{
                backgroundColor: 'white',
                color: '#374151',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                border: '1px solid #d1d5db',
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'background-color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'white'}
            >
              다른 글 보기
            </Link>
          </div>
        </div>

        {/* 관련 글 추천 */}
        <RelatedPosts 
          currentPostId={post.id}
          currentPostTitle={post.title}
        />

        {/* Back to Blog */}
        <div style={{marginTop: '4rem', textAlign: 'center'}}>
          <Link 
            to="/blog"
            style={{
              backgroundColor: '#f8fafc',
              color: '#374151',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              border: '1px solid #d1d5db',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'background-color 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            ← 다른 블로그 글 보기
          </Link>
        </div>
      </div>
    </div>
  )
}