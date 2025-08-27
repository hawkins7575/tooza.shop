import { useEffect } from 'react'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string
  canonicalUrl: string
  ogImage?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  structuredData?: any
}

export function SEOHead({
  title,
  description,
  keywords = "주식투자, 블로그, 투자정보, Finance Link, 투자가이드, 재테크",
  canonicalUrl,
  ogImage = "/logo512.png",
  ogType = "article",
  publishedTime,
  modifiedTime,
  author = "Finance Link",
  structuredData
}: SEOHeadProps) {
  const fullTitle = `${title} | Finance Link - 투자 정보 블로그`
  
  useEffect(() => {
    // 기본 메타태그 업데이트
    document.title = fullTitle
    updateMetaTag('name', 'description', description)
    updateMetaTag('name', 'keywords', keywords)
    updateMetaTag('name', 'author', author)
    updateMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1')
    
    // Canonical URL
    updateLinkTag('canonical', canonicalUrl)
    
    // Open Graph 태그
    updateMetaTag('property', 'og:title', fullTitle)
    updateMetaTag('property', 'og:description', description)
    updateMetaTag('property', 'og:type', ogType)
    updateMetaTag('property', 'og:url', canonicalUrl)
    updateMetaTag('property', 'og:image', ogImage)
    updateMetaTag('property', 'og:image:width', '1200')
    updateMetaTag('property', 'og:image:height', '630')
    updateMetaTag('property', 'og:locale', 'ko_KR')
    updateMetaTag('property', 'og:site_name', 'Finance Link')
    
    // Twitter Card 태그
    updateMetaTag('name', 'twitter:card', 'summary_large_image')
    updateMetaTag('name', 'twitter:title', fullTitle)
    updateMetaTag('name', 'twitter:description', description)
    updateMetaTag('name', 'twitter:image', ogImage)
    updateMetaTag('name', 'twitter:site', '@financelink')
    updateMetaTag('name', 'twitter:creator', '@financelink')
    
    // Article 메타태그
    if (ogType === 'article') {
      if (publishedTime) updateMetaTag('property', 'article:published_time', publishedTime)
      if (modifiedTime) updateMetaTag('property', 'article:modified_time', modifiedTime)
      updateMetaTag('property', 'article:author', author)
      updateMetaTag('property', 'article:section', '투자')
    }
    
    // 구조화된 데이터
    if (structuredData) {
      updateStructuredData(structuredData)
    }
  }, [fullTitle, description, keywords, canonicalUrl, ogImage, ogType, publishedTime, modifiedTime, author, structuredData])

  const updateMetaTag = (attribute: string, value: string, content: string) => {
    let element = document.querySelector(`meta[${attribute}="${value}"]`)
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attribute, value)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  const updateLinkTag = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`)
    if (!element) {
      element = document.createElement('link')
      element.setAttribute('rel', rel)
      document.head.appendChild(element)
    }
    element.setAttribute('href', href)
  }

  const updateStructuredData = (data: any) => {
    const existingScript = document.querySelector('script[type="application/ld+json"]')
    if (existingScript) {
      existingScript.remove()
    }
    
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(data)
    document.head.appendChild(script)
  }
  
  return null
}