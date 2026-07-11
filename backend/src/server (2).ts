import dotenv from 'dotenv';
import { logger } from './utils/logger.js';

// ==========================================
// 1. SAFETY CRITICAL EXCEPTION CACHING
// ==========================================
process.on('uncaughtException', (err: Error) => {
  logger.error('CRITICAL UNCAUGHT EXCEPTION! Shutting down process...', err);
  process.exit(1);
});

// Load environment variables immediately
dotenv.config();

// Now safely import database connection and app (which depend on loaded env variables)
import { app } from './app.js';
import { connectDB, disconnectDB } from './config/db.js';

// Determine execution Port (Port 3000 is required by AI Studio preview reverse proxy)
const PORT = process.env.PORT || 3000;

// ==========================================
// 2. BOOTSTRAP DATABASES & LAUNCH SERVER
// ==========================================
logger.info('🚀 Bootstrapping AI Timetable Generator Backend...');

let server: any;

async function bootstrap() {
  // Connect to MongoDB connection pool
  await connectDB();

  // Start Express Server
  server = app.listen(PORT, () => {
    logger.success(`=======================================================`);
    logger.success(`🔥 Express Backend Server is running in ${process.env.NODE_ENV || 'development'} mode`);
    logger.success(`🔌 Listening on Port: ${PORT}`);
    logger.success(`📖 Interactive Swagger Terminal: http://localhost:${PORT}/docs`);
    logger.success(`=======================================================`);
  });
}

bootstrap().catch((err) => {
  logger.error('💥 Failed to bootstrap backend server:', err);
  process.exit(1);
});

// ==========================================
// 3. SHUTDOWN & REJECTION SAFETY HANDLERS
// ==========================================
process.on('unhandledRejection', (err: any) => {
  logger.error('CRITICAL UNHANDLED REJECTION! Shutting down server gracefully...', err);
  if (server) {
    server.close(() => {
      disconnectDB().then(() => {
        process.exit(1);
      });
    });
  } else {
    process.exit(1);
  }
});

// Graceful termination handling (SIGTERM/SIGINT) for Docker / Cloud Run containers
const gracefulShutdown = (signal: string) => {
  logger.warn(`📥 Received ${signal}. Starting graceful shutdown...`);
  if (server) {
    server.close(async () => {
      logger.info('🛑 Express server closed. Cleaning up database pools...');
      await disconnectDB();
      logger.success('✅ Clean exit complete. See you next time!');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
export default server;
