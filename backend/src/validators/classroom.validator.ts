/**
 * Classroom Validation Schemas
 * @module validators/classroom
 */

import { z } from 'zod';

/**
 * Create Classroom request schema
 */
export const createClassroomSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Room number must be at least 1 character')
    .max(20, 'Room number cannot exceed 20 characters')
    .trim(),
  building: z
    .string()
    .min(1, 'Building name must be at least 1 character')
    .max(50, 'Building name cannot exceed 50 characters')
    .trim(),
  capacity: z
    .number()
    .min(1, 'Capacity must be at least 1')
    .max(500, 'Capacity cannot exceed 500'),
  roomType: z
    .union([z.literal('classroom'), z.literal('laboratory'), z.literal('seminar')])
    .default('classroom'),
  hasProjector: z
    .boolean()
    .default(true),
});

/**
 * Update Classroom request schema
 */
export const updateClassroomSchema = createClassroomSchema.partial();

/**
 * Infer TypeScript types
 */
export type CreateClassroomInput = z.infer<typeof createClassroomSchema>;
export type UpdateClassroomInput = z.infer<typeof updateClassroomSchema>;
