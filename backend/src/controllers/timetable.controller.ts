/**
 * Timetable Controller
 * Handles HTTP requests for timetable endpoints
 * @module controllers/timetable
 */

import { Request, Response, NextFunction } from 'express';
import * as timetableService from '../services/timetable.service.js';
import {
  generateTimetableSchema,
  updateTimetableStatusSchema,
  listTimetablesSchema,
} from '../validators/timetable.validator.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Generate timetable using AI service
 * Requires authentication and admin role
 */
export async function generateTimetable(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = generateTimetableSchema.parse(req.body);

    // Get user ID from authenticated request
    const userId = (req as any).user?.id;
    if (!userId) {
      throw new AppError('User authentication required', 401);
    }

    const timetable = await timetableService.generateTimetable(validatedData, userId);

    res.status(201).json({
      status: 'success',
      message: 'Timetable generated successfully',
      data: { timetable },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Generate timetable error:', error);
      next(new AppError('Failed to generate timetable', 500));
    }
  }
}

/**
 * Get all timetables with pagination and filters
 * Requires authentication (admin or faculty)
 */
export async function getAllTimetables(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const queryParams = listTimetablesSchema.parse(req.query);
    const page = parseInt(queryParams.page as any) || 1;
    const limit = parseInt(queryParams.limit as any) || 20;

    const filters = {
      departmentId: queryParams.departmentId,
      semester: queryParams.semester ? parseInt(queryParams.semester as any) : undefined,
      status: queryParams.status,
    };

    const result = await timetableService.getAllTimetables(page, limit, filters);

    res.status(200).json({
      status: 'success',
      message: 'Timetables retrieved successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get all timetables error:', error);
      next(new AppError('Failed to fetch timetables', 500));
    }
  }
}

/**
 * Get single timetable by ID
 * Requires authentication (admin or faculty)
 */
export async function getTimetableById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const timetable = await timetableService.getTimetableById(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Timetable retrieved successfully',
      data: { timetable },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get timetable by ID error:', error);
      next(new AppError('Failed to fetch timetable', 500));
    }
  }
}

/**
 * Update timetable status
 * Requires authentication and admin role
 * Supports transitions: draft → generated → published
 */
export async function updateTimetableStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = updateTimetableStatusSchema.parse(req.body);
    const timetable = await timetableService.updateTimetableStatus(
      req.params.id,
      validatedData.status
    );

    res.status(200).json({
      status: 'success',
      message: 'Timetable status updated successfully',
      data: { timetable },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Update timetable status error:', error);
      next(new AppError('Failed to update timetable status', 500));
    }
  }
}

/**
 * Delete timetable
 * Requires authentication and admin role
 */
export async function deleteTimetable(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await timetableService.deleteTimetable(req.params.id);

    res.status(204).send();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Delete timetable error:', error);
      next(new AppError('Failed to delete timetable', 500));
    }
  }
}
