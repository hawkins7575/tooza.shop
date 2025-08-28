const { execSync } = require('child_process');
const fs = require('fs');

// Read the migration SQL
const migrationSQL = fs.readFileSync('apply_hierarchical_migration.sql', 'utf8');

// Escape the SQL for command line
const escapedSQL = migrationSQL.replace(/'/g, "'\"'\"'");

// Create a temporary SQL file
const tempSQLFile = 'temp_migration.sql';
fs.writeFileSync(tempSQLFile, migrationSQL);

console.log('Executing SQL via Supabase CLI...');
console.log('SQL content:');
console.log('=====================================');
console.log(migrationSQL);
console.log('=====================================');

try {
  // Try using psql through supabase
  const result = execSync(`npx supabase db reset --linked`, { encoding: 'utf8' });
  console.log('Reset result:', result);
} catch (error) {
  console.log('Reset failed, trying direct approach...');
  
  try {
    // Try creating a new migration
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0, 15);
    const newMigrationFile = `supabase/migrations/${timestamp}_apply_hierarchical_fix.sql`;
    
    fs.writeFileSync(newMigrationFile, migrationSQL);
    console.log('Created new migration file:', newMigrationFile);
    
    // Push the new migration
    const pushResult = execSync(`npx supabase db push --linked`, { encoding: 'utf8' });
    console.log('Push result:', pushResult);
    
  } catch (pushError) {
    console.error('Push failed:', pushError.message);
    
    // Alternative: try using supabase sql via API
    console.log('Trying alternative method...');
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = 'https://latnaiwpixeweqfxwczu.supabase.co';
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhdG5haXdwaXhld2VxZnh3Y3p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMjM2NTksImV4cCI6MjA3MTU5OTY1OX0.XKy5Tw-Boqcuk0C6suWHy76BFP2u-dm_Y1kfp8ul1Ac';
    
    const supabase = createClient(supabaseUrl, serviceKey);
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split('$$;')
      .filter(stmt => stmt.trim().length > 0)
      .map(stmt => stmt.includes('$$') ? stmt + '$$;' : stmt);
    
    console.log('Split into', statements.length, 'statements');
    
    for (let i = 0; i < statements.length; i++) {
      try {
        console.log(`Executing statement ${i + 1}...`);
        const { data, error } = await supabase.rpc('exec_sql', { query: statements[i] });
        if (error) {
          console.log(`Statement ${i + 1} error:`, error);
        } else {
          console.log(`Statement ${i + 1} success`);
        }
      } catch (stmtError) {
        console.log(`Statement ${i + 1} failed:`, stmtError.message);
      }
    }
  }
}

// Cleanup
if (fs.existsSync(tempSQLFile)) {
  fs.unlinkSync(tempSQLFile);
}