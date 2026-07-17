/**
 * Authentication Middleware
 * Verifies JWT tokens and loads authenticated user information
 * @module middleware/authenticate
 */

import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/user.model.js';
import { verifyToken, extractTokenFromHeader, ITokenPayload } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';

/**
 * Extend Express Request to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      tokenPayload?: ITokenPayload;
    }
  }
}

/**
 * Authentication Middleware
 * Protects routes and ensures user is authenticated via JWT token
 *
 * Usage:
 *   router.get('/protected-route', authenticate, handler);
 *
 * @throws AppError if token is missing, invalid, or expired
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Extract token from Authorization header
    const token = extractTokenFromHeader(req.headers.authorization);

    // Verify token and get payload
    const tokenPayload = verifyToken(token);

    // Attach token payload to request for authorization checks
    req.tokenPayload = tokenPayload;

    // Load user from database
    const user = await User.findById(tokenPayload.id);

    if (!user || !user.isActive) {
      throw new AppError('User not found or account is inactive', 401);
    }

    // Attach authenticated user to request
    req.user = user;

    next();
  } catch (error) {
    // Let the error handler middleware catch it
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError('Authentication failed', 401));
    }
  }
}
