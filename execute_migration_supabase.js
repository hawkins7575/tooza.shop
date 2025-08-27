const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

async function executeMigration() {
  // Use the Supabase client instead of direct PostgreSQL connection
  const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('Checking current database schema...');
    
    // First check if columns already exist
    const { data: columns, error: columnError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'categories')
      .eq('table_schema', 'public');

    if (columnError) {
      console.error('Error checking columns:', columnError);
      return;
    }

    console.log('Current columns in categories table:');
    columns.forEach(col => {
      console.log(`- ${col.column_name}: ${col.data_type}`);
    });

    const hasParentId = columns.some(col => col.column_name === 'parent_id');
    const hasSortOrder = columns.some(col => col.column_name === 'sort_order');

    console.log(`\\nparent_id column exists: ${hasParentId}`);
    console.log(`sort_order column exists: ${hasSortOrder}`);

    if (hasParentId && hasSortOrder) {
      console.log('\\n✅ Hierarchical columns already exist! Migration not needed.');
      return;
    }

    console.log('\\n⚠️  Some columns are missing. You need to apply the migration manually.');
    console.log('\\n📋 Please follow these steps:');
    console.log('1. Go to https://supabase.com/dashboard');
    console.log('2. Select your project (finance-link)');
    console.log('3. Go to SQL Editor');
    console.log('4. Execute the following SQL:');
    console.log('\\n=====================================');
    
    // Read and display the migration SQL
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'apply_hierarchical_migration.sql'), 'utf8');
    console.log(migrationSQL);
    console.log('=====================================');

    // Test if we can create a category (this will show the current error)
    console.log('\\n🔍 Testing category creation to confirm the error...');
    
    const { data: testData, error: testError } = await supabase
      .from('categories')
      .insert([
        { name: 'Test Category', icon: '🔧', description: 'Test', parent_id: null, sort_order: 999 }
      ])
      .select();

    if (testError) {
      console.log('\\n❌ Confirmed error:', testError.message);
      console.log('This confirms that the parent_id and sort_order columns need to be added.');
    } else {
      console.log('\\n🎉 Test category created successfully!');
      console.log('Migration may have been applied already.');
      
      // Clean up test data
      if (testData && testData.length > 0) {
        await supabase
          .from('categories')
          .delete()
          .eq('id', testData[0].id);
        console.log('Test category deleted.');
      }
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

executeMigration();