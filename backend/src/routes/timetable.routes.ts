/**
 * Timetable Routes
 * Endpoints for timetable generation and management
 * @module routes/timetable
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../models/user.model.js';
import * as timetableController from '../controllers/timetable.controller.js';

const router = Router();

/**
 * @openapi
 * /timetable:
 *   get:
 *     summary: Get all timetables
 *     description: Retrieve all generated timetables with pagination and optional filters
 *     tags:
 *       - Timetable
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
 *       - name: departmentId
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - name: semester
 *         in: query
 *         schema:
 *           type: integer
 *         description: Filter by semester (1-8)
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: [draft, generated, published]
 *         description: Filter by timetable status
 *     responses:
 *       200:
 *         description: Timetables retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, timetableController.getAllTimetables);

/**
 * @openapi
 * /timetable/generate:
 *   post:
 *     summary: Generate a new timetable using AI
 *     description: Generate a timetable for a department using AI service (Admin only)
 *     tags:
 *       - Timetable
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departmentId
 *               - semester
 *               - academicYear
 *               - workingDays
 *               - periodsPerDay
 *             properties:
 *               departmentId:
 *                 type: string
 *                 description: MongoDB ObjectId of the department
 *                 example: "507f1f77bcf86cd799439011"
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 8
 *                 example: 5
 *               academicYear:
 *                 type: string
 *                 pattern: '^\d{4}-\d{4}$'
 *                 example: "2024-2025"
 *               workingDays:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *                 minItems: 1
 *                 maxItems: 6
 *                 example: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
 *               periodsPerDay:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 12
 *                 example: 8
 *               constraints:
 *                 type: object
 *                 description: Optional scheduling constraints
 *                 properties:
 *                   maxConsecutiveClasses:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 12
 *                   minBreakBetweenClasses:
 *                     type: integer
 *                     minimum: 0
 *                     maximum: 5
 *                   labClassesPerWeek:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 3
 *                   preferredLabDays:
 *                     type: array
 *                     items:
 *                       type: string
 *     responses:
 *       201:
 *         description: Timetable generated successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Department, faculty, subjects, or classrooms not found
 *       422:
 *         description: Unprocessable entity (AI generation failed or insufficient resources)
 *       503:
 *         description: AI service unavailable
 */
router.post('/generate', authenticate, authorize(UserRole.ADMIN), timetableController.generateTimetable);

/**
 * @openapi
 * /timetable/{id}:
 *   get:
 *     summary: Get timetable by ID
 *     description: Retrieve a specific timetable with all entries populated
 *     tags:
 *       - Timetable
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ObjectId
 *     responses:
 *       200:
 *         description: Timetable retrieved successfully
 *       400:
 *         description: Invalid timetable ID format
 *       404:
 *         description: Timetable not found
 */
router.get('/:id', authenticate, timetableController.getTimetableById);

/**
 * @openapi
 * /timetable/{id}/publish:
 *   patch:
 *     summary: Update timetable status
 *     description: Change timetable status (Draft → Generated → Published). Admin only.
 *     tags:
 *       - Timetable
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, generated, published]
 *                 example: "published"
 *     responses:
 *       200:
 *         description: Timetable status updated successfully
 *       400:
 *         description: Invalid status value
 *       403:
 *         description: Forbidden (Admin only) or invalid status transition
 *       404:
 *         description: Timetable not found
 *       409:
 *         description: Conflict (e.g., cannot change published timetable status)
 */
router.patch('/:id/publish', authenticate, authorize(UserRole.ADMIN), timetableController.updateTimetableStatus);

/**
 * @openapi
 * /timetable/{id}:
 *   delete:
 *     summary: Delete timetable
 *     description: Delete a timetable (Admin only)
 *     tags:
 *       - Timetable
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Timetable ObjectId
 *     responses:
 *       204:
 *         description: Timetable deleted successfully
 *       400:
 *         description: Invalid timetable ID format
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: Timetable not found
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), timetableController.deleteTimetable);

export { router as timetableRouter };
