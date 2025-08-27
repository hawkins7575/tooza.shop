-- 북마크 사이트 + SEO 블로그 통합 SQL
-- 총 28개 사이트 추가 (북마크 24개 + 블로그 4개)

-- 북마크 사이트 추가 (24개)
INSERT INTO sites (title, url, description, category, tags) VALUES
('한경 컨센서스', 'http://hkconsensus.hankyung.com/', '한국경제신문 컨센서스 정보', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('불릿 | 독립리서치', 'https://bulit.io/', '독립 투자 리서치 플랫폼', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('와이즈리포트', 'https://www.wisereport.co.kr/Default.aspx', '투자정보 및 리포트 제공', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('인포스탁', 'https://new.infostock.co.kr/', '주식정보 및 투자정보 제공', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('한국IR협의회', 'http://www.kirs.or.kr/main.html', '한국 투자자관계협의회', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('대한민국 NO1 가치투자포털 아이투자', 'http://www.itooza.com/', '가치투자 정보 및 커뮤니티', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('KSD 증권정보포털 SEIBro', 'http://www.seibro.or.kr/websquare/control.jsp?w2xPath=/IPORTAL/user/index.xml', '증권정보 포털', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('IRGO - 투자자와 기업의 연결', 'https://m.irgo.co.kr/홈', '투자자 관계 정보 플랫폼', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('대한민국 대표 기업공시채널 KIND', 'http://kind.krx.co.kr/main.do?method=loadInitPage&scrnmode=1', '기업공시 정보 채널', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('한국거래소', 'http://www.krx.co.kr/main/main.jsp', '한국 증권거래소 공식 사이트', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('금융감독원', 'http://www.fss.or.kr/fss/kr/main.html', '금융감독원 공식 홈페이지', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('스넥(SNEK) - 나만의 투자 정보', 'https://www.snek.ai/home#economy', 'AI 기반 투자 정보 서비스', '교육', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('비상장주식,장외주식시장 NO.1 38커뮤니케이션', 'http://www.38.co.kr/', '비상장 주식 정보', '주식', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('리서치알음', 'http://www.researcharum.com/', '투자 리서치 정보', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('삼성전자 기업정보', 'http://comp.fnguide.com/SVO2/ASP/SVD_main.asp?pGB=1&gicode=A005930&cID=&MenuYn=Y&ReportGB=&NewMenuID=11&stkGb=&strResearchYN=', '삼성전자 기업 정보', '주식', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('빅파이낸스(Big Finance)', 'https://bigfinance.co.kr/services/korea', '금융 데이터 분석 플랫폼', '교육', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('전자공시시스템 DART', 'http://dart.fss.or.kr/', '전자공시시스템', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('퀀트킹', 'http://www.quantking.co.kr/page/main.php', '퀀트 투자 정보', '교육', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('VSQuant: Value Studio Quant', 'http://vsquant.kr/app/company/overview/A005930', '가치 투자 퀀트 분석', '교육', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('팍스넷', 'http://www.paxnet.co.kr/', '증권정보 제공', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('연합인포맥스', 'http://news.einfomax.co.kr/', '금융뉴스 및 정보', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('Pstock : 비상장/IPO 전문정보', 'http://www.pstock.co.kr/', '비상장 및 IPO 정보', '주식', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('감시통합포털', 'https://sims.krx.co.kr/p/Main/', '거래소 감시시스템', '뉴스', '{}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('더밀크 | The Miilk', 'https://themiilk.com/', '실리콘밸리 혁신 미디어', '뉴스', '{}');

-- SEO 최적화 블로그 추가 (4개)
INSERT INTO sites (title, url, description, category, tags) VALUES
('한국주식투자연구소 - 체계적인 가치투자 분석과 종목 발굴', 'https://korea-stock-research.com', '국내 주식시장의 가치투자 전략과 재무분석을 통한 우량 종목 발굴. PER, PBR, ROE 등 핵심 지표 분석과 배당주 투자 가이드를 제공하는 전문 투자 연구소입니다.', '뉴스', '{"가치투자","재무분석","배당주","종목분석","투자전략"}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('코스피데이터랩 - 빅데이터와 AI 기반 한국 주식 투자 플랫폼', 'https://kospi-datalab.com', '빅데이터 분석과 머신러닝을 활용한 한국 주식시장 예측 모델. 코스피, 코스닥 종목의 기술적 분석과 퀀트 투자 전략을 제공하는 차세대 투자 플랫폼입니다.', '교육', '{"빅데이터","AI투자","퀀트","기술적분석","머신러닝"}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('US Stock Masters - Premium American Stock Investment Insights', 'https://usstockmasters.com', 'Comprehensive analysis of US stock market with focus on S&P 500, NASDAQ, and dividend aristocrats. Expert insights on growth stocks, value investing, and sector rotation strategies for American equity markets.', '뉴스', '{"US stocks","S&P 500","NASDAQ","dividend","growth investing"}');

INSERT INTO sites (title, url, description, category, tags) VALUES
('Wall Street Analytics Pro - Advanced US Market Research & Trading', 'https://wallstreetanalyticspro.com', 'Professional-grade US stock market analysis with institutional-level research on earnings, Fed policy impacts, and market cycles. Specializing in swing trading, momentum strategies, and risk management for active traders.', '교육', '{"Wall Street","swing trading","momentum","Fed policy","earnings analysis"}');