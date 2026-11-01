/**
 * Subject Routes
 * @module routes/subject
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../models/user.model.js';
import * as subjectController from '../controllers/subject.controller.js';

const router = Router();

/**
 * @openapi
 * /subjects:
 *   get:
 *     summary: Get all subjects
 *     description: Retrieve all subjects with pagination and optional search
 *     tags:
 *       - Subjects
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
 *         description: Search by name or code
 *     responses:
 *       200:
 *         description: Subjects retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, subjectController.getAllSubjects);

/**
 * @openapi
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     description: Create a new subject (Admin only)
 *     tags:
 *       - Subjects
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
 *               - department
 *               - semester
 *               - credits
 *               - hoursPerWeek
 *               - faculty
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Data Structures"
 *               code:
 *                 type: string
 *                 example: "CSE201"
 *               department:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *               semester:
 *                 type: integer
 *                 example: 2
 *               credits:
 *                 type: number
 *                 example: 4
 *               hoursPerWeek:
 *                 type: number
 *                 example: 4
 *               faculty:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *               isLab:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authenticate, authorize(UserRole.ADMIN), subjectController.createSubject);

/**
 * @openapi
 * /subjects/{id}:
 *   get:
 *     summary: Get subject by ID
 *     description: Retrieve a specific subject by ID
 *     tags:
 *       - Subjects
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
 *         description: Subject retrieved successfully
 *       404:
 *         description: Subject not found
 */
router.get('/:id', authenticate, subjectController.getSubjectById);

/**
 * @openapi
 * /subjects/{id}:
 *   put:
 *     summary: Update a subject
 *     description: Update subject details (Admin only)
 *     tags:
 *       - Subjects
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
 *               department:
 *                 type: string
 *               semester:
 *                 type: integer
 *               credits:
 *                 type: number
 *               hoursPerWeek:
 *                 type: number
 *               faculty:
 *                 type: string
 *               isLab:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       404:
 *         description: Subject not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id', authenticate, authorize(UserRole.ADMIN), subjectController.updateSubject);

/**
 * @openapi
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     description: Delete a subject (Admin only)
 *     tags:
 *       - Subjects
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
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), subjectController.deleteSubject);

export { router as subjectRouter };
