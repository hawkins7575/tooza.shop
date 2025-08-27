// Generate SQL insert statements for bookmark sites

// Extract sites from "국내주식 info" folder
const bookmarkSites = [
  {
    title: "한경 컨센서스",
    url: "http://hkconsensus.hankyung.com/",
    description: "한국경제신문 컨센서스 정보",
    category: "뉴스"
  },
  {
    title: "불릿 | 독립리서치",
    url: "https://bulit.io/",
    description: "독립 투자 리서치 플랫폼",
    category: "뉴스"
  },
  {
    title: "와이즈리포트",
    url: "https://www.wisereport.co.kr/Default.aspx",
    description: "투자정보 및 리포트 제공",
    category: "뉴스"
  },
  {
    title: "인포스탁",
    url: "https://new.infostock.co.kr/",
    description: "주식정보 및 투자정보 제공",
    category: "뉴스"
  },
  {
    title: "한국IR협의회",
    url: "http://www.kirs.or.kr/main.html",
    description: "한국 투자자관계협의회",
    category: "뉴스"
  },
  {
    title: "대한민국 NO1 가치투자포털 아이투자",
    url: "http://www.itooza.com/",
    description: "가치투자 정보 및 커뮤니티",
    category: "뉴스"
  },
  {
    title: "KSD 증권정보포털 SEIBro",
    url: "http://www.seibro.or.kr/websquare/control.jsp?w2xPath=/IPORTAL/user/index.xml",
    description: "증권정보 포털",
    category: "뉴스"
  },
  {
    title: "IRGO - 투자자와 기업의 연결",
    url: "https://m.irgo.co.kr/홈",
    description: "투자자 관계 정보 플랫폼",
    category: "뉴스"
  },
  {
    title: "대한민국 대표 기업공시채널 KIND",
    url: "http://kind.krx.co.kr/main.do?method=loadInitPage&scrnmode=1",
    description: "기업공시 정보 채널",
    category: "뉴스"
  },
  {
    title: "한국거래소",
    url: "http://www.krx.co.kr/main/main.jsp",
    description: "한국 증권거래소 공식 사이트",
    category: "뉴스"
  },
  {
    title: "금융감독원",
    url: "http://www.fss.or.kr/fss/kr/main.html",
    description: "금융감독원 공식 홈페이지",
    category: "뉴스"
  },
  {
    title: "스넥(SNEK) - 나만의 투자 정보",
    url: "https://www.snek.ai/home#economy",
    description: "AI 기반 투자 정보 서비스",
    category: "교육"
  },
  {
    title: "비상장주식,장외주식시장 NO.1 38커뮤니케이션",
    url: "http://www.38.co.kr/",
    description: "비상장 주식 정보",
    category: "주식"
  },
  {
    title: "리서치알음",
    url: "http://www.researcharum.com/",
    description: "투자 리서치 정보",
    category: "뉴스"
  },
  {
    title: "삼성전자 기업정보",
    url: "http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?pGB=1&gicode=A005930&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=&strResearchYN=",
    description: "삼성전자 기업 정보",
    category: "주식"
  },
  {
    title: "빅파이낸스(Big Finance)",
    url: "https://bigfinance.co.kr/services/korea",
    description: "금융 데이터 분석 플랫폼",
    category: "교육"
  },
  {
    title: "전자공시시스템 DART",
    url: "http://dart.fss.or.kr/",
    description: "전자공시시스템",
    category: "뉴스"
  },
  {
    title: "퀀트킹",
    url: "http://www.quantking.co.kr/page/main.php",
    description: "퀀트 투자 정보",
    category: "교육"
  },
  {
    title: "VSQuant: Value Studio Quant",
    url: "http://vsquant.kr/app/company/overview/A005930",
    description: "가치 투자 퀀트 분석",
    category: "교육"
  },
  {
    title: "팍스넷",
    url: "http://www.paxnet.co.kr/",
    description: "증권정보 제공",
    category: "뉴스"
  },
  {
    title: "연합인포맥스",
    url: "http://news.einfomax.co.kr/",
    description: "금융뉴스 및 정보",
    category: "뉴스"
  },
  {
    title: "Pstock : 비상장/IPO 전문정보",
    url: "http://www.pstock.co.kr/",
    description: "비상장 및 IPO 정보",
    category: "주식"
  },
  {
    title: "감시통합포털",
    url: "https://sims.krx.co.kr/p/Main/",
    description: "거래소 감시시스템",
    category: "뉴스"
  },
  {
    title: "더밀크 | The Miilk",
    url: "https://themiilk.com/",
    description: "실리콘밸리 혁신 미디어",
    category: "뉴스"
  }
];

function generateSQL() {
  console.log('-- 북마크 사이트 추가 SQL문');
  console.log('-- "국내주식 info" 폴더에서 추출한 사이트들\n');
  
  bookmarkSites.forEach((site, index) => {
    const escapedTitle = site.title.replace(/'/g, "''");
    const escapedDescription = site.description.replace(/'/g, "''");
    const escapedUrl = site.url.replace(/'/g, "''");
    
    console.log(`INSERT INTO sites (title, url, description, category, tags) VALUES`);
    console.log(`('${escapedTitle}', '${escapedUrl}', '${escapedDescription}', '${site.category}', '{}');`);
    console.log('');
  });
}

generateSQL();