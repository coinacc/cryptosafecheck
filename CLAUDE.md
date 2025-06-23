# CryptoSafeCheck - Claude Context

## Project Overview
This is a Next.js application that provides AI-powered cryptocurrency scam detection. It's a legitimate defensive security tool that helps users identify potentially fraudulent crypto projects under the brand "CryptoSafeCheck".

## Technology Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **AI**: Google Gemini 2.5 Flash Lite API
- **Database**: Supabase (PostgreSQL)
- **Caching**: Supabase (analytics_records table)
- **Deployment**: Vercel

## Key Commands
```bash
# Development (Note: User will start dev server in separate terminal)
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint

# Testing
node test-app.js    # Test the application functionality
```

## Project Structure
```
app/
├── actions/         # Server actions
├── api/            # API routes
│   ├── analyze-full/   # Main analysis endpoint
│   ├── analytics/      # Usage analytics
│   └── dev/           # Development utilities
├── components/     # React components
├── lib/           # Utility libraries
│   ├── gemini.js     # AI analysis engine
│   ├── cache.js      # Vercel KV caching
│   ├── supabase.js   # Database client
│   └── analytics.js  # Usage tracking
└── globals.css    # Global styles
```

## Environment Variables
Required in `.env.local`:
```
GOOGLE_AI_API_KEY=          # Google Gemini API key
NEXT_PUBLIC_SUPABASE_URL=   # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=  # Supabase service role key
```

## Core Functionality
- **Analysis Engine**: `app/lib/gemini.js` - AI-powered crypto project analysis
- **Main UI**: `app/page.js` - User interface for inputting projects to analyze
- **Results Display**: `app/components/CryptoScannerResults.js` - Shows analysis results
- **API Endpoint**: `app/api/analyze-full/route.js` - Handles analysis requests

## Analysis Categories
The AI evaluates projects across 6 dimensions:
1. Team Transparency (VERIFIED → ANONYMOUS → FAKE)
2. Technical Security (AUDITED → UNAUDITED → BACKDOOR_DETECTED)
3. Legal/Regulatory (COMPLIANT → UNCLEAR → CRIMINAL_CHARGES)
4. Financial Transparency (TRANSPARENT → PONZI_STRUCTURE → RUG_PULL_RISK)
5. Community/Marketing (ORGANIC → SHILLED → PUMP_SCHEME)
6. Product Delivery (DELIVERED → DELAYED → IMPOSSIBLE)

## Safety Levels
- **VERY_SAFE**: Established projects (Bitcoin, Ethereum base layers)
- **SAFE**: Good transparency, audited, minimal red flags
- **RISKY**: Some concerning elements, proceed with caution
- **DANGEROUS**: Clear scam indicators, avoid

## Development Notes
- Uses Gemini 2.5 Flash Lite model with web search capabilities
- Implements Supabase-based caching to reduce API costs (24-hour TTL)
- Progressive analysis with real-time updates
- Dev-only utilities available on localhost (rate limit reset, cache clearing)
- Includes comprehensive error handling and retry logic

## Database Schema
Main table: `url_analyses` - stores analysis results
- Includes risk scores, safety levels, findings, red flags, positive signals
- Unique constraint on URL to prevent duplicates

## Important Files to Check When Making Changes
- `app/lib/gemini.js` - Core AI analysis logic
- `app/api/analyze-full/route.js` - API endpoint
- `app/page.js` - Main UI component
- `package.json` - Dependencies and scripts
- `supabase/schema.sql` - Database schema

## Testing
Use `node test-app.js` or `node test-gemini.js` to test functionality before deploying.

## Security Notes
This is a legitimate defensive security tool. It's designed to protect users from crypto scams, not to create or facilitate malicious activities.