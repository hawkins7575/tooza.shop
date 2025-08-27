-- User Favorites Enhancement
-- 사용자 즐겨찾기 기능 개선을 위한 추가 테이블과 기능

-- User Favorite Categories 테이블 (사용자 정의 카테고리)
CREATE TABLE user_favorite_categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7) DEFAULT '#2563eb', -- hex color
  icon VARCHAR(50) DEFAULT '📁',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- User Favorite Sites 테이블 (사용자 정의 즐겨찾기 그룹)
CREATE TABLE user_favorite_sites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES user_favorite_categories(id) ON DELETE CASCADE,
  site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
  notes TEXT, -- 개인 메모
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- 개인 평점
  visit_count INTEGER DEFAULT 0,
  last_visited TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, category_id, site_id)
);

-- User Dashboard Settings 테이블 (개인 대시보드 설정)
CREATE TABLE user_dashboard_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  default_view VARCHAR(20) DEFAULT 'bookmarks', -- 'bookmarks', 'categories', 'recent'
  cards_per_row INTEGER DEFAULT 3,
  show_descriptions BOOLEAN DEFAULT true,
  show_tags BOOLEAN DEFAULT true,
  theme VARCHAR(20) DEFAULT 'light', -- 'light', 'dark'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX idx_user_favorite_categories_user_id ON user_favorite_categories(user_id);
CREATE INDEX idx_user_favorite_categories_sort_order ON user_favorite_categories(sort_order);
CREATE INDEX idx_user_favorite_sites_user_id ON user_favorite_sites(user_id);
CREATE INDEX idx_user_favorite_sites_category_id ON user_favorite_sites(category_id);
CREATE INDEX idx_user_favorite_sites_site_id ON user_favorite_sites(site_id);
CREATE INDEX idx_user_favorite_sites_last_visited ON user_favorite_sites(last_visited);

-- RLS 정책 설정
ALTER TABLE user_favorite_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorite_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard_settings ENABLE ROW LEVEL SECURITY;

-- User Favorite Categories 정책
CREATE POLICY "Users can manage own favorite categories" ON user_favorite_categories FOR ALL USING (auth.uid() = user_id);

-- User Favorite Sites 정책
CREATE POLICY "Users can manage own favorite sites" ON user_favorite_sites FOR ALL USING (auth.uid() = user_id);

-- User Dashboard Settings 정책
CREATE POLICY "Users can manage own dashboard settings" ON user_dashboard_settings FOR ALL USING (auth.uid() = user_id);

-- 트리거: updated_at 자동 갱신
CREATE TRIGGER update_user_favorite_categories_updated_at BEFORE UPDATE ON user_favorite_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_favorite_sites_updated_at BEFORE UPDATE ON user_favorite_sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_dashboard_settings_updated_at BEFORE UPDATE ON user_dashboard_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 방문 횟수 업데이트 함수
CREATE OR REPLACE FUNCTION increment_visit_count(p_user_id UUID, p_site_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_favorite_sites (user_id, site_id, visit_count, last_visited)
  VALUES (p_user_id, p_site_id, 1, NOW())
  ON CONFLICT (user_id, site_id)
  DO UPDATE SET 
    visit_count = user_favorite_sites.visit_count + 1,
    last_visited = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 기본 즐겨찾기 카테고리 생성 함수
CREATE OR REPLACE FUNCTION create_default_favorite_categories(p_user_id UUID)
RETURNS void AS $$
BEGIN
  INSERT INTO user_favorite_categories (user_id, name, description, icon, sort_order)
  VALUES 
    (p_user_id, '주식투자', '주식 관련 투자 사이트', '📈', 1),
    (p_user_id, '부동산', '부동산 투자 정보', '🏠', 2),
    (p_user_id, '암호화폐', '가상화폐 투자 정보', '₿', 3),
    (p_user_id, '경제뉴스', '경제 뉴스 및 분석', '📰', 4),
    (p_user_id, '투자도구', '투자 도구 및 플랫폼', '🛠️', 5)
  ON CONFLICT (user_id, name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;