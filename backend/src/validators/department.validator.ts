/**
 * Department Validation Schemas
 * @module validators/department
 */

import { z } from 'zod';

/**
 * Create Department request schema
 */
export const createDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, 'Department name must be at least 2 characters')
    .max(100, 'Department name cannot exceed 100 characters')
    .trim(),
  code: z
    .string()
    .min(2, 'Department code must be at least 2 characters')
    .max(10, 'Department code cannot exceed 10 characters')
    .uppercase()
    .trim()
    .regex(/^[A-Z]{2,10}$/, 'Department code must be 2-10 uppercase letters'),
  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .trim()
    .optional(),
});

/**
 * Update Department request schema
 */
export const updateDepartmentSchema = createDepartmentSchema.partial();

/**
 * Infer TypeScript types
 */
export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
