const { createClient } = require('@supabase/supabase-js');

async function testCategoryUpdate() {
  const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';
  
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    console.log('🔍 Testing category update functionality...');
    
    // 1. Get existing categories
    const { data: categories, error: fetchError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (fetchError) {
      console.log('❌ Error fetching categories:', fetchError.message);
      return;
    }

    if (!categories || categories.length === 0) {
      console.log('❌ No categories found to test');
      return;
    }

    const testCategory = categories[0];
    console.log('✅ Found category to test:', testCategory.name);
    console.log('Category details:', testCategory);

    // 2. Test update with the same data (should succeed)
    console.log('\\n🔧 Testing update with current data...');
    const { data: updateData, error: updateError } = await supabase
      .from('categories')
      .update({
        name: testCategory.name,
        icon: testCategory.icon,
        description: testCategory.description,
        parent_id: testCategory.parent_id,
        sort_order: testCategory.sort_order
      })
      .eq('id', testCategory.id)
      .select();

    if (updateError) {
      console.log('❌ Update failed:', updateError.message);
      console.log('Error details:', updateError);
      
      if (updateError.code === '42501') {
        console.log('\\n🔒 RLS POLICY ISSUE: Update permission denied');
        console.log('\\n📋 Need to add UPDATE policy in Supabase Dashboard:');
        console.log(`CREATE POLICY "Authenticated users can update categories" ON categories 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);`);
      }
    } else {
      console.log('✅ Update successful:', updateData);
    }

    // 3. Test update with modified data
    console.log('\\n🔧 Testing update with modified description...');
    const newDescription = testCategory.description + ' (test update)';
    
    const { data: modifyData, error: modifyError } = await supabase
      .from('categories')
      .update({
        description: newDescription
      })
      .eq('id', testCategory.id)
      .select();

    if (modifyError) {
      console.log('❌ Modify failed:', modifyError.message);
    } else {
      console.log('✅ Modify successful:', modifyData);
      
      // Revert the change
      await supabase
        .from('categories')
        .update({
          description: testCategory.description
        })
        .eq('id', testCategory.id);
      console.log('✅ Reverted test change');
    }

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

testCategoryUpdate();