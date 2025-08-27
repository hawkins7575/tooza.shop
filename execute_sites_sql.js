const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 모든 사이트 데이터 (북마크 24개 + 블로그 4개)
const allSites = [
  // 북마크 사이트 (24개)
  { title: "한경 컨센서스", url: "http://hkconsensus.hankyung.com/", description: "한국경제신문 컨센서스 정보", category: "뉴스", tags: [] },
  { title: "불릿 | 독립리서치", url: "https://bulit.io/", description: "독립 투자 리서치 플랫폼", category: "뉴스", tags: [] },
  { title: "와이즈리포트", url: "https://www.wisereport.co.kr/Default.aspx", description: "투자정보 및 리포트 제공", category: "뉴스", tags: [] },
  { title: "인포스탁", url: "https://new.infostock.co.kr/", description: "주식정보 및 투자정보 제공", category: "뉴스", tags: [] },
  { title: "한국IR협의회", url: "http://www.kirs.or.kr/main.html", description: "한국 투자자관계협의회", category: "뉴스", tags: [] },
  { title: "대한민국 NO1 가치투자포털 아이투자", url: "http://www.itooza.com/", description: "가치투자 정보 및 커뮤니티", category: "뉴스", tags: [] },
  { title: "KSD 증권정보포털 SEIBro", url: "http://www.seibro.or.kr/websquare/control.jsp?w2xPath=/IPORTAL/user/index.xml", description: "증권정보 포털", category: "뉴스", tags: [] },
  { title: "IRGO - 투자자와 기업의 연결", url: "https://m.irgo.co.kr/홈", description: "투자자 관계 정보 플랫폼", category: "뉴스", tags: [] },
  { title: "대한민국 대표 기업공시채널 KIND", url: "http://kind.krx.co.kr/main.do?method=loadInitPage&scrnmode=1", description: "기업공시 정보 채널", category: "뉴스", tags: [] },
  { title: "한국거래소", url: "http://www.krx.co.kr/main/main.jsp", description: "한국 증권거래소 공식 사이트", category: "뉴스", tags: [] },
  { title: "금융감독원", url: "http://www.fss.or.kr/fss/kr/main.html", description: "금융감독원 공식 홈페이지", category: "뉴스", tags: [] },
  { title: "스넥(SNEK) - 나만의 투자 정보", url: "https://www.snek.ai/home#economy", description: "AI 기반 투자 정보 서비스", category: "교육", tags: [] },
  { title: "비상장주식,장외주식시장 NO.1 38커뮤니케이션", url: "http://www.38.co.kr/", description: "비상장 주식 정보", category: "주식", tags: [] },
  { title: "리서치알음", url: "http://www.researcharum.com/", description: "투자 리서치 정보", category: "뉴스", tags: [] },
  { title: "삼성전자 기업정보", url: "http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?pGB=1&gicode=A005930&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=&strResearchYN=", description: "삼성전자 기업 정보", category: "주식", tags: [] },
  { title: "빅파이낸스(Big Finance)", url: "https://bigfinance.co.kr/services/korea", description: "금융 데이터 분석 플랫폼", category: "교육", tags: [] },
  { title: "전자공시시스템 DART", url: "http://dart.fss.or.kr/", description: "전자공시시스템", category: "뉴스", tags: [] },
  { title: "퀀트킹", url: "http://www.quantking.co.kr/page/main.php", description: "퀀트 투자 정보", category: "교육", tags: [] },
  { title: "VSQuant: Value Studio Quant", url: "http://vsquant.kr/app/company/overview/A005930", description: "가치 투자 퀀트 분석", category: "교육", tags: [] },
  { title: "팍스넷", url: "http://www.paxnet.co.kr/", description: "증권정보 제공", category: "뉴스", tags: [] },
  { title: "연합인포맥스", url: "http://news.einfomax.co.kr/", description: "금융뉴스 및 정보", category: "뉴스", tags: [] },
  { title: "Pstock : 비상장/IPO 전문정보", url: "http://www.pstock.co.kr/", description: "비상장 및 IPO 정보", category: "주식", tags: [] },
  { title: "감시통합포털", url: "https://sims.krx.co.kr/p/Main/", description: "거래소 감시시스템", category: "뉴스", tags: [] },
  { title: "더밀크 | The Miilk", url: "https://themiilk.com/", description: "실리콘밸리 혁신 미디어", category: "뉴스", tags: [] },

  // SEO 블로그 (4개)
  { 
    title: "한국주식투자연구소 - 체계적인 가치투자 분석과 종목 발굴", 
    url: "https://korea-stock-research.com", 
    description: "국내 주식시장의 가치투자 전략과 재무분석을 통한 우량 종목 발굴. PER, PBR, ROE 등 핵심 지표 분석과 배당주 투자 가이드를 제공하는 전문 투자 연구소입니다.", 
    category: "뉴스", 
    tags: ["가치투자","재무분석","배당주","종목분석","투자전략"]
  },
  { 
    title: "코스피데이터랩 - 빅데이터와 AI 기반 한국 주식 투자 플랫폼", 
    url: "https://kospi-datalab.com", 
    description: "빅데이터 분석과 머신러닝을 활용한 한국 주식시장 예측 모델. 코스피, 코스닥 종목의 기술적 분석과 퀀트 투자 전략을 제공하는 차세대 투자 플랫폼입니다.", 
    category: "교육", 
    tags: ["빅데이터","AI투자","퀀트","기술적분석","머신러닝"]
  },
  { 
    title: "US Stock Masters - Premium American Stock Investment Insights", 
    url: "https://usstockmasters.com", 
    description: "Comprehensive analysis of US stock market with focus on S&P 500, NASDAQ, and dividend aristocrats. Expert insights on growth stocks, value investing, and sector rotation strategies for American equity markets.", 
    category: "뉴스", 
    tags: ["US stocks","S&P 500","NASDAQ","dividend","growth investing"]
  },
  { 
    title: "Wall Street Analytics Pro - Advanced US Market Research & Trading", 
    url: "https://wallstreetanalyticspro.com", 
    description: "Professional-grade US stock market analysis with institutional-level research on earnings, Fed policy impacts, and market cycles. Specializing in swing trading, momentum strategies, and risk management for active traders.", 
    category: "교육", 
    tags: ["Wall Street","swing trading","momentum","Fed policy","earnings analysis"]
  }
];

async function insertAllSites() {
  try {
    console.log('🚀 총 28개 사이트를 데이터베이스에 추가합니다...');
    console.log('   - 북마크 사이트: 24개');
    console.log('   - SEO 블로그: 4개\n');
    
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < allSites.length; i++) {
      const site = allSites[i];
      
      try {
        // 중복 확인
        const { data: existing, error: checkError } = await supabase
          .from('sites')
          .select('id')
          .eq('url', site.url)
          .single();

        if (existing) {
          console.log(`⏭️  이미 존재: ${site.title}`);
          skipCount++;
          continue;
        }

        // 새 사이트 추가
        const { data, error } = await supabase
          .from('sites')
          .insert([{
            title: site.title,
            url: site.url,
            description: site.description,
            category: site.category,
            tags: site.tags
          }])
          .select();

        if (error) {
          if (error.code === '42501') {
            console.log(`🔒 RLS 정책으로 인한 제한: ${site.title}`);
            console.log('    → 관리자 권한이 필요합니다.');
          } else {
            console.log(`❌ 실패: ${site.title} - ${error.message}`);
          }
          errorCount++;
        } else {
          console.log(`✅ 추가 완료: ${site.title}`);
          successCount++;
        }
        
        // 진행률 표시
        const progress = Math.round(((i + 1) / allSites.length) * 100);
        console.log(`    진행률: ${progress}% (${i + 1}/${allSites.length})\n`);
        
      } catch (err) {
        console.log(`❌ 오류: ${site.title} - ${err.message}`);
        errorCount++;
      }
    }

    console.log('\n📊 실행 결과 요약:');
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`⏭️  중복: ${skipCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📝 총합: ${allSites.length}개`);
    
    if (errorCount > 0) {
      console.log('\n⚠️  실패한 사이트들은 Supabase Dashboard의 SQL Editor에서 직접 실행해주세요.');
      console.log('   파일: combined_sites.sql');
    }
    
  } catch (error) {
    console.error('🚨 전체 실행 중 오류:', error);
  }
}

insertAllSites();