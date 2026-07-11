import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSwagger } from './config/swagger.js';
import { logger } from './utils/logger.js';
import { AppError } from './utils/appError.js';

// Initialize express application
const app: Express = express();

// ==========================================
// 1. GLOBAL SECURITY MIDDLEWARES
// ==========================================

// Set security HTTP headers (XSS, Clickjacking, Content Security Policy)
app.use(
  helmet({
    contentSecurityPolicy: false, // Turned off to allow Swagger UI execution in iframe
    crossOriginEmbedderPolicy: false,
  })
);

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Limit requests from same API (Brute force & DDoS protection)
const limiter = rateLimit({
  max: 300, // Limit each IP to 300 requests per windowMs
  windowMs: 15 * 60 * 1000, // 15 minutes
  message: {
    status: 'fail',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api', limiter);

// ==========================================
// 2. PARSING & ACCESS LOGGING MIDDLEWARES
// ==========================================

// Body parser, reading data from body into req.body (limit size to prevent payload injection)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Stream morgan http logs through our colorized logger
const morganStream = {
  write: (message: string) => logger.info(message.trim()),
};
app.use(morgan(':method :url :status :res[content-length] - :response-time ms', { stream: morganStream }));

// ==========================================
// 3. DOCUMENTATION & TEST INTERFACES
// ==========================================

// Register Swagger Interactive UI
setupSwagger(app);

// Health check endpoint (for Cloud Run / Kubernetes / container checks)
/**
 * @openapi
 * /healthz:
 *   get:
 *     summary: Verify service health status
 *     description: Returns 200 OK if server and database are healthy.
 *     responses:
 *       200:
 *         description: Server is online and database is connected.
 */
app.get('/healthz', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ==========================================
// 4. API ROUTES DEFINITIONS (Registered later in next phases)
// ==========================================

// Base router placeholder - we will register routes here in subsequent modules
// app.use('/api/v1/auth', authRouter);
// app.use('/api/v1/faculty', facultyRouter);
// app.use('/api/v1/subjects', subjectRouter);
// app.use('/api/v1/departments', departmentRouter);
// app.use('/api/v1/classrooms', classroomRouter);
// app.use('/api/v1/timetable', timetableRouter);

// ==========================================
// 5. UNHANDLED ROUTE FALLBACK
// ==========================================
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this server!`, 404));
});

// ==========================================
// 6. CENTRALIZED GLOBAL ERROR HANDLER
// ==========================================
app.use(errorHandler);

export { app };
