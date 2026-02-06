import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  apiKey?: string;
  userId?: string;
}

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
export const apiKeyAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Check for API key in header
  const keyFromHeader = req.headers['x-api-key'] as string;
  
  // Check for API key in query parameter
  const keyFromQuery = req.query['api_key'] as string;

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
  } else {
    res.status(401).json({
      error: 'Invalid API key',
      message: 'Please provide a valid API key in X-API-Key header or api_key query parameter',
    });
  }
};

/**
 * Error handling middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err.message);

  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred',
  });
};

/**
 * Request logging middleware
 */
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
    );
  });

  next();
};
