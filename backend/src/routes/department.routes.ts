/**
 * Department Routes
 * @module routes/department
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../models/user.model.js';
import * as departmentController from '../controllers/department.controller.js';

const router = Router();

/**
 * @openapi
 * /departments:
 *   get:
 *     summary: Get all departments
 *     description: Retrieve all departments with pagination and optional search
 *     tags:
 *       - Departments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 20
 *       - name: search
 *         in: query
 *         schema:
 *           type: string
 *         description: Search by name, code, or description
 *     responses:
 *       200:
 *         description: Departments retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, departmentController.getAllDepartments);

/**
 * @openapi
 * /departments:
 *   post:
 *     summary: Create a new department
 *     description: Create a new department (Admin only)
 *     tags:
 *       - Departments
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Computer Science"
 *               code:
 *                 type: string
 *                 example: "CSE"
 *               description:
 *                 type: string
 *                 example: "Department of Computer Science and Engineering"
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authenticate, authorize(UserRole.ADMIN), departmentController.createDepartment);

/**
 * @openapi
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     description: Retrieve a specific department by ID
 *     tags:
 *       - Departments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department retrieved successfully
 *       404:
 *         description: Department not found
 */
router.get('/:id', authenticate, departmentController.getDepartmentById);

/**
 * @openapi
 * /departments/{id}:
 *   put:
 *     summary: Update a department
 *     description: Update department details (Admin only)
 *     tags:
 *       - Departments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       404:
 *         description: Department not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id', authenticate, authorize(UserRole.ADMIN), departmentController.updateDepartment);

/**
 * @openapi
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     description: Delete a department (Admin only)
 *     tags:
 *       - Departments
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), departmentController.deleteDepartment);

export { router as departmentRouter };
