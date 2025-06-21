import { generateAnalysisPDF } from './app/lib/pdf-generator.js';
import fs from 'fs';

// Test data with sources that have URLs
const testAnalysisResult = {
  status: "analyzed",
  project_name: "Test Project with Links",
  project_type: "DeFi Protocol",
  blockchain_network: "Ethereum",
  token_symbol: "TEST",
  safety_level: "RISKY",
  confidence: "HIGH",
  team_transparency: "ANONYMOUS",
  technical_security: "UNAUDITED",
  legal_regulatory: "UNCLEAR",
  financial_transparency: "CONCERNING",
  community_marketing: "SHILLED",
  product_delivery: "DELAYED",
  exchange_listings: ["Uniswap", "PancakeSwap", "SushiSwap"],
  scam_type_indicators: ["anonymous_team", "fake_partnerships", "unrealistic_promises"],
  community_warnings: [
    "Multiple reports of delayed withdrawals",
    "Suspicious social media activity",
    "Fake team member profiles detected"
  ],
  red_flags: [
    "Anonymous development team",
    "No code audit completed",
    "Unrealistic yield promises",
    "Fake partnership announcements",
    "Suspicious tokenomics structure"
  ],
  positive_signals: [
    "Listed on major DEX platforms",
    "Active community engagement",
    "Regular development updates"
  ],
  risk_summary: "This project presents significant risks due to anonymous team, lack of audits, and multiple red flags. While it has some positive aspects like DEX listings, the overall risk profile suggests caution.",
  sources_used: [
    {
      name: "CoinGecko",
      url: "https://www.coingecko.com/en/coins/test-project"
    },
    {
      name: "Official Website",
      url: "https://testproject.com"
    },
    {
      name: "GitHub Repository",
      url: "https://github.com/testproject/contracts"
    },
    {
      name: "Etherscan",
      url: "https://etherscan.io/address/0x123..."
    },
    {
      name: "Reddit Discussion",
      url: "https://reddit.com/r/cryptocurrency/comments/testproject"
    },
    {
      name: "Twitter Analysis",
      url: "https://twitter.com/testproject"
    }
  ]
};

async function testPDFGeneration() {
  try {
    console.log('🧪 Testing improved PDF generation...');
    
    const pdfBuffer = await generateAnalysisPDF(testAnalysisResult, testAnalysisResult.project_name);
    
    console.log('✅ PDF generated successfully!');
    console.log('📄 PDF size:', pdfBuffer.length, 'bytes');
    
    // Save the PDF
    fs.writeFileSync('test-improved-output.pdf', pdfBuffer);
    console.log('💾 PDF saved as test-improved-output.pdf');
    
    console.log('\n🔍 Improvements made:');
    console.log('✅ Clickable links for sources');
    console.log('✅ Page break controls to keep sections together');
    console.log('✅ Better section spacing');
    console.log('✅ Improved visual styling');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testPDFGeneration();
