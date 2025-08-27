import React, { useEffect, useRef } from 'react'

interface AdSenseProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal'
  style?: React.CSSProperties
  className?: string
}

// AdSense 글로벌 초기화 상태 추적
let isPageLevelAdsInitialized = false;
const initializedSlots = new Set<string>();

export function AdSense({ slot, format = 'auto', style = {}, className = '' }: AdSenseProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    const initializeAd = () => {
      try {
        // 페이지 레벨 광고는 전체 애플리케이션에서 한 번만 초기화
        // @ts-ignore
        if (typeof window !== 'undefined' && window.adsbygoogle && !isPageLevelAdsInitialized) {
          try {
            console.log('AdSense 페이지 레벨 광고 초기화 중...');
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "ca-pub-YOUR_PUBLISHER_ID",
              enable_page_level_ads: true
            });
            isPageLevelAdsInitialized = true;
            console.log('AdSense 페이지 레벨 광고 초기화 완료');
          } catch (pageError: any) {
            // 이미 초기화된 경우 무시
            if (pageError?.message?.includes('enable_page_level_ads')) {
              console.log('AdSense 페이지 레벨 광고가 이미 초기화됨');
              isPageLevelAdsInitialized = true;
            } else {
              console.warn('AdSense 페이지 레벨 광고 오류:', pageError?.message);
            }
          }
        }

        // 슬롯별 중복 초기화 방지
        const slotKey = `${slot}-${format}`;
        if (initializedSlots.has(slotKey) || isInitialized.current) {
          return;
        }

        // 요소가 DOM에 존재하고 크기가 있는지 확인
        if (adRef.current) {
          const rect = adRef.current.getBoundingClientRect();
          if (rect.width === 0 || rect.height === 0) {
            console.warn(`AdSense 슬롯 ${slot}: 크기가 0입니다. 초기화를 건너뜁니다.`);
            return;
          }
        }

        // 개별 광고 슬롯 초기화
        // @ts-ignore
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          console.log(`AdSense 슬롯 ${slot} 초기화 중...`);
          try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            initializedSlots.add(slotKey);
            isInitialized.current = true;
            console.log(`AdSense 슬롯 ${slot} 초기화 완료`);
          } catch (slotError: any) {
            console.warn(`AdSense 슬롯 ${slot} 초기화 오류:`, slotError?.message);
          }
        }
      } catch (error) {
        console.error('AdSense 초기화 오류:', error);
      }
    };

    // DOM이 완전히 로드된 후 초기화
    const timer = setTimeout(initializeAd, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [slot, format]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      const slotKey = `${slot}-${format}`;
      initializedSlots.delete(slotKey);
      isInitialized.current = false;
    };
  }, [slot, format]);

  return (
    <div 
      ref={adRef}
      className={`adsense-container ${className}`} 
      style={{ 
        minHeight: '90px',
        minWidth: '300px', 
        ...style 
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block', 
          minHeight: '90px',
          minWidth: '300px',
          ...style 
        }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}

// 사전 정의된 광고 슬롯들
export function HeaderAd() {
  return (
    <AdSense 
      slot="HEADER_AD_SLOT"
      format="horizontal"
      style={{ margin: '16px 0', textAlign: 'center' }}
      className="header-ad"
    />
  )
}

export function SidebarAd() {
  return (
    <AdSense 
      slot="SIDEBAR_AD_SLOT"
      format="vertical"
      style={{ margin: '16px 0' }}
      className="sidebar-ad"
    />
  )
}

export function ContentAd() {
  return (
    <AdSense 
      slot="CONTENT_AD_SLOT"
      format="rectangle"
      style={{ margin: '24px auto', display: 'block' }}
      className="content-ad"
    />
  )
}

export function FooterAd() {
  return (
    <AdSense 
      slot="FOOTER_AD_SLOT"
      format="horizontal"
      style={{ margin: '16px 0', textAlign: 'center' }}
      className="footer-ad"
    />
  )
}