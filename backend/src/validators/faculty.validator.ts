/**
 * Faculty Validation Schemas
 * @module validators/faculty
 */

import { z } from 'zod';

/**
 * Time slot schema
 */
const timeSlotSchema = z.object({
  startTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
  endTime: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'),
});

/**
 * Create Faculty request schema
 */
export const createFacultySchema = z.object({
  name: z
    .string()
    .min(2, 'Faculty name must be at least 2 characters')
    .max(100, 'Faculty name cannot exceed 100 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  employeeId: z
    .string()
    .min(5, 'Employee ID must be at least 5 characters')
    .max(10, 'Employee ID cannot exceed 10 characters')
    .regex(/^[A-Z0-9]{5,10}$/, 'Employee ID must be 5-10 alphanumeric characters'),
  department: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Invalid department ID format'),
  maxHoursPerWeek: z
    .number()
    .min(1, 'Max hours per week must be at least 1')
    .max(60, 'Max hours per week cannot exceed 60'),
  availableDays: z
    .array(z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']))
    .min(1, 'At least one available day is required'),
  availableTimeSlots: z
    .array(timeSlotSchema)
    .min(1, 'At least one available time slot is required'),
});

/**
 * Update Faculty request schema
 */
export const updateFacultySchema = createFacultySchema.partial();

/**
 * Infer TypeScript types
 */
export type CreateFacultyInput = z.infer<typeof createFacultySchema>;
export type UpdateFacultyInput = z.infer<typeof updateFacultySchema>;
