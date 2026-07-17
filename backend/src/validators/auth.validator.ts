/**
 * Authentication Validation Schemas
 * Uses Zod for runtime type validation and TypeScript inference
 * @module validators/auth
 */

import { z } from 'zod';

/**
 * Signup request validation schema
 * Ensures email format, password strength, and role validity
 */
export const signupSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
  role: z
    .union([z.literal('admin'), z.literal('faculty')])
    .default('faculty'),
});

/**
 * Infer TypeScript type from signup schema
 */
export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Login request validation schema
 * Validates email format and password presence
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
});

/**
 * Infer TypeScript type from login schema
 */
export type LoginInput = z.infer<typeof loginSchema>;
