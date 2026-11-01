/**
 * Faculty Routes
 * @module routes/faculty
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../models/user.model.js';
import * as facultyController from '../controllers/faculty.controller.js';

const router = Router();

/**
 * @openapi
 * /faculty:
 *   get:
 *     summary: Get all faculty members
 *     description: Retrieve all faculty members with pagination and optional search
 *     tags:
 *       - Faculty
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
 *         description: Search by name, email, or employee ID
 *     responses:
 *       200:
 *         description: Faculty members retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, facultyController.getAllFaculty);

/**
 * @openapi
 * /faculty:
 *   post:
 *     summary: Create a new faculty member
 *     description: Create a new faculty member (Admin only)
 *     tags:
 *       - Faculty
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
 *               - email
 *               - employeeId
 *               - department
 *               - maxHoursPerWeek
 *               - availableDays
 *               - availableTimeSlots
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dr. John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@university.edu"
 *               employeeId:
 *                 type: string
 *                 example: "EMP001"
 *               department:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               maxHoursPerWeek:
 *                 type: number
 *                 example: 20
 *               availableDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *               availableTimeSlots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     startTime:
 *                       type: string
 *                       example: "09:00"
 *                     endTime:
 *                       type: string
 *                       example: "17:00"
 *     responses:
 *       201:
 *         description: Faculty member created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authenticate, authorize(UserRole.ADMIN), facultyController.createFaculty);

/**
 * @openapi
 * /faculty/{id}:
 *   get:
 *     summary: Get faculty member by ID
 *     description: Retrieve a specific faculty member by ID
 *     tags:
 *       - Faculty
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
 *         description: Faculty member retrieved successfully
 *       404:
 *         description: Faculty member not found
 */
router.get('/:id', authenticate, facultyController.getFacultyById);

/**
 * @openapi
 * /faculty/{id}:
 *   put:
 *     summary: Update a faculty member
 *     description: Update faculty member details (Admin only)
 *     tags:
 *       - Faculty
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
 *               email:
 *                 type: string
 *               employeeId:
 *                 type: string
 *               department:
 *                 type: string
 *               maxHoursPerWeek:
 *                 type: number
 *               availableDays:
 *                 type: array
 *                 items:
 *                   type: string
 *               availableTimeSlots:
 *                 type: array
 *     responses:
 *       200:
 *         description: Faculty member updated successfully
 *       404:
 *         description: Faculty member not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id', authenticate, authorize(UserRole.ADMIN), facultyController.updateFaculty);

/**
 * @openapi
 * /faculty/{id}:
 *   delete:
 *     summary: Delete a faculty member
 *     description: Delete a faculty member (Admin only)
 *     tags:
 *       - Faculty
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
 *         description: Faculty member deleted successfully
 *       404:
 *         description: Faculty member not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), facultyController.deleteFaculty);

export { router as facultyRouter };
