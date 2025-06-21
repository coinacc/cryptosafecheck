// Simple test script to test Gemini API directly without caching
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testGeminiDirect() {
  console.log('🧪 Testing Gemini API directly...\n');

  try {
    // Check if API key is loaded
    const apiKey = process.env.GOOGLE_AI_API_KEY;
    console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NOT FOUND');
    
    if (!apiKey) {
      throw new Error('GOOGLE_AI_API_KEY not found in environment variables');
    }

    // Initialize Google AI client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    console.log('Testing with a simple prompt...');
    
    // Simple test prompt
    const prompt = "Say 'Hello, I am Gemini 2.0 Flash!' and nothing else.";
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Gemini API test successful!');
    console.log('Response:', text);
    
    return true;
  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    
    if (error.message.includes('API key not valid')) {
      console.log('\n🔑 API Key Issues:');
      console.log('1. Go to https://aistudio.google.com/app/apikey');
      console.log('2. Create a new API key');
      console.log('3. Make sure you have access to Gemini API');
      console.log('4. Update your .env.local file');
    }
    
    return false;
  }
}

// Run the test
testGeminiDirect();
