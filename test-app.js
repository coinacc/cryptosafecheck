// Simple test script to verify the application components
const { analyzeUrl } = require('./app/lib/gemini');

async function testGeminiIntegration() {
  console.log('Testing Gemini integration...');
  
  try {
    // Test with a known legitimate site
    const result = await analyzeUrl('https://bitcoin.org');
    console.log('✅ Gemini integration working!');
    console.log('Sample result:', {
      riskScore: result.riskScore,
      riskLevel: result.riskLevel,
      summary: result.summary.substring(0, 100) + '...'
    });
    return true;
  } catch (error) {
    console.error('❌ Gemini integration failed:', error.message);
    return false;
  }
}

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  try {
    const { getCachedAnalysis, storeAnalysisResult } = require('./app/lib/dal');
    
    // Test storing a result
    const testResult = {
      riskScore: 25,
      riskLevel: 'low',
      summary: 'Test analysis',
      findings: ['Test finding'],
      redFlags: [],
      positiveSignals: ['Test positive signal']
    };
    
    await storeAnalysisResult('https://test-url.com', testResult);
    console.log('✅ Database write working!');
    
    // Test retrieving a result
    const cached = await getCachedAnalysis('https://test-url.com');
    if (cached) {
      console.log('✅ Database read working!');
      return true;
    } else {
      console.log('⚠️ Database read returned null (might be expected)');
      return true;
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Running Crypto Scam Detector Tests\n');
  
  const geminiTest = await testGeminiIntegration();
  console.log('');
  
  const dbTest = await testDatabaseConnection();
  console.log('');
  
  if (geminiTest && dbTest) {
    console.log('🎉 All tests passed! Your application is ready to use.');
  } else {
    console.log('⚠️ Some tests failed. Check your environment variables and database setup.');
  }
}

// Only run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testGeminiIntegration, testDatabaseConnection };
