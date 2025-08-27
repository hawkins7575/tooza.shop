-- Create YouTube related tables for Finance Link (Safe version)
-- Migration for YouTube channels and categories functionality

-- YouTube Categories 테이블 (유튜브 채널 카테고리)
CREATE TABLE IF NOT EXISTS youtube_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  parent_id UUID REFERENCES youtube_categories(id) ON DELETE SET NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_youtube_category_name UNIQUE (name)
);

-- YouTube Channels 테이블 (유튜브 채널 정보)
CREATE TABLE IF NOT EXISTS youtube_channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  tags TEXT[] DEFAULT '{}',
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_youtube_channel_url UNIQUE (url)
);

-- 인덱스 생성 (성능 최적화) - IF NOT EXISTS 구문으로 안전하게 생성
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_youtube_categories_name') THEN
        CREATE INDEX idx_youtube_categories_name ON youtube_categories(name);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_youtube_categories_parent_id') THEN
        CREATE INDEX idx_youtube_categories_parent_id ON youtube_categories(parent_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_youtube_categories_sort_order') THEN
        CREATE INDEX idx_youtube_categories_sort_order ON youtube_categories(sort_order);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_youtube_channels_category') THEN
        CREATE INDEX idx_youtube_channels_category ON youtube_channels(category);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_youtube_channels_tags') THEN
        CREATE INDEX idx_youtube_channels_tags ON youtube_channels USING GIN(tags);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_youtube_channels_title') THEN
        CREATE INDEX idx_youtube_channels_title ON youtube_channels(title);
    END IF;
END $$;

-- Row Level Security (RLS) 설정
ALTER TABLE youtube_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정 (안전하게 생성)
DO $$
BEGIN
    -- YouTube Categories 정책들
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view youtube categories' AND tablename = 'youtube_categories') THEN
        EXECUTE 'CREATE POLICY "Anyone can view youtube categories" ON youtube_categories FOR SELECT USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can insert youtube categories' AND tablename = 'youtube_categories') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can insert youtube categories" ON youtube_categories FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update youtube categories' AND tablename = 'youtube_categories') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can update youtube categories" ON youtube_categories FOR UPDATE USING (auth.role() = ''authenticated'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete youtube categories' AND tablename = 'youtube_categories') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can delete youtube categories" ON youtube_categories FOR DELETE USING (auth.role() = ''authenticated'')';
    END IF;
    
    -- YouTube Channels 정책들
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Anyone can view youtube channels' AND tablename = 'youtube_channels') THEN
        EXECUTE 'CREATE POLICY "Anyone can view youtube channels" ON youtube_channels FOR SELECT USING (true)';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can insert youtube channels' AND tablename = 'youtube_channels') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can insert youtube channels" ON youtube_channels FOR INSERT WITH CHECK (auth.role() = ''authenticated'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can update youtube channels' AND tablename = 'youtube_channels') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can update youtube channels" ON youtube_channels FOR UPDATE USING (auth.role() = ''authenticated'')';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can delete youtube channels' AND tablename = 'youtube_channels') THEN
        EXECUTE 'CREATE POLICY "Authenticated users can delete youtube channels" ON youtube_channels FOR DELETE USING (auth.role() = ''authenticated'')';
    END IF;
END $$;

-- 트리거: updated_at 자동 갱신 (안전하게 생성)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_youtube_categories_updated_at') THEN
        EXECUTE 'CREATE TRIGGER update_youtube_categories_updated_at BEFORE UPDATE ON youtube_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_youtube_channels_updated_at') THEN
        EXECUTE 'CREATE TRIGGER update_youtube_channels_updated_at BEFORE UPDATE ON youtube_channels FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()';
    END IF;
END $$;

-- 기본 유튜브 카테고리 데이터 삽입 (중복 방지)
INSERT INTO youtube_categories (name, description, icon, sort_order) VALUES
  ('주식분석', '개별 주식 분석 및 종목 추천 채널', '📊', 1),
  ('경제뉴스', '경제 동향 및 시장 뉴스 분석 채널', '📰', 2),
  ('투자교육', '투자 기초 및 전략 교육 채널', '🎓', 3),
  ('부동산', '부동산 투자 및 시장 분석 채널', '🏠', 4),
  ('암호화폐', '가상화폐 및 블록체인 관련 채널', '₿', 5),
  ('해외투자', '해외 주식 및 글로벌 투자 채널', '🌍', 6),
  ('펀드/ETF', '펀드 및 ETF 상품 분석 채널', '💼', 7)
ON CONFLICT (name) DO NOTHING;