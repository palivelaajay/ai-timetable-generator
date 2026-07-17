/**
 * Authentication Controller
 * Thin controller that delegates to AuthService
 * Handles HTTP request/response only
 * @module controllers/auth
 */

import { Request, Response, NextFunction } from 'express';
import { signup, login, getCurrentUser } from '../services/auth.service.js';
import { signupSchema, loginSchema } from '../validators/auth.validator.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Signup Handler
 * POST /api/v1/auth/signup
 *
 * @param req - Express request with body containing signup data
 * @param res - Express response
 * @param next - Express next middleware function
 */
export async function signupHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body using Zod
    const validatedData = signupSchema.parse(req.body);

    // Call service to handle signup logic
    const user = await signup(validatedData);

    // Send response
    res.status(201).json({
      status: 'success',
      message: 'User registered successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      // Zod validation error
      next(new AppError((error as any).errors?.[0]?.message || 'Validation failed', 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Signup handler error', error);
      next(new AppError('Signup failed', 500));
    }
  }
}

/**
 * Login Handler
 * POST /api/v1/auth/login
 *
 * @param req - Express request with body containing login data
 * @param res - Express response
 * @param next - Express next middleware function
 */
export async function loginHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body using Zod
    const validatedData = loginSchema.parse(req.body);

    // Call service to handle login logic
    const { token, user } = await login(validatedData);

    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    if (error instanceof Error && 'errors' in error) {
      // Zod validation error
      next(new AppError((error as any).errors?.[0]?.message || 'Validation failed', 400));
    } else if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Login handler error', error);
      next(new AppError('Login failed', 500));
    }
  }
}

/**
 * Get Current User Handler
 * GET /api/v1/auth/me
 * Protected route - requires valid JWT
 *
 * @param req - Express request with authenticated user
 * @param res - Express response
 * @param next - Express next middleware function
 */
export async function getMeHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('User not authenticated', 401);
    }

    // Call service to get current user
    const user = await getCurrentUser(req.user);

    // Send response
    res.status(200).json({
      status: 'success',
      message: 'Current user information retrieved',
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get current user handler error', error);
      next(new AppError('Failed to retrieve user information', 500));
    }
  }
}
