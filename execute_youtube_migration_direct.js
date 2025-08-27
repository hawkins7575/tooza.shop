const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function executeYouTubeMigration() {
  try {
    console.log('YouTube 테이블 생성을 시작합니다...');
    
    // 1. 먼저 테이블 존재 확인
    console.log('1. 기존 테이블 확인 중...');
    
    const { data: tables, error: tableError } = await supabase.rpc('exec_sql', {
      sql: "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('youtube_channels', 'youtube_categories')"
    });
    
    if (tableError) {
      console.log('테이블 확인 실패 (정상일 수 있음):', tableError.message);
    } else {
      console.log('기존 테이블:', tables);
    }
    
    // 2. YouTube Categories 테이블 생성
    console.log('2. YouTube Categories 테이블 생성 중...');
    
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (categoriesError) {
      console.error('Categories 테이블 생성 오류:', categoriesError);
      throw categoriesError;
    }
    console.log('✅ YouTube Categories 테이블 생성 완료');
    
    // 3. YouTube Channels 테이블 생성
    console.log('3. YouTube Channels 테이블 생성 중...');
    
    const { error: channelsError } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    });
    
    if (channelsError) {
      console.error('Channels 테이블 생성 오류:', channelsError);
      throw channelsError;
    }
    console.log('✅ YouTube Channels 테이블 생성 완료');
    
    // 4. RLS 활성화
    console.log('4. Row Level Security 설정 중...');
    
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE youtube_categories ENABLE ROW LEVEL SECURITY;
        ALTER TABLE youtube_channels ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (rlsError) {
      console.log('RLS 설정 오류 (무시 가능):', rlsError.message);
    } else {
      console.log('✅ RLS 설정 완료');
    }
    
    // 5. 기본 카테고리 데이터 삽입
    console.log('5. 기본 카테고리 데이터 삽입 중...');
    
    const { error: insertError } = await supabase
      .from('youtube_categories')
      .upsert([
        { name: '주식분석', description: '개별 주식 분석 및 종목 추천 채널', icon: '📊', sort_order: 1 },
        { name: '경제뉴스', description: '경제 동향 및 시장 뉴스 분석 채널', icon: '📰', sort_order: 2 },
        { name: '투자교육', description: '투자 기초 및 전략 교육 채널', icon: '🎓', sort_order: 3 },
        { name: '부동산', description: '부동산 투자 및 시장 분석 채널', icon: '🏠', sort_order: 4 },
        { name: '암호화폐', description: '가상화폐 및 블록체인 관련 채널', icon: '₿', sort_order: 5 },
        { name: '해외투자', description: '해외 주식 및 글로벌 투자 채널', icon: '🌍', sort_order: 6 },
        { name: '펀드/ETF', description: '펀드 및 ETF 상품 분석 채널', icon: '💼', sort_order: 7 }
      ], { onConflict: 'name' });
    
    if (insertError) {
      console.log('기본 데이터 삽입 오류 (무시 가능):', insertError.message);
    } else {
      console.log('✅ 기본 카테고리 데이터 삽입 완료');
    }
    
    // 6. 테이블 생성 확인
    console.log('6. 테이블 생성 확인 중...');
    
    const { data: categoriesCheck, error: catCheckError } = await supabase
      .from('youtube_categories')
      .select('count', { count: 'exact', head: true });
    
    const { data: channelsCheck, error: chanCheckError } = await supabase
      .from('youtube_channels')
      .select('count', { count: 'exact', head: true });
    
    if (catCheckError || chanCheckError) {
      console.error('테이블 확인 오류:', { catCheckError, chanCheckError });
    } else {
      console.log(`✅ 테이블 확인 완료:`);
      console.log(`   - youtube_categories: 테이블 생성됨`);
      console.log(`   - youtube_channels: 테이블 생성됨`);
    }
    
    console.log('\n🎉 YouTube 테이블 생성이 완료되었습니다!');
    console.log('이제 관리자 페이지에서 유튜브 채널 추가 기능을 사용할 수 있습니다.');
    
  } catch (error) {
    console.error('마이그레이션 실행 오류:', error);
    process.exit(1);
  }
}

// 직접 실행
if (require.main === module) {
  executeYouTubeMigration();
}

module.exports = { executeYouTubeMigration };