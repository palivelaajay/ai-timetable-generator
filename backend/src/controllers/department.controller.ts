/**
 * Department Controller
 * Handles HTTP requests for department endpoints
 * @module controllers/department
 */

import { Request, Response, NextFunction } from 'express';
import * as departmentService from '../services/department.service.js';
import { createDepartmentSchema, updateDepartmentSchema } from '../validators/department.validator.js';
import { AppError } from '../utils/appError.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new department
 */
export async function createDepartment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = createDepartmentSchema.parse(req.body);
    const department = await departmentService.createDepartment(validatedData);

    res.status(201).json({
      status: 'success',
      message: 'Department created successfully',
      data: { department },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Create department error:', error);
      next(new AppError('Failed to create department', 500));
    }
  }
}

/**
 * Get all departments
 */
export async function getAllDepartments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string | undefined;

    const result = await departmentService.getAllDepartments(page, limit, search);

    res.status(200).json({
      status: 'success',
      message: 'Departments retrieved successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get all departments error:', error);
      next(new AppError('Failed to fetch departments', 500));
    }
  }
}

/**
 * Get a single department by ID
 */
export async function getDepartmentById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const department = await departmentService.getDepartmentById(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Department retrieved successfully',
      data: { department },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Get department by ID error:', error);
      next(new AppError('Failed to fetch department', 500));
    }
  }
}

/**
 * Update a department
 */
export async function updateDepartment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const validatedData = updateDepartmentSchema.parse(req.body);
    const department = await departmentService.updateDepartment(req.params.id, validatedData);

    res.status(200).json({
      status: 'success',
      message: 'Department updated successfully',
      data: { department },
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Update department error:', error);
      next(new AppError('Failed to update department', 500));
    }
  }
}

/**
 * Delete a department
 */
export async function deleteDepartment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await departmentService.deleteDepartment(req.params.id);

    res.status(204).json({
      status: 'success',
      message: 'Department deleted successfully',
    });
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      logger.error('Delete department error:', error);
      next(new AppError('Failed to delete department', 500));
    }
  }
}
