const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function executeSQL() {
  const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  const sqlCommands = [
    // Add parent_id column if it doesn't exist
    `DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'parent_id') THEN
        ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END
$$`,
    
    // Add sort_order column if it doesn't exist
    `DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'sort_order') THEN
        ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END
$$`,
    
    // Create indexes
    "CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id)",
    "CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order)",
    
    // Update existing categories with sort_order
    `UPDATE categories SET sort_order = 
  CASE name
    WHEN '주식' THEN 1
    WHEN '부동산' THEN 2
    WHEN '코인' THEN 3
    WHEN '펀드' THEN 4
    WHEN '채권' THEN 5
    WHEN '원자재' THEN 6
    WHEN '뉴스' THEN 7
    WHEN '교육' THEN 8
    ELSE 999
  END
WHERE sort_order = 0 OR sort_order IS NULL`
  ];

  console.log('🔧 Executing SQL commands via Supabase...');
  
  for (let i = 0; i < sqlCommands.length; i++) {
    const sql = sqlCommands[i];
    console.log(`\\n📝 Executing command ${i + 1}/${sqlCommands.length}:`);
    console.log(sql.substring(0, 100) + '...');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', { sql: sql });
      
      if (error) {
        console.log(`❌ Error:`, error);
        // Try alternative method
        console.log(`🔄 Trying direct query...`);
        try {
          const result = await supabase.from('_sql').select().eq('query', sql);
          console.log('Direct result:', result);
        } catch (directError) {
          console.log(`❌ Direct query also failed:`, directError.message);
        }
      } else {
        console.log(`✅ Success:`, data);
      }
    } catch (rpcError) {
      console.log(`❌ RPC Error:`, rpcError.message);
    }
  }

  // Test if columns were added
  console.log('\\n🔍 Testing if columns were added...');
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('❌ Test error:', error.message);
    } else if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log('✅ Current columns:', columns);
      console.log(`✅ parent_id exists: ${columns.includes('parent_id')}`);
      console.log(`✅ sort_order exists: ${columns.includes('sort_order')}`);
    } else {
      console.log('⚠️  No categories found to test');
    }
  } catch (testError) {
    console.log('❌ Test failed:', testError.message);
  }
}

executeSQL();