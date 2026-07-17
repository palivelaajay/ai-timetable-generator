/**
 * Classroom Routes
 * @module routes/classroom
 */

import { Router } from 'express';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { UserRole } from '../models/user.model.js';
import * as classroomController from '../controllers/classroom.controller.js';

const router = Router();

/**
 * @openapi
 * /classrooms:
 *   get:
 *     summary: Get all classrooms
 *     description: Retrieve all classrooms with pagination and optional search
 *     tags:
 *       - Classrooms
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
 *         description: Search by room number, building, or room type
 *     responses:
 *       200:
 *         description: Classrooms retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticate, classroomController.getAllClassrooms);

/**
 * @openapi
 * /classrooms:
 *   post:
 *     summary: Create a new classroom
 *     description: Create a new classroom (Admin only)
 *     tags:
 *       - Classrooms
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomNumber
 *               - building
 *               - capacity
 *               - roomType
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: "101"
 *               building:
 *                 type: string
 *                 example: "Building A"
 *               capacity:
 *                 type: integer
 *                 example: 60
 *               roomType:
 *                 type: string
 *                 enum: [classroom, laboratory, seminar]
 *                 example: "classroom"
 *               hasProjector:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden (Admin only)
 */
router.post('/', authenticate, authorize(UserRole.ADMIN), classroomController.createClassroom);

/**
 * @openapi
 * /classrooms/{id}:
 *   get:
 *     summary: Get classroom by ID
 *     description: Retrieve a specific classroom by ID
 *     tags:
 *       - Classrooms
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
 *         description: Classroom retrieved successfully
 *       404:
 *         description: Classroom not found
 */
router.get('/:id', authenticate, classroomController.getClassroomById);

/**
 * @openapi
 * /classrooms/{id}:
 *   put:
 *     summary: Update a classroom
 *     description: Update classroom details (Admin only)
 *     tags:
 *       - Classrooms
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
 *               roomNumber:
 *                 type: string
 *               building:
 *                 type: string
 *               capacity:
 *                 type: integer
 *               roomType:
 *                 type: string
 *                 enum: [classroom, laboratory, seminar]
 *               hasProjector:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Classroom updated successfully
 *       404:
 *         description: Classroom not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.put('/:id', authenticate, authorize(UserRole.ADMIN), classroomController.updateClassroom);

/**
 * @openapi
 * /classrooms/{id}:
 *   delete:
 *     summary: Delete a classroom
 *     description: Delete a classroom (Admin only)
 *     tags:
 *       - Classrooms
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
 *         description: Classroom deleted successfully
 *       404:
 *         description: Classroom not found
 *       403:
 *         description: Forbidden (Admin only)
 */
router.delete('/:id', authenticate, authorize(UserRole.ADMIN), classroomController.deleteClassroom);

export { router as classroomRouter };
