import React, { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { RichTextEditor } from '../components/RichTextEditor'

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

export function BoardPage() {
  const { boardType } = useParams<{ boardType: string }>()
  const { user } = useAuth()
  const [posts, setPosts] = useState<BoardPost[]>([])
  const [loading, setLoading] = useState(false)
  const [showWriteForm, setShowWriteForm] = useState(false)
  const [writeForm, setWriteForm] = useState({
    title: '',
    content: ''
  })

  const boardTitle = BOARD_TYPES[boardType as keyof typeof BOARD_TYPES] || '게시판'

  const fetchPosts = useCallback(async () => {
    if (!supabase || !boardType) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('board_posts')
        .select('*')
        .eq('board_type', boardType)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('게시물 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [boardType])

  useEffect(() => {
    if (boardType) {
      fetchPosts()
    }
  }, [boardType, fetchPosts])

  const handleSubmitPost = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !boardType || !supabase) return

    try {
      const { error } = await supabase
        .from('board_posts')
        .insert({
          title: writeForm.title.trim(),
          content: writeForm.content.trim(),
          author_name: user.user_metadata?.username || user.email?.split('@')[0] || 'Anonymous',
          author_id: user.id,
          board_type: boardType,
          views: 0,
          likes: 0
        })

      if (error) throw error

      setWriteForm({ title: '', content: '' })
      setShowWriteForm(false)
      await fetchPosts()
      alert('게시물이 성공적으로 등록되었습니다.')
    } catch (error) {
      console.error('게시물 등록 실패:', error)
      alert('게시물 등록 중 오류가 발생했습니다.')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    } else {
      return date.toLocaleDateString('ko-KR')
    }
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
      {/* 게시판 헤더 */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>
          📋 {boardTitle}
        </h1>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          {boardType === 'free' && '자유롭게 이야기를 나누어보세요'}
          {boardType === 'investment' && '투자 정보와 경험을 공유해보세요'}
          {boardType === 'qna' && '궁금한 점을 질문하고 답변을 받아보세요'}
          {boardType === 'notice' && '중요한 공지사항을 확인하세요'}
        </p>

        {user && (
          <button
            onClick={() => setShowWriteForm(!showWriteForm)}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '1.5rem'
            }}
          >
            {showWriteForm ? '취소' : '✏️ 글쓰기'}
          </button>
        )}
      </div>

      {/* 글쓰기 폼 */}
      {showWriteForm && user && (
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '0.75rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', color: '#111827' }}>
            새 글 작성
          </h3>
          <form onSubmit={handleSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                제목 *
              </label>
              <input
                type="text"
                value={writeForm.title}
                onChange={(e) => setWriteForm({ ...writeForm, title: e.target.value })}
                required
                placeholder="제목을 입력하세요"
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.5rem',
                  fontSize: '1rem'
                }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '0.5rem' }}>
                내용 *
              </label>
              <RichTextEditor
                value={writeForm.content}
                onChange={(value) => setWriteForm({ ...writeForm, content: value })}
                placeholder="내용을 입력하세요. 마크다운 문법을 사용하거나 툴바를 이용해 서식을 적용할 수 있습니다."
                minHeight="400px"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowWriteForm(false)}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#374151',
                  borderRadius: '0.5rem',
                  cursor: 'pointer'
                }}
              >
                취소
              </button>
              <button
                type="submit"
                disabled={!writeForm.title.trim() || !writeForm.content.trim()}
                style={{
                  padding: '0.75rem 1.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  backgroundColor: writeForm.title.trim() && writeForm.content.trim() ? '#2563eb' : '#9ca3af',
                  color: 'white',
                  borderRadius: '0.5rem',
                  cursor: writeForm.title.trim() && writeForm.content.trim() ? 'pointer' : 'not-allowed'
                }}
              >
                등록
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 게시물 목록 */}
      <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '0.75rem', overflow: 'hidden' }}>
        {loading ? (
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
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>아직 게시물이 없습니다.</p>
            {user && (
              <p style={{ color: '#9ca3af', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                첫 번째 글을 작성해보세요!
              </p>
            )}
          </div>
        ) : (
          <div>
            {/* 테이블 헤더 */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto auto',
              gap: '1rem',
              padding: '1rem 1.5rem',
              backgroundColor: '#f9fafb',
              borderBottom: '1px solid #e5e7eb',
              fontSize: '0.875rem',
              fontWeight: '600',
              color: '#374151'
            }}>
              <div>제목</div>
              <div style={{ textAlign: 'center' }}>작성자</div>
              <div style={{ textAlign: 'center' }}>작성일</div>
              <div style={{ textAlign: 'center' }}>조회</div>
            </div>

            {/* 게시물 목록 */}
            {posts.map((post) => (
              <div key={post.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr auto auto auto',
                gap: '1rem',
                padding: '1rem 1.5rem',
                borderBottom: '1px solid #e5e7eb',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease'
              }}
              onClick={() => window.location.href = `/boards/${boardType}/${post.id}`}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: '#111827',
                    marginBottom: '0.25rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {post.title}
                  </h3>
                  <p style={{
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '400px'
                  }}>
                    {post.content.replace(/[#*`\n]/g, ' ').substring(0, 100)}...
                  </p>
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  {post.author_name}
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  {formatDate(post.created_at)}
                </div>
                <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
                  {post.views}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!user && (
        <div style={{
          textAlign: 'center',
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f9fafb',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb'
        }}>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            게시물을 작성하려면 로그인이 필요합니다.
          </p>
        </div>
      )}
    </div>
  )
}