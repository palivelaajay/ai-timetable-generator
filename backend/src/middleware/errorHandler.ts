import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Handle Mongoose CastError (e.g. invalid ObjectId)
 */
function handleCastErrorDB(err: any): AppError {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

/**
 * Handle MongoDB Duplicate Fields Error (e.g. email already exists)
 */
function handleDuplicateFieldsDB(err: any): AppError {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)?.[0] : 'Unknown value';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
}

/**
 * Handle Mongoose Validation Error
 */
function handleValidationErrorDB(err: any): AppError {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
}

/**
 * Handle JWT authentication errors
 */
function handleJWTError(): AppError {
  return new AppError('Invalid token. Please log in again!', 401);
}

function handleJWTExpiredError(): AppError {
  return new AppError('Your login session has expired. Please log in again.', 401);
}

/**
 * Send detailed errors in development mode
 */
function sendErrorDev(err: any, res: Response): void {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
}

/**
 * Send clean, safe errors in production mode
 */
function sendErrorProd(err: any, res: Response): void {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak details to the client
    logger.error('CRITICAL UNHANDLED EXCEPTION 💥:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on our servers. Please try again later.',
    });
  }
}

/**
 * Centralized Global Error Handling Middleware.
 * Registered as the last middleware in Express.
 */
export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV !== 'production') {
    logger.error(`${req.method} ${req.originalUrl} - Error: ${err.message}`, err);
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;
    error.errmsg = err.errmsg;
    error.errors = err.errors;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
}
