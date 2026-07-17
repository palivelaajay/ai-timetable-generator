/**
 * Subject Controller
 * Handles HTTP requests for subject endpoints
 * @module controllers/subject
 */

import { Request, Response, NextFunction } from 'express';
import * as subjectService from '../services/subject.service.js';
import { createSubjectSchema, updateSubjectSchema } from '../validators/subject.validator.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new subject
 */
export async function createSubject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = createSubjectSchema.parse(req.body);
    const subject = await subjectService.createSubject(validatedData);

    res.status(201).json({
      status: 'success',
      message: 'Subject created successfully',
      data: { subject },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Create subject error:', error);
      next(new AppError('Failed to create subject', 500));
    }
  }
}

/**
 * Get all subjects
 */
export async function getAllSubjects(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;

    const result = await subjectService.getAllSubjects(page, limit, search);

    res.status(200).json({
      status: 'success',
      message: 'Subjects retrieved successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get all subjects error:', error);
      next(new AppError('Failed to fetch subjects', 500));
    }
  }
}

/**
 * Get a single subject by ID
 */
export async function getSubjectById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const subject = await subjectService.getSubjectById(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Subject retrieved successfully',
      data: { subject },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get subject by ID error:', error);
      next(new AppError('Failed to fetch subject', 500));
    }
  }
}

/**
 * Update a subject
 */
export async function updateSubject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = updateSubjectSchema.parse(req.body);
    const subject = await subjectService.updateSubject(req.params.id, validatedData);

    res.status(200).json({
      status: 'success',
      message: 'Subject updated successfully',
      data: { subject },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Update subject error:', error);
      next(new AppError('Failed to update subject', 500));
    }
  }
}

/**
 * Delete a subject
 */
export async function deleteSubject(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await subjectService.deleteSubject(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Subject deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Delete subject error:', error);
      next(new AppError('Failed to delete subject', 500));
    }
  }
}
