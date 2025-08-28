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

  useEffect(() => {
    fetchCategories()
    fetchYouTubeCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const client = supabase || mockSupabase
      const { data, error } = await client
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchYouTubeCategories = async () => {
    try {
      const client = supabase || mockSupabase
      const { data, error } = await client
        .from('youtube_categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      if (data) {
        const formattedData = data.map(cat => ({
          id: cat.id,
          name: cat.name,
          count: 0,
          icon: '▶️',
          parent_id: null,
          sort_order: 0
        }))
        setYoutubeCategories(formattedData)
      }
    } catch (error) {
      console.error('Error fetching YouTube categories:', error)
    }
  }

  const renderCategoryItem = (category: Category, isYoutube = false) => (
    <button
      key={category.id}
      onClick={() => onCategoryChange(category.name)}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        margin: '4px 0',
        backgroundColor: selectedCategory === category.name ? '#e0f2fe' : 'white',
        border: selectedCategory === category.name ? '2px solid #0284c7' : '1px solid #e5e7eb',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: selectedCategory === category.name ? '600' : '400',
        color: selectedCategory === category.name ? '#0284c7' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '16px' }}>
          {isYoutube ? '▶️' : (category.icon || '📁')}
        </span>
        <span>{category.name}</span>
      </div>
      <span style={{
        backgroundColor: selectedCategory === category.name ? '#0284c7' : '#9ca3af',
        color: 'white',
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '12px',
        minWidth: '24px',
        textAlign: 'center'
      }}>
        {category.count || 0}
      </span>
    </button>
  )

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
        padding: '16px',
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
            padding: '12px 16px',
            margin: '0 0 16px 0',
            backgroundColor: selectedCategory === '' ? '#e0f2fe' : 'white',
            border: selectedCategory === '' ? '2px solid #0284c7' : '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: selectedCategory === '' ? '600' : '400',
            color: selectedCategory === '' ? '#0284c7' : '#374151',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '16px' }}>🏠</span>
            <span>전체</span>
          </div>
        </button>

        {/* Main Categories */}
        {categories.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              주요 카테고리
            </h3>
            {categories.map(category => renderCategoryItem(category))}
          </div>
        )}

        {/* YouTube Categories */}
        {youtubeCategories.length > 0 && (
          <div>
            <h3 style={{
              margin: '0 0 12px 0',
              fontSize: '14px',
              fontWeight: '600',
              color: '#6b7280',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
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