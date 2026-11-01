/**
 * Timetable Validator
 * Zod schemas for timetable generation and CRUD operations
 * @module validators/timetable
 */

import { z } from 'zod';



/**
 * Constraint schema for timetable generation
 */
const constraintSchema = z.object({
  maxConsecutiveClasses: z
    .number()
    .int()
    .min(1, 'Max consecutive classes must be at least 1')
    .max(12, 'Max consecutive classes cannot exceed 12')
    .optional(),
  minBreakBetweenClasses: z
    .number()
    .int()
    .min(0, 'Min break must be non-negative')
    .max(5, 'Min break cannot exceed 5 periods')
    .optional(),
  labClassesPerWeek: z
    .number()
    .int()
    .min(1, 'Lab classes per week must be at least 1')
    .max(3, 'Lab classes per week cannot exceed 3')
    .optional(),
  preferredLabDays: z
    .array(
      z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'])
    )
    .optional(),
});

/**
 * Schema for timetable generation request
 */
export const generateTimetableSchema = z.object({
  departmentId: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID format'),
  semester: z
    .number()
    .int()
    .min(1, 'Semester must be at least 1')
    .max(8, 'Semester cannot exceed 8'),
  academicYear: z
    .string()
    .regex(/^\d{4}-\d{4}$/, 'Academic year must be in format YYYY-YYYY'),
  workingDays: z
    .array(z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']))
    .min(1, 'At least one working day is required')
    .max(6, 'Cannot exceed 6 working days'),
  periodsPerDay: z
    .number()
    .int()
    .min(1, 'Periods per day must be at least 1')
    .max(12, 'Periods per day cannot exceed 12'),
  constraints: constraintSchema.optional(),
});

/**
 * Schema for updating timetable status
 */
export const updateTimetableStatusSchema = z.object({
  status: z.enum(['draft', 'generated', 'published']),
});

/**
 * Schema for timetable list query parameters
 */
export const listTimetablesSchema = z.object({
  page: z
    .string()
    .transform(Number)
    .refine((n) => n >= 1, 'Page must be at least 1')
    .optional()
    .default(() => 1),
  limit: z
    .string()
    .transform(Number)
    .refine((n) => n >= 1 && n <= 100, 'Limit must be between 1 and 100')
    .optional()
    .default(() => 20),
  departmentId: z.string().optional(),
  semester: z
    .string()
    .transform(Number)
    .refine((n) => n >= 1 && n <= 8, 'Semester must be between 1 and 8')
    .optional(),
  status: z.enum(['draft', 'generated', 'published']).optional(),
});

/**
 * Type exports for TypeScript
 */
export type GenerateTimetableRequest = z.infer<typeof generateTimetableSchema>;
export type UpdateTimetableStatusRequest = z.infer<typeof updateTimetableStatusSchema>;
export type ListTimetablesQuery = z.infer<typeof listTimetablesSchema>;
