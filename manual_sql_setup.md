# YouTube 테이블 수동 설정 가이드

## 문제 상황
관리자 페이지에서 유튜브 채널 추가 시 오류가 발생하는 이유는 데이터베이스에 `youtube_channels` 및 `youtube_categories` 테이블이 존재하지 않기 때문입니다.

## 해결 방법

### 1. Supabase Dashboard 접속
1. [Supabase Dashboard](https://supabase.com/dashboard) 에 로그인
2. 프로젝트 선택 (URL: https://latnaiwpixeweqfxwczu.supabase.co)
3. 좌측 메뉴에서 "SQL Editor" 클릭

### 2. 테이블 생성 SQL 실행
아래 SQL을 SQL Editor에 복사하여 실행하세요:

```sql
-- YouTube Categories 테이블 생성
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

-- YouTube Channels 테이블 생성
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

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_youtube_categories_name ON youtube_categories(name);
CREATE INDEX IF NOT EXISTS idx_youtube_categories_parent_id ON youtube_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_youtube_categories_sort_order ON youtube_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_youtube_channels_category ON youtube_channels(category);
CREATE INDEX IF NOT EXISTS idx_youtube_channels_tags ON youtube_channels USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_youtube_channels_title ON youtube_channels(title);

-- Row Level Security (RLS) 설정
ALTER TABLE youtube_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;

-- RLS 정책 설정
-- YouTube Categories: 모든 사용자가 조회 가능, 인증된 사용자만 수정 가능
CREATE POLICY IF NOT EXISTS "Anyone can view youtube categories" ON youtube_categories FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can insert youtube categories" ON youtube_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can update youtube categories" ON youtube_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete youtube categories" ON youtube_categories FOR DELETE USING (auth.role() = 'authenticated');

-- YouTube Channels: 모든 사용자가 조회 가능, 인증된 사용자만 수정 가능
CREATE POLICY IF NOT EXISTS "Anyone can view youtube channels" ON youtube_channels FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Authenticated users can insert youtube channels" ON youtube_channels FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can update youtube channels" ON youtube_channels FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY IF NOT EXISTS "Authenticated users can delete youtube channels" ON youtube_channels FOR DELETE USING (auth.role() = 'authenticated');

-- 기본 유튜브 카테고리 데이터 삽입
INSERT INTO youtube_categories (name, description, icon, sort_order) VALUES
  ('주식분석', '개별 주식 분석 및 종목 추천 채널', '📊', 1),
  ('경제뉴스', '경제 동향 및 시장 뉴스 분석 채널', '📰', 2),
  ('투자교육', '투자 기초 및 전략 교육 채널', '🎓', 3),
  ('부동산', '부동산 투자 및 시장 분석 채널', '🏠', 4),
  ('암호화폐', '가상화폐 및 블록체인 관련 채널', '₿', 5),
  ('해외투자', '해외 주식 및 글로벌 투자 채널', '🌍', 6),
  ('펀드/ETF', '펀드 및 ETF 상품 분석 채널', '💼', 7)
ON CONFLICT (name) DO NOTHING;
```

### 3. 실행 확인
SQL 실행 후 아래 쿼리로 테이블이 정상 생성되었는지 확인:

```sql
-- 테이블 존재 확인
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('youtube_channels', 'youtube_categories');

-- 기본 카테고리 데이터 확인
SELECT * FROM youtube_categories ORDER BY sort_order;
```

### 4. 애플리케이션 테스트
1. 웹 애플리케이션을 새로고침
2. 관리자 페이지에서 "유튜브 채널 추가" 기능 테스트
3. "유튜브 카테고리 추가" 기능 테스트

## 수정된 기능

### 오류 처리 개선
- 테이블이 없을 때 사용자에게 명확한 안내 메시지 표시
- 중복 URL/이름에 대한 적절한 오류 메시지
- 필수 필드 누락에 대한 검증

### 타입 정의 추가
- TypeScript 타입에 `youtube_channels`, `youtube_categories` 테이블 정의 추가
- Supabase 클라이언트 타입 정의 개선

## 향후 작업
1. 마이그레이션 파일을 통한 자동 테이블 생성 (Supabase CLI 설치 후)
2. 유튜브 채널 메타데이터 자동 추출 기능 개선
3. 카테고리 계층 구조 관리 기능 추가