import { useState, useEffect, useRef } from 'react'

interface UseLazyLoadOptions {
  threshold?: number
  rootMargin?: string
}

export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  const { threshold = 0.1, rootMargin = '50px' } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true)
          setHasLoaded(true)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [threshold, rootMargin, hasLoaded])

  return { ref, isIntersecting, hasLoaded }
}