import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface RelatedPost {
  id: string
  title: string
  slug: string
  content: string
  created_at: string
}

interface RelatedPostsProps {
  currentPostId: string
  currentPostTitle: string
}

export function RelatedPosts({ currentPostId, currentPostTitle }: RelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([])
  
  const fetchRelatedPosts = useCallback(async () => {
    if (!supabase) return

    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, content, created_at')
        .eq('published', true)
        .neq('id', currentPostId)
        .order('created_at', { ascending: false })
        .limit(3)

      if (error) throw error
      setRelatedPosts(data || [])
    } catch (error) {
      console.error('관련 글 가져오기 실패:', error)
    }
  }, [currentPostId])

  useEffect(() => {
    fetchRelatedPosts()
  }, [fetchRelatedPosts])

  if (relatedPosts.length === 0) return null

  return (
    <section 
      style={{
        marginTop: '4rem',
        padding: '2rem',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        border: '1px solid #e2e8f0'
      }}
      aria-labelledby="related-posts-heading"
    >
      <h3 
        id="related-posts-heading"
        style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        📚 관련 글 추천
      </h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {relatedPosts.map(post => (
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
                padding: '1.5rem',
                borderRadius: '8px',
                boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
              }}
            >
              <h4 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1a202c',
                marginBottom: '1rem',
                lineHeight: '1.4',
                flex: '1'
              }}>
                {post.title}
              </h4>
              
              <p style={{
                fontSize: '0.875rem',
                color: '#64748b',
                lineHeight: '1.6',
                marginBottom: '1rem'
              }}>
                {post.content.replace(/#+\s/g, '').replace(/!\[.*?\]\(.*?\)/g, '').substring(0, 120)}...
              </p>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                <span>📅 {new Date(post.created_at).toLocaleDateString('ko-KR')}</span>
                <span style={{
                  color: '#2563eb',
                  fontWeight: '600'
                }}>
                  읽어보기 →
                </span>
              </div>
            </article>
          </Link>
        ))}
      </div>
      
      <div style={{
        textAlign: 'center',
        marginTop: '2rem'
      }}>
        <Link
          to="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#2563eb',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: '600',
            padding: '0.75rem 1.5rem',
            border: '1px solid #2563eb',
            borderRadius: '8px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#2563eb'
            e.currentTarget.style.color = 'white'
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#2563eb'
          }}
        >
          📖 더 많은 글 보기
        </Link>
      </div>
    </section>
  )
}