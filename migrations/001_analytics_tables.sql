-- CryptoSafeCheck Analytics Tables Migration
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Analytics Records Table - Individual request tracking
CREATE TABLE analytics_records (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  environment TEXT NOT NULL DEFAULT 'development', -- 'development' or 'production'
  project TEXT NOT NULL, -- URL/project name analyzed
  model TEXT NOT NULL DEFAULT 'gemini-2.5-flash-lite-preview-06-17',
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  total_tokens INTEGER GENERATED ALWAYS AS (input_tokens + output_tokens) STORED,
  response_time_ms INTEGER DEFAULT 0,
  cost_usd DECIMAL(10,8) DEFAULT 0, -- Real cost from AI
  cost_source TEXT DEFAULT 'not_provided', -- 'ai_provided' or 'not_provided'
  cached BOOLEAN DEFAULT FALSE,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  user_agent TEXT,
  client_ip INET,
  scan_type TEXT DEFAULT 'full',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Daily Summaries Table - Aggregated daily data
CREATE TABLE daily_summaries (
  id BIGSERIAL PRIMARY KEY,
  date DATE NOT NULL,
  environment TEXT NOT NULL DEFAULT 'development',
  total_requests INTEGER DEFAULT 0,
  total_tokens BIGINT DEFAULT 0,
  total_cost_usd DECIMAL(12,8) DEFAULT 0,
  cached_requests INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  avg_response_time_ms DECIMAL(8,2) DEFAULT 0,
  basic_scans INTEGER DEFAULT 0,
  full_scans INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Ensure one summary per date per environment
  UNIQUE(date, environment)
);

-- 3. Rate Limits Table - IP-based rate limiting
CREATE TABLE rate_limits (
  id BIGSERIAL PRIMARY KEY,
  client_ip INET NOT NULL,
  environment TEXT NOT NULL DEFAULT 'development',
  request_count INTEGER DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_request TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- One rate limit record per IP per environment
  UNIQUE(client_ip, environment)
);

-- Create indexes for performance
CREATE INDEX idx_analytics_records_timestamp ON analytics_records(timestamp DESC);
CREATE INDEX idx_analytics_records_environment ON analytics_records(environment);
CREATE INDEX idx_analytics_records_project ON analytics_records(project);
CREATE INDEX idx_analytics_records_cached ON analytics_records(cached);
CREATE INDEX idx_analytics_records_success ON analytics_records(success);

CREATE INDEX idx_daily_summaries_date ON daily_summaries(date DESC);
CREATE INDEX idx_daily_summaries_environment ON daily_summaries(environment);

CREATE INDEX idx_rate_limits_ip ON rate_limits(client_ip);
CREATE INDEX idx_rate_limits_environment ON rate_limits(environment);
CREATE INDEX idx_rate_limits_window ON rate_limits(window_start);

-- Create function to update daily summaries automatically
CREATE OR REPLACE FUNCTION update_daily_summaries()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert or update daily summary
  INSERT INTO daily_summaries (
    date,
    environment,
    total_requests,
    total_tokens,
    total_cost_usd,
    cached_requests,
    error_count,
    avg_response_time_ms,
    basic_scans,
    full_scans,
    updated_at
  )
  VALUES (
    DATE(NEW.timestamp),
    NEW.environment,
    1,
    NEW.total_tokens,
    NEW.cost_usd,
    CASE WHEN NEW.cached THEN 1 ELSE 0 END,
    CASE WHEN NOT NEW.success THEN 1 ELSE 0 END,
    NEW.response_time_ms,
    CASE WHEN NEW.scan_type = 'basic' THEN 1 ELSE 0 END,
    CASE WHEN NEW.scan_type = 'full' THEN 1 ELSE 0 END,
    NOW()
  )
  ON CONFLICT (date, environment)
  DO UPDATE SET
    total_requests = daily_summaries.total_requests + 1,
    total_tokens = daily_summaries.total_tokens + NEW.total_tokens,
    total_cost_usd = daily_summaries.total_cost_usd + NEW.cost_usd,
    cached_requests = daily_summaries.cached_requests + CASE WHEN NEW.cached THEN 1 ELSE 0 END,
    error_count = daily_summaries.error_count + CASE WHEN NOT NEW.success THEN 1 ELSE 0 END,
    avg_response_time_ms = (
      (daily_summaries.avg_response_time_ms * daily_summaries.total_requests) + NEW.response_time_ms
    ) / (daily_summaries.total_requests + 1),
    basic_scans = daily_summaries.basic_scans + CASE WHEN NEW.scan_type = 'basic' THEN 1 ELSE 0 END,
    full_scans = daily_summaries.full_scans + CASE WHEN NEW.scan_type = 'full' THEN 1 ELSE 0 END,
    updated_at = NOW();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update daily summaries
CREATE TRIGGER analytics_daily_summary_trigger
  AFTER INSERT ON analytics_records
  FOR EACH ROW
  EXECUTE FUNCTION update_daily_summaries();

-- Create function to clean up old rate limit records
CREATE OR REPLACE FUNCTION cleanup_old_rate_limits()
RETURNS void AS $$
BEGIN
  -- Delete rate limit records older than 2 hours
  DELETE FROM rate_limits 
  WHERE window_start < NOW() - INTERVAL '2 hours';
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust as needed for your setup)
-- These are for the service role key to work properly
GRANT ALL ON TABLE analytics_records TO service_role;
GRANT ALL ON TABLE daily_summaries TO service_role;
GRANT ALL ON TABLE rate_limits TO service_role;
GRANT ALL ON SEQUENCE analytics_records_id_seq TO service_role;
GRANT ALL ON SEQUENCE daily_summaries_id_seq TO service_role;
GRANT ALL ON SEQUENCE rate_limits_id_seq TO service_role;

-- Enable Row Level Security (optional - can be enabled later)
-- ALTER TABLE analytics_records ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Success message
SELECT 'Analytics tables created successfully!' AS status;