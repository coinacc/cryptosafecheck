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

-- Create table for blog posts
CREATE TABLE blog_posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);