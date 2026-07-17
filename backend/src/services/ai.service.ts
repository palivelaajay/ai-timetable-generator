/**
 * AI Service
 * Handles communication with external AI server for timetable generation
 * @module services/ai
 */

import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';
import type { ITimetableEntry } from '../models/timetable.model.js';
import type { IFaculty } from '../models/faculty.model.js';
import type { ISubject } from '../models/subject.model.js';
import type { IClassroom } from '../models/classroom.model.js';

// Logger already imported

/**
 * Request payload structure for AI server
 */
interface AIGenerationRequest {
  faculty: Array<{
    id: string;
    name: string;
    availableDays: string[];
    availableTimeSlots: Array<{ startTime: string; endTime: string }>;
    maxHoursPerWeek: number;
  }>;
  subjects: Array<{
    id: string;
    name: string;
    code: string;
    hoursPerWeek: number;
    faculty: string;
    isLab: boolean;
    semester: number;
    credits: number;
  }>;
  classrooms: Array<{
    id: string;
    roomNumber: string;
    building: string;
    capacity: number;
    roomType: string;
    hasProjector: boolean;
  }>;
  constraints: {
    maxConsecutiveClasses?: number;
    minBreakBetweenClasses?: number;
    labClassesPerWeek?: number;
    preferredLabDays?: string[];
  };
  workingDays: string[];
  periodsPerDay: number;
  department: {
    id: string;
    name: string;
    code: string;
  };
  semester: number;
  academicYear: string;
}

/**
 * Response structure from AI server
 */
export interface AIGenerationResponse {
  success: boolean;
  timetable: ITimetableEntry[];
  metadata?: {
    generatedAt: string;
    algorithm: string;
    iterations?: number;
    optimizationScore?: number;
  };
  errors?: string[];
}

/**
 * Call AI server to generate timetable
 * @param payload - Timetable generation payload
 * @returns Generated timetable entries
 * @throws AppError if AI server is unavailable or returns error
 */
export async function callAIService(
  payload: AIGenerationRequest
): Promise<ITimetableEntry[]> {
  const aiServerUrl = process.env.AI_SERVER_URL;

  if (!aiServerUrl) {
    logger.error('AI_SERVER_URL not configured in environment');
    throw new AppError('AI service is not configured', 500);
  }

  try {
    logger.info(`Calling AI server at ${aiServerUrl}/generate`);

    const response = await fetch(`${aiServerUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(120000), // 2-minute timeout for AI processing
    });

    if (!response.ok) {
      logger.error(
        `AI server returned status ${response.status}: ${response.statusText}`
      );

      if (response.status >= 500) {
        throw new AppError('AI server is temporarily unavailable', 503);
      }

      if (response.status === 400) {
        const errorData = (await response.json()) as { message?: string };
        throw new AppError(
          `Invalid request to AI server: ${errorData.message || 'Unknown error'}`,
          400
        );
      }

      throw new AppError('AI server error', response.status);
    }

    const data = (await response.json()) as AIGenerationResponse;

    if (!data.success) {
      logger.warn('AI generation failed', data.errors);
      throw new AppError('Timetable generation failed', 422);
    }

    if (!Array.isArray(data.timetable) || data.timetable.length === 0) {
      logger.warn('AI returned empty timetable');
      throw new AppError('AI generated empty timetable', 422);
    }

    logger.info(
      `Successfully generated timetable with ${data.timetable.length} entries`
    );
    return data.timetable;
  } catch (error) {
    // Handle fetch errors (network, timeout, etc.)
    if (error instanceof TypeError) {
      logger.error(`Network error when calling AI server: ${error.message}`);
      throw new AppError('AI server is unreachable', 503);
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      logger.error('AI server request timeout');
      throw new AppError('AI server request timeout', 503);
    }

    // Re-throw AppError instances
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(`Unexpected error calling AI service: ${error}`);
    throw new AppError('Unexpected error during timetable generation', 500);
  }
}

/**
 * Build AI server request payload from database data
 * @internal Used by timetable service
 */
export function buildAIPayload(
  faculty: IFaculty[],
  subjects: ISubject[],
  classrooms: IClassroom[],
  department: any, // IDepartment
  semester: number,
  academicYear: string,
  workingDays: string[],
  periodsPerDay: number,
  constraints?: Record<string, any>
): AIGenerationRequest {
  return {
    faculty: faculty.map((f) => ({
      id: f._id.toString(),
      name: f.name,
      availableDays: f.availableDays,
      availableTimeSlots: f.availableTimeSlots,
      maxHoursPerWeek: f.maxHoursPerWeek,
    })),
    subjects: subjects.map((s) => ({
      id: s._id.toString(),
      name: s.name,
      code: s.code,
      hoursPerWeek: s.hoursPerWeek,
      faculty: s.faculty.toString(),
      isLab: s.isLab,
      semester: s.semester,
      credits: s.credits,
    })),
    classrooms: classrooms.map((c) => ({
      id: c._id.toString(),
      roomNumber: c.roomNumber,
      building: c.building,
      capacity: c.capacity,
      roomType: c.roomType,
      hasProjector: c.hasProjector,
    })),
    constraints: constraints || {},
    workingDays,
    periodsPerDay,
    department: {
      id: department._id.toString(),
      name: department.name,
      code: department.code,
    },
    semester,
    academicYear,
  };
}
