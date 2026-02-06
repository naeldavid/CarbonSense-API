"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("./server");
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const app = (0, server_1.createServer)();
const server = app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║  ⚡ Carbon Footprint Calculation API                  ║
║                                                        ║
║  Server running in ${NODE_ENV} mode
║  🚀 http://localhost:${PORT}                             ║
║  📚 API docs: http://localhost:${PORT}/api              ║
║  ❤️  Health: http://localhost:${PORT}/health           ║
║                                                        ║
║  Features:                                             ║
║  • Latest IPCC 2023 emission factors                  ║
║  • Sub-second response times                          ║
║  • Real-time data updates                             ║
║  • Multiple calculation standards                     ║
║                                                        ║
╚════════════════════════════════════════════════════════╝
  `);
});
// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
process.on('SIGINT', () => {
    console.log('SIGINT signal received: closing HTTP server');
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});
exports.default = app;
