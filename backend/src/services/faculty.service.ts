/**
 * Faculty Service
 * Contains all faculty business logic
 * @module services/faculty
 */

import { Faculty, IFaculty, Department } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { CreateFacultyInput, UpdateFacultyInput } from '../validators/faculty.validator.js';
import { logger } from '../utils/logger.js';
import { Types } from 'mongoose';

/**
 * Create a new faculty member
 */
export async function createFaculty(
  data: CreateFacultyInput
): Promise<IFaculty> {
  try {
    // Check if department exists
    const department = await Department.findById(data.department);
    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Check for duplicate email
    const existingFaculty = await Faculty.findOne({ email: data.email });
    if (existingFaculty) {
      throw new AppError('Faculty with this email already exists', 409);
    }

    // Check for duplicate employeeId
    const existingEmployee = await Faculty.findOne({ employeeId: data.employeeId });
    if (existingEmployee) {
      throw new AppError('Faculty with this employee ID already exists', 409);
    }

    const faculty = new Faculty({
      ...data,
      department: new Types.ObjectId(data.department),
    });
    await faculty.save();

    logger.success(`Faculty created: ${data.email}`);
    return faculty;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating faculty:', error);
    throw new AppError('Failed to create faculty', 500);
  }
}

/**
 * Get all faculty members with pagination and search
 */
export async function getAllFaculty(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{
  data: IFaculty[];
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
        { email: { $regex: search, $options: 'i' } },
        { employeeId: { $regex: search, $options: 'i' } },
      ];
    }

    const [faculty, total] = await Promise.all([
      Faculty.find(query)
        .populate('department', 'name code')
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Faculty.countDocuments(query),
    ]);

    return {
      data: faculty,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error('Error fetching faculty:', error);
    throw new AppError('Failed to fetch faculty', 500);
  }
}

/**
 * Get a single faculty member by ID
 */
export async function getFacultyById(id: string): Promise<IFaculty> {
  try {
    const faculty = await Faculty.findById(id)
      .populate('department', 'name code')
      .lean();

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    return faculty;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching faculty:', error);
    throw new AppError('Failed to fetch faculty', 500);
  }
}

/**
 * Update a faculty member
 */
export async function updateFaculty(
  id: string,
  data: UpdateFacultyInput
): Promise<IFaculty> {
  try {
    const faculty = await Faculty.findById(id);

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    // If updating department, check if it exists
    if (data.department) {
      const department = await Department.findById(data.department);
      if (!department) {
        throw new AppError('Department not found', 404);
      }
    }

    // Check for duplicate email if being updated
    if (data.email && data.email !== faculty.email) {
      const existingFaculty = await Faculty.findOne({ email: data.email });
      if (existingFaculty) {
        throw new AppError('Faculty with this email already exists', 409);
      }
    }

    // Check for duplicate employeeId if being updated
    if (data.employeeId && data.employeeId !== faculty.employeeId) {
      const existingEmployee = await Faculty.findOne({ employeeId: data.employeeId });
      if (existingEmployee) {
        throw new AppError('Faculty with this employee ID already exists', 409);
      }
    }

    Object.assign(faculty, data);
    await faculty.save();

    logger.success(`Faculty updated: ${id}`);
    return faculty;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating faculty:', error);
    throw new AppError('Failed to update faculty', 500);
  }
}

/**
 * Delete a faculty member
 */
export async function deleteFaculty(id: string): Promise<void> {
  try {
    const faculty = await Faculty.findByIdAndDelete(id);

    if (!faculty) {
      throw new AppError('Faculty not found', 404);
    }

    logger.success(`Faculty deleted: ${id}`);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting faculty:', error);
    throw new AppError('Failed to delete faculty', 500);
  }
}
