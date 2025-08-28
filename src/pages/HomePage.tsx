import React, { useState, useEffect, useCallback } from 'react'
import { SiteCard } from '../components/SiteCard'
import { FilterPanel } from '../components/FilterPanel'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { theme } from '../styles/theme'
import { styles } from '../styles/components'
import { useDebounce } from '../hooks/useDebounce'

interface Site {
  id: string
  title: string
  url: string
  description: string | null
  category: string
  tags: string[]
  thumbnail_url: string | null
  isBookmarked?: boolean
  isYoutube?: boolean
}

export function HomePage() {
  const { user } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  
  // 디바운스된 검색어
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // 스타일 정의
  const homeStyles = {
    container: {
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.neutral[25]} 0%, ${theme.colors.neutral[50]} 50%, ${theme.colors.primary[25]} 100%)`,
      position: 'relative' as const,
      overflow: 'hidden' as const,
    },
    contentWrapper: {
      maxWidth: theme.components.container.maxWidth,
      margin: theme.components.container.margin,
      padding: `${theme.spacing[6]} ${theme.spacing[6]}`,
      display: 'flex',
      gap: theme.spacing[8],
      flexDirection: isMobile ? 'column' as const : 'row' as const,
      position: 'relative' as const,
      zIndex: 1,
    },
    sidebar: {
      width: isMobile ? '100%' : '320px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing[6],
    },
    mainContent: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column' as const,
      gap: theme.spacing[8],
    },
    gridContainer: {
      display: 'grid',
      gridTemplateColumns: isMobile 
        ? 'repeat(auto-fill, minmax(280px, 1fr))' 
        : 'repeat(3, 1fr)',
      gap: theme.spacing[4],
      alignItems: 'start',
    },
    loadingContainer: {
      ...styles.loading,
      minHeight: '400px',
      backgroundColor: theme.colors.neutral[0],
      borderRadius: theme.borderRadius['2xl'],
      border: `1px solid ${theme.colors.neutral[200]}`,
    },
    emptyContainer: {
      ...styles.emptyState,
      backgroundColor: theme.colors.neutral[0],
      borderRadius: theme.borderRadius['2xl'],
      border: `1px solid ${theme.colors.neutral[200]}`,
      minHeight: '400px',
    },
    categorySection: {
      marginBottom: theme.spacing[8],
    },
    categoryHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      marginBottom: theme.spacing[4],
      paddingBottom: theme.spacing[2],
      borderBottom: `2px solid ${theme.colors.primary[200]}`,
    },
    categoryTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontWeight: 500,
      color: theme.colors.neutral[600],
      margin: 0,
    },
    categoryCount: {
      backgroundColor: theme.colors.primary[100],
      color: theme.colors.primary[700],
      fontSize: theme.typography.fontSize.xs,
      fontWeight: 500,
      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
      borderRadius: theme.borderRadius.full,
    },
    backgroundDecoration: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0.4,
      pointerEvents: 'none' as const,
      background: `radial-gradient(circle at 20% 20%, ${theme.colors.primary[100]} 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, ${theme.colors.accent.purple[100]} 0%, transparent 50%),
                  radial-gradient(circle at 60% 40%, ${theme.colors.success[100]} 0%, transparent 50%)`,
    },
  }

  // 모바일 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const fetchSites = useCallback(async () => {
    if (!supabase) return
    
    setLoading(true)
    try {
      // 특정 카테고리가 선택된 경우 (기존 로직 유지)
      if (selectedCategory) {
        // 유튜브 카테고리인지 확인
        const isYouTubeCategory = selectedCategory.startsWith('유튜브-')
        
        if (isYouTubeCategory) {
          // 유튜브 채널 데이터 조회
          const youtubeCategory = selectedCategory.replace('유튜브-', '')
          let query = supabase
            .from('youtube_channels')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('category', youtubeCategory)

          // 검색어가 있는 경우 필터링 추가
          if (debouncedSearchTerm) {
            query = query.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`)
          }

          const { data, error } = await query

          if (error) {
            console.error('유튜브 채널 조회 실패:', error)
            setSites([])
            return
          }

          let filteredChannels = data || []

          // 로그인된 사용자의 경우 북마크 정보 추가
          if (user) {
            let bookmarkedChannelIds = new Set()
            try {
              const { data: bookmarks } = await supabase
                .from('youtube_bookmarks')
                .select('channel_id')
                .eq('user_id', user.id)
              
              bookmarkedChannelIds = new Set(bookmarks?.map(b => b.channel_id) || [])
            } catch (error) {
              console.warn('YouTube bookmarks table not available:', error)
            }
            
            filteredChannels = filteredChannels.map(channel => ({
              ...channel,
              isBookmarked: bookmarkedChannelIds.has(channel.id)
            }))
          }

          setSites(filteredChannels)
        } else {
          // 일반 사이트 데이터 조회
          let query = supabase
            .from('sites')
            .select('*')
            .order('created_at', { ascending: false })
            .eq('category', selectedCategory)

          // 검색어가 있는 경우 필터링 추가
          if (debouncedSearchTerm) {
            query = query.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`)
          }

          const { data, error } = await query

          if (error) throw error

          let filteredSites = data || []

          // 로그인된 사용자의 경우 북마크 정보 추가
          if (user) {
            const { data: bookmarks } = await supabase
              .from('bookmarks')
              .select('site_id')
              .eq('user_id', user.id)
            
            const bookmarkedSiteIds = new Set(bookmarks?.map(b => b.site_id) || [])
            
            filteredSites = filteredSites.map(site => ({
              ...site,
              isBookmarked: bookmarkedSiteIds.has(site.id)
            }))
          }

          setSites(filteredSites)
        }
      } else {
        // 전체 데이터 조회 (카테고리별로 정렬하기 위해)
        // 1. 카테고리 순서 정보 가져오기
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })
        
        setCategories(categoriesData || [])

        // 2. 모든 사이트 데이터 조회
        let sitesQuery = supabase
          .from('sites')
          .select('*')

        // 검색어가 있는 경우 필터링 추가
        if (debouncedSearchTerm) {
          sitesQuery = sitesQuery.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`)
        }

        const { data: sitesData, error: sitesError } = await sitesQuery

        if (sitesError) throw sitesError

        let allSites = sitesData || []

        // 3. 유튜브 채널 데이터도 함께 조회
        let youtubeQuery = supabase
          .from('youtube_channels')
          .select('*')

        if (debouncedSearchTerm) {
          youtubeQuery = youtubeQuery.or(`title.ilike.%${debouncedSearchTerm}%,description.ilike.%${debouncedSearchTerm}%`)
        }

        const { data: youtubeData } = await youtubeQuery

        // 유튜브 데이터를 사이트 형식으로 변환
        const convertedYoutubeData = (youtubeData || []).map(channel => ({
          ...channel,
          category: `유튜브-${channel.category}`,
          isYoutube: true
        }))

        // 모든 데이터 합치기
        allSites = [...allSites, ...convertedYoutubeData]

        // 로그인된 사용자의 경우 북마크 정보 추가
        if (user) {
          let bookmarkedSiteIds = new Set()
          let bookmarkedChannelIds = new Set()
          
          try {
            const [sitesBookmarks, youtubeBookmarks] = await Promise.all([
              supabase.from('bookmarks').select('site_id').eq('user_id', user.id),
              supabase.from('youtube_bookmarks').select('channel_id').eq('user_id', user.id).throwOnError()
            ])
            
            bookmarkedSiteIds = new Set(sitesBookmarks.data?.map(b => b.site_id) || [])
            bookmarkedChannelIds = new Set(youtubeBookmarks.data?.map(b => b.channel_id) || [])
          } catch (error) {
            console.warn('Error loading bookmarks:', error)
            // 사이트 북마크만 로드
            try {
              const { data } = await supabase.from('bookmarks').select('site_id').eq('user_id', user.id)
              bookmarkedSiteIds = new Set(data?.map(b => b.site_id) || [])
            } catch (siteError) {
              console.warn('Error loading site bookmarks:', siteError)
            }
          }
          
          allSites = allSites.map(site => ({
            ...site,
            isBookmarked: site.isYoutube 
              ? bookmarkedChannelIds.has(site.id)
              : bookmarkedSiteIds.has(site.id)
          }))
        }

        setSites(allSites)
      }
    } catch (error) {
      console.error('데이터 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, user, debouncedSearchTerm])

  useEffect(() => {
    fetchSites()
  }, [fetchSites])

  // 카테고리별로 사이트 그룹화
  const groupSitesByCategory = () => {
    if (selectedCategory || sites.length === 0) return {}
    
    const grouped: { [key: string]: Site[] } = {}
    const categoryOrder: { [key: string]: number } = {}
    
    
    // 카테고리 순서 맵핑
    categories.forEach((cat, index) => {
      categoryOrder[cat.name] = cat.sort_order || index
    })

    // 유튜브 카테고리 추가 (일반 카테고리 이후)
    const maxOrder = Math.max(...Object.values(categoryOrder), 0)
    const youtubeCategories = Array.from(new Set(sites.filter(s => s.isYoutube).map(s => s.category)))
    youtubeCategories.forEach((cat, index) => {
      categoryOrder[cat] = maxOrder + index + 1
    })
    
    // 사이트를 카테고리별로 그룹화 (모든 사이트 표시)
    sites.forEach(site => {
      const category = site.category
      
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(site)
    })
    
    // 카테고리 순서대로 정렬
    const sortedCategories = Object.keys(grouped).sort((a, b) => {
      return (categoryOrder[a] || 999) - (categoryOrder[b] || 999)
    })
    
    const sortedGrouped: { [key: string]: Site[] } = {}
    sortedCategories.forEach(category => {
      sortedGrouped[category] = grouped[category]
    })
    
    return sortedGrouped
  }


  return (
    <div style={homeStyles.container}>
      {/* 배경 장식 */}
      <div style={homeStyles.backgroundDecoration} />
      

      {/* 메인 콘텐츠 */}
      <div style={homeStyles.contentWrapper}>
        {/* 사이드바 */}
        <aside style={homeStyles.sidebar}>
          {/* 필터 패널 */}
          <FilterPanel
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </aside>

        {/* 메인 콘텐츠 영역 */}
        <main style={homeStyles.mainContent}>

          {/* 콘텐츠 영역 */}
          {loading ? (
            <div style={homeStyles.loadingContainer}>
              <div style={{
                ...styles.loadingSpinner,
                borderColor: theme.colors.neutral[200],
                borderTopColor: theme.colors.primary[500],
              }}></div>
              <span>사이트를 불러오고 있습니다...</span>
            </div>
          ) : sites.length === 0 ? (
            <div style={homeStyles.emptyContainer}>
              <div style={styles.emptyStateIcon}>
                {selectedCategory.startsWith('유튜브-') ? '📺' : '📊'}
              </div>
              <h3 style={styles.emptyStateTitle}>
                {debouncedSearchTerm 
                  ? '검색 결과가 없습니다' 
                  : selectedCategory 
                    ? '해당 카테고리에 등록된 사이트가 없습니다'
                    : '사이트를 불러올 수 없습니다'
                }
              </h3>
              <p style={styles.emptyStateText}>
                {debouncedSearchTerm 
                  ? '다른 검색어를 입력해보세요' 
                  : selectedCategory 
                    ? '다른 카테고리를 선택해보세요'
                    : '잠시 후 다시 시도해주세요'
                }
              </p>
            </div>
          ) : (
            <div>
              {selectedCategory ? (
                // 특정 카테고리 선택된 경우 (기존 방식)
                <div style={homeStyles.gridContainer}>
                  {sites.map((site, index) => (
                    <React.Fragment key={site.id}>
                      <SiteCard 
                        site={site} 
                        isBookmarked={site.isBookmarked}
                        onBookmarkChange={fetchSites}
                      />
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                // 전체 보기 시 카테고리별로 그룹화하여 표시
                (() => {
                  const groupedSites = groupSitesByCategory()
                  return Object.entries(groupedSites).map(([category, categorySites], categoryIndex) => {
                    const isYoutubeCategory = category.startsWith('유튜브-')
                    const displayCategory = isYoutubeCategory 
                      ? `📺 ${category.replace('유튜브-', '')} (YouTube)`
                      : `📊 ${category}`
                    
                    return (
                      <div key={category} style={homeStyles.categorySection}>
                        {/* 카테고리 헤더 */}
                        <div style={homeStyles.categoryHeader}>
                          <h3 style={homeStyles.categoryTitle}>{displayCategory}</h3>
                          <span style={homeStyles.categoryCount}>
                            {categorySites.length}개
                          </span>
                        </div>
                        
                        {/* 카테고리별 사이트 그리드 */}
                        <div style={homeStyles.gridContainer}>
                          {categorySites.map((site, index) => (
                            <React.Fragment key={site.id}>
                              <SiteCard 
                                site={site} 
                                isBookmarked={site.isBookmarked}
                                onBookmarkChange={fetchSites}
                              />
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )
                  })
                })()
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}