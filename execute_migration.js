const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function executeMigration() {
  // Supabase connection details
  const client = new Client({
    host: 'db.latnaiwpixeweqfxwczu.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'latnaiwpixeweqfxwczu', // This should be your actual DB password
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Supabase database...');
    await client.connect();
    console.log('Connected successfully!');

    // Read the migration SQL file
    const migrationSQL = fs.readFileSync(path.join(__dirname, 'apply_hierarchical_migration.sql'), 'utf8');
    
    console.log('Executing migration...');
    console.log('SQL to execute:');
    console.log('=====================================');
    console.log(migrationSQL);
    console.log('=====================================');

    // Execute the migration
    const result = await client.query(migrationSQL);
    console.log('Migration executed successfully!');
    console.log('Result:', result);

    // Verify the columns were added
    console.log('\\nVerifying columns were added...');
    const columnsCheck = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns 
      WHERE table_name = 'categories' 
      ORDER BY column_name;
    `);
    
    console.log('Categories table columns:');
    columnsCheck.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });

    // Check if parent_id and sort_order exist
    const hasParentId = columnsCheck.rows.some(row => row.column_name === 'parent_id');
    const hasSortOrder = columnsCheck.rows.some(row => row.column_name === 'sort_order');
    
    console.log(`\\n✅ parent_id column: ${hasParentId ? 'EXISTS' : 'MISSING'}`);
    console.log(`✅ sort_order column: ${hasSortOrder ? 'EXISTS' : 'MISSING'}`);

    if (hasParentId && hasSortOrder) {
      console.log('\\n🎉 Migration completed successfully! Categories table now supports hierarchy.');
    } else {
      console.log('\\n❌ Migration may have failed. Some columns are missing.');
    }

  } catch (error) {
    console.error('Error executing migration:', error);
    if (error.code) {
      console.error('Error code:', error.code);
    }
    if (error.detail) {
      console.error('Error detail:', error.detail);
    }
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

executeMigration();