// WordPress REST API 연동 서비스

// JSONPlaceholder API를 사용한 더미 데이터 (403 오류 해결)
const WORDPRESS_API_URL = 'https://jsonplaceholder.typicode.com'

// JSONPlaceholder 원본 데이터 인터페이스
interface JsonPlaceholderPost {
  userId: number
  id: number
  title: string
  body: string
}

interface JsonPlaceholderUser {
  id: number
  name: string
  username: string
  email: string
}

export interface WordPressPost {
  ID: number
  title: string
  content: string
  excerpt: string
  date: string
  slug: string
  featured_image?: string
  categories?: { [key: string]: WordPressCategory }
  tags?: { [key: string]: WordPressTag }
  author?: {
    name: string
    avatar_URL?: string
  }
  URL: string
}

export interface WordPressCategory {
  ID: number
  name: string
  slug: string
}

export interface WordPressTag {
  ID: number
  name: string
  slug: string
}

export interface WordPressResponse {
  posts: WordPressPost[]
  found: number
  meta?: {
    next_page?: string
  }
}

// 투자 관련 샘플 카테고리
const investmentCategories = [
  { ID: 1, name: '주식투자', slug: 'stocks' },
  { ID: 2, name: 'ETF', slug: 'etf' },
  { ID: 3, name: '부동산', slug: 'realestate' },
  { ID: 4, name: '가상화폐', slug: 'crypto' },
  { ID: 5, name: '경제분석', slug: 'analysis' }
]

// 투자 관련 샘플 이미지 URL들
const sampleImages = [
  'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=400&h=200&fit=crop'
]

/**
 * JSONPlaceholder API에서 게시글을 가져와 WordPress 형식으로 변환합니다
 */
export async function fetchWordPressPosts(
  page: number = 1,
  perPage: number = 10,
  search?: string,
  category?: string
): Promise<WordPressResponse> {
  try {
    // JSONPlaceholder에서 포스트와 사용자 데이터 가져오기
    const [postsResponse, usersResponse] = await Promise.all([
      fetch(`${WORDPRESS_API_URL}/posts?_page=${page}&_limit=${perPage}`),
      fetch(`${WORDPRESS_API_URL}/users`)
    ])
    
    if (!postsResponse.ok || !usersResponse.ok) {
      throw new Error(`API 응답 오류: ${postsResponse.status}`)
    }

    const postsData: JsonPlaceholderPost[] = await postsResponse.json()
    const usersData: JsonPlaceholderUser[] = await usersResponse.json()

    // 사용자 데이터를 맵으로 변환
    const usersMap = usersData.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {} as { [key: number]: JsonPlaceholderUser })

    // JSONPlaceholder 데이터를 WordPress 형식으로 변환
    const transformedPosts: WordPressPost[] = postsData
      .filter(post => {
        if (search) {
          const searchLower = search.toLowerCase()
          return post.title.toLowerCase().includes(searchLower) || 
                 post.body.toLowerCase().includes(searchLower)
        }
        return true
      })
      .map((post, index) => {
        const user = usersMap[post.userId] || { name: 'Unknown Author', username: 'unknown' }
        const randomCategory = investmentCategories[Math.floor(Math.random() * investmentCategories.length)]
        const randomImage = sampleImages[index % sampleImages.length]
        
        return {
          ID: post.id,
          title: `📈 ${post.title.charAt(0).toUpperCase() + post.title.slice(1)} - 투자 가이드`,
          content: `${post.body}\n\n이 글은 투자 교육 목적으로 작성된 샘플 콘텐츠입니다. 실제 투자 결정 시에는 전문가의 조언을 구하시기 바랍니다.`,
          excerpt: post.body.substring(0, 120) + '...',
          date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          slug: `investment-guide-${post.id}`,
          featured_image: randomImage,
          categories: {
            [randomCategory.ID]: randomCategory
          },
          author: {
            name: user.name,
            avatar_URL: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=64`
          },
          URL: `https://jsonplaceholder.typicode.com/posts/${post.id}`
        }
      })

    return {
      posts: transformedPosts,
      found: transformedPosts.length,
      meta: {
        next_page: page < 10 ? `${page + 1}` : undefined
      }
    }
  } catch (error) {
    console.error('블로그 포스트 조회 실패:', error)
    throw error
  }
}

/**
 * 특정 게시글을 ID로 가져옵니다
 */
export async function fetchWordPressPost(postId: string): Promise<WordPressPost> {
  try {
    const response = await fetch(`${WORDPRESS_API_URL}/posts/${postId}`)
    
    if (!response.ok) {
      throw new Error(`게시글을 찾을 수 없습니다: ${response.status}`)
    }

    const post: JsonPlaceholderPost = await response.json()
    const userResponse = await fetch(`${WORDPRESS_API_URL}/users/${post.userId}`)
    const user: JsonPlaceholderUser = userResponse.ok ? await userResponse.json() : { name: 'Unknown', username: 'unknown', id: 0, email: '' }
    
    const randomCategory = investmentCategories[Math.floor(Math.random() * investmentCategories.length)]
    const randomImage = sampleImages[post.id % sampleImages.length]
    
    return {
      ID: post.id,
      title: `📈 ${post.title.charAt(0).toUpperCase() + post.title.slice(1)} - 투자 가이드`,
      content: `${post.body}\n\n이 글은 투자 교육 목적으로 작성된 샘플 콘텐츠입니다. 실제 투자 결정 시에는 전문가의 조언을 구하시기 바랍니다.`,
      excerpt: post.body.substring(0, 120) + '...',
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      slug: `investment-guide-${post.id}`,
      featured_image: randomImage,
      categories: {
        [randomCategory.ID]: randomCategory
      },
      author: {
        name: user.name,
        avatar_URL: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563eb&color=fff&size=64`
      },
      URL: `https://jsonplaceholder.typicode.com/posts/${post.id}`
    }
  } catch (error) {
    console.error('게시글 조회 실패:', error)
    throw error
  }
}

/**
 * 투자 관련 카테고리 목록을 반환합니다
 */
export async function fetchWordPressCategories(): Promise<WordPressCategory[]> {
  return investmentCategories
}

/**
 * HTML 태그를 제거하고 텍스트만 추출합니다
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim()
}

/**
 * 게시글 요약을 생성합니다
 */
export function createExcerpt(content: string, maxLength: number = 150): string {
  const text = stripHtmlTags(content)
  if (text.length <= maxLength) return text
  
  const truncated = text.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...'
}

/**
 * 날짜를 한국어 형식으로 포맷합니다
 */
export function formatKoreanDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return `${year}년 ${month}월 ${day}일`
}

/**
 * 상대적 시간을 표시합니다 (예: "3일 전")
 */
export function getRelativeTime(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return '오늘'
  if (diffInDays === 1) return '어제'
  if (diffInDays < 7) return `${diffInDays}일 전`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}주 전`
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}개월 전`
  
  return `${Math.floor(diffInDays / 365)}년 전`
}