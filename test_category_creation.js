const { createClient } = require('@supabase/supabase-js');

async function testCategoryCreation() {
  // Use the Supabase client
  const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔍 Testing current database schema...');
    
    // Try to get existing categories first
    console.log('\\n1. Checking existing categories...');
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .limit(3);

    if (fetchError) {
      console.log('❌ Error fetching categories:', fetchError.message);
    } else {
      console.log('✅ Successfully fetched categories:', existingCategories.length, 'found');
      if (existingCategories.length > 0) {
        console.log('First category columns:', Object.keys(existingCategories[0]));
        const hasParentId = existingCategories[0].hasOwnProperty('parent_id');
        const hasSortOrder = existingCategories[0].hasOwnProperty('sort_order');
        console.log(`parent_id column exists: ${hasParentId}`);
        console.log(`sort_order column exists: ${hasSortOrder}`);
      }
    }

    // Test category creation with hierarchical fields
    console.log('\\n2. Testing category creation with hierarchical fields...');
    
    const testCategory = {
      name: 'Test Hierarchical Category ' + Date.now(),
      icon: '🔧',
      description: 'Test category for hierarchy',
      parent_id: null,
      sort_order: 999
    };

    const { data: createData, error: createError } = await supabase
      .from('categories')
      .insert([testCategory])
      .select();

    if (createError) {
      console.log('❌ Error creating category:', createError.message);
      console.log('Error details:', createError.details);
      console.log('Error code:', createError.code);
      
      if (createError.message.includes("parent_id")) {
        console.log('\\n🎯 CONFIRMED: parent_id column is missing from categories table');
        console.log('\\n📋 SOLUTION: Execute this SQL in Supabase Dashboard > SQL Editor:');
        console.log('\\n=====================================');
        console.log(`-- Add parent_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'parent_id') THEN
        ALTER TABLE categories ADD COLUMN parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;
    END IF;
END
$$;

-- Add sort_order column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'categories' AND column_name = 'sort_order') THEN
        ALTER TABLE categories ADD COLUMN sort_order INTEGER DEFAULT 0;
    END IF;
END
$$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);`);
        console.log('=====================================');
      }
    } else {
      console.log('✅ Category created successfully!');
      console.log('Created category:', createData[0]);
      
      // Clean up test data
      console.log('\\n3. Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', createData[0].id);
      
      if (deleteError) {
        console.log('⚠️  Warning: Could not delete test category:', deleteError.message);
      } else {
        console.log('✅ Test category deleted successfully');
      }
      
      console.log('\\n🎉 GOOD NEWS: Hierarchical columns already exist and working!');
    }

    // Test without hierarchical fields
    console.log('\\n4. Testing category creation without hierarchical fields...');
    const basicCategory = {
      name: 'Basic Test Category ' + Date.now(),
      icon: '⚡',
      description: 'Basic test category'
    };

    const { data: basicData, error: basicError } = await supabase
      .from('categories')
      .insert([basicCategory])
      .select();

    if (basicError) {
      console.log('❌ Error creating basic category:', basicError.message);
    } else {
      console.log('✅ Basic category created successfully!');
      console.log('Created basic category columns:', Object.keys(basicData[0]));
      
      // Clean up
      await supabase.from('categories').delete().eq('id', basicData[0].id);
      console.log('✅ Basic test category deleted');
    }

  } catch (error) {
    console.error('💥 Unexpected error:', error);
  }
}

testCategoryCreation();