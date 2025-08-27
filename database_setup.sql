-- Finance Link Database Setup for Supabase
-- 이 SQL을 Supabase SQL Editor에서 실행하세요

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories 테이블 (투자 카테고리)
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(50)
);

-- Sites 테이블 (투자 사이트 정보)
CREATE TABLE sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  tags TEXT[] DEFAULT '{}',
  thumbnail_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users 테이블 (Supabase Auth와 연동)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookmarks 테이블 (사용자 즐겨찾기)
CREATE TABLE bookmarks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, site_id)
);

-- Blog Posts 테이블 (투자 블로그)
CREATE TABLE blog_posts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_sites_category ON sites(category);
CREATE INDEX idx_sites_tags ON sites USING GIN(tags);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_blog_posts_user_id ON blog_posts(user_id);
CREATE INDEX idx_blog_posts_published ON blog_posts(published);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);

-- Row Level Security (RLS) 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- Users: 본인 정보만 조회/수정 가능
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Bookmarks: 본인 북마크만 관리 가능
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Blog Posts: 본인 글만 수정/삭제, 퍼블리시된 글은 모두 조회 가능
CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Users can view own posts" ON blog_posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own posts" ON blog_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON blog_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON blog_posts FOR DELETE USING (auth.uid() = user_id);

-- Sites: 모든 사용자가 조회 가능, 관리자만 수정 가능
CREATE POLICY "Anyone can view sites" ON sites FOR SELECT USING (true);

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
INSERT INTO sites (title, url, description, category, tags, thumbnail_url) VALUES
('네이버 금융', 'https://finance.naver.com', '국내 주식 정보 및 시세', '주식', ARRAY['주식', '시세', '국내'], NULL),
('야후 파이낸스', 'https://finance.yahoo.com', '글로벌 금융 정보', '주식', ARRAY['주식', '해외', '글로벌'], NULL),
('부동산114', 'https://www.r114.com', '부동산 시세 및 매물 정보', '부동산', ARRAY['부동산', '시세'], NULL),
('업비트', 'https://upbit.com', '국내 대표 암호화폐 거래소', '코인', ARRAY['코인', '거래소', '업비트'], NULL),
('한국투자증권', 'https://www.truefriend.com', '종합 금융 서비스', '주식', ARRAY['증권사', '종합'], NULL);

-- 함수: 업데이트 시간 자동 갱신
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 트리거: updated_at 자동 갱신
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();