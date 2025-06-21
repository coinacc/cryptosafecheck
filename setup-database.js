// Database setup script for Crypto Scam Detector
const { supabaseAdmin } = require('./app/lib/supabase');

async function setupDatabase() {
  console.log('🔧 Setting up database for Crypto Scam Detector...\n');

  try {
    // Create the url_analyses table
    const { error } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS url_analyses (
          id BIGSERIAL PRIMARY KEY,
          url TEXT NOT NULL,
          risk_score INTEGER NOT NULL,
          risk_level TEXT NOT NULL,
          summary TEXT NOT NULL,
          findings TEXT[] NOT NULL,
          red_flags TEXT[] NOT NULL,
          positive_signals TEXT[] NOT NULL,
          analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          
          -- Add index for faster lookups
          CONSTRAINT url_analyses_url_idx UNIQUE (url)
        );
      `
    });

    if (error) {
      console.error('❌ Failed to create table:', error);
      console.log('\n📋 Manual Setup Required:');
      console.log('Please run this SQL in your Supabase SQL editor:');
      console.log('\n' + '='.repeat(50));
      console.log(`
CREATE TABLE IF NOT EXISTS url_analyses (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  risk_level TEXT NOT NULL,
  summary TEXT NOT NULL,
  findings TEXT[] NOT NULL,
  red_flags TEXT[] NOT NULL,
  positive_signals TEXT[] NOT NULL,
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Add index for faster lookups
  CONSTRAINT url_analyses_url_idx UNIQUE (url)
);
      `);
      console.log('='.repeat(50));
      return false;
    }

    console.log('✅ Database table created successfully!');
    
    // Test the connection
    const { data, error: testError } = await supabaseAdmin
      .from('url_analyses')
      .select('count(*)')
      .limit(1);

    if (testError) {
      console.error('❌ Database connection test failed:', testError);
      return false;
    }

    console.log('✅ Database connection test passed!');
    console.log('🎉 Database setup complete!\n');
    return true;

  } catch (error) {
    console.error('❌ Setup failed:', error);
    console.log('\n📋 Manual Setup Required:');
    console.log('Please run the SQL schema in supabase/schema.sql in your Supabase project.');
    return false;
  }
}

// Only run setup if this file is executed directly
if (require.main === module) {
  setupDatabase().then(success => {
    if (success) {
      console.log('Database is ready for use!');
    } else {
      console.log('Please complete the manual setup steps above.');
    }
    process.exit(success ? 0 : 1);
  });
}

module.exports = { setupDatabase };
