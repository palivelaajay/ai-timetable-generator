/**
 * Classroom Service
 * Contains all classroom business logic
 * @module services/classroom
 */

import { Classroom, IClassroom } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { CreateClassroomInput, UpdateClassroomInput } from '../validators/classroom.validator.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new classroom
 */
export async function createClassroom(
  data: CreateClassroomInput
): Promise<IClassroom> {
  try {
    const classroom = new Classroom(data);
    await classroom.save();

    logger.success(`Classroom created: ${data.building} - ${data.roomNumber}`);
    return classroom;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating classroom:', error);
    throw new AppError('Failed to create classroom', 500);
  }
}

/**
 * Get all classrooms with pagination and search
 */
export async function getAllClassrooms(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{
  data: IClassroom[];
  total: number;
  page: number;
  totalPages: number;
}> {
  try {
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (search) {
      query.$or = [
        { roomNumber: { $regex: search, $options: 'i' } },
        { building: { $regex: search, $options: 'i' } },
        { roomType: { $regex: search, $options: 'i' } },
      ];
    }

    const [classrooms, total] = await Promise.all([
      Classroom.find(query)
        .lean()
        .sort({ building: 1, roomNumber: 1 })
        .skip(skip)
        .limit(limit),
      Classroom.countDocuments(query),
    ]);

    return {
      data: classrooms,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error('Error fetching classrooms:', error);
    throw new AppError('Failed to fetch classrooms', 500);
  }
}

/**
 * Get a single classroom by ID
 */
export async function getClassroomById(id: string): Promise<IClassroom> {
  try {
    const classroom = await Classroom.findById(id).lean();

    if (!classroom) {
      throw new AppError('Classroom not found', 404);
    }

    return classroom;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching classroom:', error);
    throw new AppError('Failed to fetch classroom', 500);
  }
}

/**
 * Update a classroom
 */
export async function updateClassroom(
  id: string,
  data: UpdateClassroomInput
): Promise<IClassroom> {
  try {
    const classroom = await Classroom.findById(id);

    if (!classroom) {
      throw new AppError('Classroom not found', 404);
    }

    Object.assign(classroom, data);
    await classroom.save();

    logger.success(`Classroom updated: ${id}`);
    return classroom;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating classroom:', error);
    throw new AppError('Failed to update classroom', 500);
  }
}

/**
 * Delete a classroom
 */
export async function deleteClassroom(id: string): Promise<void> {
  try {
    const classroom = await Classroom.findByIdAndDelete(id);

    if (!classroom) {
      throw new AppError('Classroom not found', 404);
    }

    logger.success(`Classroom deleted: ${id}`);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting classroom:', error);
    throw new AppError('Failed to delete classroom', 500);
  }
}
