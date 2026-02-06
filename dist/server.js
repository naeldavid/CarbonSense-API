"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authentication_1 = require("./middleware/authentication");
const rateLimit_1 = require("./middleware/rateLimit");
const routes_1 = __importDefault(require("./routes"));
function createServer() {
    const app = (0, express_1.default)();
    // Middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    // CORS configuration
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
    }));
    // Logging
    app.use(authentication_1.requestLogger);
    // Rate limiting (100 requests per minute)
    app.use((0, rateLimit_1.rateLimit)(60000, 100));
    // Authentication
    app.use(authentication_1.apiKeyAuth);
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
    return app;
}
