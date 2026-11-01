/**
 * Authorization Middleware (Role-Based Access Control)
 * Restricts access to routes based on user roles
 * @module middleware/authorize
 */

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/user.model.js';
import { AppError } from '../utils/appError.js';

/**
 * Authorization Middleware Factory
 * Returns a middleware function that checks if user has required role(s)
 *
 * Usage:
 *   router.delete('/admin-only', authenticate, authorize('admin'), handler);
 *   router.post('/faculty-or-admin', authenticate, authorize('faculty', 'admin'), handler);
 *
 * @param allowedRoles - Role(s) that are allowed to access the route
 * @returns Middleware function
 * @throws AppError if user doesn't have required role
 */
export function authorize(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, _res: Response, next: NextFunction): void => {
    // Check if user is authenticated
    if (!req.user) {
      next(new AppError('Authentication required to access this resource', 401));
      return;
    }

    // Check if user has required role
    if (!allowedRoles.includes(req.user.role as UserRole)) {
      next(
        new AppError(
          `Access denied. Required role(s): ${allowedRoles.join(', ')}. Your role: ${req.user.role}`,
          403
        )
      );
      return;
    }

    next();
  };
}
