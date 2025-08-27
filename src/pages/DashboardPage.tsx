import React, { useState, useEffect, useCallback } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { SiteCard } from '../components/SiteCard'

interface Site {
  id: string
  title: string
  url: string
  description: string | null
  category: string
  tags: string[]
  thumbnail_url: string | null
}

interface Bookmark {
  id: string
  site: Site
  created_at: string
}

interface FavoriteCategory {
  id: string
  name: string
  sites: Site[]
}

export function DashboardPage() {
  const { user } = useAuth()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [favoriteCategories, setFavoriteCategories] = useState<FavoriteCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'categories'>('bookmarks')

  const fetchBookmarks = useCallback(async () => {
    if (!user) return
    
    if (!supabase) {
      // Mock data for development without Supabase
      setBookmarks([])
      return
    }

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          id,
          created_at,
          site:sites(
            id,
            title,
            url,
            description,
            category,
            tags,
            thumbnail_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      const typedBookmarks = data?.map((item: any) => ({
        id: item.id,
        created_at: item.created_at,
        site: item.site as Site
      })) || []
      setBookmarks(typedBookmarks)
    } catch (error) {
      console.error('북마크 조회 실패:', error)
      setBookmarks([])
    }
  }, [user])

  const fetchFavoriteCategories = useCallback(async () => {
    if (!user) return
    
    if (!supabase) {
      // Mock data for development without Supabase
      setFavoriteCategories([])
      setLoading(false)
      return
    }

    try {
      const { data: bookmarkData, error } = await supabase
        .from('bookmarks')
        .select(`
          site:sites(
            id,
            title,
            url,
            description,
            category,
            tags,
            thumbnail_url
          )
        `)
        .eq('user_id', user.id)

      if (error) throw error

      const categorizedSites: { [key: string]: Site[] } = {}
      bookmarkData?.forEach((bookmark: any) => {
        const site = bookmark.site as Site
        if (!categorizedSites[site.category]) {
          categorizedSites[site.category] = []
        }
        categorizedSites[site.category].push(site)
      })

      const categories: FavoriteCategory[] = Object.entries(categorizedSites).map(([name, sites]) => ({
        id: name,
        name,
        sites
      }))

      setFavoriteCategories(categories)
      setLoading(false)
    } catch (error) {
      console.error('즐겨찾기 카테고리 조회 실패:', error)
      setFavoriteCategories([])
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchBookmarks()
      fetchFavoriteCategories()
    }
  }, [user, fetchBookmarks, fetchFavoriteCategories])

  const handleBookmarkChange = () => {
    fetchBookmarks()
    fetchFavoriteCategories()
  }

  if (!user) {
    return (
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
        <div style={{marginBottom: '40px', textAlign: 'center'}}>
          <div style={{width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '16px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <svg style={{width: '32px', height: '32px', color: 'white'}} fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </div>
          <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '12px', letterSpacing: '-1px'}}>
            대시보드
          </h1>
          <p style={{color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto 24px', lineHeight: '1.6'}}>
            로그인하면 개인화된 대시보드를 이용할 수 있습니다
          </p>
          <button
            onClick={() => window.location.href = '/#login'}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            로그인하기
          </button>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'}}>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a202c'}}>📈 내 투자 현황</h3>
            <p style={{color: '#64748b', marginBottom: '16px'}}>로그인하면 개인 투자 현황을 확인할 수 있습니다.</p>
          </div>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a202c'}}>⭐ 즐겨찾기</h3>
            <p style={{color: '#64748b', marginBottom: '16px'}}>좋아하는 투자 사이트를 즐겨찾기에 추가해보세요.</p>
          </div>
          <div style={{backgroundColor: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
            <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#1a202c'}}>📊 맞춤 추천</h3>
            <p style={{color: '#64748b', marginBottom: '16px'}}>개인 관심사에 맞는 사이트를 추천받을 수 있습니다.</p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{padding: '40px 24px', textAlign: 'center'}}>
        <div style={{width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px'}}></div>
        <p style={{color: '#64748b', fontSize: '16px'}}>로딩 중...</p>
      </div>
    )
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
      {/* 대시보드 헤더 */}
      <div style={{marginBottom: '40px', textAlign: 'center'}}>
        <div style={{width: '64px', height: '64px', backgroundColor: '#2563eb', borderRadius: '16px', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg style={{width: '32px', height: '32px', color: 'white'}} fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
          </svg>
        </div>
        <h1 style={{fontSize: '32px', fontWeight: '700', color: '#1a202c', marginBottom: '12px', letterSpacing: '-1px'}}>
          내 대시보드
        </h1>
        <p style={{color: '#64748b', fontSize: '16px', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6'}}>
          즐겨찾는 투자 사이트를 관리하고 카테고리별로 정리해보세요
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', justifyContent: 'center', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '6px'}}>
          <button
            onClick={() => setActiveTab('bookmarks')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'bookmarks' ? '#2563eb' : '#64748b',
              border: 'none',
              backgroundColor: activeTab === 'bookmarks' ? 'white' : 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: activeTab === 'bookmarks' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            즐겨찾기 ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'categories' ? '#2563eb' : '#64748b',
              border: 'none',
              backgroundColor: activeTab === 'categories' ? 'white' : 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: activeTab === 'categories' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            카테고리별 ({favoriteCategories.length})
          </button>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === 'bookmarks' ? (
        <div>
          {bookmarks.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 20px'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>📋</div>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '8px'}}>
                아직 즐겨찾기가 없습니다
              </h3>
              <p style={{color: '#64748b', fontSize: '16px', marginBottom: '24px'}}>
                홈페이지에서 마음에 드는 투자 사이트를 즐겨찾기에 추가해보세요.
              </p>
              <a
                href="/"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                사이트 둘러보기
              </a>
            </div>
          ) : (
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
              {bookmarks.map((bookmark) => (
                <SiteCard
                  key={bookmark.id}
                  site={bookmark.site}
                  isBookmarked={true}
                  onBookmarkChange={handleBookmarkChange}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          {favoriteCategories.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 20px'}}>
              <div style={{fontSize: '48px', marginBottom: '16px'}}>📁</div>
              <h3 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '8px'}}>
                즐겨찾기 카테고리가 없습니다
              </h3>
              <p style={{color: '#64748b', fontSize: '16px'}}>
                즐겨찾기를 추가하면 카테고리별로 자동 분류됩니다.
              </p>
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '32px'}}>
              {favoriteCategories.map((category) => (
                <div key={category.id}>
                  <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', marginBottom: '16px'}}>
                    {category.name} ({category.sites.length})
                  </h2>
                  <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px'}}>
                    {category.sites.map((site) => (
                      <SiteCard
                        key={site.id}
                        site={site}
                        isBookmarked={true}
                        onBookmarkChange={handleBookmarkChange}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}