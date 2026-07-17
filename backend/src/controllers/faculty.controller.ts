/**
 * Faculty Controller
 * Handles HTTP requests for faculty endpoints
 * @module controllers/faculty
 */

import { Request, Response, NextFunction } from 'express';
import * as facultyService from '../services/faculty.service.js';
import { createFacultySchema, updateFacultySchema } from '../validators/faculty.validator.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new faculty member
 */
export async function createFaculty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = createFacultySchema.parse(req.body);
    const faculty = await facultyService.createFaculty(validatedData);

    res.status(201).json({
      status: 'success',
      message: 'Faculty member created successfully',
      data: { faculty },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Create faculty error:', error);
      next(new AppError('Failed to create faculty', 500));
    }
  }
}

/**
 * Get all faculty members
 */
export async function getAllFaculty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;

    const result = await facultyService.getAllFaculty(page, limit, search);

    res.status(200).json({
      status: 'success',
      message: 'Faculty members retrieved successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get all faculty error:', error);
      next(new AppError('Failed to fetch faculty', 500));
    }
  }
}

/**
 * Get a single faculty member by ID
 */
export async function getFacultyById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const faculty = await facultyService.getFacultyById(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Faculty member retrieved successfully',
      data: { faculty },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get faculty by ID error:', error);
      next(new AppError('Failed to fetch faculty', 500));
    }
  }
}

/**
 * Update a faculty member
 */
export async function updateFaculty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = updateFacultySchema.parse(req.body);
    const faculty = await facultyService.updateFaculty(req.params.id, validatedData);

    res.status(200).json({
      status: 'success',
      message: 'Faculty member updated successfully',
      data: { faculty },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Update faculty error:', error);
      next(new AppError('Failed to update faculty', 500));
    }
  }
}

/**
 * Delete a faculty member
 */
export async function deleteFaculty(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await facultyService.deleteFaculty(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Faculty member deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Delete faculty error:', error);
      next(new AppError('Failed to delete faculty', 500));
    }
  }
}
