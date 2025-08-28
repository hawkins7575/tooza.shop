const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정
const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 기본 사이트 정보
const SITE_URL = 'https://finance-link.com';
const TODAY = new Date().toISOString().split('T')[0];

// 정적 페이지 설정
const staticPages = [
  { url: '/', changefreq: 'daily', priority: '1.0', lastmod: TODAY },
  { url: '/about', changefreq: 'monthly', priority: '0.9', lastmod: TODAY },
  { url: '/blog', changefreq: 'daily', priority: '0.9', lastmod: TODAY },
  { url: '/dashboard', changefreq: 'daily', priority: '0.8', lastmod: TODAY },
  { url: '/bookmarks', changefreq: 'weekly', priority: '0.7', lastmod: TODAY },
  { url: '/privacy', changefreq: 'yearly', priority: '0.3', lastmod: TODAY },
  { url: '/terms', changefreq: 'yearly', priority: '0.3', lastmod: TODAY }
];

async function generateSitemap() {
  try {
    console.log('🚀 사이트맵 생성 시작...');
    
    // 블로그 포스트 가져오기
    const { data: blogPosts, error } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('published', true)
      .order('updated_at', { ascending: false });

    if (error) {
      throw error;
    }

    console.log(`📝 ${blogPosts?.length || 0}개 블로그 포스트 발견`);

    // XML 시작
    let xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
`;

    // 정적 페이지 추가
    staticPages.forEach(page => {
      xmlContent += `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    });

    // 블로그 포스트 추가
    if (blogPosts && blogPosts.length > 0) {
      blogPosts.forEach(post => {
        const lastmod = post.updated_at ? 
          new Date(post.updated_at).toISOString().split('T')[0] : 
          new Date(post.created_at).toISOString().split('T')[0];
          
        xmlContent += `  <url>
    <loc>${SITE_URL}/blog/${post.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <news:news>
      <news:publication>
        <news:name>Finance Link</news:name>
        <news:language>ko</news:language>
      </news:publication>
      <news:publication_date>${post.created_at}</news:publication_date>
    </news:news>
  </url>
`;
      });
    }

    // XML 마무리
    xmlContent += '</urlset>';

    // 파일 저장
    const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
    
    console.log('✅ 사이트맵 생성 완료!');
    console.log(`📍 위치: ${sitemapPath}`);
    console.log(`🔗 총 ${staticPages.length + (blogPosts?.length || 0)}개 URL 포함`);

    // robots.txt 업데이트
    generateRobotsTxt();

  } catch (error) {
    console.error('❌ 사이트맵 생성 실패:', error.message);
  }
}

function generateRobotsTxt() {
  const robotsContent = `User-agent: *
Allow: /

User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 2

# SEO 최적화된 사이트맵
Sitemap: ${SITE_URL}/sitemap.xml

# 크롤링 제외 경로
Disallow: /admin
Disallow: /api/
Disallow: /private/
Disallow: /*?*
Disallow: /dashboard/private/
Disallow: /user/

# 허용 경로 명시
Allow: /blog/
Allow: /dashboard/
Allow: /about/
Allow: /bookmarks/
`;

  const robotsPath = path.join(__dirname, 'public', 'robots.txt');
  fs.writeFileSync(robotsPath, robotsContent, 'utf8');
  console.log('🤖 robots.txt 업데이트 완료!');
}

// 실행
generateSitemap();