const { createClient } = require('@supabase/supabase-js');

// Supabase 설정
const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkYouTubeTables() {
  try {
    console.log('YouTube 테이블 존재 여부를 확인합니다...');
    
    // 1. YouTube Categories 테이블 확인
    console.log('1. YouTube Categories 테이블 확인 중...');
    
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('youtube_categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.log('❌ youtube_categories 테이블이 존재하지 않습니다.');
      console.log('오류:', categoriesError.message);
    } else {
      console.log('✅ youtube_categories 테이블이 존재합니다.');
      console.log('데이터 개수:', categoriesData?.length || 0);
    }
    
    // 2. YouTube Channels 테이블 확인
    console.log('2. YouTube Channels 테이블 확인 중...');
    
    const { data: channelsData, error: channelsError } = await supabase
      .from('youtube_channels')
      .select('*')
      .limit(1);
    
    if (channelsError) {
      console.log('❌ youtube_channels 테이블이 존재하지 않습니다.');
      console.log('오류:', channelsError.message);
    } else {
      console.log('✅ youtube_channels 테이블이 존재합니다.');
      console.log('데이터 개수:', channelsData?.length || 0);
    }
    
    // 3. 결론
    if (categoriesError || channelsError) {
      console.log('\n❌ YouTube 테이블이 생성되지 않았습니다.');
      console.log('Supabase Dashboard에서 수동으로 SQL을 실행해주세요:');
      console.log('1. https://supabase.com/dashboard 로그인');
      console.log('2. 프로젝트 선택');
      console.log('3. SQL Editor 클릭');
      console.log('4. manual_sql_setup.md 파일의 SQL 실행');
    } else {
      console.log('\n✅ 모든 YouTube 테이블이 정상적으로 생성되었습니다!');
    }
    
  } catch (error) {
    console.error('테이블 확인 중 오류:', error);
  }
}

// 직접 실행
if (require.main === module) {
  checkYouTubeTables();
}

module.exports = { checkYouTubeTables };