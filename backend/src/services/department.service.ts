/**
 * Department Service
 * Contains all department business logic
 * @module services/department
 */

import { Department, IDepartment } from '../models/index.js';
import { AppError } from '../utils/appError.js';
import { CreateDepartmentInput, UpdateDepartmentInput } from '../validators/department.validator.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new department
 */
export async function createDepartment(
  data: CreateDepartmentInput
): Promise<IDepartment> {
  try {
    // Check if department with same code already exists
    const existingDepartment = await Department.findOne({ code: data.code });
    if (existingDepartment) {
      throw new AppError(`Department with code "${data.code}" already exists`, 409);
    }

    const department = new Department(data);
    await department.save();

    logger.success(`Department created: ${data.code}`);
    return department;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error creating department:', error);
    throw new AppError('Failed to create department', 500);
  }
}

/**
 * Get all departments with pagination and search
 */
export async function getAllDepartments(
  page: number = 1,
  limit: number = 20,
  search?: string
): Promise<{
  data: IDepartment[];
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
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const [departments, total] = await Promise.all([
      Department.find(query)
        .lean()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Department.countDocuments(query),
    ]);

    return {
      data: departments,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error('Error fetching departments:', error);
    throw new AppError('Failed to fetch departments', 500);
  }
}

/**
 * Get a single department by ID
 */
export async function getDepartmentById(id: string): Promise<IDepartment> {
  try {
    const department = await Department.findById(id).lean();

    if (!department) {
      throw new AppError('Department not found', 404);
    }

    return department;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error fetching department:', error);
    throw new AppError('Failed to fetch department', 500);
  }
}

/**
 * Update a department
 */
export async function updateDepartment(
  id: string,
  data: UpdateDepartmentInput
): Promise<IDepartment> {
  try {
    const department = await Department.findById(id);

    if (!department) {
      throw new AppError('Department not found', 404);
    }

    // Check for duplicate code if code is being updated
    if (data.code && data.code !== department.code) {
      const existingDepartment = await Department.findOne({ code: data.code });
      if (existingDepartment) {
        throw new AppError(`Department with code "${data.code}" already exists`, 409);
      }
    }

    Object.assign(department, data);
    await department.save();

    logger.success(`Department updated: ${id}`);
    return department;
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error updating department:', error);
    throw new AppError('Failed to update department', 500);
  }
}

/**
 * Delete a department
 */
export async function deleteDepartment(id: string): Promise<void> {
  try {
    const department = await Department.findByIdAndDelete(id);

    if (!department) {
      throw new AppError('Department not found', 404);
    }

    logger.success(`Department deleted: ${id}`);
  } catch (error) {
    if (error instanceof AppError) throw error;
    logger.error('Error deleting department:', error);
    throw new AppError('Failed to delete department', 500);
  }
}
