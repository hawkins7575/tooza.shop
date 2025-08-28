const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugHomepageData() {
  try {
    console.log('🔍 HomePage에서 실제로 가져오는 데이터를 확인합니다...\n');

    // HomePage.tsx와 같은 방식으로 데이터 조회
    const { data: allSites, error } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ 데이터 조회 오류:', error);
      return;
    }

    console.log(`📊 전체 사이트 개수: ${allSites?.length || 0}개\n`);

    // 블로그 키워드로 필터링
    const blogKeywords = ['한국주식투자연구소', '코스피데이터랩', 'Stock Masters', 'Analytics Pro'];
    console.log('🎯 블로그 사이트 검색 결과:');
    
    blogKeywords.forEach(keyword => {
      const found = allSites?.filter(site => site.title.includes(keyword));
      if (found && found.length > 0) {
        console.log(`\n✅ "${keyword}" 검색 결과: ${found.length}개`);
        found.forEach(site => {
          console.log(`   제목: ${site.title}`);
          console.log(`   URL: ${site.url}`);
          console.log(`   카테고리: ${site.category}`);
          console.log(`   생성일: ${site.created_at}`);
          console.log('   ---');
        });
      } else {
        console.log(`❌ "${keyword}" 검색 결과: 0개`);
      }
    });

    // 카테고리별로 분류해서 확인
    console.log('\n📂 카테고리별 사이트 분류:');
    const categories = {};
    allSites?.forEach(site => {
      if (!categories[site.category]) {
        categories[site.category] = [];
      }
      categories[site.category].push(site);
    });

    Object.entries(categories).forEach(([category, sites]) => {
      console.log(`\n📁 ${category} (${sites.length}개):`);
      sites.slice(0, 3).forEach(site => {
        console.log(`   - ${site.title}`);
      });
      if (sites.length > 3) {
        console.log(`   ... 외 ${sites.length - 3}개 더`);
      }
    });

    // 최신 추가된 사이트 10개
    console.log('\n🕐 최신 추가된 사이트 10개:');
    const recentSites = allSites?.slice(0, 10) || [];
    recentSites.forEach((site, index) => {
      console.log(`${index + 1}. ${site.title} (${site.category}) - ${site.created_at}`);
    });

  } catch (error) {
    console.error('🚨 디버깅 중 오류:', error);
  }
}

debugHomepageData();