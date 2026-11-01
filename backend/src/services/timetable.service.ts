/**
 * Timetable Service
 * Business logic for timetable generation, CRUD operations, and management
 * @module services/timetable
 */

import { Types } from 'mongoose';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';
import { Timetable, TimetableStatus, type ITimetable } from '../models/timetable.model.js';
import { Department } from '../models/department.model.js';
import { Faculty } from '../models/faculty.model.js';
import { Subject } from '../models/subject.model.js';
import { Classroom } from '../models/classroom.model.js';
import { callAIService, buildAIPayload } from './ai.service.js';
import type { GenerateTimetableRequest } from '../validators/timetable.validator.js';

// Logger already imported

/**
 * Generate timetable for a department using AI service
 * @param data - Timetable generation request parameters
 * @param userId - ID of user generating the timetable
 * @returns Newly created timetable document
 * @throws AppError if department/faculty/subjects/classrooms don't exist or AI service fails
 */
export async function generateTimetable(
  data: GenerateTimetableRequest,
  userId: string
): Promise<ITimetable> {
  const { departmentId, semester, academicYear, workingDays, periodsPerDay, constraints } = data;

  try {
    // Validate department exists
    const department = await Department.findById(departmentId).lean();
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Load all required data for AI processing
    logger.info(`Loading data for timetable generation for department ${departmentId}`);

    const [faculty, subjects, classrooms] = await Promise.all([
      Faculty.find({ department: departmentId }).lean(),
      Subject.find({ department: departmentId, semester }).lean(),
      Classroom.find().lean(), // Classrooms are shared across departments
    ]);

    // Validate sufficient data exists
    if (faculty.length === 0) {
      throw new AppError('No faculty members found for this department', 422);
    }

    if (subjects.length === 0) {
      throw new AppError('No subjects found for this department and semester', 422);
    }

    if (classrooms.length === 0) {
      throw new AppError('No classrooms available in the system', 422);
    }

    // Validate minimum resources
    const totalSubjectHours = subjects.reduce((sum: number, s) => sum + s.hoursPerWeek, 0);
    const availableSlots = workingDays.length * periodsPerDay;
    const requiredSlots = totalSubjectHours;

    if (requiredSlots > availableSlots) {
      throw new AppError(
        `Insufficient timetable slots (need ${requiredSlots}, have ${availableSlots})`,
        422
      );
    }

    // Build payload for AI service
    const aiPayload = buildAIPayload(
      faculty,
      subjects,
      classrooms,
      department,
      semester,
      academicYear,
      workingDays,
      periodsPerDay,
      constraints
    );

    // Call AI service
    logger.info('Calling AI service to generate timetable');
    const timetableEntries = await callAIService(aiPayload);

    // Check for existing draft/generated timetable for same department+semester+year
    const existingTimetable = await Timetable.findOne({
      department: departmentId,
      semester,
      academicYear,
      status: { $in: [TimetableStatus.DRAFT, TimetableStatus.GENERATED] },
    });

    if (existingTimetable) {
      // Update existing timetable
      existingTimetable.timetableEntries = timetableEntries;
      existingTimetable.status = TimetableStatus.GENERATED;
      existingTimetable.generatedBy = new Types.ObjectId(userId);
      existingTimetable.generatedAt = new Date();
      await existingTimetable.save();
      logger.info(`Updated existing timetable ${existingTimetable._id}`);
      return existingTimetable.populate(['department', 'generatedBy']);
    }

    // Create new timetable
    const newTimetable = new Timetable({
      department: departmentId,
      semester,
      academicYear,
      status: TimetableStatus.GENERATED,
      timetableEntries,
      generatedBy: userId,
      generatedAt: new Date(),
    });

    await newTimetable.save();
    logger.info(`Created new timetable ${newTimetable._id}`);
    return newTimetable.populate(['department', 'generatedBy']);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(`Error generating timetable: ${error}`);
    throw new AppError('Failed to generate timetable', 500);
  }
}

/**
 * Get paginated list of timetables with optional filters
 * @param page - Page number (default: 1)
 * @param limit - Items per page (default: 20)
 * @param filters - Optional filters (departmentId, semester, status)
 * @returns Timetables with pagination metadata
 */
export async function getAllTimetables(
  page: number = 1,
  limit: number = 20,
  filters?: { departmentId?: string; semester?: number; status?: string }
) {
  const skip = (page - 1) * limit;

  // Build query
  const query: any = {};
  if (filters?.departmentId) query.department = filters.departmentId;
  if (filters?.semester) query.semester = filters.semester;
  if (filters?.status) query.status = filters.status;

  try {
    const [timetables, total] = await Promise.all([
      Timetable.find(query)
        .populate('department', 'name code')
        .populate('generatedBy', 'fullName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Timetable.countDocuments(query),
    ]);

    return {
      data: timetables,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error(`Error fetching timetables: ${error}`);
    throw new AppError('Failed to fetch timetables', 500);
  }
}

/**
 * Get single timetable by ID
 * @param id - Timetable ID
 * @returns Timetable with populated references
 * @throws AppError if not found
 */
export async function getTimetableById(id: string): Promise<ITimetable> {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid timetable ID format', 400);
    }

    const timetable = await Timetable.findById(id)
      .populate('department', 'name code')
      .populate('generatedBy', 'fullName email')
      .populate({
        path: 'timetableEntries.subject',
        model: 'Subject',
        select: 'name code hoursPerWeek isLab',
      })
      .populate({
        path: 'timetableEntries.faculty',
        model: 'Faculty',
        select: 'name email',
      })
      .populate({
        path: 'timetableEntries.classroom',
        model: 'Classroom',
        select: 'roomNumber building capacity roomType',
      });

    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    return timetable;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(`Error fetching timetable ${id}: ${error}`);
    throw new AppError('Failed to fetch timetable', 500);
  }
}

/**
 * Delete timetable by ID
 * @param id - Timetable ID
 * @throws AppError if not found
 */
export async function deleteTimetable(id: string): Promise<void> {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid timetable ID format', 400);
    }

    const timetable = await Timetable.findByIdAndDelete(id);

    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    logger.info(`Deleted timetable ${id}`);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(`Error deleting timetable ${id}: ${error}`);
    throw new AppError('Failed to delete timetable', 500);
  }
}

/**
 * Update timetable status
 * @param id - Timetable ID
 * @param newStatus - New status value
 * @returns Updated timetable
 * @throws AppError if not found or invalid transition
 */
export async function updateTimetableStatus(
  id: string,
  newStatus: string
): Promise<ITimetable> {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid timetable ID format', 400);
    }

    // Validate status value
    if (!Object.values(TimetableStatus).includes(newStatus as TimetableStatus)) {
      throw new AppError('Invalid timetable status', 400);
    }

    const timetable = await Timetable.findById(id);

    if (!timetable) {
      throw new AppError('Timetable not found', 404);
    }

    // Validate status transition rules
    if (timetable.status === TimetableStatus.PUBLISHED && newStatus !== TimetableStatus.PUBLISHED) {
      throw new AppError('Cannot change status of published timetable', 409);
    }

    // Can only go from draft to generated or generated to published
    if (
      timetable.status === TimetableStatus.DRAFT &&
      newStatus === TimetableStatus.PUBLISHED
    ) {
      throw new AppError('Must generate timetable before publishing', 409);
    }

    timetable.status = newStatus as TimetableStatus;
    await timetable.save();

    logger.info(`Updated timetable ${id} status to ${newStatus}`);
    await timetable.populate('department', 'name code');
    await timetable.populate('generatedBy', 'fullName email');
    return timetable;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logger.error(`Error updating timetable ${id} status: ${error}`);
    throw new AppError('Failed to update timetable status', 500);
  }
}
