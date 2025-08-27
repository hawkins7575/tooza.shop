const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// 한국 주요 증권사 목록
const koreanSecuritiesCompanies = [
  {
    title: 'NH투자증권',
    url: 'https://www.nhqv.com',
    description: 'NH투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치 제공',
    category: '증권사',
    tags: ['NH투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=nhqv.com&sz=64'
  },
  {
    title: '삼성증권',
    url: 'https://www.samsungpop.com',
    description: '삼성증권 공식 홈페이지 - 주식거래, 투자상품, 리서치 보고서',
    category: '증권사',
    tags: ['삼성증권', '주식거래', 'POP'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=samsungpop.com&sz=64'
  },
  {
    title: '키움증권',
    url: 'https://www.kiwoom.com',
    description: '키움증권 공식 홈페이지 - 영웅문, 주식거래, 투자정보',
    category: '증권사',
    tags: ['키움증권', '영웅문', '주식거래'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=kiwoom.com&sz=64'
  },
  {
    title: '미래에셋증권',
    url: 'https://www.miraeasset.com',
    description: '미래에셋증권 공식 홈페이지 - 주식거래, 투자정보, 글로벌 투자',
    category: '증권사',
    tags: ['미래에셋증권', '주식거래', '글로벌투자'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=miraeasset.com&sz=64'
  },
  {
    title: 'KB증권',
    url: 'https://www.kbsec.com',
    description: 'KB증권 공식 홈페이지 - 주식거래, 투자상품, 리서치',
    category: '증권사',
    tags: ['KB증권', '주식거래', '투자상품'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=kbsec.com&sz=64'
  },
  {
    title: '신한투자증권',
    url: 'https://www.shinhansec.com',
    description: '신한투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['신한투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=shinhansec.com&sz=64'
  },
  {
    title: '하나증권',
    url: 'https://www.hanaw.com',
    description: '하나증권 공식 홈페이지 - 주식거래, 투자상품, 리서치',
    category: '증권사',
    tags: ['하나증권', '주식거래', '투자상품'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=hanaw.com&sz=64'
  },
  {
    title: '대신증권',
    url: 'https://www.daishin.com',
    description: '대신증권 공식 홈페이지 - 주식거래, 투자정보, 크레온',
    category: '증권사',
    tags: ['대신증권', '크레온', '주식거래'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=daishin.com&sz=64'
  },
  {
    title: 'SK증권',
    url: 'https://www.sks.co.kr',
    description: 'SK증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['SK증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=sks.co.kr&sz=64'
  },
  {
    title: 'IBK투자증권',
    url: 'https://www.ibks.com',
    description: 'IBK투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['IBK투자증권', '기업은행', '주식거래'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=ibks.com&sz=64'
  },
  {
    title: '유진투자증권',
    url: 'https://www.eugenes.com',
    description: '유진투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['유진투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=eugenes.com&sz=64'
  },
  {
    title: '교보증권',
    url: 'https://www.kyobosec.co.kr',
    description: '교보증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['교보증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=kyobosec.co.kr&sz=64'
  },
  {
    title: '한국투자증권',
    url: 'https://www.truefriend.com',
    description: '한국투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['한국투자증권', 'TrueFriend', '주식거래'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=truefriend.com&sz=64'
  },
  {
    title: '메리츠증권',
    url: 'https://www.meritz.co.kr',
    description: '메리츠증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['메리츠증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=meritz.co.kr&sz=64'
  },
  {
    title: '현대차증권',
    url: 'https://www.hmcsec.com',
    description: '현대차증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['현대차증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=hmcsec.com&sz=64'
  },
  {
    title: '케이프투자증권',
    url: 'https://www.kape.co.kr',
    description: '케이프투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['케이프투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=kape.co.kr&sz=64'
  },
  {
    title: '이베스트투자증권',
    url: 'https://www.ebestsec.co.kr',
    description: '이베스트투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['이베스트투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=ebestsec.co.kr&sz=64'
  },
  {
    title: '신영증권',
    url: 'https://www.shinyoung.com',
    description: '신영증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['신영증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=shinyoung.com&sz=64'
  },
  {
    title: '부국증권',
    url: 'https://www.bks.co.kr',
    description: '부국증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['부국증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=bks.co.kr&sz=64'
  },
  {
    title: '동부증권',
    url: 'https://www.dongbustock.com',
    description: '동부증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['동부증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=dongbustock.com&sz=64'
  },
  {
    title: '리딩투자증권',
    url: 'https://www.leading.co.kr',
    description: '리딩투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['리딩투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=leading.co.kr&sz=64'
  },
  {
    title: '상상인증권',
    url: 'https://www.sangsangin.co.kr',
    description: '상상인증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['상상인증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=sangsangin.co.kr&sz=64'
  },
  {
    title: '한화투자증권',
    url: 'https://www.hanwhawm.com',
    description: '한화투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: ['한화투자증권', '주식거래', '투자정보'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=hanwhawm.com&sz=64'
  },
  {
    title: '토스증권',
    url: 'https://securities.toss.im',
    description: '토스증권 공식 홈페이지 - 간편한 주식거래, 투자정보',
    category: '증권사',
    tags: ['토스증권', '간편투자', '주식거래'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=securities.toss.im&sz=64'
  },
  {
    title: '카카오페이증권',
    url: 'https://securities.kakaopay.com',
    description: '카카오페이증권 공식 홈페이지 - 간편한 주식거래, 투자정보',
    category: '증권사',
    tags: ['카카오페이증권', '간편투자', '주식거래'],
    favicon_url: 'https://www.google.com/s2/favicons?domain=securities.kakaopay.com&sz=64'
  }
]

async function addSecuritiesCompanies() {
  try {
    console.log('증권사 카테고리 확인 중...')
    
    // 증권사 카테고리가 있는지 확인
    const { data: categories, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('name', '증권사')

    if (categoryError) {
      console.error('카테고리 조회 오류:', categoryError)
      return
    }

    // 증권사 카테고리가 없으면 생성
    if (!categories || categories.length === 0) {
      console.log('증권사 카테고리 생성 중...')
      const { error: insertError } = await supabase
        .from('categories')
        .insert({
          name: '증권사',
          description: '한국 주요 증권사 모음',
          icon: '🏦',
          sort_order: 10
        })

      if (insertError) {
        console.error('카테고리 생성 오류:', insertError)
        return
      }
      console.log('✅ 증권사 카테고리 생성 완료')
    } else {
      console.log('✅ 증권사 카테고리 확인됨')
    }

    console.log('증권사 사이트 등록 시작...')
    
    // 각 증권사를 하나씩 등록
    let successCount = 0
    let errorCount = 0

    for (const company of koreanSecuritiesCompanies) {
      try {
        // 중복 체크
        const { data: existing } = await supabase
          .from('sites')
          .select('id')
          .eq('url', company.url)

        if (existing && existing.length > 0) {
          console.log(`⏭️  ${company.title} - 이미 등록됨`)
          continue
        }

        // 새 증권사 등록
        const { error: insertError } = await supabase
          .from('sites')
          .insert({
            title: company.title,
            url: company.url,
            description: company.description,
            category: company.category,
            tags: company.tags,
            thumbnail_url: company.favicon_url
          })

        if (insertError) {
          console.error(`❌ ${company.title} 등록 실패:`, insertError.message)
          errorCount++
        } else {
          console.log(`✅ ${company.title} 등록 완료`)
          successCount++
        }

        // API 호출 간격 조절
        await new Promise(resolve => setTimeout(resolve, 100))

      } catch (error) {
        console.error(`❌ ${company.title} 처리 중 오류:`, error.message)
        errorCount++
      }
    }

    console.log('\n=== 등록 완료 ===')
    console.log(`✅ 성공: ${successCount}개`)
    console.log(`❌ 실패: ${errorCount}개`)
    console.log(`📝 총 처리: ${koreanSecuritiesCompanies.length}개`)

  } catch (error) {
    console.error('전체 프로세스 오류:', error)
  }
}

// 스크립트 실행
addSecuritiesCompanies()
  .then(() => {
    console.log('증권사 등록 프로세스 완료')
    process.exit(0)
  })
  .catch((error) => {
    console.error('프로세스 실행 오류:', error)
    process.exit(1)
  })