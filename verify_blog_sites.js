const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 우리가 추가하려는 블로그들
const targetBlogs = [
  'https://korea-stock-research.com',
  'https://kospi-datalab.com', 
  'https://usstockmasters.com',
  'https://wallstreetanalyticspro.com'
];

async function verifyBlogAddition() {
  try {
    console.log('🔍 블로그 사이트 존재 여부를 정확히 확인합니다...\n');

    for (const url of targetBlogs) {
      const { data: site, error } = await supabase
        .from('sites')
        .select('*')
        .eq('url', url)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error(`❌ 조회 오류 (${url}):`, error);
        continue;
      }

      if (site) {
        console.log(`✅ 존재: ${site.title}`);
        console.log(`   URL: ${site.url}`);
        console.log(`   카테고리: ${site.category}`);
        console.log(`   설명: ${site.description.substring(0, 50)}...`);
        console.log('');
      } else {
        console.log(`❌ 존재하지 않음: ${url}\n`);
      }
    }

    // 최근 추가된 사이트들 확인 (최신 10개)
    console.log('📅 최근 추가된 사이트들 (최신 10개):');
    const { data: recentSites, error: recentError } = await supabase
      .from('sites')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (recentError) {
      console.error('최근 사이트 조회 오류:', recentError);
    } else {
      recentSites?.forEach((site, index) => {
        console.log(`${index + 1}. ${site.title}`);
        console.log(`   카테고리: ${site.category} | 생성일: ${site.created_at}`);
      });
    }

  } catch (error) {
    console.error('🚨 검증 중 오류:', error);
  }
}

verifyBlogAddition();