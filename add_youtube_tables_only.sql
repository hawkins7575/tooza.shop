-- 유튜브 테이블만 추가 (기존 테이블은 건드리지 않음)

-- YouTube Categories 테이블
CREATE TABLE IF NOT EXISTS youtube_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  parent_id UUID REFERENCES youtube_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- YouTube Channels 테이블
CREATE TABLE IF NOT EXISTS youtube_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL UNIQUE,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 카테고리 데이터
INSERT INTO youtube_categories (name, description, icon, sort_order) VALUES
  ('주식분석', '개별 주식 분석 및 종목 추천 채널', '📊', 1),
  ('경제뉴스', '경제 동향 및 시장 뉴스 분석 채널', '📰', 2),
  ('투자교육', '투자 기초 및 전략 교육 채널', '🎓', 3),
  ('부동산', '부동산 투자 및 시장 분석 채널', '🏠', 4),
  ('암호화폐', '가상화폐 및 블록체인 관련 채널', '₿', 5),
  ('해외투자', '해외 주식 및 글로벌 투자 채널', '🌍', 6),
  ('펀드/ETF', '펀드 및 ETF 상품 분석 채널', '💼', 7)
ON CONFLICT (name) DO NOTHING;