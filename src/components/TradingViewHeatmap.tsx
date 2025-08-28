import React, { useEffect, useRef, useState } from 'react'

interface TradingViewHeatmapProps {
  width?: string
  height?: string
  colorTheme?: 'light' | 'dark'
  dataSource?: string
  grouping?: 'sector' | 'no_group'
  blockSize?: 'market_cap_basic' | 'volume' | 'relative_volume_10d_calc'
  blockColor?: 'change' | 'change_abs'
  locale?: string
  hasTopBar?: boolean
  isZoomEnabled?: boolean
  hasSymbolTooltip?: boolean
}

export function TradingViewHeatmap({
  width = "100%",
  height = "600",
  colorTheme = "light",
  dataSource = "KOSPI",
  grouping = "sector",
  blockSize = "market_cap_basic",
  blockColor = "change",
  locale = "kr",
  hasTopBar = false,
  isZoomEnabled = true,
  hasSymbolTooltip = true
}: TradingViewHeatmapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    setIsLoading(true)
    setHasError(false)

    // 기존 위젯 정리
    container.innerHTML = ''

    // TradingView 위젯 생성
    const createWidget = () => {
      try {
        const widgetContainer = document.createElement('div')
        widgetContainer.className = 'tradingview-widget-container__widget'
        
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js'
        
        const config = {
          exchanges: [],
          dataSource,
          grouping,
          blockSize,
          blockColor,
          locale,
          colorTheme,
          hasTopBar,
          isZoomEnabled,
          hasSymbolTooltip,
          width: "100%",
          height: parseInt(height)
        }

        script.innerHTML = JSON.stringify(config)
        
        script.onload = () => {
          setIsLoading(false)
        }
        
        script.onerror = () => {
          setHasError(true)
          setIsLoading(false)
          console.error('TradingView widget failed to load')
        }

        widgetContainer.appendChild(script)
        container.appendChild(widgetContainer)

        // TradingView 저작권 정보
        const copyright = document.createElement('div')
        copyright.className = 'tradingview-widget-copyright'
        copyright.innerHTML = `
          <a href="https://www.tradingview.com/" rel="noopener noreferrer nofollow" target="_blank">
            <span style="color: #9CA3AF; font-size: 13px; line-height: 14px; font-weight: 400; text-decoration: none;">
              Track all markets on TradingView
            </span>
          </a>
        `
        container.appendChild(copyright)

      } catch (error) {
        console.error('Widget creation error:', error)
        setHasError(true)
        setIsLoading(false)
      }
    }

    // 약간의 지연을 두고 위젯 생성
    const timer = setTimeout(createWidget, 100)

    return () => {
      clearTimeout(timer)
      if (container) {
        container.innerHTML = ''
      }
    }
  }, [dataSource, grouping, blockSize, blockColor, locale, colorTheme, hasTopBar, isZoomEnabled, hasSymbolTooltip, height])

  if (hasError) {
    return (
      <div style={{
        width: '100%',
        height: height + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e9ecef'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#666',
          padding: '2rem'
        }}>
          <div style={{fontSize: '24px', marginBottom: '8px'}}>📊</div>
          <p style={{margin: 0, fontSize: '14px'}}>히트맵을 불러올 수 없습니다</p>
          <p style={{margin: '4px 0 0 0', fontSize: '12px', color: '#999'}}>잠시 후 다시 시도해주세요</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative' }}>
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 10,
          borderRadius: '8px'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#666'
          }}>
            <div style={{fontSize: '24px', marginBottom: '8px'}}>📊</div>
            <p style={{margin: 0, fontSize: '14px'}}>히트맵 로딩 중...</p>
          </div>
        </div>
      )}
      
      <div 
        className="tradingview-widget-container" 
        ref={containerRef} 
        style={{
          width: '100%',
          height: height + 'px',
          minHeight: height + 'px'
        }}
      />
    </div>
  )
}