# Finance Link Supabase 클라우드 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase.com](https://supabase.com) 접속
2. "New project" 클릭
3. 프로젝트 이름: `finance-link`
4. 비밀번호 설정 (안전한 비밀번호 사용)
5. 리전 선택: Asia Pacific (Seoul) 권장

## 2. 데이터베이스 설정

### 마이그레이션 실행
```bash
# Supabase CLI를 통한 원격 마이그레이션
npx supabase db push

# 또는 수동으로 SQL 실행
# Supabase Dashboard → SQL Editor에서 아래 파일 내용 실행:
# 1. supabase/migrations/20250824000001_initial_schema.sql
# 2. supabase/seed.sql
```

### 환경 변수 설정
`.env.local` 파일 업데이트:

```bash
# Supabase Dashboard → Settings → API에서 확인
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

## 3. 프로젝트 연결

```bash
# 프로젝트 연결
npx supabase link --project-ref your-project-id

# 원격 DB와 동기화
npx supabase db pull
```

## 4. 개발 서버 실행

```bash
npm start
```

## 5. 확인사항

1. **로그인 기능**: 회원가입/로그인이 정상 작동하는지 확인
2. **데이터**: 초기 투자 사이트 데이터가 표시되는지 확인  
3. **북마크**: 로그인 후 북마크 기능이 작동하는지 확인
4. **카테고리 필터**: 좌측 필터가 정상 작동하는지 확인

## 6. 문제 해결

### 연결 오류시
- Supabase URL과 Anon Key가 정확한지 확인
- `.env.local` 파일이 프로젝트 루트에 있는지 확인
- 브라우저 캐시 삭제 후 재시도

### 마이그레이션 오류시
- Supabase Dashboard에서 직접 SQL 실행
- 테이블이 정상 생성되었는지 확인

## 7. 추가 설정 (선택사항)

### 이메일 인증 비활성화 (개발용)
Supabase Dashboard → Authentication → Settings:
- "Enable email confirmations" 비활성화

### RLS 정책 확인
Dashboard → Table Editor에서 각 테이블의 RLS 정책이 적용되었는지 확인