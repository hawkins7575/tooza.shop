import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

// Web Vitals 추적 함수
export function trackWebVitals() {
  // Core Web Vitals 추적
  getCLS(console.log) // Cumulative Layout Shift
  getFID(console.log) // First Input Delay  
  getLCP(console.log) // Largest Contentful Paint
  
  // 추가 성능 지표
  getFCP(console.log) // First Contentful Paint
  getTTFB(console.log) // Time to First Byte
}

// Google Analytics로 Web Vitals 전송 (선택사항)
export function sendToGoogleAnalytics({ name, delta, value, id }: any) {
  // @ts-ignore
  if (typeof gtag !== 'undefined') {
    // @ts-ignore
    gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? delta * 1000 : delta),
      non_interaction: true,
    })
  }
}

// 성능 최적화를 위한 이미지 lazy loading 컴포넌트
interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  style?: React.CSSProperties
}

export function OptimizedImage({ src, alt, width, height, className, style }: OptimizedImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={(e) => {
        // 이미지 로딩 실패 시 대체 이미지
        e.currentTarget.src = '/logo192.png'
      }}
    />
  )
}