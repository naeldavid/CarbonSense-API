"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimit = void 0;
/**
 * Simple in-memory rate limiter
 * In production, use Redis for distributed rate limiting
 */
const rateLimitStore = {};
/**
 * Rate limit middleware
 * Default: 100 requests per minute
 */
const rateLimit = (windowMs = 60000, // 1 minute
maxRequests = 100) => {
    return (req, res, next) => {
        // Use IP address as key (in production, use API key if authenticated)
        const key = req.ip || 'unknown';
        const now = Date.now();
        const record = rateLimitStore[key];
        if (!record || now > record.resetTime) {
            // Create new window
            rateLimitStore[key] = {
                count: 1,
                resetTime: now + windowMs,
            };
            res.set('X-RateLimit-Limit', maxRequests.toString());
            res.set('X-RateLimit-Remaining', (maxRequests - 1).toString());
            res.set('X-RateLimit-Reset', new Date(now + windowMs).toISOString());
            next();
        }
        else if (record.count < maxRequests) {
            // Within limit
            record.count++;
            res.set('X-RateLimit-Limit', maxRequests.toString());
            res.set('X-RateLimit-Remaining', (maxRequests - record.count).toString());
            res.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
            next();
        }
        else {
            // Exceeded limit
            res.status(429).json({
                error: 'Too many requests',
                message: `You have exceeded the rate limit of ${maxRequests} requests per minute`,
                retryAfter: Math.ceil((record.resetTime - now) / 1000),
            });
            res.set('X-RateLimit-Reset', new Date(record.resetTime).toISOString());
        }
    };
};
exports.rateLimit = rateLimit;
/**
 * Cleanup old records periodically (every 30 minutes)
 */
setInterval(() => {
    const now = Date.now();
    for (const key in rateLimitStore) {
        if (now > rateLimitStore[key].resetTime) {
            delete rateLimitStore[key];
        }
    }
}, 30 * 60 * 1000);
