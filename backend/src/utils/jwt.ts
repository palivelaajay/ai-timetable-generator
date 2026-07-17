/**
 * JWT Utility Functions
 * Handles token generation and verification
 * @module utils/jwt
 */

import jwt, { VerifyOptions } from 'jsonwebtoken';
import { IUser } from '../models/user.model.js';
import { AppError } from './appError.js';

/**
 * JWT Token Payload Interface
 */
export interface ITokenPayload {
  id: string;
  email: string;
  role: string;
}

/**
 * Generate JWT Token
 * @param user - User document from MongoDB
 * @returns JWT token as string
 * @throws AppError if JWT_SECRET is not configured
 */
export function generateToken(user: IUser): string {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

  if (!secret) {
    throw new AppError('JWT_SECRET is not configured in environment variables', 500);
  }

  const payload: ITokenPayload = {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const options: any = {
    expiresIn,
    algorithm: 'HS256',
    issuer: 'ai-timetable-generator',
    subject: user._id.toString(),
  };

  return jwt.sign(payload, secret, options);
}

/**
 * Verify JWT Token
 * @param token - JWT token string (without "Bearer " prefix)
 * @returns Decoded token payload
 * @throws AppError if token is invalid or expired
 */
export function verifyToken(token: string): ITokenPayload {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError('JWT_SECRET is not configured in environment variables', 500);
  }

  try {
    const options: VerifyOptions = {
      algorithms: ['HS256'],
      issuer: 'ai-timetable-generator',
    };

    const decoded = jwt.verify(token, secret, options);

    return decoded as ITokenPayload;
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired. Please log in again.', 401);
    }
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token. Please log in again.', 401);
    }
    throw new AppError('Token verification failed', 401);
  }
}

/**
 * Extract token from Authorization header
 * @param authHeader - Authorization header value
 * @returns Token string without "Bearer " prefix
 * @throws AppError if header format is invalid
 */
export function extractTokenFromHeader(authHeader: string | undefined): string {
  if (!authHeader) {
    throw new AppError('Missing authorization header', 401);
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    throw new AppError('Invalid authorization header format. Expected: Bearer <token>', 401);
  }

  return parts[1];
}
