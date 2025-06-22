# CryptoSafeCheck Deployment Guide

## Pre-Deployment Checklist

### ✅ Domain Updates Complete
- [x] Updated all URLs from cryptosafecheck.com to cryptosafecheck.io
- [x] Updated metadata, OpenGraph, and structured data
- [x] Updated sitemap and robots.txt
- [x] Verified production build works

### 🔧 Environment Variables Required

Set these in Vercel Dashboard → Project Settings → Environment Variables:

```
GOOGLE_AI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**Note**: Do NOT set any KV-related variables (we're using Supabase only)

## Vercel Deployment Steps

### 1. Connect Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from Git: `https://github.com/coinacc/cryptosafecheck.git`
4. Configure build settings (should auto-detect Next.js):
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

### 2. Set Environment Variables
1. In project settings, go to "Environment Variables"
2. Add all required variables listed above
3. Set for "Production", "Preview", and "Development" environments

### 3. Configure Domain
1. Go to project settings → "Domains"
2. Add custom domain: `cryptosafecheck.io`
3. Configure DNS records as instructed by Vercel
4. Wait for SSL certificate to provision

### 4. Deploy
1. Push to main branch or manually trigger deployment
2. Monitor build logs for any errors
3. Test all functionality on live site

## Post-Deployment Verification

### ✅ Core Functionality
- [ ] Homepage loads correctly
- [ ] AI analysis works (test with a crypto project)
- [ ] Blog pages render properly with new markdown parser
- [ ] About page displays correctly
- [ ] Sitemap accessible at /sitemap.xml
- [ ] Robots.txt accessible at /robots.txt

### ✅ SEO & Metadata
- [ ] All meta tags show cryptosafecheck.io domain
- [ ] OpenGraph images work in social media previews
- [ ] Structured data validates (use Google Rich Results Test)
- [ ] Canonical URLs point to .io domain

### ✅ Database & APIs
- [ ] Supabase connection works
- [ ] Analysis results save to database
- [ ] Analytics tracking functions
- [ ] Cache system operates correctly

## Known Issues
- Minor build warnings about progress exports (non-critical)
- Punycode deprecation warnings from dependencies (harmless)

## Performance Optimization (Optional)
After deployment, consider:
- Google PageSpeed Insights analysis
- Core Web Vitals monitoring
- Image optimization
- Cache headers optimization

## Support
If deployment issues occur:
1. Check Vercel build logs
2. Verify environment variables are set
3. Test local production build: `npm run build && npm start`
4. Ensure all dependencies are properly installed