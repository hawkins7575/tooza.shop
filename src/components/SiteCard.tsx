import React, { useState, memo } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

interface Site {
  id: string
  title: string
  url: string
  description: string | null
  category: string
  tags: string[]
  thumbnail_url: string | null
}

interface SiteCardProps {
  site: Site
  isBookmarked?: boolean
  onBookmarkChange?: () => void
}

const SiteCard = memo(function SiteCard({ site, isBookmarked = false, onBookmarkChange }: SiteCardProps) {
  const { user } = useAuth()
  const [bookmarkLoading, setBookmarkLoading] = useState(false)
  const [currentlyBookmarked, setCurrentlyBookmarked] = useState(isBookmarked)

  const handleBookmarkToggle = async () => {
    if (!user || !supabase) return

    setBookmarkLoading(true)
    try {
      if (currentlyBookmarked) {
        // 북마크 제거
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('user_id', user.id)
          .eq('site_id', site.id)

        if (!error) {
          setCurrentlyBookmarked(false)
          onBookmarkChange?.()
        }
      } else {
        // 북마크 추가
        const { error } = await supabase
          .from('bookmarks')
          .insert({
            user_id: user.id,
            site_id: site.id
          })

        if (!error) {
          setCurrentlyBookmarked(true)
          onBookmarkChange?.()
        }
      }
    } catch (error) {
      console.error('Bookmark error:', error)
    } finally {
      setBookmarkLoading(false)
    }
  }

  const handleCardClick = () => {
    window.open(site.url, '_blank', 'noopener,noreferrer')
  }

  // 카테고리별 색상 매핑
  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      '주식': '#3b82f6',
      '채권': '#10b981', 
      '부동산': '#f59e0b',
      '암호화폐': '#8b5cf6',
      '금융뉴스': '#ef4444',
      '투자교육': '#06b6d4',
      '경제분석': '#84cc16',
      '투자도구': '#f97316'
    }
    return colors[category] || '#6b7280'
  }

  return (
    <div 
      onClick={handleCardClick}
      style={{backgroundColor: 'var(--surface)', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: '1px solid #e2e8f0', transition: 'all 0.2s ease', cursor: 'pointer', overflow: 'hidden'}}
      onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'}
      onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}>
      
      {/* 콘텐츠 영역 */}
      <div style={{padding: '12px'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px'}}>
          <div style={{display: 'flex', alignItems: 'center', flex: 1}}>
            {site.thumbnail_url && (
              <img 
                src={site.thumbnail_url} 
                alt={`${site.title} logo`}
                style={{
                  width: '24px', 
                  height: '24px', 
                  marginRight: '8px',
                  borderRadius: '4px',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <h3 style={{fontWeight: '600', color: '#1a202c', fontSize: '15px', lineHeight: '1.3', margin: 0}}>
              {site.title}
            </h3>
          </div>
          {user && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleBookmarkToggle()
              }}
              disabled={bookmarkLoading}
              style={{marginLeft: '8px', color: currentlyBookmarked ? '#f59e0b' : '#9ca3af', border: 'none', backgroundColor: 'transparent', cursor: bookmarkLoading ? 'not-allowed' : 'pointer', fontSize: '14px', padding: '2px', minWidth: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onMouseOver={(e) => !bookmarkLoading && (e.currentTarget.style.color = '#f59e0b')}
              onMouseOut={(e) => !bookmarkLoading && (e.currentTarget.style.color = currentlyBookmarked ? '#f59e0b' : '#9ca3af')}
            >
              {currentlyBookmarked ? '⭐' : '☆'}
            </button>
          )}
        </div>

        <p style={{color: '#64748b', fontSize: '13px', marginBottom: '8px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
          {site.description || '투자 관련 정보를 제공하는 사이트입니다.'}
        </p>

        {/* 카테고리와 태그를 한 줄에 표현 */}
        <div style={{display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap'}}>
          <span style={{
            display: 'inline-block', 
            backgroundColor: getCategoryColor(site.category), 
            color: 'white', 
            fontSize: '11px', 
            fontWeight: '600', 
            padding: '3px 8px', 
            borderRadius: '12px'
          }}>
            {site.category}
          </span>
          {site.tags.length > 0 && (
            <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
              {site.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  style={{display: 'inline-block', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '10px', padding: '2px 6px', borderRadius: '8px'}}
                >
                  #{tag}
                </span>
              ))}
              {site.tags.length > 2 && (
                <span style={{fontSize: '10px', color: '#94a3b8'}}>+{site.tags.length - 2}</span>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  )
})

export { SiteCard }