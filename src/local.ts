import dotenv from 'dotenv';
import app from './server';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

const server = app.listen(PORT, () => {
  console.log(`\n╔════════════════════════════════════════════════════════╗\n║                                                        ║\n║  ⚡ Carbon Footprint Calculation API                  ║\n║                                                        ║\n║  Server running in ${NODE_ENV} mode\n║  🚀 http://localhost:${PORT}                             ║\n║  📚 API docs: http://localhost:${PORT}/api              ║\n║  ❤️  Health: http://localhost:${PORT}/health           ║\n║                                                        ║\n║  Features:                                             ║\n║  • Latest IPCC 2023 emission factors                  ║\n║  • Sub-second response times                          ║\n║  • Real-time data updates                             ║\n║  • Multiple calculation standards                     ║\n║                                                        ║\n╚════════════════════════════════════════════════════════╝\n  `);
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
