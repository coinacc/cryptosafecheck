# 🔍 AI Crypto Check

An AI-powered web application that analyzes cryptocurrency projects for potential scam indicators using Google's Gemini AI and Vercel KV for caching. Both quick scan and full analysis are completely free.

## ✨ Features

- **AI-Powered Analysis**: Uses Gemini 2.5 Flash Lite to analyze cryptocurrency projects for scam indicators
- **Dual Analysis Modes**: Quick scan for basic detection and full analysis for comprehensive evaluation
- **Risk Assessment**: Provides detailed safety levels with confidence scores
- **Comprehensive Evaluation**: Checks for red flags, positive signals, and key findings
- **Caching System**: Stores analysis results in Vercel KV to avoid redundant API calls
- **Modern Design**: Clean, trustworthy UI built with Tailwind CSS
- **Real-time Analysis**: Fast analysis with loading states and error handling
- **Free Service**: Both analysis modes are completely free to use

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 Flash Lite API
- **Caching**: Vercel KV
- **Database**: Supabase
- **Language**: JavaScript

## 📋 Prerequisites

Before running this application, you need:

1. **Node.js** (v18 or higher)
2. **Google AI API Key** - Get one from [Google AI Studio](https://aistudio.google.com/app/apikey)
3. **Vercel KV Database** - For caching analysis results
4. **Supabase Project** - Create one at [Supabase](https://supabase.com/)

## 🚀 Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <your-repo-url>
cd scamapp
npm install
```

### 2. Environment Variables

Create a `.env.local` file with the following variables:

```env
# Google AI API Key
GOOGLE_AI_API_KEY=your_google_ai_api_key_here

# Vercel KV Configuration (for caching)
KV_REST_API_URL=your_vercel_kv_rest_api_url
KV_REST_API_TOKEN=your_vercel_kv_rest_api_token

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 3. Database Setup

Run the SQL schema in your Supabase project:

```sql
-- Create table for URL analysis results
CREATE TABLE url_analyses (
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
```

### 4. Run the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🧪 Testing

Run the test script to verify everything is working:

```bash
node test-app.js
```

## 📁 Project Structure

```
scamapp/
├── app/
│   ├── actions/
│   │   ├── analyze.js          # Server action for full analysis
│   │   └── analyze-basic.js    # Server action for quick scan
│   ├── api/
│   │   ├── analytics/          # Analytics endpoints
│   │   ├── analyze-basic/      # Basic analysis API
│   │   ├── pre-check/          # Pre-validation API
│   │   └── progress/           # Real-time progress tracking
│   ├── components/
│   │   ├── CryptoScannerResults.js  # Full analysis results
│   │   ├── BasicScanResults.js      # Quick scan results
│   │   └── theme-toggle.js          # Dark mode toggle
│   ├── lib/
│   │   ├── gemini.js           # Gemini AI integration
│   │   ├── dal.js              # Database access layer
│   │   └── supabase.js         # Supabase client configuration
│   ├── globals.css             # Global styles
│   ├── layout.js               # Root layout component
│   └── page.js                 # Main page component
├── supabase/
│   └── schema.sql              # Database schema
├── .env.local                  # Environment variables
├── package.json                # Dependencies
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
└── postcss.config.js           # PostCSS configuration
```

## 🔧 How It Works

1. **User Input**: User enters a cryptocurrency project name, symbol, website URL, or contract address
2. **Analysis Type**: User chooses between Quick Scan (basic detection) or Full Analysis (comprehensive)
3. **Pre-check**: System validates if the input is crypto-related
4. **Cache Check**: System checks if analysis exists in Vercel KV cache
5. **AI Analysis**: If not cached, Gemini AI analyzes the project using web search capabilities
6. **Risk Assessment**: AI provides safety level, confidence score, red flags, and positive signals
7. **Storage**: Results are cached in Vercel KV for faster future access
8. **Display**: Results are shown with color-coded safety levels and detailed findings

## 🎯 Safety Assessment Levels

- **VERY_SAFE**: Well-established, legitimate projects with strong indicators
- **SAFE**: Generally legitimate projects with good transparency
- **RISKY**: Projects with some concerning indicators that warrant caution
- **DANGEROUS**: Projects with multiple red flags suggesting high scam risk

## ⚠️ Disclaimer

This tool is for educational and informational purposes only. It should not be considered financial advice. Always conduct your own research before making investment decisions.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
