"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = exports.errorHandler = exports.apiKeyAuth = void 0;
// Valid API keys (in production, use a database)
const VALID_API_KEYS = new Set([
    process.env.API_KEY_1 || 'demo-key-1',
    process.env.API_KEY_2 || 'demo-key-2',
    process.env.API_KEY_3 || 'demo-key-3',
].filter(Boolean));
/**
 * API Key authentication middleware
 * Supports both header and query parameter API keys
 */
const apiKeyAuth = (req, res, next) => {
    // Check for API key in header
    const keyFromHeader = req.headers['x-api-key'];
    // Check for API key in query parameter
    const keyFromQuery = req.query['api_key'];
    const apiKey = keyFromHeader || keyFromQuery;
    if (!apiKey) {
        // Allow public endpoints but mark as unauthenticated
        req.apiKey = 'public';
        next();
        return;
    }
    // Validate API key
    if (VALID_API_KEYS.has(apiKey)) {
        req.apiKey = apiKey;
        next();
    }
    else {
        res.status(401).json({
            error: 'Invalid API key',
            message: 'Please provide a valid API key in X-API-Key header or api_key query parameter',
        });
    }
};
exports.apiKeyAuth = apiKeyAuth;
/**
 * Error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
    });
};
exports.errorHandler = errorHandler;
/**
 * Request logging middleware
 */
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
    });
    next();
};
exports.requestLogger = requestLogger;
