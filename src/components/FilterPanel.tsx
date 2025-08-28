import React, { useState, useEffect } from 'react'
import { supabase, mockSupabase } from '../lib/supabase'

interface Category {
  id: string
  name: string
  count: number
  icon: string | null
  parent_id: string | null
  sort_order: number
  children?: Category[]
  level?: number
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
  const [categories, setCategories] = useState<Category[]>([])
  const [youtubeCategories, setYoutubeCategories] = useState<Category[]>([])


  useEffect(() => {
    fetchCategories()
    fetchYouTubeCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const client = supabase || mockSupabase
      
      // 카테고리와 사이트 수를 함께 조회
      const { data: categoriesData, error } = await client
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      
      // 각 카테고리별 사이트 수 계산
      const sitesResponse = await client
        .from('sites')
        .select('category')
      
      const siteCounts: Record<string, number> = {}
      const sitesData = 'data' in sitesResponse ? sitesResponse.data : []
      sitesData?.forEach((site: any) => {
        siteCounts[site.category] = (siteCounts[site.category] || 0) + 1
      })
      
      // 카테고리에 count 정보 추가
      const categoriesWithCount = categoriesData?.map((category: any) => ({
        ...category,
        count: siteCounts[category.name] || 0
      })) || []
      
      // 계층 구조 생성
      const parentCategories: Category[] = []
      const childrenMap: Record<string, Category[]> = {}
      
      categoriesWithCount.forEach((category: Category) => {
        if (!category.parent_id) {
          parentCategories.push(category)
        } else {
          if (!childrenMap[category.parent_id]) {
            childrenMap[category.parent_id] = []
          }
          childrenMap[category.parent_id].push(category)
        }
      })
      
      // 상위 카테고리에 하위 카테고리 연결
      const hierarchicalCategories = parentCategories.map(parent => ({
        ...parent,
        children: childrenMap[parent.id] || []
      }))
      
      setCategories(hierarchicalCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchYouTubeCategories = async () => {
    try {
      const client = supabase || mockSupabase
      
      // 유튜브 카테고리와 채널 수를 함께 조회
      const { data: ytCategoriesData, error } = await client
        .from('youtube_categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      
      // 각 유튜브 카테고리별 채널 수 계산
      const channelsResponse = await client
        .from('youtube_channels')
        .select('category')
      
      const channelCounts: Record<string, number> = {}
      const channelsData = 'data' in channelsResponse ? channelsResponse.data : []
      channelsData?.forEach((channel: any) => {
        channelCounts[channel.category] = (channelCounts[channel.category] || 0) + 1
      })
      
      // 유튜브 카테고리에 count 정보 추가
      const formattedData = ytCategoriesData?.map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        count: channelCounts[cat.name] || 0,
        icon: cat.icon || '▶️',
        parent_id: null,
        sort_order: cat.sort_order
      })) || []
      
      setYoutubeCategories(formattedData)
    } catch (error) {
      console.error('Error fetching YouTube categories:', error)
    }
  }

  const renderCategoryItem = (category: Category, isYoutube = false, level = 0) => (
    <button
      key={category.id}
      onClick={() => onCategoryChange(isYoutube ? `유튜브-${category.name}` : category.name)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        paddingLeft: `${12 + level * 16}px`,
        margin: '2px 0',
        backgroundColor: selectedCategory === category.name ? '#e0f2fe' : 'white',
        border: selectedCategory === category.name ? '1px solid #0284c7' : '1px solid #e5e7eb',
        borderRadius: '6px',
        fontSize: '13px',
        fontWeight: selectedCategory === category.name ? '500' : '400',
        color: selectedCategory === category.name ? '#0284c7' : level > 0 ? '#6b7280' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        textAlign: 'left'
      }}
      onMouseOver={(e) => {
        if (selectedCategory !== category.name) {
          e.currentTarget.style.backgroundColor = '#f8fafc'
          e.currentTarget.style.borderColor = '#cbd5e1'
        }
      }}
      onMouseOut={(e) => {
        if (selectedCategory !== category.name) {
          e.currentTarget.style.backgroundColor = 'white'
          e.currentTarget.style.borderColor = '#e5e7eb'
        }
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {level > 0 && (
          <span style={{ fontSize: '10px', color: '#9ca3af' }}>└</span>
        )}
        <span style={{ fontSize: '14px' }}>
          {isYoutube ? '▶️' : (category.icon || '📁')}
        </span>
        <span>{category.name}</span>
      </div>
      <span style={{
        backgroundColor: selectedCategory === category.name ? '#0284c7' : '#9ca3af',
        color: 'white',
        fontSize: '11px',
        padding: '2px 6px',
        borderRadius: '10px',
        minWidth: '20px',
        textAlign: 'center',
        lineHeight: '1.2'
      }}>
        {category.count || 0}
      </span>
    </button>
  )

  const renderHierarchicalCategories = (categories: Category[], level = 0): React.ReactElement[] => {
    const result: React.ReactElement[] = []
    
    categories.forEach(category => {
      // 상위 카테고리 렌더링
      result.push(
        <div key={category.id}>
          {renderCategoryItem(category, false, level)}
        </div>
      )
      
      // 하위 카테고리 렌더링
      if (category.children && category.children.length > 0) {
        const childElements = renderHierarchicalCategories(category.children, level + 1)
        result.push(...childElements)
      }
    })
    
    return result
  }

  return (
    <div style={{
      width: '320px',
      height: '100vh',
      backgroundColor: 'white',
      borderRight: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#fafafa'
      }}>
        <h2 style={{
          margin: '0 0 12px 0',
          fontSize: '18px',
          fontWeight: '700',
          color: '#1f2937'
        }}>
          카테고리
        </h2>
        
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            placeholder="사이트 검색..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 40px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: 'white',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = '#0284c7'}
            onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
          />
          <span style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#9ca3af',
            fontSize: '16px'
          }}>
            🔍
          </span>
        </div>
      </div>

      {/* Categories */}
      <div style={{
        flex: 1,
        padding: '12px',
        overflowY: 'auto'
      }}>
        {/* All Category */}
        <button
          onClick={() => onCategoryChange('')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            margin: '0 0 12px 0',
            backgroundColor: selectedCategory === '' ? '#e0f2fe' : 'white',
            border: selectedCategory === '' ? '1px solid #0284c7' : '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: selectedCategory === '' ? '500' : '400',
            color: selectedCategory === '' ? '#0284c7' : '#374151',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '14px' }}>🏠</span>
            <span>전체</span>
          </div>
        </button>

        {/* Main Categories */}
        {categories.length > 0 && (
          <div style={{ marginBottom: '18px' }}>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              주요 카테고리
            </h3>
            {renderHierarchicalCategories(categories)}
          </div>
        )}

        {/* YouTube Categories */}
        {youtubeCategories.length > 0 && (
          <div>
            <h3 style={{
              margin: '0 0 8px 0',
              fontSize: '12px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.3px'
            }}>
              유튜브 카테고리
            </h3>
            {youtubeCategories.map(category => renderCategoryItem(category, true))}
          </div>
        )}
      </div>
    </div>
  )
}