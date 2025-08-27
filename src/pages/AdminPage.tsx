import React, { useState, useEffect } from 'react'
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

interface YouTubeChannel {
  id: string
  title: string
  url: string
  description: string | null
  category: string
  tags: string[]
  thumbnail_url: string | null
}

interface Category {
  id: string
  name: string
  icon: string | null
  description: string | null
  count: number
  parent_id: string | null
  sort_order: number
  children?: Category[]
  level?: number
}

interface YouTubeCategory {
  id: string
  name: string
  icon: string | null
  description: string | null
  count: number
  parent_id: string | null
  sort_order: number
  children?: YouTubeCategory[]
  level?: number
}

export function AdminPage() {
  const { user, isAdmin } = useAuth()
  const [sites, setSites] = useState<Site[]>([])
  const [youtubeChannels, setYoutubeChannels] = useState<YouTubeChannel[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [youtubeCategories, setYoutubeCategories] = useState<YouTubeCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'sites' | 'youtube' | 'categories'>('sites')
  
  // 사이트 추가 폼 상태
  const [showAddSite, setShowAddSite] = useState(false)
  const [siteForm, setSiteForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: '',
    thumbnail_url: ''
  })

  // 카테고리 추가 폼 상태
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    icon: '',
    description: '',
    parent_id: ''
  })
  
  // 카테고리 수정 상태
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editCategoryForm, setEditCategoryForm] = useState({
    name: '',
    icon: '',
    description: '',
    parent_id: '',
    sort_order: 0
  })

  // 유튜브 카테고리 추가 폼 상태
  const [showAddYoutubeCategory, setShowAddYoutubeCategory] = useState(false)
  const [youtubeCategoryForm, setYoutubeCategoryForm] = useState({
    name: '',
    icon: '',
    description: '',
    parent_id: '',
    sort_order: 0
  })

  // 유튜브 카테고리 수정 상태
  const [editingYoutubeCategory, setEditingYoutubeCategory] = useState<YouTubeCategory | null>(null)
  const [editYoutubeCategoryForm, setEditYoutubeCategoryForm] = useState({
    name: '',
    icon: '',
    description: '',
    parent_id: '',
    sort_order: 0
  })
  
  // 사이트 수정 상태
  const [editingSite, setEditingSite] = useState<Site | null>(null)
  const [editSiteForm, setEditSiteForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: '',
    thumbnail_url: ''
  })

  // 유튜브 채널 추가 폼 상태
  const [showAddYoutube, setShowAddYoutube] = useState(false)
  const [youtubeForm, setYoutubeForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: '',
    thumbnail_url: ''
  })

  // 유튜브 채널 수정 상태
  const [editingYoutube, setEditingYoutube] = useState<YouTubeChannel | null>(null)
  const [editYoutubeForm, setEditYoutubeForm] = useState({
    title: '',
    url: '',
    description: '',
    category: '',
    tags: '',
    thumbnail_url: ''
  })

  useEffect(() => {
    if (user && isAdmin) {
      fetchSites()
      fetchYoutubeChannels()
      fetchCategories()
      fetchYoutubeCategories()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin])

  // 유튜브 채널 썸네일 추출 함수
  const extractYoutubeThumbnail = (url: string): string | null => {
    try {
      // 유튜브 채널 URL 패턴들
      const patterns = [
        /youtube\.com\/channel\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/c\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/user\/([a-zA-Z0-9_-]+)/,
        /youtube\.com\/@([a-zA-Z0-9_.-]+)/
      ]
      
      for (const pattern of patterns) {
        const match = url.match(pattern)
        if (match) {
          // 유튜브 채널 ID나 사용자명을 찾은 경우
          // 실제로는 YouTube API를 통해 썸네일을 가져와야 하지만,
          // 임시로 유튜브 기본 아이콘을 사용
          return `https://www.google.com/s2/favicons?domain=youtube.com&sz=64`
        }
      }
      
      return null
    } catch (error) {
      console.error('유튜브 썸네일 추출 실패:', error)
      return null
    }
  }

  // 자동 파비콘 감지 함수
  const autoDetectFavicon = async (url: string, formType: 'add' | 'edit' = 'add', targetForm: 'site' | 'youtube' = 'site') => {
    if (!url) return
    
    try {
      const domain = new URL(url).hostname
      const origin = new URL(url).origin
      
      // 파비콘 후보 URL들 (우선순위 순)
      const faviconCandidates = [
        `https://www.google.com/s2/favicons?domain=${domain}&sz=64`, // Google Favicon API (가장 안정적)
        `${origin}/favicon.ico`,
        `${origin}/apple-touch-icon.png`,
        `${origin}/android-chrome-192x192.png`,
        `https://favicon.im/${domain}?larger=true` // 대체 파비콘 서비스
      ]
      
      // 이미지 로드 테스트 함수
      const testImageUrl = (imageUrl: string): Promise<boolean> => {
        return new Promise((resolve) => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => resolve(true)
          img.onerror = () => resolve(false)
          img.src = imageUrl
          
          // 5초 타임아웃
          setTimeout(() => resolve(false), 5000)
        })
      }
      
      // 첫 번째로 로드되는 이미지 사용
      for (const candidate of faviconCandidates) {
        console.log(`파비콘 테스트 중: ${candidate}`)
        const isValid = await testImageUrl(candidate)
        
        if (isValid) {
          console.log(`파비콘 감지 성공: ${candidate}`)
          
          // 폼 타입에 따라 적절한 상태 업데이트
          if (formType === 'add') {
            if (targetForm === 'site') {
              setSiteForm(prev => ({...prev, thumbnail_url: candidate}))
            } else {
              setYoutubeForm(prev => ({...prev, thumbnail_url: candidate}))
            }
          } else if (formType === 'edit') {
            if (targetForm === 'site') {
              setEditSiteForm(prev => ({...prev, thumbnail_url: candidate}))
            } else {
              setEditYoutubeForm(prev => ({...prev, thumbnail_url: candidate}))
            }
          }
          
          alert(`파비콘이 자동으로 감지되었습니다: ${candidate}`)
          return
        }
      }
      
      // 모든 후보가 실패한 경우 Google API를 기본값으로 사용
      const fallbackUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`
      if (formType === 'add') {
        if (targetForm === 'site') {
          setSiteForm(prev => ({...prev, thumbnail_url: fallbackUrl}))
        } else {
          setYoutubeForm(prev => ({...prev, thumbnail_url: fallbackUrl}))
        }
      } else if (formType === 'edit') {
        if (targetForm === 'site') {
          setEditSiteForm(prev => ({...prev, thumbnail_url: fallbackUrl}))
        } else {
          setEditYoutubeForm(prev => ({...prev, thumbnail_url: fallbackUrl}))
        }
      }
      
      alert(`기본 파비콘 URL이 설정되었습니다: ${fallbackUrl}`)
      
    } catch (error) {
      console.error('파비콘 자동 감지 실패:', error)
      alert('올바른 URL을 입력해주세요.')
    }
  }

  const fetchSites = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('sites')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      setSites(data || [])
    } catch (error) {
      console.error('사이트 목록 조회 실패:', error)
    }
  }

  const fetchYoutubeChannels = async () => {
    if (!supabase) return
    
    try {
      const { data, error } = await supabase
        .from('youtube_channels')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('유튜브 채널 목록 조회 실패:', error)
        // 테이블이 없는 경우에도 에러를 무시하고 빈 배열 설정
        setYoutubeChannels([])
        return
      }
      setYoutubeChannels(data || [])
    } catch (error) {
      console.error('유튜브 채널 목록 조회 실패:', error)
      setYoutubeChannels([])
    }
  }

  const fetchYoutubeCategories = async () => {
    if (!supabase) return
    
    try {
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('youtube_categories')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (categoriesError) {
        console.error('유튜브 카테고리 목록 조회 실패:', categoriesError)
        setYoutubeCategories([])
        return
      }
      
      // 각 카테고리별 채널 개수 계산
      const { data: channelsData, error: channelsError } = await supabase
        .from('youtube_channels')
        .select('category')
      
      if (channelsError) {
        console.error('유튜브 채널 개수 조회 실패:', channelsError)
      }
      
      // 카테고리별 개수 계산
      const categoryCount: { [key: string]: number } = {}
      channelsData?.forEach(channel => {
        categoryCount[channel.category] = (categoryCount[channel.category] || 0) + 1
      })
      
      // 계층 구조 구축
      const hierarchicalCategories = buildCategoryHierarchy(categoriesData || [])
      
      // 채널 개수 추가
      hierarchicalCategories.forEach(category => {
        category.count = categoryCount[category.name] || 0
      })
      
      setYoutubeCategories(hierarchicalCategories)
    } catch (error) {
      console.error('유튜브 카테고리 목록 조회 실패:', error)
      setYoutubeCategories([])
    }
  }

  const buildCategoryHierarchy = (categories: any[]): Category[] => {
    const categoryMap = new Map<string, Category>()
    const rootCategories: Category[] = []
    
    // First pass: create category objects
    categories.forEach(cat => {
      categoryMap.set(cat.id, {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        description: cat.description,
        parent_id: cat.parent_id,
        sort_order: cat.sort_order || 0,
        count: 0,
        children: [],
        level: 0
      })
    })
    
    // Second pass: build hierarchy and calculate levels
    categories.forEach(cat => {
      const category = categoryMap.get(cat.id)!
      if (cat.parent_id) {
        const parent = categoryMap.get(cat.parent_id)
        if (parent) {
          parent.children!.push(category)
          category.level = (parent.level || 0) + 1
        }
      } else {
        rootCategories.push(category)
      }
    })
    
    // Sort categories by sort_order
    const sortCategories = (cats: Category[]) => {
      cats.sort((a, b) => a.sort_order - b.sort_order)
      cats.forEach(cat => {
        if (cat.children && cat.children.length > 0) {
          sortCategories(cat.children)
        }
      })
    }
    
    sortCategories(rootCategories)
    return Array.from(categoryMap.values())
  }


  const fetchCategories = async () => {
    if (!supabase) return
    
    try {
      // categories 테이블에서 카테고리 정보 가져오기 (parent_id와 sort_order 포함)
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      
      if (categoriesError) throw categoriesError
      
      // 각 카테고리별 사이트 개수 계산
      const { data: sitesData, error: sitesError } = await supabase
        .from('sites')
        .select('category')
      
      if (sitesError) throw sitesError
      
      // 카테고리별 개수 계산
      const categoryCount: { [key: string]: number } = {}
      sitesData?.forEach(site => {
        categoryCount[site.category] = (categoryCount[site.category] || 0) + 1
      })
      
      // 계층 구조 구축
      const hierarchicalCategories = buildCategoryHierarchy(categoriesData || [])
      
      // 사이트 개수 추가
      hierarchicalCategories.forEach(category => {
        category.count = categoryCount[category.name] || 0
      })
      
      setCategories(hierarchicalCategories)
    } catch (error) {
      console.error('카테고리 목록 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) return

    try {
      const { error } = await supabase
        .from('sites')
        .insert({
          title: siteForm.title,
          url: siteForm.url,
          description: siteForm.description || null,
          category: siteForm.category,
          tags: siteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          thumbnail_url: siteForm.thumbnail_url || null
        })

      if (error) throw error
      
      // 폼 초기화 및 목록 새로고침
      setSiteForm({
        title: '',
        url: '',
        description: '',
        category: '',
        tags: '',
        thumbnail_url: ''
      })
      setShowAddSite(false)
      await fetchSites()
      await fetchCategories()
      
      alert('사이트가 성공적으로 추가되었습니다.')
    } catch (error) {
      console.error('사이트 추가 실패:', error)
      alert('사이트 추가에 실패했습니다.')
    }
  }

  const handleDeleteSite = async (siteId: string) => {
    if (!supabase) return
    if (!window.confirm('정말로 이 사이트를 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('sites')
        .delete()
        .eq('id', siteId)

      if (error) throw error
      
      await fetchSites()
      await fetchCategories()
      alert('사이트가 삭제되었습니다.')
    } catch (error) {
      console.error('사이트 삭제 실패:', error)
      alert('사이트 삭제에 실패했습니다.')
    }
  }

  const handleEditSite = (site: Site) => {
    setEditingSite(site)
    setEditSiteForm({
      title: site.title,
      url: site.url,
      description: site.description || '',
      category: site.category,
      tags: site.tags.join(', '),
      thumbnail_url: site.thumbnail_url || ''
    })
  }

  const handleUpdateSite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !editingSite) return

    try {
      const { error } = await supabase
        .from('sites')
        .update({
          title: editSiteForm.title,
          url: editSiteForm.url,
          description: editSiteForm.description || null,
          category: editSiteForm.category,
          tags: editSiteForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          thumbnail_url: editSiteForm.thumbnail_url || null
        })
        .eq('id', editingSite.id)

      if (error) throw error
      
      setEditingSite(null)
      setEditSiteForm({
        title: '',
        url: '',
        description: '',
        category: '',
        tags: '',
        thumbnail_url: ''
      })
      await fetchSites()
      await fetchCategories()
      
      alert('사이트가 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error('사이트 수정 실패:', error)
      alert('사이트 수정에 실패했습니다.')
    }
  }

  // 유튜브 채널 CRUD 함수들
  const handleAddYoutube = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      alert('Supabase가 설정되지 않았습니다.')
      return
    }

    try {
      const { error } = await supabase
        .from('youtube_channels')
        .insert({
          title: youtubeForm.title,
          url: youtubeForm.url,
          description: youtubeForm.description || null,
          category: youtubeForm.category,
          tags: youtubeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          thumbnail_url: youtubeForm.thumbnail_url || null
        })

      if (error) {
        // 테이블이 없는 경우 특별한 처리
        if (error.message.includes('relation "youtube_channels" does not exist') || 
            error.message.includes('table "youtube_channels" does not exist')) {
          alert(`데이터베이스 설정이 필요합니다.\n\n유튜브 채널 기능을 사용하려면 다음 테이블을 생성해주세요:\n\n1. Supabase Dashboard → SQL Editor로 이동\n2. 다음 SQL을 실행하세요:\n\nCREATE TABLE youtube_channels (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  title VARCHAR(255) NOT NULL,\n  url VARCHAR(500) NOT NULL UNIQUE,\n  description TEXT,\n  category VARCHAR(100),\n  tags TEXT[] DEFAULT '{}',\n  thumbnail_url VARCHAR(500),\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`)
          return
        }
        throw error
      }
      
      setYoutubeForm({
        title: '',
        url: '',
        description: '',
        category: '',
        tags: '',
        thumbnail_url: ''
      })
      setShowAddYoutube(false)
      await fetchYoutubeChannels()
      
      alert('유튜브 채널이 성공적으로 추가되었습니다.')
    } catch (error: any) {
      console.error('유튜브 채널 추가 실패:', error)
      
      let errorMessage = '유튜브 채널 추가에 실패했습니다.'
      
      if (error?.message?.includes('duplicate key')) {
        errorMessage = '이미 존재하는 URL입니다.'
      } else if (error?.message?.includes('violates not-null constraint')) {
        errorMessage = '필수 정보가 누락되었습니다.'
      } else if (error?.message) {
        errorMessage += `\n오류: ${error.message}`
      }
      
      alert(errorMessage)
    }
  }

  const handleDeleteYoutube = async (channelId: string) => {
    if (!supabase) return
    if (!window.confirm('정말로 이 유튜브 채널을 삭제하시겠습니까?')) return

    try {
      const { error } = await supabase
        .from('youtube_channels')
        .delete()
        .eq('id', channelId)

      if (error) throw error
      
      await fetchYoutubeChannels()
      alert('유튜브 채널이 삭제되었습니다.')
    } catch (error) {
      console.error('유튜브 채널 삭제 실패:', error)
      alert('유튜브 채널 삭제에 실패했습니다.')
    }
  }

  const handleEditYoutube = (channel: YouTubeChannel) => {
    setEditingYoutube(channel)
    setEditYoutubeForm({
      title: channel.title,
      url: channel.url,
      description: channel.description || '',
      category: channel.category,
      tags: channel.tags.join(', '),
      thumbnail_url: channel.thumbnail_url || ''
    })
  }

  const handleUpdateYoutube = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !editingYoutube) return

    try {
      const { error } = await supabase
        .from('youtube_channels')
        .update({
          title: editYoutubeForm.title,
          url: editYoutubeForm.url,
          description: editYoutubeForm.description || null,
          category: editYoutubeForm.category,
          tags: editYoutubeForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
          thumbnail_url: editYoutubeForm.thumbnail_url || null
        })
        .eq('id', editingYoutube.id)

      if (error) throw error
      
      setEditingYoutube(null)
      setEditYoutubeForm({
        title: '',
        url: '',
        description: '',
        category: '',
        tags: '',
        thumbnail_url: ''
      })
      await fetchYoutubeChannels()
      
      alert('유튜브 채널이 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error('유튜브 채널 수정 실패:', error)
      alert('유튜브 채널 수정에 실패했습니다.')
    }
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !categoryForm.name.trim()) {
      alert('카테고리 이름을 입력해주세요.')
      return
    }

    try {
      // Get next sort order
      const maxSortOrder = categories.length > 0 ? Math.max(...categories.map(c => c.sort_order)) : 0
      
      console.log('카테고리 추가 시도:', {
        name: categoryForm.name.trim(),
        icon: categoryForm.icon.trim() || null,
        description: categoryForm.description.trim() || null,
        parent_id: categoryForm.parent_id || null,
        sort_order: maxSortOrder + 1
      })
      
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: categoryForm.name.trim(),
          icon: categoryForm.icon.trim() || null,
          description: categoryForm.description.trim() || null,
          parent_id: categoryForm.parent_id || null,
          sort_order: maxSortOrder + 1
        })
        .select()

      if (error) {
        console.error('Supabase 오류:', error)
        throw error
      }
      
      console.log('카테고리 추가 성공:', data)
      
      setCategoryForm({
        name: '',
        icon: '',
        description: '',
        parent_id: ''
      })
      setShowAddCategory(false)
      await fetchCategories()
      
      alert(`카테고리 '${categoryForm.name}'가 생성되었습니다.`)
    } catch (error: any) {
      console.error('카테고리 추가 실패:', error)
      alert(`카테고리 추가에 실패했습니다: ${error.message || '알 수 없는 오류'}`)
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setEditCategoryForm({
      name: category.name,
      icon: category.icon || '',
      description: category.description || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order
    })
  }

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !editingCategory) return

    try {
      const { error } = await supabase
        .from('categories')
        .update({
          name: editCategoryForm.name.trim(),
          icon: editCategoryForm.icon.trim() || null,
          description: editCategoryForm.description.trim() || null,
          parent_id: editCategoryForm.parent_id || null,
          sort_order: editCategoryForm.sort_order
        })
        .eq('id', editingCategory.id)

      if (error) throw error
      
      setEditingCategory(null)
      setEditCategoryForm({
        name: '',
        icon: '',
        description: '',
        parent_id: '',
        sort_order: 0
      })
      await fetchCategories()
      
      alert('카테고리가 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error('카테고리 수정 실패:', error)
      alert('카테고리 수정에 실패했습니다.')
    }
  }

  const handleMoveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    if (!supabase) return
    
    const category = categories.find(c => c.id === categoryId)
    if (!category) return
    
    const siblings = categories.filter(c => c.parent_id === category.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order)
    
    const currentIndex = siblings.findIndex(c => c.id === categoryId)
    
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === siblings.length - 1)) {
      return
    }
    
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapCategory = siblings[swapIndex]
    
    try {
      // Swap sort_order values
      await supabase
        .from('categories')
        .update({ sort_order: swapCategory.sort_order })
        .eq('id', category.id)
        
      await supabase
        .from('categories')
        .update({ sort_order: category.sort_order })
        .eq('id', swapCategory.id)
        
      await fetchCategories()
    } catch (error) {
      console.error('카테고리 이동 실패:', error)
      alert('카테고리 이동에 실패했습니다.')
    }
  }

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (!supabase) return
    
    // Check if category has children
    const hasChildren = categories.some(c => c.parent_id === categoryId)
    if (hasChildren) {
      alert('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다. 먼저 하위 카테고리를 삭제하거나 다른 상위 카테고리로 이동해주세요.')
      return
    }
    
    const sitesInCategory = sites.filter(site => site.category === categoryName)
    
    if (sitesInCategory.length > 0) {
      alert(`이 카테고리에는 ${sitesInCategory.length}개의 사이트가 있습니다. 카테고리를 삭제하려면 먼저 해당 사이트들을 다른 카테고리로 이동하거나 삭제해주세요.`)
      return
    }

    if (!window.confirm(`'${categoryName}' 카테고리를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      
      await fetchCategories()
      alert(`카테고리 '${categoryName}'가 삭제되었습니다.`)
    } catch (error) {
      console.error('카테고리 삭제 실패:', error)
      alert('카테고리 삭제에 실패했습니다.')
    }
  }

  // 유튜브 카테고리 CRUD 함수들
  const handleAddYoutubeCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      alert('Supabase가 설정되지 않았습니다.')
      return
    }
    
    if (!youtubeCategoryForm.name.trim()) {
      alert('카테고리 이름을 입력해주세요.')
      return
    }

    try {
      const maxSortOrder = youtubeCategories.length > 0 ? Math.max(...youtubeCategories.map(c => c.sort_order)) : 0
      
      const { error } = await supabase
        .from('youtube_categories')
        .insert({
          name: youtubeCategoryForm.name.trim(),
          icon: youtubeCategoryForm.icon.trim() || null,
          description: youtubeCategoryForm.description.trim() || null,
          parent_id: youtubeCategoryForm.parent_id || null,
          sort_order: maxSortOrder + 1
        })

      if (error) {
        // 테이블이 없는 경우 특별한 처리
        if (error.message.includes('relation "youtube_categories" does not exist') || 
            error.message.includes('table "youtube_categories" does not exist')) {
          alert(`데이터베이스 설정이 필요합니다.\n\n유튜브 카테고리 기능을 사용하려면 다음 테이블을 생성해주세요:\n\n1. Supabase Dashboard → SQL Editor로 이동\n2. 다음 SQL을 실행하세요:\n\nCREATE TABLE youtube_categories (\n  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,\n  name VARCHAR(100) NOT NULL UNIQUE,\n  description TEXT,\n  icon VARCHAR(50),\n  parent_id UUID REFERENCES youtube_categories(id) ON DELETE SET NULL,\n  sort_order INTEGER DEFAULT 0,\n  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),\n  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`)
          return
        }
        throw error
      }
      
      setYoutubeCategoryForm({
        name: '',
        icon: '',
        description: '',
        parent_id: '',
        sort_order: 0
      })
      setShowAddYoutubeCategory(false)
      await fetchYoutubeCategories()
      
      alert(`유튜브 카테고리 '${youtubeCategoryForm.name}'가 생성되었습니다.`)
    } catch (error: any) {
      console.error('유튜브 카테고리 추가 실패:', error)
      
      let errorMessage = '유튜브 카테고리 추가에 실패했습니다.'
      
      if (error?.message?.includes('duplicate key')) {
        errorMessage = '이미 존재하는 카테고리 이름입니다.'
      } else if (error?.message?.includes('violates not-null constraint')) {
        errorMessage = '카테고리 이름은 필수입니다.'
      } else if (error?.message) {
        errorMessage += `\n오류: ${error.message}`
      }
      
      alert(errorMessage)
    }
  }

  const handleEditYoutubeCategory = (category: YouTubeCategory) => {
    setEditingYoutubeCategory(category)
    setEditYoutubeCategoryForm({
      name: category.name,
      icon: category.icon || '',
      description: category.description || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order
    })
  }

  const handleUpdateYoutubeCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase || !editingYoutubeCategory) return

    try {
      const { error } = await supabase
        .from('youtube_categories')
        .update({
          name: editYoutubeCategoryForm.name.trim(),
          icon: editYoutubeCategoryForm.icon.trim() || null,
          description: editYoutubeCategoryForm.description.trim() || null,
          parent_id: editYoutubeCategoryForm.parent_id || null,
          sort_order: editYoutubeCategoryForm.sort_order
        })
        .eq('id', editingYoutubeCategory.id)

      if (error) throw error
      
      setEditingYoutubeCategory(null)
      setEditYoutubeCategoryForm({
        name: '',
        icon: '',
        description: '',
        parent_id: '',
        sort_order: 0
      })
      await fetchYoutubeCategories()
      
      alert('유튜브 카테고리가 성공적으로 수정되었습니다.')
    } catch (error) {
      console.error('유튜브 카테고리 수정 실패:', error)
      alert('유튜브 카테고리 수정에 실패했습니다.')
    }
  }

  const handleMoveYoutubeCategory = async (categoryId: string, direction: 'up' | 'down') => {
    if (!supabase) return
    
    const category = youtubeCategories.find(c => c.id === categoryId)
    if (!category) return
    
    const siblings = youtubeCategories.filter(c => c.parent_id === category.parent_id)
      .sort((a, b) => a.sort_order - b.sort_order)
    
    const currentIndex = siblings.findIndex(c => c.id === categoryId)
    
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === siblings.length - 1)) {
      return
    }
    
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapCategory = siblings[swapIndex]
    
    try {
      await supabase
        .from('youtube_categories')
        .update({ sort_order: swapCategory.sort_order })
        .eq('id', category.id)
        
      await supabase
        .from('youtube_categories')
        .update({ sort_order: category.sort_order })
        .eq('id', swapCategory.id)
        
      await fetchYoutubeCategories()
    } catch (error) {
      console.error('유튜브 카테고리 이동 실패:', error)
      alert('유튜브 카테고리 이동에 실패했습니다.')
    }
  }

  const handleDeleteYoutubeCategory = async (categoryId: string, categoryName: string) => {
    if (!supabase) return
    
    const hasChildren = youtubeCategories.some(c => c.parent_id === categoryId)
    if (hasChildren) {
      alert('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다. 먼저 하위 카테고리를 삭제하거나 다른 상위 카테고리로 이동해주세요.')
      return
    }
    
    const channelsInCategory = youtubeChannels.filter(channel => channel.category === categoryName)
    
    if (channelsInCategory.length > 0) {
      alert(`이 카테고리에는 ${channelsInCategory.length}개의 유튜브 채널이 있습니다. 카테고리를 삭제하려면 먼저 해당 채널들을 다른 카테고리로 이동하거나 삭제해주세요.`)
      return
    }

    if (!window.confirm(`'${categoryName}' 유튜브 카테고리를 삭제하시겠습니까?`)) {
      return
    }

    try {
      const { error } = await supabase
        .from('youtube_categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      
      await fetchYoutubeCategories()
      alert(`유튜브 카테고리 '${categoryName}'가 삭제되었습니다.`)
    } catch (error) {
      console.error('유튜브 카테고리 삭제 실패:', error)
      alert('유튜브 카테고리 삭제에 실패했습니다.')
    }
  }

  // 관리자가 아니거나 로그인하지 않은 경우
  if (!user || !isAdmin) {
    return (
      <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px', textAlign: 'center'}}>
        <h1 style={{fontSize: '24px', fontWeight: '600', color: '#1a202c', marginBottom: '16px'}}>
          접근 권한이 없습니다
        </h1>
        <p style={{color: '#64748b', fontSize: '16px'}}>
          관리자만 접근할 수 있는 페이지입니다.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px'}}>
        <div style={{width: '32px', height: '32px', border: '3px solid #e2e8f0', borderTop: '3px solid #2563eb', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
      </div>
    )
  }

  return (
    <div style={{maxWidth: '1200px', margin: '0 auto', padding: '32px 24px'}}>
      {/* 헤더 */}
      <div style={{marginBottom: '32px'}}>
        <h1 style={{fontSize: '28px', fontWeight: '700', color: '#1a202c', marginBottom: '8px'}}>
          관리자 페이지
        </h1>
        <p style={{color: '#64748b', fontSize: '16px'}}>
          사이트 및 카테고리를 관리할 수 있습니다
        </p>
      </div>

      {/* 탭 네비게이션 */}
      <div style={{marginBottom: '32px'}}>
        <div style={{display: 'flex', gap: '8px', backgroundColor: '#f8fafc', borderRadius: '12px', padding: '6px'}}>
          <button
            onClick={() => setActiveTab('sites')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'sites' ? '#2563eb' : '#64748b',
              border: 'none',
              backgroundColor: activeTab === 'sites' ? 'white' : 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: activeTab === 'sites' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            사이트 관리 ({sites.length})
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              color: activeTab === 'youtube' ? '#2563eb' : '#64748b',
              border: 'none',
              backgroundColor: activeTab === 'youtube' ? 'white' : 'transparent',
              cursor: 'pointer',
              borderRadius: '8px',
              boxShadow: activeTab === 'youtube' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            📺 유튜브 관리 ({youtubeChannels.length})
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
            카테고리 관리 ({categories.length + youtubeCategories.length})
          </button>
        </div>
      </div>

      {/* 사이트 관리 탭 */}
      {activeTab === 'sites' && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', margin: 0}}>
              사이트 목록
            </h2>
            <button
              onClick={() => setShowAddSite(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + 사이트 추가
            </button>
          </div>

          {/* 사이트 추가 폼 */}
          {showAddSite && (
            <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                새 사이트 추가
              </h3>
              <form onSubmit={handleAddSite} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    사이트 제목 *
                  </label>
                  <input
                    type="text"
                    value={siteForm.title}
                    onChange={(e) => setSiteForm({...siteForm, title: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    URL *
                  </label>
                  <input
                    type="url"
                    value={siteForm.url}
                    onChange={(e) => setSiteForm({...siteForm, url: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    카테고리 *
                  </label>
                  <select
                    value={siteForm.category}
                    onChange={(e) => setSiteForm({...siteForm, category: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    설명
                  </label>
                  <textarea
                    value={siteForm.description}
                    onChange={(e) => setSiteForm({...siteForm, description: e.target.value})}
                    rows={3}
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={siteForm.tags}
                    onChange={(e) => setSiteForm({...siteForm, tags: e.target.value})}
                    placeholder="예: 주식, 투자, 분석"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    썸네일 URL
                  </label>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="url"
                      value={siteForm.thumbnail_url}
                      onChange={(e) => setSiteForm({...siteForm, thumbnail_url: e.target.value})}
                      placeholder="사이트 로고나 파비콘 URL"
                      style={{flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                    <button
                      type="button"
                      onClick={() => autoDetectFavicon(siteForm.url, 'add', 'site')}
                      disabled={!siteForm.url}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #d1d5db',
                        backgroundColor: siteForm.url ? '#f3f4f6' : '#e5e7eb',
                        color: siteForm.url ? '#374151' : '#9ca3af',
                        borderRadius: '6px',
                        cursor: siteForm.url ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🔍 자동감지
                    </button>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => setShowAddSite(false)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 사이트 수정 폼 */}
          {editingSite && (
            <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                사이트 수정
              </h3>
              <form onSubmit={handleUpdateSite} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    사이트 제목 *
                  </label>
                  <input
                    type="text"
                    value={editSiteForm.title}
                    onChange={(e) => setEditSiteForm({...editSiteForm, title: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    URL *
                  </label>
                  <input
                    type="url"
                    value={editSiteForm.url}
                    onChange={(e) => setEditSiteForm({...editSiteForm, url: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    카테고리 *
                  </label>
                  <select
                    value={editSiteForm.category}
                    onChange={(e) => setEditSiteForm({...editSiteForm, category: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    설명
                  </label>
                  <textarea
                    value={editSiteForm.description}
                    onChange={(e) => setEditSiteForm({...editSiteForm, description: e.target.value})}
                    rows={3}
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={editSiteForm.tags}
                    onChange={(e) => setEditSiteForm({...editSiteForm, tags: e.target.value})}
                    placeholder="예: 주식, 투자, 분석"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    썸네일 URL
                  </label>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="url"
                      value={editSiteForm.thumbnail_url}
                      onChange={(e) => setEditSiteForm({...editSiteForm, thumbnail_url: e.target.value})}
                      placeholder="사이트 로고나 파비콘 URL"
                      style={{flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                    <button
                      type="button"
                      onClick={() => autoDetectFavicon(editSiteForm.url, 'edit', 'site')}
                      disabled={!editSiteForm.url}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #d1d5db',
                        backgroundColor: editSiteForm.url ? '#f3f4f6' : '#e5e7eb',
                        color: editSiteForm.url ? '#374151' : '#9ca3af',
                        borderRadius: '6px',
                        cursor: editSiteForm.url ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🔍 자동감지
                    </button>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => setEditingSite(null)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    수정
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 사이트 목록 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {sites.map((site) => (
              <div key={site.id} style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '4px'}}>
                      {site.title}
                    </h3>
                    <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px'}}>
                      {site.url}
                    </p>
                    {site.description && (
                      <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px'}}>
                        {site.description}
                      </p>
                    )}
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px'}}>
                      <span style={{fontSize: '12px', padding: '2px 8px', backgroundColor: '#e2e8f0', borderRadius: '12px', color: '#374151'}}>
                        {site.category}
                      </span>
                      {site.tags.map((tag, index) => (
                        <span key={index} style={{fontSize: '12px', padding: '2px 8px', backgroundColor: '#dbeafe', borderRadius: '12px', color: '#1e40af'}}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => handleEditSite(site)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #2563eb',
                        backgroundColor: 'white',
                        color: '#2563eb',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteSite(site.id)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #ef4444',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 유튜브 관리 탭 */}
      {activeTab === 'youtube' && (
        <div>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
            <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', margin: 0}}>
              📺 유튜브 채널 목록
            </h2>
            <button
              onClick={() => setShowAddYoutube(true)}
              style={{
                backgroundColor: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              + 유튜브 채널 추가
            </button>
          </div>

          {/* 유튜브 채널 추가 폼 */}
          {showAddYoutube && (
            <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                새 유튜브 채널 추가
              </h3>
              <form onSubmit={handleAddYoutube} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    채널명 *
                  </label>
                  <input
                    type="text"
                    value={youtubeForm.title}
                    onChange={(e) => setYoutubeForm({...youtubeForm, title: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    유튜브 URL *
                  </label>
                  <input
                    type="url"
                    value={youtubeForm.url}
                    onChange={(e) => setYoutubeForm({...youtubeForm, url: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    카테고리 *
                  </label>
                  <select
                    value={youtubeForm.category}
                    onChange={(e) => setYoutubeForm({...youtubeForm, category: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  >
                    <option value="">카테고리 선택</option>
                    {youtubeCategories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    설명
                  </label>
                  <textarea
                    value={youtubeForm.description}
                    onChange={(e) => setYoutubeForm({...youtubeForm, description: e.target.value})}
                    rows={3}
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={youtubeForm.tags}
                    onChange={(e) => setYoutubeForm({...youtubeForm, tags: e.target.value})}
                    placeholder="예: 주식, 투자, 분석"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    썸네일 URL
                  </label>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="url"
                      value={youtubeForm.thumbnail_url}
                      onChange={(e) => setYoutubeForm({...youtubeForm, thumbnail_url: e.target.value})}
                      placeholder="채널 로고나 썸네일 URL"
                      style={{flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const youtubeThumbnail = extractYoutubeThumbnail(youtubeForm.url)
                        if (youtubeThumbnail) {
                          setYoutubeForm(prev => ({...prev, thumbnail_url: youtubeThumbnail}))
                          alert('유튜브 채널 썸네일이 설정되었습니다.')
                        } else {
                          // 일반 사이트로 처리
                          autoDetectFavicon(youtubeForm.url, 'add', 'youtube')
                        }
                      }}
                      disabled={!youtubeForm.url}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #d1d5db',
                        backgroundColor: youtubeForm.url ? '#f3f4f6' : '#e5e7eb',
                        color: youtubeForm.url ? '#374151' : '#9ca3af',
                        borderRadius: '6px',
                        cursor: youtubeForm.url ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🔍 자동감지
                    </button>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => setShowAddYoutube(false)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 유튜브 채널 수정 폼 */}
          {editingYoutube && (
            <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                유튜브 채널 수정
              </h3>
              <form onSubmit={handleUpdateYoutube} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    채널명 *
                  </label>
                  <input
                    type="text"
                    value={editYoutubeForm.title}
                    onChange={(e) => setEditYoutubeForm({...editYoutubeForm, title: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    유튜브 URL *
                  </label>
                  <input
                    type="url"
                    value={editYoutubeForm.url}
                    onChange={(e) => setEditYoutubeForm({...editYoutubeForm, url: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    카테고리 *
                  </label>
                  <select
                    value={editYoutubeForm.category}
                    onChange={(e) => setEditYoutubeForm({...editYoutubeForm, category: e.target.value})}
                    required
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  >
                    <option value="">카테고리 선택</option>
                    {youtubeCategories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    설명
                  </label>
                  <textarea
                    value={editYoutubeForm.description}
                    onChange={(e) => setEditYoutubeForm({...editYoutubeForm, description: e.target.value})}
                    rows={3}
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', resize: 'vertical'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    태그 (쉼표로 구분)
                  </label>
                  <input
                    type="text"
                    value={editYoutubeForm.tags}
                    onChange={(e) => setEditYoutubeForm({...editYoutubeForm, tags: e.target.value})}
                    placeholder="예: 주식, 투자, 분석"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    썸네일 URL
                  </label>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <input
                      type="url"
                      value={editYoutubeForm.thumbnail_url}
                      onChange={(e) => setEditYoutubeForm({...editYoutubeForm, thumbnail_url: e.target.value})}
                      placeholder="채널 로고나 썸네일 URL"
                      style={{flex: 1, padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const youtubeThumbnail = extractYoutubeThumbnail(editYoutubeForm.url)
                        if (youtubeThumbnail) {
                          setEditYoutubeForm(prev => ({...prev, thumbnail_url: youtubeThumbnail}))
                          alert('유튜브 채널 썸네일이 설정되었습니다.')
                        } else {
                          // 일반 사이트로 처리
                          autoDetectFavicon(editYoutubeForm.url, 'edit', 'youtube')
                        }
                      }}
                      disabled={!editYoutubeForm.url}
                      style={{
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #d1d5db',
                        backgroundColor: editYoutubeForm.url ? '#f3f4f6' : '#e5e7eb',
                        color: editYoutubeForm.url ? '#374151' : '#9ca3af',
                        borderRadius: '6px',
                        cursor: editYoutubeForm.url ? 'pointer' : 'not-allowed',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      🔍 자동감지
                    </button>
                  </div>
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => setEditingYoutube(null)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    수정
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 유튜브 채널 목록 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {youtubeChannels.map((channel) => (
              <div key={channel.id} style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div style={{flex: 1}}>
                    <h3 style={{fontSize: '16px', fontWeight: '600', color: '#1a202c', marginBottom: '4px'}}>
                      📺 {channel.title}
                    </h3>
                    <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px'}}>
                      {channel.url}
                    </p>
                    {channel.description && (
                      <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px'}}>
                        {channel.description}
                      </p>
                    )}
                    <div style={{display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px'}}>
                      <span style={{fontSize: '12px', padding: '2px 8px', backgroundColor: '#fee2e2', borderRadius: '12px', color: '#ef4444'}}>
                        {channel.category}
                      </span>
                      {channel.tags.map((tag, index) => (
                        <span key={index} style={{fontSize: '12px', padding: '2px 8px', backgroundColor: '#dbeafe', borderRadius: '12px', color: '#1e40af'}}>
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{display: 'flex', gap: '8px'}}>
                    <button
                      onClick={() => handleEditYoutube(channel)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #ef4444',
                        backgroundColor: 'white',
                        color: '#ef4444',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDeleteYoutube(channel.id)}
                      style={{
                        padding: '4px 8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #dc2626',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리 관리 탭 */}
      {activeTab === 'categories' && (
        <div>
          {/* 사이트 카테고리 섹션 */}
          <div style={{marginBottom: '48px'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', margin: 0, marginBottom: '4px'}}>
                  🌐 사이트 카테고리 관리
                </h2>
                <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>
                  투자 사이트의 카테고리를 관리합니다
                </p>
              </div>
              <button
                onClick={() => setShowAddCategory(true)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + 사이트 카테고리 추가
              </button>
            </div>

          {/* 카테고리 수정 폼 */}
          {editingCategory && (
            <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                카테고리 수정
              </h3>
              <form onSubmit={handleUpdateCategory} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    카테고리 이름 *
                  </label>
                  <input
                    type="text"
                    value={editCategoryForm.name}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, name: e.target.value})}
                    required
                    placeholder="예: 주식, 부동산, 암호화폐"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    아이콘
                  </label>
                  <input
                    type="text"
                    value={editCategoryForm.icon}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, icon: e.target.value})}
                    placeholder="예: 📈, 🏠, ₿"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    상위 카테고리
                  </label>
                  <select
                    value={editCategoryForm.parent_id}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, parent_id: e.target.value})}
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  >
                    <option value="">상위 카테고리 선택 (선택안함 = 최상위)</option>
                    {categories.filter(c => !c.parent_id && c.id !== editingCategory.id).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    설명
                  </label>
                  <input
                    type="text"
                    value={editCategoryForm.description}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, description: e.target.value})}
                    placeholder="카테고리에 대한 간단한 설명"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    정렬 순서
                  </label>
                  <input
                    type="number"
                    value={editCategoryForm.sort_order}
                    onChange={(e) => setEditCategoryForm({...editCategoryForm, sort_order: parseInt(e.target.value) || 0})}
                    min="0"
                    placeholder="숫자가 낮을수록 앞에 표시됩니다"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => setEditingCategory(null)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    수정
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 카테고리 추가 폼 */}
          {showAddCategory && (
            <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
              <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                새 카테고리 추가
              </h3>
              <form onSubmit={handleAddCategory} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    카테고리 이름 *
                  </label>
                  <input
                    type="text"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                    required
                    placeholder="예: 주식, 부동산, 암호화폐"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    아이콘
                  </label>
                  <input
                    type="text"
                    value={categoryForm.icon}
                    onChange={(e) => setCategoryForm({...categoryForm, icon: e.target.value})}
                    placeholder="예: 📈, 🏠, ₿"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    상위 카테고리
                  </label>
                  <select
                    value={categoryForm.parent_id}
                    onChange={(e) => setCategoryForm({...categoryForm, parent_id: e.target.value})}
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  >
                    <option value="">상위 카테고리 선택 (선택안함 = 최상위)</option>
                    {categories.filter(c => !c.parent_id).map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                    설명
                  </label>
                  <input
                    type="text"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({...categoryForm, description: e.target.value})}
                    placeholder="카테고리에 대한 간단한 설명"
                    style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                  />
                </div>
                <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                  <button
                    type="button"
                    onClick={() => setShowAddCategory(false)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: '1px solid #d1d5db',
                      backgroundColor: 'white',
                      color: '#374151',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      fontWeight: '500',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    추가
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 카테고리 목록 */}
          <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
            {categories
              .filter(category => !category.parent_id)
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((category) => (
                <div key={category.id}>
                  {/* 상위 카테고리 */}
                  <div style={{backgroundColor: 'white', border: '2px solid #e2e8f0', borderRadius: '8px', padding: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                          {category.icon && (
                            <span style={{fontSize: '24px', marginRight: '12px'}}>{category.icon}</span>
                          )}
                          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1a202c', margin: 0}}>
                            {category.name}
                          </h3>
                          <span style={{marginLeft: '12px', padding: '4px 8px', backgroundColor: '#dbeafe', borderRadius: '12px', fontSize: '12px', color: '#1e40af', fontWeight: '500'}}>
                            상위 카테고리
                          </span>
                        </div>
                        {category.description && (
                          <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: '1.4'}}>
                            {category.description}
                          </p>
                        )}
                        <p style={{fontSize: '14px', color: '#64748b', fontWeight: '500'}}>
                          {category.count}개 사이트
                        </p>
                      </div>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        {/* 위치 이동 버튼 */}
                        <button
                          onClick={() => handleMoveCategory(category.id, 'up')}
                          style={{
                            padding: '6px 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #6b7280',
                            backgroundColor: 'white',
                            color: '#6b7280',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveCategory(category.id, 'down')}
                          style={{
                            padding: '6px 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #6b7280',
                            backgroundColor: 'white',
                            color: '#6b7280',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEditCategory(category)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #2563eb',
                            backgroundColor: 'white',
                            color: '#2563eb',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id, category.name)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #ef4444',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* 하위 카테고리 */}
                  {categories
                    .filter(child => child.parent_id === category.id)
                    .sort((a, b) => a.sort_order - b.sort_order)
                    .map((childCategory) => (
                      <div key={childCategory.id} style={{marginTop: '8px', marginLeft: '40px'}}>
                        <div style={{backgroundColor: '#f9fafb', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '16px'}}>
                          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                            <div style={{flex: 1}}>
                              <div style={{display: 'flex', alignItems: 'center', marginBottom: '6px'}}>
                                <span style={{fontSize: '16px', marginRight: '8px', color: '#9ca3af'}}>└</span>
                                {childCategory.icon && (
                                  <span style={{fontSize: '18px', marginRight: '8px'}}>{childCategory.icon}</span>
                                )}
                                <h4 style={{fontSize: '16px', fontWeight: '500', color: '#1a202c', margin: 0}}>
                                  {childCategory.name}
                                </h4>
                                <span style={{marginLeft: '8px', padding: '2px 6px', backgroundColor: '#fef3c7', borderRadius: '8px', fontSize: '10px', color: '#92400e', fontWeight: '500'}}>
                                  하위 카테고리
                                </span>
                              </div>
                              {childCategory.description && (
                                <p style={{fontSize: '13px', color: '#64748b', marginBottom: '6px', lineHeight: '1.4', marginLeft: '24px'}}>
                                  {childCategory.description}
                                </p>
                              )}
                              <p style={{fontSize: '13px', color: '#64748b', fontWeight: '500', marginLeft: '24px'}}>
                                {childCategory.count}개 사이트
                              </p>
                            </div>
                            <div style={{display: 'flex', gap: '6px', alignItems: 'center'}}>
                              <button
                                onClick={() => handleMoveCategory(childCategory.id, 'up')}
                                style={{
                                  padding: '4px 6px',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  border: '1px solid #6b7280',
                                  backgroundColor: 'white',
                                  color: '#6b7280',
                                  borderRadius: '3px',
                                  cursor: 'pointer'
                                }}
                              >
                                ↑
                              </button>
                              <button
                                onClick={() => handleMoveCategory(childCategory.id, 'down')}
                                style={{
                                  padding: '4px 6px',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  border: '1px solid #6b7280',
                                  backgroundColor: 'white',
                                  color: '#6b7280',
                                  borderRadius: '3px',
                                  cursor: 'pointer'
                                }}
                              >
                                ↓
                              </button>
                              <button
                                onClick={() => handleEditCategory(childCategory)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  border: '1px solid #2563eb',
                                  backgroundColor: 'white',
                                  color: '#2563eb',
                                  borderRadius: '3px',
                                  cursor: 'pointer'
                                }}
                              >
                                수정
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(childCategory.id, childCategory.name)}
                                style={{
                                  padding: '4px 8px',
                                  fontSize: '10px',
                                  fontWeight: '500',
                                  border: '1px solid #ef4444',
                                  backgroundColor: 'white',
                                  color: '#ef4444',
                                  borderRadius: '3px',
                                  cursor: 'pointer'
                                }}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))
            }
          </div>
        </div>

        {/* 유튜브 카테고리 섹션 */}
          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px'}}>
              <div>
                <h2 style={{fontSize: '20px', fontWeight: '600', color: '#1a202c', margin: 0, marginBottom: '4px'}}>
                  📺 유튜브 카테고리 관리
                </h2>
                <p style={{fontSize: '14px', color: '#64748b', margin: 0}}>
                  유튜브 채널의 카테고리를 관리합니다
                </p>
              </div>
              <button
                onClick={() => setShowAddYoutubeCategory(true)}
                style={{
                  backgroundColor: '#ef4444',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                + 유튜브 카테고리 추가
              </button>
            </div>

            {/* 유튜브 카테고리 수정 폼 */}
            {editingYoutubeCategory && (
              <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                  유튜브 카테고리 수정
                </h3>
                <form onSubmit={handleUpdateYoutubeCategory} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      카테고리 이름 *
                    </label>
                    <input
                      type="text"
                      value={editYoutubeCategoryForm.name}
                      onChange={(e) => setEditYoutubeCategoryForm({...editYoutubeCategoryForm, name: e.target.value})}
                      required
                      placeholder="예: 주식분석, 경제뉴스, 투자교육"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      아이콘
                    </label>
                    <input
                      type="text"
                      value={editYoutubeCategoryForm.icon}
                      onChange={(e) => setEditYoutubeCategoryForm({...editYoutubeCategoryForm, icon: e.target.value})}
                      placeholder="예: 📈, 📰, 🎓"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      설명
                    </label>
                    <input
                      type="text"
                      value={editYoutubeCategoryForm.description}
                      onChange={(e) => setEditYoutubeCategoryForm({...editYoutubeCategoryForm, description: e.target.value})}
                      placeholder="카테고리에 대한 간단한 설명"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      정렬 순서
                    </label>
                    <input
                      type="number"
                      value={editYoutubeCategoryForm.sort_order}
                      onChange={(e) => setEditYoutubeCategoryForm({...editYoutubeCategoryForm, sort_order: parseInt(e.target.value) || 0})}
                      min="0"
                      placeholder="숫자가 낮을수록 앞에 표시됩니다"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                    <button
                      type="button"
                      onClick={() => setEditingYoutubeCategory(null)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#374151',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      수정
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 유튜브 카테고리 추가 폼 */}
            {showAddYoutubeCategory && (
              <div style={{backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px'}}>
                <h3 style={{fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#1a202c'}}>
                  새 유튜브 카테고리 추가
                </h3>
                <form onSubmit={handleAddYoutubeCategory} style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      카테고리 이름 *
                    </label>
                    <input
                      type="text"
                      value={youtubeCategoryForm.name}
                      onChange={(e) => setYoutubeCategoryForm({...youtubeCategoryForm, name: e.target.value})}
                      required
                      placeholder="예: 주식분석, 경제뉴스, 투자교육"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      아이콘
                    </label>
                    <input
                      type="text"
                      value={youtubeCategoryForm.icon}
                      onChange={(e) => setYoutubeCategoryForm({...youtubeCategoryForm, icon: e.target.value})}
                      placeholder="예: 📈, 📰, 🎓"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      설명
                    </label>
                    <input
                      type="text"
                      value={youtubeCategoryForm.description}
                      onChange={(e) => setYoutubeCategoryForm({...youtubeCategoryForm, description: e.target.value})}
                      placeholder="카테고리에 대한 간단한 설명"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div>
                    <label style={{display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px'}}>
                      정렬 순서
                    </label>
                    <input
                      type="number"
                      value={youtubeCategoryForm.sort_order}
                      onChange={(e) => setYoutubeCategoryForm({...youtubeCategoryForm, sort_order: parseInt(e.target.value) || 0})}
                      min="0"
                      placeholder="숫자가 낮을수록 앞에 표시됩니다"
                      style={{width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px'}}
                    />
                  </div>
                  <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
                    <button
                      type="button"
                      onClick={() => setShowAddYoutubeCategory(false)}
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: '1px solid #d1d5db',
                        backgroundColor: 'white',
                        color: '#374151',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      style={{
                        padding: '8px 16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        border: 'none',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      추가
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 유튜브 카테고리 목록 */}
            <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
              {youtubeCategories
                .sort((a, b) => a.sort_order - b.sort_order)
                .map((category) => (
                  <div key={category.id} style={{backgroundColor: 'white', border: '2px solid #fef2f2', borderRadius: '8px', padding: '20px'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div style={{flex: 1}}>
                        <div style={{display: 'flex', alignItems: 'center', marginBottom: '8px'}}>
                          {category.icon && (
                            <span style={{fontSize: '24px', marginRight: '12px'}}>{category.icon}</span>
                          )}
                          <h3 style={{fontSize: '18px', fontWeight: '600', color: '#1a202c', margin: 0}}>
                            {category.name}
                          </h3>
                          <span style={{marginLeft: '12px', padding: '4px 8px', backgroundColor: '#fef2f2', borderRadius: '12px', fontSize: '12px', color: '#dc2626', fontWeight: '500'}}>
                            유튜브 카테고리
                          </span>
                        </div>
                        {category.description && (
                          <p style={{fontSize: '14px', color: '#64748b', marginBottom: '8px', lineHeight: '1.4'}}>
                            {category.description}
                          </p>
                        )}
                        <p style={{fontSize: '14px', color: '#64748b', fontWeight: '500'}}>
                          {category.count}개 채널
                        </p>
                      </div>
                      <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                        {/* 위치 이동 버튼 */}
                        <button
                          onClick={() => handleMoveYoutubeCategory(category.id, 'up')}
                          style={{
                            padding: '6px 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #6b7280',
                            backgroundColor: 'white',
                            color: '#6b7280',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMoveYoutubeCategory(category.id, 'down')}
                          style={{
                            padding: '6px 8px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #6b7280',
                            backgroundColor: 'white',
                            color: '#6b7280',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ↓
                        </button>
                        <button
                          onClick={() => handleEditYoutubeCategory(category)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #ef4444',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteYoutubeCategory(category.id, category.name)}
                          style={{
                            padding: '6px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            border: '1px solid #ef4444',
                            backgroundColor: 'white',
                            color: '#ef4444',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  )
}