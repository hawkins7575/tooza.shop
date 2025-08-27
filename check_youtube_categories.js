const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkCategories() {
  try {
    console.log('YouTube 카테고리 데이터를 확인합니다...');
    
    const { data: categories, error } = await supabase
      .from('youtube_categories')
      .select('*')
      .order('sort_order');
    
    if (error) {
      console.error('카테고리 조회 오류:', error);
      return;
    }
    
    console.log('데이터베이스의 YouTube 카테고리:');
    categories?.forEach(cat => {
      console.log(`- ${cat.name} (${cat.icon}) - sort_order: ${cat.sort_order}`);
    });
    
    console.log('\nFilterPanel에서 사용 중인 카테고리:');
    console.log('- 유튜브-주식분석');
    console.log('- 유튜브-경제뉴스'); 
    console.log('- 유튜브-투자교육');
    console.log('- 유튜브-코인');
    console.log('- 유튜브-부동산');
    console.log('- 유튜브-해외투자');
    console.log('- 유튜브-차트분석');
    console.log('- 유튜브-투자전략');
    
  } catch (error) {
    console.error('확인 중 오류:', error);
  }
}

checkCategories();