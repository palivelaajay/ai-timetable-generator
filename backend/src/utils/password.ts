/**
 * Password Utility Functions
 * Handles password hashing and comparison using bcryptjs
 * @module utils/password
 */

import bcryptjs from 'bcryptjs';
import { AppError } from './appError.js';

/**
 * Hash a plain text password using bcryptjs
 * @param password - Plain text password
 * @param saltRounds - Number of salt rounds (default: 12)
 * @returns Hashed password
 * @throws AppError if hashing fails
 */
export async function hashPassword(password: string, saltRounds: number = 12): Promise<string> {
  try {
    const hashedPassword = await bcryptjs.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new AppError('Password hashing failed', 500);
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword - Plain text password from user input
 * @param hashedPassword - Hashed password from database
 * @returns true if passwords match, false otherwise
 * @throws AppError if comparison fails
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await bcryptjs.compare(plainPassword, hashedPassword);
  } catch (error) {
    throw new AppError('Password comparison failed', 500);
  }
}
