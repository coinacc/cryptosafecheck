// Test script to debug Gemini API issues
require('dotenv').config({ path: '.env.local' });
const { analyzeUrl } = require('./app/lib/gemini');

async function testGemini() {
  console.log('🧪 Testing Gemini API integration...\n');

  try {
    console.log('Testing with a simple URL: https://bitcoin.org');
    const result = await analyzeUrl('https://bitcoin.org', true); // bypass cache
    
    console.log('✅ Gemini API test successful!');
    console.log('Result:', JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Gemini API test failed:', error);
    console.error('Error details:', error.message);
  }
}

// Run the test
testGemini();
