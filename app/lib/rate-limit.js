import { kv } from '@vercel/kv';

// Rate limiting configuration
const RATE_LIMIT_MAX = 10; // 10 free scans per IP per day (for both basic and full)
const RATE_LIMIT_WINDOW = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check and update rate limit for a given IP and scan type
 * @param {string} ip - Client IP address
 * @param {string} scanType - 'basic' or 'full'
 * @returns {Object} Rate limit status
 */
export async function checkRateLimit(ip, scanType = 'basic') {
  const key = `rate_limit:${scanType}:${ip}`;
  const now = Date.now();
  
  try {
    // Get current usage
    const usage = await kv.get(key) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
    
    // Reset if window expired
    if (now > usage.resetTime) {
      usage.count = 0;
      usage.resetTime = now + RATE_LIMIT_WINDOW;
    }
    
    // Check if limit exceeded
    if (usage.count >= RATE_LIMIT_MAX) {
      const timeLeft = Math.ceil((usage.resetTime - now) / (60 * 60 * 1000)); // hours
      return {
        allowed: false,
        remaining: 0,
        resetTime: usage.resetTime,
        timeLeft,
        scanType
      };
    }
    
    // Increment usage
    usage.count += 1;
    await kv.set(key, usage, { ex: Math.ceil(RATE_LIMIT_WINDOW / 1000) });
    
    return {
      allowed: true,
      remaining: RATE_LIMIT_MAX - usage.count,
      resetTime: usage.resetTime,
      scanType
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Allow request if rate limiting fails
    return { 
      allowed: true, 
      remaining: RATE_LIMIT_MAX - 1,
      scanType
    };
  }
}

/**
 * Get client IP from request headers
 * @param {Request} request - The request object
 * @returns {string} Client IP address
 */
export function getClientIP(request) {
  // Try various headers for IP detection
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfIP = request.headers.get('cf-connecting-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfIP) {
    return cfIP;
  }
  
  // Fallback
  return 'unknown';
}

/**
 * Get rate limit configuration
 * @returns {Object} Rate limit configuration
 */
export function getRateLimitConfig() {
  return {
    max: RATE_LIMIT_MAX,
    window: RATE_LIMIT_WINDOW
  };
}

/**
 * Reset rate limit for a specific IP and scan type (dev only)
 * @param {string} ip - Client IP address
 * @param {string} scanType - 'basic' or 'full'
 */
export async function resetRateLimit(ip, scanType = 'basic') {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('Rate limit reset only available in development');
  }
  
  const key = `rate_limit:${scanType}:${ip}`;
  try {
    await kv.del(key);
    console.log(`Rate limit reset for IP: ${ip}, scan type: ${scanType}`);
  } catch (error) {
    console.error('Failed to reset rate limit:', error);
    throw error;
  }
}
