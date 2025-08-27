// 브라우저 콘솔에서 실행할 코드 (관리자 페이지에서)
// 관리자 페이지 (/admin)에 로그인한 상태에서 브라우저 개발자 도구 콘솔에 붙여넣고 실행하세요

const koreanSecuritiesCompanies = [
  {
    title: 'NH투자증권',
    url: 'https://www.nhqv.com',
    description: 'NH투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치 제공',
    category: '증권사',
    tags: 'NH투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=nhqv.com&sz=64'
  },
  {
    title: '삼성증권',
    url: 'https://www.samsungpop.com',
    description: '삼성증권 공식 홈페이지 - 주식거래, 투자상품, 리서치 보고서',
    category: '증권사',
    tags: '삼성증권,주식거래,POP',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=samsungpop.com&sz=64'
  },
  {
    title: '키움증권',
    url: 'https://www.kiwoom.com',
    description: '키움증권 공식 홈페이지 - 영웅문, 주식거래, 투자정보',
    category: '증권사',
    tags: '키움증권,영웅문,주식거래',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=kiwoom.com&sz=64'
  },
  {
    title: '미래에셋증권',
    url: 'https://www.miraeasset.com',
    description: '미래에셋증권 공식 홈페이지 - 주식거래, 투자정보, 글로벌 투자',
    category: '증권사',
    tags: '미래에셋증권,주식거래,글로벌투자',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=miraeasset.com&sz=64'
  },
  {
    title: 'KB증권',
    url: 'https://www.kbsec.com',
    description: 'KB증권 공식 홈페이지 - 주식거래, 투자상품, 리서치',
    category: '증권사',
    tags: 'KB증권,주식거래,투자상품',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=kbsec.com&sz=64'
  },
  {
    title: '신한투자증권',
    url: 'https://www.shinhansec.com',
    description: '신한투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '신한투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=shinhansec.com&sz=64'
  },
  {
    title: '하나증권',
    url: 'https://www.hanaw.com',
    description: '하나증권 공식 홈페이지 - 주식거래, 투자상품, 리서치',
    category: '증권사',
    tags: '하나증권,주식거래,투자상품',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=hanaw.com&sz=64'
  },
  {
    title: '대신증권',
    url: 'https://www.daishin.com',
    description: '대신증권 공식 홈페이지 - 주식거래, 투자정보, 크레온',
    category: '증권사',
    tags: '대신증권,크레온,주식거래',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=daishin.com&sz=64'
  },
  {
    title: 'SK증권',
    url: 'https://www.sks.co.kr',
    description: 'SK증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: 'SK증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=sks.co.kr&sz=64'
  },
  {
    title: 'IBK투자증권',
    url: 'https://www.ibks.com',
    description: 'IBK투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: 'IBK투자증권,기업은행,주식거래',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=ibks.com&sz=64'
  },
  {
    title: '유진투자증권',
    url: 'https://www.eugenes.com',
    description: '유진투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '유진투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=eugenes.com&sz=64'
  },
  {
    title: '교보증권',
    url: 'https://www.kyobosec.co.kr',
    description: '교보증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '교보증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=kyobosec.co.kr&sz=64'
  },
  {
    title: '메리츠증권',
    url: 'https://www.meritz.co.kr',
    description: '메리츠증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '메리츠증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=meritz.co.kr&sz=64'
  },
  {
    title: '현대차증권',
    url: 'https://www.hmcsec.com',
    description: '현대차증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '현대차증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=hmcsec.com&sz=64'
  },
  {
    title: '케이프투자증권',
    url: 'https://www.kape.co.kr',
    description: '케이프투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '케이프투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=kape.co.kr&sz=64'
  },
  {
    title: '이베스트투자증권',
    url: 'https://www.ebestsec.co.kr',
    description: '이베스트투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '이베스트투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=ebestsec.co.kr&sz=64'
  },
  {
    title: '신영증권',
    url: 'https://www.shinyoung.com',
    description: '신영증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '신영증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=shinyoung.com&sz=64'
  },
  {
    title: '부국증권',
    url: 'https://www.bks.co.kr',
    description: '부국증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '부국증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=bks.co.kr&sz=64'
  },
  {
    title: '동부증권',
    url: 'https://www.dongbustock.com',
    description: '동부증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '동부증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=dongbustock.com&sz=64'
  },
  {
    title: '리딩투자증권',
    url: 'https://www.leading.co.kr',
    description: '리딩투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '리딩투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=leading.co.kr&sz=64'
  },
  {
    title: '상상인증권',
    url: 'https://www.sangsangin.co.kr',
    description: '상상인증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '상상인증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=sangsangin.co.kr&sz=64'
  },
  {
    title: '한화투자증권',
    url: 'https://www.hanwhawm.com',
    description: '한화투자증권 공식 홈페이지 - 주식거래, 투자정보, 리서치',
    category: '증권사',
    tags: '한화투자증권,주식거래,투자정보',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=hanwhawm.com&sz=64'
  },
  {
    title: '토스증권',
    url: 'https://securities.toss.im',
    description: '토스증권 공식 홈페이지 - 간편한 주식거래, 투자정보',
    category: '증권사',
    tags: '토스증권,간편투자,주식거래',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=securities.toss.im&sz=64'
  },
  {
    title: '카카오페이증권',
    url: 'https://securities.kakaopay.com',
    description: '카카오페이증권 공식 홈페이지 - 간편한 주식거래, 투자정보',
    category: '증권사',
    tags: '카카오페이증권,간편투자,주식거래',
    thumbnail_url: 'https://www.google.com/s2/favicons?domain=securities.kakaopay.com&sz=64'
  }
];

// 자동 등록 함수
async function autoAddSecurities() {
  console.log('🏦 한국 증권사 자동 등록 시작...');
  console.log(`📊 총 ${koreanSecuritiesCompanies.length}개 증권사를 등록합니다.`);

  // 사이트 추가 버튼 클릭
  const addButton = document.querySelector('button');
  if (addButton && addButton.textContent.includes('사이트 추가')) {
    addButton.click();
    console.log('✅ 사이트 추가 폼 열림');
  }

  let successCount = 0;
  let skipCount = 0;

  for (const [index, company] of koreanSecuritiesCompanies.entries()) {
    console.log(`\n[${index + 1}/${koreanSecuritiesCompanies.length}] ${company.title} 등록 중...`);
    
    try {
      // 폼 필드 찾기
      const titleInput = document.querySelector('input[placeholder="사이트 제목"]');
      const urlInput = document.querySelector('input[placeholder="사이트 URL"]');
      const categorySelect = document.querySelector('select');
      const descInput = document.querySelector('textarea[placeholder="사이트 설명"]');
      const tagsInput = document.querySelector('input[placeholder="태그 (쉼표로 구분)"]');
      const thumbnailInput = document.querySelector('input[placeholder="썸네일 URL"]');

      if (!titleInput || !urlInput || !categorySelect) {
        console.error('❌ 필수 폼 요소를 찾을 수 없습니다.');
        break;
      }

      // 폼 값 입력
      titleInput.value = company.title;
      titleInput.dispatchEvent(new Event('input', { bubbles: true }));

      urlInput.value = company.url;
      urlInput.dispatchEvent(new Event('input', { bubbles: true }));

      // 카테고리 선택 (증권사)
      categorySelect.value = company.category;
      categorySelect.dispatchEvent(new Event('change', { bubbles: true }));

      if (descInput) {
        descInput.value = company.description;
        descInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (tagsInput) {
        tagsInput.value = company.tags;
        tagsInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      if (thumbnailInput) {
        thumbnailInput.value = company.thumbnail_url;
        thumbnailInput.dispatchEvent(new Event('input', { bubbles: true }));
      }

      // 잠시 대기 후 제출
      await new Promise(resolve => setTimeout(resolve, 500));

      // 추가 버튼 클릭
      const submitButton = document.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.click();
        successCount++;
        console.log(`✅ ${company.title} 등록 완료`);
        
        // 다음 등록을 위해 대기
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 다시 사이트 추가 버튼 클릭 (다음 등록을 위해)
        if (index < koreanSecuritiesCompanies.length - 1) {
          const nextAddButton = document.querySelector('button');
          if (nextAddButton && nextAddButton.textContent.includes('사이트 추가')) {
            nextAddButton.click();
          }
        }
      } else {
        console.error(`❌ ${company.title} - 제출 버튼을 찾을 수 없습니다.`);
      }

    } catch (error) {
      console.error(`❌ ${company.title} 등록 중 오류:`, error);
    }

    // 진행률 표시
    if ((index + 1) % 5 === 0) {
      console.log(`📊 진행률: ${index + 1}/${koreanSecuritiesCompanies.length} (${Math.round((index + 1) / koreanSecuritiesCompanies.length * 100)}%)`);
    }
  }

  console.log('\n🎉 증권사 등록 완료!');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`⏭️ 건너뜀: ${skipCount}개`);
  console.log('📝 페이지를 새로고침하여 등록된 증권사를 확인하세요.');
}

// 실행
console.log('🚀 5초 후 자동 등록을 시작합니다...');
console.log('💡 중간에 중단하려면 페이지를 새로고침하세요.');

setTimeout(() => {
  autoAddSecurities();
}, 5000);