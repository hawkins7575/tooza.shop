-- Finance Link Seed Data
-- 초기 카테고리 및 사이트 데이터

-- 초기 카테고리 데이터 삽입
INSERT INTO categories (name, description, icon) VALUES
('주식', '국내외 주식 정보 및 분석', '📈'),
('부동산', '부동산 투자 정보 및 시장 동향', '🏠'),
('코인', '암호화폐 정보 및 거래소', '₿'),
('펀드', '펀드 및 ETF 정보', '💼'),
('채권', '채권 투자 정보', '📋'),
('원자재', '금, 원유 등 원자재 투자', '🥇'),
('뉴스', '투자 관련 뉴스 및 분석', '📰'),
('교육', '투자 교육 자료 및 강좌', '📚');

-- 샘플 사이트 데이터 삽입
INSERT INTO sites (title, url, description, category, tags) VALUES
-- 주식 관련 사이트
('네이버 금융', 'https://finance.naver.com', '국내 주식 정보 및 시세', '주식', ARRAY['주식', '시세', '국내']),
('야후 파이낸스', 'https://finance.yahoo.com', '글로벌 금융 정보', '주식', ARRAY['주식', '해외', '글로벌']),
('한국거래소', 'https://www.krx.co.kr', '한국 증권 거래소 공식 사이트', '주식', ARRAY['거래소', '공식', '한국']),
('investing.com', 'https://kr.investing.com', '글로벌 투자 정보 및 차트', '주식', ARRAY['차트', '분석', '글로벌']),

-- 부동산 관련 사이트
('부동산114', 'https://www.r114.com', '부동산 시세 및 매물 정보', '부동산', ARRAY['부동산', '시세']),
('직방', 'https://www.zigbang.com', '원룸, 투룸 등 임대 정보', '부동산', ARRAY['임대', '원룸']),
('네이버 부동산', 'https://land.naver.com', '부동산 매매 및 임대 정보', '부동산', ARRAY['매매', '임대']),

-- 코인 관련 사이트
('업비트', 'https://upbit.com', '국내 대표 암호화폐 거래소', '코인', ARRAY['코인', '거래소', '업비트']),
('빗썸', 'https://www.bithumb.com', '암호화폐 거래소', '코인', ARRAY['코인', '거래소', '빗썸']),
('코인원', 'https://coinone.co.kr', '암호화폐 거래 플랫폼', '코인', ARRAY['코인', '거래소']),

-- 펀드 관련 사이트
('한국투자증권', 'https://www.truefriend.com', '종합 금융 서비스', '펀드', ARRAY['증권사', '펀드']),
('미래에셋대우', 'https://www.miraeassetdaewoo.com', '자산관리 및 투자', '펀드', ARRAY['자산관리', '펀드']),

-- 뉴스 관련 사이트
('매일경제', 'https://www.mk.co.kr', '경제 전문 일간지', '뉴스', ARRAY['뉴스', '경제']),
('한국경제', 'https://www.hankyung.com', '종합 경제 정보', '뉴스', ARRAY['뉴스', '경제']),
('이데일리', 'https://www.edaily.co.kr', '경제 및 금융 뉴스', '뉴스', ARRAY['뉴스', '금융']),

-- 교육 관련 사이트
('한국투자교육연구소', 'https://www.kiri.or.kr', '투자 교육 및 연구', '교육', ARRAY['교육', '연구']),
('서학개미', 'https://www.seohak.co.kr', '해외주식 투자 교육', '교육', ARRAY['교육', '해외주식']);