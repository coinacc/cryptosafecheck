-- Add analysis result storage to analytics_records table
-- Run this in Supabase Dashboard → SQL Editor

-- Add a column to store the full analysis result JSON
ALTER TABLE analytics_records 
ADD COLUMN analysis_result JSONB;

-- Create index for analysis result queries
CREATE INDEX idx_analytics_records_analysis_result ON analytics_records USING GIN (analysis_result) WHERE analysis_result IS NOT NULL;

-- Add index for cache lookups (project + scan_type + success + not cached)
CREATE INDEX idx_analytics_cache_lookup ON analytics_records(project, scan_type, success, cached, timestamp DESC) WHERE success = true AND cached = false AND analysis_result IS NOT NULL;

-- Success message
SELECT 'Analysis result storage added successfully!' AS status;