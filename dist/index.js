"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authentication_1 = require("./middleware/authentication");
const rateLimit_1 = require("./middleware/rateLimit");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// CORS configuration for RapidAPI
app.use((0, cors_1.default)({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-API-Key', 'api_key', 'x-rapidapi-key', 'x-rapidapi-host'],
    credentials: false,
}));
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
app.use(authentication_1.requestLogger);
// Rate limiting (100 requests per minute)
app.use((0, rateLimit_1.rateLimit)(60000, 100));
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Carbon Footprint Calculation API',
        version: '1.0.0',
        redirect: 'See /api for full API documentation',
    });
});
// Routes
app.use('/api', routes_1.default);
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
app.use(authentication_1.errorHandler);
exports.default = app;
