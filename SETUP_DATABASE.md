# Supabase Database Setup

## Quick Setup (5 minutes)

### Step 1: Run the SQL Migration
1. Open your Supabase Dashboard
2. Go to **SQL Editor** 
3. Copy the entire contents of `/migrations/001_analytics_tables.sql`
4. Paste into the SQL Editor
5. Click **"Run"**

You should see: `Analytics tables created successfully!`

### Step 2: Verify Tables Created
In Supabase Dashboard → **Table Editor**, you should see:
- `analytics_records` - Individual request tracking
- `daily_summaries` - Daily aggregated data  
- `rate_limits` - IP-based rate limiting

### Step 3: Test the Application
1. Start your dev server: `npm run dev`
2. Try analyzing a crypto project
3. Check analytics at `/analytics` (password: `admin123`)

## What Changed
✅ **Permanent Analytics Storage** - No more 30-day expiration  
✅ **Dev/Prod Separation** - Environment-based data filtering  
✅ **Smart Rate Limiting** - 50 requests/hour per IP  
✅ **Simplified Architecture** - No more Vercel KV dependency  
✅ **Better Performance** - Database queries with proper indexing  

## Environment Variables Needed
Your existing Supabase environment variables should work:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_ROLE_KEY`

## Development Tools
- **Rate Limit Reset Button** - Only visible on localhost
- **Analytics Dashboard** - `/analytics` with environment filtering
- **Database Triggers** - Auto-calculate daily summaries

## Production Notes
- Analytics data persists permanently
- Environment automatically detected (development/production)
- Rate limiting protects against cost attacks
- Daily summaries calculated automatically via triggers