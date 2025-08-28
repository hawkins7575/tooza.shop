import React, { useEffect, useRef, memo } from 'react'

interface TradingViewWidgetProps {
  symbol?: string
  theme?: 'light' | 'dark'
  locale?: string
  interval?: string
}

function TradingViewWidget({ 
  symbol = "KRX:005930", 
  theme = "light", 
  locale = "en",
  interval = "D" 
}: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    // 기존 스크립트 정리
    container.current.innerHTML = ''

    const script = document.createElement("script")
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js"
    script.type = "text/javascript"
    script.async = true
    script.innerHTML = JSON.stringify({
      allow_symbol_change: true,
      calendar: false,
      details: true,
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      hide_legend: false,
      hide_volume: false,
      hotlist: true,
      interval,
      locale,
      save_image: true,
      style: "1",
      symbol,
      theme,
      timezone: "Asia/Seoul",
      backgroundColor: theme === 'light' ? "#ffffff" : "#131722",
      gridColor: theme === 'light' ? "rgba(46, 46, 46, 0.06)" : "rgba(240, 243, 250, 0.06)",
      watchlist: [
        "KRX:005930",
        "KRX:000660", 
        "KRX:207940",
        "KRX:005490",
        "KRX:035420",
        "KRX:006400",
        "KRX:051910",
        "KRX:003670",
        "KRX:096770",
        "KRX:028260",
        "KRX:105560",
        "KRX:000270",
        "KRX:017670",
        "KRX:068270",
        "KRX:323410",
        "NASDAQ:AAPL",
        "NASDAQ:GOOGL",
        "NYSE:TSLA",
        "BINANCE:BTCUSDT"
      ],
      withdateranges: true,
      compareSymbols: [],
      studies: [
        "RSI@tv-basicstudies",
        "MASimple@tv-basicstudies"
      ],
      autosize: true,
      enable_publishing: false,
      toolbar_bg: theme === 'light' ? "#f1f3f6" : "#2a2e39",
      popup_width: "1000",
      popup_height: "650",
      container_id: "tradingview_" + Math.random().toString(36).substr(2, 9),
      // 추가 설정으로 접근성 향상
      loading_screen: { backgroundColor: theme === 'light' ? "#ffffff" : "#131722" },
      overrides: {
        "paneProperties.background": theme === 'light' ? "#ffffff" : "#131722",
        "paneProperties.vertGridProperties.color": theme === 'light' ? "#e1e1e1" : "#363c4e",
        "paneProperties.horzGridProperties.color": theme === 'light' ? "#e1e1e1" : "#363c4e"
      },
      // 한국 주식에 대한 추가 설정
      allowed_referrers: ["*"],
      customer: "guest",
      utm_source: "localhost",
      utm_medium: "widget",
      utm_campaign: "chart"
    })

    const widgetContainer = document.createElement('div')
    widgetContainer.className = 'tradingview-widget-container__widget'
    widgetContainer.style.height = 'calc(100% - 32px)'
    widgetContainer.style.width = '100%'

    const copyright = document.createElement('div')
    copyright.className = 'tradingview-widget-copyright'
    copyright.innerHTML = `
      <a href="https://kr.tradingview.com/symbols/${symbol.replace(':', '-')}/" rel="noopener nofollow" target="_blank">
        <span style="color: #2962FF; font-size: 13px;">Track all markets on TradingView</span>
      </a>
    `

    container.current.appendChild(widgetContainer)
    container.current.appendChild(copyright)
    widgetContainer.appendChild(script)
  }, [symbol, theme, locale, interval])

  return (
    <div 
      className="tradingview-widget-container" 
      ref={container} 
      style={{ 
        height: "100%", 
        width: "100%",
        minHeight: "500px"
      }}
    />
  )
}

export default memo(TradingViewWidget)