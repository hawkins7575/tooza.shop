import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { theme } from '../styles/theme'

interface Category {
  id: string
  name: string
  count: number
  icon: string | null
  parent?: {
    name: string
    icon: string
    color: string
    children: string[]
  } | null
}

interface FilterPanelProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function FilterPanel({
  selectedCategory,
  onCategoryChange,
  searchTerm,
  onSearchChange
}: FilterPanelProps) {
  const [siteCategories, setSiteCategories] = useState<Category[]>([])
  const [youtubeCategories, setYoutubeCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  // 스타일 정의
  const panelStyles = {
    container: {
      width: '100%',
      maxWidth: '280px',
      backgroundColor: theme.colors.neutral[0],
      border: `1px solid ${theme.colors.neutral[200]}`,
      borderRadius: theme.borderRadius['2xl'],
      boxShadow: theme.shadows.lg,
      overflow: 'hidden' as const,
      height: 'fit-content' as const,
    },
    header: {
      padding: theme.spacing[6],
      background: theme.gradients.primarySoft,
      borderBottom: `1px solid ${theme.colors.primary[200]}`,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.primary[800],
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    headerIcon: {
      fontSize: theme.typography.fontSize.xl,
      background: theme.gradients.primary,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    searchSection: {
      padding: theme.spacing[5],
      borderBottom: `1px solid ${theme.colors.neutral[200]}`,
    },
    searchInput: {
      width: '100%',
      padding: theme.spacing[3],
      borderRadius: theme.borderRadius.lg,
      border: `2px solid ${theme.colors.neutral[200]}`,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.sans.join(', '),
      backgroundColor: theme.colors.neutral[0],
      color: theme.colors.neutral[900],
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
      outline: 'none',
    },
    sectionContainer: {
      padding: `${theme.spacing[1]} 0`,
    },
    sectionHeader: {
      padding: `${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[1]} ${theme.spacing[4]}`,
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.bold,
      color: theme.colors.neutral[500],
      textTransform: 'uppercase' as const,
      letterSpacing: theme.typography.letterSpacing.wide,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
    },
    categoryItem: {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
      margin: `0 ${theme.spacing[1]}`,
      borderRadius: theme.borderRadius.md,
      cursor: 'pointer',
      transition: `all ${theme.animation.duration.fast} ${theme.animation.easing.smooth}`,
      fontSize: theme.typography.fontSize.sm,
      fontWeight: theme.typography.fontWeight.medium,
    },
    categoryIcon: {
      width: '28px',
      height: '28px',
      borderRadius: theme.borderRadius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      flexShrink: 0,
    },
    categoryName: {
      flex: 1,
      color: theme.colors.neutral[700],
    },
    categoryCount: {
      fontSize: theme.typography.fontSize.xs,
      fontWeight: theme.typography.fontWeight.semibold,
      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
      borderRadius: theme.borderRadius.full,
      backgroundColor: theme.colors.neutral[100],
      color: theme.colors.neutral[600],
      minWidth: '24px',
      textAlign: 'center' as const,
    },
    allCategoriesItem: {
      backgroundColor: theme.colors.primary[50],
      borderLeft: `3px solid ${theme.colors.primary[500]}`,
    },
    activeCategoryItem: {
      backgroundColor: theme.colors.primary[50],
      borderLeft: `3px solid ${theme.colors.primary[500]}`,
    },
    loadingContainer: {
      padding: theme.spacing[8],
      textAlign: 'center' as const,
      color: theme.colors.neutral[500],
    },
    divider: {
      height: '1px',
      backgroundColor: theme.colors.neutral[200],
      margin: `${theme.spacing[1]} ${theme.spacing[3]}`,
    },
  }


  // 카테고리별 아이콘과 색상 정의
  const getCategoryStyle = (categoryName: string, isYoutube = false): { icon: string; color: string } => {
    const siteCategories: Record<string, { icon: string; color: string }> = {
      '교육': { icon: '🎓', color: theme.colors.info[500] },
      '뉴스': { icon: '📰', color: theme.colors.error[500] },
      '미국주식': { icon: '🇺🇸', color: theme.colors.primary[500] },
      '부동산': { icon: '🏠', color: theme.colors.warning[500] },
      '비상장주식': { icon: '📊', color: theme.colors.accent.purple[500] },
      '주식': { icon: '📈', color: theme.colors.primary[500] },
      '증권사': { icon: '🏢', color: theme.colors.success[500] },
      '코인': { icon: '₿', color: theme.colors.accent.purple[500] },
      '펀드': { icon: '💼', color: theme.colors.warning[500] },
    }

    const youtubeCategories: Record<string, { icon: string; color: string }> = {
      '주식분석': { icon: '📊', color: theme.colors.primary[500] },
      '암호화페': { icon: '₿', color: theme.colors.accent.purple[500] },
    }

    const categories = isYoutube ? youtubeCategories : siteCategories
    return categories[categoryName] || { 
      icon: isYoutube ? '📺' : '📋', 
      color: theme.colors.neutral[500] 
    }
  }


  useEffect(() => {
    const fetchCategories = async () => {
      console.log('🔄 FilterPanel: fetchCategories 시작')
      if (!supabase) {
        console.log('❌ FilterPanel: supabase가 없음')
        return
      }
      setLoading(true)
      
      try {
        // 먼저 실제 카테고리 계층 구조를 가져오기
        console.log('📊 FilterPanel: 카테고리 구조 조회 중...')
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })

        // 계층 구조 생성
        const hierarchy: {[key: string]: {id: string; icon: string; color: string; children: string[]}} = {}
        
        if (categoriesError) {
          console.error('❌ FilterPanel: 카테고리 구조 조회 실패:', categoriesError)
        } else {
          console.log('✅ FilterPanel: 카테고리 구조 조회 성공:', categoriesData?.length)
          // 상위-하위 카테고리 매핑 생성
          const parentCategories = categoriesData?.filter(cat => !cat.parent_id) || []
          console.log('📈 FilterPanel: 상위 카테고리 개수:', parentCategories.length)
          
          parentCategories.forEach(parent => {
            const children = categoriesData?.filter(cat => cat.parent_id === parent.id) || []
            hierarchy[parent.name] = {
              id: parent.id,
              icon: parent.icon || '📁',
              color: getCategoryStyle(parent.name).color,
              children: children.map(child => child.name)
            }
            console.log(`📂 FilterPanel: ${parent.name} -> ${children.length}개 하위 카테고리`)
          })
          
          console.log('🏗️ FilterPanel: 계층 구조 생성 완료:', hierarchy)
        }

        // 상위 카테고리 찾기 함수 (로컬 함수로 이동)
        const getParentCategory = (categoryName: string) => {
          for (const [parent, info] of Object.entries(hierarchy)) {
            if (info.children && info.children.includes(categoryName)) {
              return { name: parent, ...info }
            }
          }
          return null
        }

        // 사이트 카테고리 조회
        console.log('🌐 FilterPanel: 사이트 데이터 조회 중...')
        const { data: sitesData, error: sitesError } = await supabase
          .from('sites')
          .select('category')

        if (sitesError) {
          console.error('❌ FilterPanel: 사이트 데이터 조회 실패:', sitesError)
          throw sitesError
        }

        console.log('✅ FilterPanel: 사이트 데이터 조회 성공:', sitesData?.length)

        // 카테고리별 개수 계산
        const categoryCount: { [key: string]: number } = {}
        sitesData?.forEach(site => {
          categoryCount[site.category] = (categoryCount[site.category] || 0) + 1
        })

        console.log('📊 FilterPanel: 카테고리별 사이트 개수:', categoryCount)

        // 사이트 카테고리를 계층 구조로 생성 (주식 중복만 제거)
        const siteCategories = Object.keys(categoryCount)
          .filter(category => {
            // 개수가 있는 카테고리 포함, 단 '주식'은 부모 카테고리로 이미 표시되므로 제외
            return categoryCount[category] > 0 && category !== '주식'
          })
          .map((category, index) => ({
            id: `site-${index}`,
            name: category,
            count: categoryCount[category],
            icon: getCategoryStyle(category).icon,
            parent: getParentCategory(category)
          }))
          .sort((a, b) => {
            // 상위 카테고리별로 그룹화하여 정렬
            const aParent = a.parent?.name || 'Z기타'
            const bParent = b.parent?.name || 'Z기타'
            if (aParent !== bParent) {
              return aParent.localeCompare(bParent)
            }
            return b.count - a.count // 같은 그룹 내에서는 개수 순
          })

        console.log('🏗️ FilterPanel: 사이트 카테고리 생성 완료:', siteCategories.length)
        setSiteCategories(siteCategories)

        // 유튜브 카테고리 조회
        console.log('📺 FilterPanel: 유튜브 채널 데이터 조회 중...')
        const { data: channelsData, error: channelsError } = await supabase
          .from('youtube_channels')
          .select('category')

        if (channelsError) {
          console.log('❌ FilterPanel: YouTube 테이블 접근 불가:', channelsError)
          setYoutubeCategories([])
        } else {
          console.log('✅ FilterPanel: 유튜브 채널 데이터 조회 성공:', channelsData?.length)
          const youtubeCategoryCount: { [key: string]: number } = {}
          channelsData?.forEach(channel => {
            youtubeCategoryCount[channel.category] = (youtubeCategoryCount[channel.category] || 0) + 1
          })

          console.log('📊 FilterPanel: 유튜브 카테고리별 개수:', youtubeCategoryCount)

          // 유튜브 카테고리 생성 (개수가 있는 것만)
          const youtubeCategories = Object.keys(youtubeCategoryCount)
            .filter(category => youtubeCategoryCount[category] > 0)
            .map((category, index) => ({
              id: `youtube-${index}`,
              name: category,
              count: youtubeCategoryCount[category],
              icon: getCategoryStyle(category, true).icon,
            }))
            .sort((a, b) => b.count - a.count)

          console.log('🏗️ FilterPanel: 유튜브 카테고리 생성 완료:', youtubeCategories.length)
          setYoutubeCategories(youtubeCategories)
        }
      } catch (error) {
        console.error('❌ FilterPanel: 전체 카테고리 조회 실패:', error)
      } finally {
        console.log('✅ FilterPanel: 로딩 완료')
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const handleSearchFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = theme.colors.primary[500]
    e.target.style.boxShadow = `0 0 0 3px ${theme.colors.primary[100]}`
  }

  const handleSearchBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = theme.colors.neutral[200]
    e.target.style.boxShadow = 'none'
  }

  const isActive = (categoryName: string) => selectedCategory === categoryName

  // 계층 구조로 카테고리 렌더링
  const renderHierarchicalCategories = (categories: Category[]) => {
    const groupedCategories: { [key: string]: Category[] } = {}
    const parentCategories: { [key: string]: Category } = {}
    
    // 상위 카테고리별로 그룹화 및 상위 카테고리 자체도 찾기
    categories.forEach(category => {
      const parentName = category.parent?.name || '기타'
      if (!groupedCategories[parentName]) {
        groupedCategories[parentName] = []
      }
      groupedCategories[parentName].push(category)
      
      // 상위 카테고리가 실제로 사이트를 가지고 있는지 확인
      if (category.parent && category.name === parentName) {
        parentCategories[parentName] = category
      }
    })

    // 상위 카테고리 자체가 사이트를 가지고 있는지 확인하고 추가
    categories.forEach(category => {
      if (category.parent) return // 하위 카테고리는 건너뜀
      
      // 상위 카테고리와 동일한 이름의 실제 카테고리가 있고, 사이트 개수가 있는 경우에만 추가
      if (groupedCategories[category.name] && category.count > 0) {
        parentCategories[category.name] = category
      }
    })

    return Object.entries(groupedCategories).map(([parentName, childCategories]) => {
      const parentCategory = parentCategories[parentName]
      
      return (
        <div key={parentName} style={{ marginBottom: theme.spacing[2] }}>
          {/* 상위 카테고리 헤더 (클릭 가능하게) */}
          {parentName !== '기타' && (
            <div>
              {/* 상위 카테고리 자체가 사이트를 가지고 있다면 클릭 가능한 카테고리로 표시 */}
              {parentCategory ? (
                <div style={{ paddingLeft: 0, marginBottom: theme.spacing[1] }}>
                  {renderCategoryItem(parentCategory, false)}
                </div>
              ) : (
                <div style={{
                  ...panelStyles.sectionHeader,
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.neutral[400],
                  paddingBottom: theme.spacing[1],
                  marginBottom: theme.spacing[1]
                }}>
                  <span>{childCategories[0]?.parent?.icon || '📁'}</span>
                  {parentName}
                </div>
              )}
            </div>
          )}
          
          {/* 하위 카테고리들 */}
          {childCategories
            .filter(category => {
              // 상위 카테고리와 동일한 이름의 카테고리는 제외 (중복 방지)
              return category.name !== parentName
            })
            .map(category => (
              <div key={category.id} style={{ paddingLeft: parentName !== '기타' ? theme.spacing[3] : 0 }}>
                {renderCategoryItem(category, false)}
              </div>
            ))}
        </div>
      )
    })
  }

  const renderCategoryItem = (category: Category, isYoutube = false) => {
    const categoryKey = isYoutube ? `유튜브-${category.name}` : category.name
    const active = isActive(categoryKey)
    const style = getCategoryStyle(category.name, isYoutube)
    
    return (
      <div
        key={category.id}
        onClick={() => onCategoryChange(categoryKey)}
        style={{
          ...panelStyles.categoryItem,
          ...(active ? panelStyles.activeCategoryItem : {}),
          color: active ? theme.colors.primary[700] : theme.colors.neutral[700],
        }}
        onMouseOver={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = theme.colors.neutral[50]
          }
        }}
        onMouseOut={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = 'transparent'
          }
        }}
      >
        <div
          style={{
            ...panelStyles.categoryIcon,
            backgroundColor: active ? style.color + '20' : theme.colors.neutral[100],
            color: active ? style.color : theme.colors.neutral[600],
            border: active ? `2px solid ${style.color}40` : 'none',
          }}
        >
          {category.icon}
        </div>
        <span style={panelStyles.categoryName}>
          {category.name}
        </span>
        <span
          style={{
            ...panelStyles.categoryCount,
            backgroundColor: active ? theme.colors.primary[100] : theme.colors.neutral[100],
            color: active ? theme.colors.primary[700] : theme.colors.neutral[600],
          }}
        >
          {category.count}
        </span>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={panelStyles.container}>
        <div style={panelStyles.loadingContainer}>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: `3px solid ${theme.colors.neutral[200]}`,
              borderTop: `3px solid ${theme.colors.primary[500]}`,
              borderRadius: theme.borderRadius.full,
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
            }}
          />
          <div style={{ marginTop: theme.spacing[3], fontSize: theme.typography.fontSize.sm }}>
            카테고리 로딩 중...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={panelStyles.container}>
      {/* 헤더 */}
      <div style={panelStyles.header}>
        <h2 style={panelStyles.headerTitle}>
          <span style={panelStyles.headerIcon}>🔍</span>
          카테고리
        </h2>
      </div>

      {/* 검색 */}
      <div style={panelStyles.searchSection}>
        <input
          type="text"
          placeholder="사이트나 채널을 검색하세요..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          style={panelStyles.searchInput}
        />
      </div>

      <div style={panelStyles.sectionContainer}>
        {/* 전체 보기 */}
        <div
          onClick={() => onCategoryChange('')}
          style={{
            ...panelStyles.categoryItem,
            ...(selectedCategory === '' ? panelStyles.allCategoriesItem : {}),
            color: selectedCategory === '' ? theme.colors.primary[700] : theme.colors.neutral[700],
            margin: `0 ${theme.spacing[2]} ${theme.spacing[2]} ${theme.spacing[2]}`,
          }}
          onMouseOver={(e) => {
            if (selectedCategory !== '') {
              e.currentTarget.style.backgroundColor = theme.colors.neutral[50]
            }
          }}
          onMouseOut={(e) => {
            if (selectedCategory !== '') {
              e.currentTarget.style.backgroundColor = 'transparent'
            }
          }}
        >
          <div
            style={{
              ...panelStyles.categoryIcon,
              backgroundColor: selectedCategory === '' ? theme.colors.primary[100] : theme.colors.neutral[100],
              color: selectedCategory === '' ? theme.colors.primary[600] : theme.colors.neutral[600],
            }}
          >
            🏠
          </div>
          <span style={panelStyles.categoryName}>전체 보기</span>
          <span
            style={{
              ...panelStyles.categoryCount,
              backgroundColor: selectedCategory === '' ? theme.colors.primary[100] : theme.colors.neutral[100],
              color: selectedCategory === '' ? theme.colors.primary[700] : theme.colors.neutral[600],
            }}
          >
            {siteCategories.reduce((sum, cat) => sum + cat.count, 0) + youtubeCategories.reduce((sum, cat) => sum + cat.count, 0)}
          </span>
        </div>

        {/* 사이트 카테고리 섹션 - 계층 구조 */}
        {siteCategories.length > 0 && (
          <>
            <div style={panelStyles.sectionHeader}>
              <span>📊</span>
              투자 사이트 ({siteCategories.length})
            </div>
            {renderHierarchicalCategories(siteCategories)}
          </>
        )}

        {/* 구분선 */}
        {siteCategories.length > 0 && youtubeCategories.length > 0 && (
          <div style={panelStyles.divider} />
        )}

        {/* 유튜브 카테고리 섹션 */}
        {youtubeCategories.length > 0 && (
          <>
            <div style={panelStyles.sectionHeader}>
              <span>📺</span>
              유튜브 채널 ({youtubeCategories.length})
            </div>
            {youtubeCategories.map(category => renderCategoryItem(category, true))}
          </>
        )}
      </div>
    </div>
  )
}