/**
 * Subject Validation Schemas
 * @module validators/subject
 */

import { z } from 'zod';

/**
 * Create Subject request schema
 */
export const createSubjectSchema = z.object({
  name: z
    .string()
    .min(2, 'Subject name must be at least 2 characters')
    .max(100, 'Subject name cannot exceed 100 characters')
    .trim(),
  code: z
    .string()
    .min(3, 'Subject code must be at least 3 characters')
    .max(10, 'Subject code cannot exceed 10 characters')
    .uppercase()
    .trim()
    .regex(/^[A-Z0-9]{3,10}$/, 'Subject code must be 3-10 alphanumeric characters'),
  department: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID format'),
  semester: z
    .number()
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot exceed 8'),
  credits: z
    .number()
    .min(1, 'Credits must be at least 1')
    .max(10, 'Credits cannot exceed 10'),
  hoursPerWeek: z
    .number()
    .min(1, 'Hours per week must be at least 1')
    .max(20, 'Hours per week cannot exceed 20'),
  faculty: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid faculty ID format'),
  isLab: z
    .boolean()
    .default(false),
});

/**
 * Update Subject request schema
 */
export const updateSubjectSchema = createSubjectSchema.partial();

/**
 * Infer TypeScript types
 */
export type CreateSubjectInput = z.infer<typeof createSubjectSchema>;
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>;
