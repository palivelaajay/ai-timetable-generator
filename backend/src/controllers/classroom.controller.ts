/**
 * Classroom Controller
 * Handles HTTP requests for classroom endpoints
 * @module controllers/classroom
 */

import { Request, Response, NextFunction } from 'express';
import * as classroomService from '../services/classroom.service.js';
import { createClassroomSchema, updateClassroomSchema } from '../validators/classroom.validator.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new classroom
 */
export async function createClassroom(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = createClassroomSchema.parse(req.body);
    const classroom = await classroomService.createClassroom(validatedData);

    res.status(201).json({
      status: 'success',
      message: 'Classroom created successfully',
      data: { classroom },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Create classroom error:', error);
      next(new AppError('Failed to create classroom', 500));
    }
  }
}

/**
 * Get all classrooms
 */
export async function getAllClassrooms(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;

    const result = await classroomService.getAllClassrooms(page, limit, search);

    res.status(200).json({
      status: 'success',
      message: 'Classrooms retrieved successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get all classrooms error:', error);
      next(new AppError('Failed to fetch classrooms', 500));
    }
  }
}

/**
 * Get a single classroom by ID
 */
export async function getClassroomById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const classroom = await classroomService.getClassroomById(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Classroom retrieved successfully',
      data: { classroom },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get classroom by ID error:', error);
      next(new AppError('Failed to fetch classroom', 500));
    }
  }
}

/**
 * Update a classroom
 */
export async function updateClassroom(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = updateClassroomSchema.parse(req.body);
    const classroom = await classroomService.updateClassroom(req.params.id, validatedData);

    res.status(200).json({
      status: 'success',
      message: 'Classroom updated successfully',
      data: { classroom },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Update classroom error:', error);
      next(new AppError('Failed to update classroom', 500));
    }
  }
}

/**
 * Delete a classroom
 */
export async function deleteClassroom(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await classroomService.deleteClassroom(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Classroom deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Delete classroom error:', error);
      next(new AppError('Failed to delete classroom', 500));
    }
  }
}
