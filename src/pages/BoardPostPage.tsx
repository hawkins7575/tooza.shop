import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

interface BoardPost {
  id: string
  title: string
  content: string
  author_name: string
  author_id: string
  board_type: string
  created_at: string
  updated_at: string
  views: number
  likes: number
}

const BOARD_TYPES = {
  'free': '자유게시판',
  'investment': '투자정보',
  'qna': '질문답변',
  'notice': '공지사항'
}

export function BoardPostPage() {
  const { boardType, postId } = useParams<{ boardType: string; postId: string }>()
  const [post, setPost] = useState<BoardPost | null>(null)
  const [loading, setLoading] = useState(false)

  const boardTitle = BOARD_TYPES[boardType as keyof typeof BOARD_TYPES] || '게시판'

  const fetchPost = useCallback(async () => {
    if (!supabase || !boardType || !postId) return
    
    setLoading(true)
    try {
      // 조회수 증가를 위해 먼저 현재 조회수를 가져온 후 1 증가
      const { data: currentPost } = await supabase
        .from('board_posts')
        .select('views')
        .eq('id', postId)
        .single()

      if (currentPost) {
        const { error: updateError } = await supabase
          .from('board_posts')
          .update({ views: (currentPost.views || 0) + 1 })
          .eq('id', postId)
        
        if (updateError) {
          console.error('조회수 업데이트 실패:', updateError)
        }
      }

      // 게시물 조회
      const { data, error } = await supabase
        .from('board_posts')
        .select('*')
        .eq('id', postId)
        .eq('board_type', boardType)
        .single()

      if (error) throw error
      setPost(data)
    } catch (error) {
      console.error('게시물 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [boardType, postId])

  useEffect(() => {
    if (boardType && postId) {
      fetchPost()
    }
  }, [boardType, postId, fetchPost])

  const formatContent = (content: string) => {
    return content
      .replace(/^# (.+)$/gm, '<h1 style="font-size: 1.875rem; font-weight: bold; margin: 1.5rem 0 1rem 0; color: #111827;">$1</h1>')
      .replace(/^## (.+)$/gm, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 1.25rem 0 0.75rem 0; color: #111827;">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1rem 0 0.5rem 0; color: #111827;">$1</h3>')
      .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/`(.+?)`/g, '<code style="background-color: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.875rem;">$1</code>')
      .replace(/```([\s\S]*?)```/g, '<pre style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; font-family: monospace; font-size: 0.875rem; line-height: 1.5; margin: 1rem 0;"><code>$1</code></pre>')
      .replace(/^- (.+)$/gm, '<li style="margin: 0.25rem 0;">$1</li>')
      .replace(/(<li.*<\/li>\s*)+/g, '<ul style="margin: 1rem 0; padding-left: 1.5rem;">$&</ul>')
      .replace(/\n\n/g, '</p><p style="margin: 1rem 0; line-height: 1.7; color: #374151;">')
      .replace(/^(?!<[h|u|p|c|l])(.+)$/gm, '<p style="margin: 1rem 0; line-height: 1.7; color: #374151;">$1</p>')
  }

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 0' }}>
          <div style={{ 
            width: '2rem', 
            height: '2rem', 
            border: '2px solid #e5e7eb', 
            borderTop: '2px solid #2563eb', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ textAlign: 'center', padding: '3rem 0' }}>
          <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>게시물을 찾을 수 없습니다.</p>
          <button
            onClick={() => window.location.href = `/boards/${boardType}`}
            style={{
              marginTop: '1rem',
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* 상단 네비게이션 */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => window.location.href = `/boards/${boardType}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6b7280',
            fontSize: '0.875rem',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '0.25rem'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          ← {boardTitle}로 돌아가기
        </button>
      </div>

      {/* 게시물 본문 */}
      <article style={{
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '0.75rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        {/* 게시물 헤더 */}
        <div style={{
          padding: '2rem',
          borderBottom: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '1rem',
            lineHeight: '1.3'
          }}>
            {post.title}
          </h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>작성자:</span>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                {post.author_name}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>작성일:</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {new Date(post.created_at).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>조회수:</span>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>{post.views}</span>
            </div>
          </div>
        </div>

        {/* 게시물 내용 */}
        <div style={{ padding: '2rem' }}>
          <div 
            style={{ 
              lineHeight: '1.8', 
              fontSize: '1rem',
              color: '#111827'
            }}
            dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
          />
        </div>

        {/* 게시물 푸터 */}
        <div style={{
          padding: '2rem',
          borderTop: '1px solid #e5e7eb',
          backgroundColor: '#f9fafb',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {post.updated_at !== post.created_at && (
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                수정됨: {new Date(post.updated_at).toLocaleString('ko-KR')}
              </span>
            )}
          </div>
          
          <button
            onClick={() => window.location.href = `/boards/${boardType}`}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            목록으로
          </button>
        </div>
      </article>
    </div>
  )
}