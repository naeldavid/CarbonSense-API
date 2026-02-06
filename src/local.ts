import dotenv from 'dotenv';
import createServer from './server';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = createServer();

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
