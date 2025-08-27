const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase 설정 (환경변수 또는 직접 설정)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // 서비스 키 필요

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL과 서비스 키가 필요합니다.');
  console.log('환경변수 설정 방법:');
  console.log('export REACT_APP_SUPABASE_URL="your-supabase-url"');
  console.log('export SUPABASE_SERVICE_ROLE_KEY="your-service-key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeMigration() {
  try {
    console.log('YouTube 테이블 마이그레이션을 시작합니다...');
    
    // 마이그레이션 파일 읽기
    const migrationPath = path.join(__dirname, 'supabase/migrations/20250826000001_create_youtube_tables.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // SQL을 여러 구문으로 분할 (간단한 방법)
    const sqlStatements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));
    
    console.log(`${sqlStatements.length}개의 SQL 구문을 실행합니다...`);
    
    for (let i = 0; i < sqlStatements.length; i++) {
      const statement = sqlStatements[i];
      if (statement) {
        try {
          console.log(`실행 중 (${i + 1}/${sqlStatements.length}): ${statement.substring(0, 50)}...`);
          
          const { data, error } = await supabase.rpc('exec_sql', {
            sql: statement
          });
          
          if (error) {
            console.error(`SQL 구문 실행 오류 (${i + 1}):`, error);
            // 일부 오류는 무시할 수 있음 (이미 존재하는 테이블 등)
            if (!error.message.includes('already exists')) {
              throw error;
            }
          } else {
            console.log(`✅ 구문 ${i + 1} 완료`);
          }
        } catch (err) {
          console.error(`구문 ${i + 1} 실행 중 오류:`, err);
          // 계속 진행하거나 중단할지 결정
        }
      }
    }
    
    console.log('마이그레이션이 완료되었습니다!');
    
    // 테이블 확인
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['youtube_channels', 'youtube_categories']);
    
    if (tablesError) {
      console.error('테이블 확인 오류:', tablesError);
    } else {
      console.log('생성된 테이블:', tables?.map(t => t.table_name));
    }
    
  } catch (error) {
    console.error('마이그레이션 실행 오류:', error);
    process.exit(1);
  }
}

// 직접 SQL 실행을 위한 대안 함수
async function executeDirectSQL() {
  console.log('직접 SQL 실행을 시도합니다...');
  
  try {
    // YouTube Categories 테이블 생성
    const createCategoriesSQL = `
      CREATE TABLE IF NOT EXISTS youtube_categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        icon VARCHAR(50),
        parent_id UUID REFERENCES youtube_categories(id) ON DELETE SET NULL,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: categoriesError } = await supabase.rpc('exec_sql', {
      sql: createCategoriesSQL
    });
    
    if (categoriesError) {
      console.error('Categories 테이블 생성 오류:', categoriesError);
    } else {
      console.log('✅ YouTube Categories 테이블 생성 완료');
    }
    
    // YouTube Channels 테이블 생성
    const createChannelsSQL = `
      CREATE TABLE IF NOT EXISTS youtube_channels (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        url VARCHAR(500) NOT NULL UNIQUE,
        description TEXT,
        category VARCHAR(100),
        tags TEXT[] DEFAULT '{}',
        thumbnail_url VARCHAR(500),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    
    const { error: channelsError } = await supabase.rpc('exec_sql', {
      sql: createChannelsSQL
    });
    
    if (channelsError) {
      console.error('Channels 테이블 생성 오류:', channelsError);
    } else {
      console.log('✅ YouTube Channels 테이블 생성 완료');
    }
    
    console.log('직접 SQL 실행이 완료되었습니다!');
    
  } catch (error) {
    console.error('직접 SQL 실행 오류:', error);
  }
}

// RPC 함수가 없는 경우를 위한 대안
async function createTablesDirectly() {
  console.log('Supabase 클라이언트를 통해 테이블을 생성합니다...');
  
  try {
    // 먼저 테이블 존재 여부 확인
    const { data: existingTables } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .in('tablename', ['youtube_channels', 'youtube_categories']);
    
    console.log('기존 테이블:', existingTables);
    
    // 테이블이 없다면 안내 메시지 출력
    if (!existingTables || existingTables.length === 0) {
      console.log('\n⚠️  YouTube 테이블이 존재하지 않습니다.');
      console.log('Supabase Dashboard에서 직접 다음 SQL을 실행해주세요:');
      console.log('='.repeat(60));
      
      const migrationPath = path.join(__dirname, 'supabase/migrations/20250826000001_create_youtube_tables.sql');
      const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
      console.log(migrationSQL);
      
      console.log('='.repeat(60));
      console.log('또는 Supabase CLI를 설치하여 마이그레이션을 실행하세요:');
      console.log('npm install -g supabase');
      console.log('supabase db push');
    }
    
  } catch (error) {
    console.error('테이블 확인 오류:', error);
    console.log('\n수동으로 Supabase Dashboard에서 SQL을 실행해주세요.');
  }
}

// 메인 실행
if (require.main === module) {
  console.log('YouTube 테이블 마이그레이션 스크립트');
  console.log('=====================================');
  
  // 방법 1: RPC를 통한 실행 시도
  // executeMigration();
  
  // 방법 2: 직접 SQL 실행 시도
  // executeDirectSQL();
  
  // 방법 3: 안내 메시지 출력
  createTablesDirectly();
}

module.exports = { executeMigration, executeDirectSQL, createTablesDirectly };