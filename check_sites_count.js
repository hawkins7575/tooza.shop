const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSitesStatus() {
  try {
    console.log('📊 현재 사이트 데이터베이스 상태 확인...\n');

    // 전체 사이트 개수 확인
    const { data: allSites, error: countError } = await supabase
      .from('sites')
      .select('id, title, category')

    if (countError) {
      console.error('❌ 사이트 조회 오류:', countError);
      return;
    }

    console.log(`📈 전체 사이트 개수: ${allSites?.length || 0}개\n`);

    // 카테고리별 개수
    const categoryCount = {};
    allSites?.forEach(site => {
      categoryCount[site.category] = (categoryCount[site.category] || 0) + 1;
    });

    console.log('📊 카테고리별 분포:');
    Object.entries(categoryCount).forEach(([category, count]) => {
      console.log(`   ${category}: ${count}개`);
    });

    // 블로그 키워드가 포함된 사이트 확인
    const blogKeywords = ['연구소', '데이터랩', 'Stock Masters', 'Analytics Pro'];
    console.log('\n🔍 블로그 관련 사이트 검색:');
    
    let foundBlogCount = 0;
    blogKeywords.forEach(keyword => {
      const found = allSites?.filter(site => site.title.includes(keyword));
      if (found && found.length > 0) {
        console.log(`   "${keyword}" 포함: ${found.length}개`);
        found.forEach(site => console.log(`     - ${site.title}`));
        foundBlogCount += found.length;
      } else {
        console.log(`   "${keyword}" 포함: 0개`);
      }
    });

    console.log(`\n📝 블로그 총 개수: ${foundBlogCount}개 (목표: 4개)`);

    if (foundBlogCount < 4) {
      console.log('\n⚠️  블로그가 제대로 추가되지 않았습니다.');
      console.log('💡 관리자 페이지에서 수동으로 추가해보겠습니다.');
    } else {
      console.log('\n✅ 블로그가 정상적으로 추가되었습니다!');
    }

  } catch (error) {
    console.error('🚨 상태 확인 중 오류:', error);
  }
}

checkSitesStatus();