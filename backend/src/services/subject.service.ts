/**
 * Subject Service
 * Contains all subject business logic
 * @module services/subject
 */

import { Subject, ISubject, Department, Faculty } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { CreateSubjectInput, UpdateSubjectInput } from '../validators/subject.validator.js';
import { logger } from '../utils/logger.js';
import { Types } from 'mongoose';

/**
 * Create a new subject
 */
export async function createSubject(
  data: CreateSubjectInput
): Promise<ISubject> {
  try {
    // Check if department exists
    const department = await Department.findById(data.department);
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Check if faculty exists
    const faculty = await Faculty.findById(data.faculty);
    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    const subject = new Subject({
      ...data,
      department: new Types.ObjectId(data.department),
      faculty: new Types.ObjectId(data.faculty),
    });
    await subject.save();

    logger.success(`Subject created: ${data.code}`);
    return subject;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating subject:', error);
    throw new AppError('Failed to create subject', 500);
  }
}

/**
 * Get all subjects with pagination and search
 */
export async function getAllSubjects(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{
  data: ISubject[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    const [subjects, total] = await Promise.all([
      Subject.find(query)
        .populate('department', 'name code')
        .populate('faculty', 'name email')
        .lean()
        .sort({ semester: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Subject.countDocuments(query),
    ]);

    return {
      data: subjects,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error('Error fetching subjects:', error);
    throw new AppError('Failed to fetch subjects', 500);
  }
}

/**
 * Get a single subject by ID
 */
export async function getSubjectById(id: string): Promise<ISubject> {
  try {
    const subject = await Subject.findById(id)
      .populate('department', 'name code')
      .populate('faculty', 'name email')
      .lean();

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    return subject;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching subject:', error);
    throw new AppError('Failed to fetch subject', 500);
  }
}

/**
 * Update a subject
 */
export async function updateSubject(
  id: string,
  data: UpdateSubjectInput
): Promise<ISubject> {
  try {
    const subject = await Subject.findById(id);

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    // If updating department, check if it exists
    if (data.department) {
      const department = await Department.findById(data.department);
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    // If updating faculty, check if it exists
    if (data.faculty) {
      const faculty = await Faculty.findById(data.faculty);
      if (!faculty) {
        throw new AppError('Faculty not found', 404);
      }
    }

    Object.assign(subject, data);
    await subject.save();

    logger.success(`Subject updated: ${id}`);
    return subject;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating subject:', error);
    throw new AppError('Failed to update subject', 500);
  }
}

/**
 * Delete a subject
 */
export async function deleteSubject(id: string): Promise<void> {
  try {
    const subject = await Subject.findByIdAndDelete(id);

    if (!subject) {
      throw new AppError('Subject not found', 404);
    }

    logger.success(`Subject deleted: ${id}`);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting subject:', error);
    throw new AppError('Failed to delete subject', 500);
  }
}
