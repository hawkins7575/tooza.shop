require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function insertSimpleBlog() {
  console.log('간단한 테스트 블로그 포스트를 삽입합니다...');

  try {
    // 우선 현재 테이블 구조를 확인해보겠습니다
    const { data: tableInfo, error: tableError } = await supabase
      .from('blog_posts')
      .select('*')
      .limit(1);

    if (tableError) {
      console.log('테이블 조회 오류:', tableError);
      return;
    }

    console.log('기존 데이터 확인:', tableInfo);

    // 간단한 블로그 포스트 데이터
    const simpleBlog = {
      title: '테스트 국내 주식 투자 가이드',
      content: `# 국내 주식 투자 기초 가이드

## 왜 지금 주식 투자를 시작해야 할까?

한국 주식시장은 매력적인 투자 기회를 제공하고 있습니다.

![투자 이미지](/images/investment-guide.jpg)

## 기본 용어 정리

- **시가총액**: 회사의 전체 가치
- **PER**: 주가수익비율
- **배당수익률**: 배당금 비율

## 투자 전략

1. 분산 투자하기
2. 장기 관점 유지하기  
3. 리스크 관리하기

---

**면책조항**: 이 글은 교육 목적으로 작성되었습니다.`,
      slug: 'test-korean-stock-investment-guide',
      published: true
    };

    const { data, error } = await supabase
      .from('blog_posts')
      .insert([simpleBlog])
      .select();

    if (error) {
      console.error('삽입 실패:', error);
    } else {
      console.log('✅ 테스트 블로그 포스트 삽입 성공:', data);
    }

  } catch (err) {
    console.error('예외 발생:', err.message);
  }
}

insertSimpleBlog().catch(console.error);