#!/bin/bash

# Finance Link Supabase CLI 설정 스크립트
# 사용법: ./setup-supabase.sh

set -e

echo "🚀 Finance Link Supabase 프로젝트 설정을 시작합니다..."
echo ""

# 토큰 확인
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "❌ SUPABASE_ACCESS_TOKEN 환경변수가 설정되지 않았습니다."
    echo ""
    echo "다음 단계를 따라주세요:"
    echo "1. https://supabase.com/dashboard/account/tokens 접속"
    echo "2. 'Generate new token' 클릭"
    echo "3. 토큰명: finance-link-cli"
    echo "4. 다음 명령으로 토큰 설정:"
    echo "   export SUPABASE_ACCESS_TOKEN=YOUR_TOKEN_HERE"
    echo ""
    exit 1
fi

echo "✅ 액세스 토큰 확인됨"

# 조직 ID 입력 받기
echo ""
read -p "Supabase 조직 ID를 입력하세요: " ORG_ID

if [ -z "$ORG_ID" ]; then
    echo "❌ 조직 ID가 필요합니다."
    echo "https://supabase.com/dashboard 에서 조직 ID를 확인할 수 있습니다."
    exit 1
fi

# 데이터베이스 비밀번호 입력 받기
echo ""
read -s -p "데이터베이스 비밀번호를 입력하세요 (최소 8자): " DB_PASSWORD
echo ""

if [ ${#DB_PASSWORD} -lt 8 ]; then
    echo "❌ 비밀번호는 최소 8자 이상이어야 합니다."
    exit 1
fi

echo ""
echo "🏗️  프로젝트 생성 중..."

# 프로젝트 생성
npx supabase projects create finance-link \
    --org-id "$ORG_ID" \
    --db-password "$DB_PASSWORD" \
    --region ap-northeast-2

echo ""
echo "✅ 프로젝트 생성 완료"

# 프로젝트 목록에서 REF 찾기
echo ""
echo "📋 프로젝트 REF ID를 찾는 중..."
PROJECT_REF=$(npx supabase projects list --output json | grep -o '"reference":"[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$PROJECT_REF" ]; then
    echo "❌ 프로젝트 REF ID를 찾을 수 없습니다."
    echo "수동으로 연결하려면:"
    echo "npx supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

echo "✅ 프로젝트 REF: $PROJECT_REF"

# 프로젝트 연결
echo ""
echo "🔗 프로젝트 연결 중..."
npx supabase link --project-ref "$PROJECT_REF"

echo ""
echo "📊 데이터베이스 스키마 배포 중..."
npx supabase db push

echo ""
echo "🌱 시드 데이터 삽입 중..."
npx supabase seed

echo ""
echo "🎉 설정 완료!"
echo ""
echo "다음 단계:"
echo "1. Supabase Dashboard에서 프로젝트 URL과 Anon Key 확인"
echo "2. .env.local 파일 업데이트"
echo "3. npm start로 개발 서버 실행"
echo ""
echo "프로젝트 정보:"
echo "- 프로젝트 REF: $PROJECT_REF"
echo "- URL: https://$PROJECT_REF.supabase.co"
echo "- Dashboard: https://supabase.com/dashboard/project/$PROJECT_REF"