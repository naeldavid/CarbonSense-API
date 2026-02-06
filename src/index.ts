import express from 'express';
import cors from 'cors';
import { errorHandler, requestLogger } from './middleware/authentication';
import { rateLimit } from './middleware/rateLimit';
import routes from './routes';

const app = express();

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration for RapidAPI
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key', 'api_key', 'x-rapidapi-key', 'x-rapidapi-host'],
    credentials: false,
  })
);

// Explicit CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, X-API-Key, api_key, x-rapidapi-key, x-rapidapi-host');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Logging
app.use(requestLogger);

// Rate limiting (100 requests per minute)
app.use(rateLimit(60000, 100));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Carbon Footprint Calculation API',
    version: '1.0.0',
    redirect: 'See /api for full API documentation',
  });
});

// Routes
app.use('/api', routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
    method: req.method,
  });
});

// Error handling
app.use(errorHandler);

export default app;
