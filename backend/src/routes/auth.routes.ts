/**
 * Authentication Routes
 * Defines all authentication endpoints
 * @module routes/auth
 */

import { Router } from 'express';
import { signupHandler, loginHandler, getMeHandler } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Register a new user account
 *     description: Create a new user account with email, password, and role. Password is hashed using bcryptjs.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - password
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Ramini Sai Santhosh"
 *                 description: Full name of the user (2-100 characters)
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "santhosh@example.com"
 *                 description: Unique email address
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123!"
 *                 description: Password (min 8 chars, must include uppercase, lowercase, digit, special character)
 *               role:
 *                 type: string
 *                 enum: [admin, faculty]
 *                 example: "faculty"
 *                 description: User role (optional, defaults to faculty)
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439011"
 *                         fullName:
 *                           type: string
 *                           example: "Ramini Sai Santhosh"
 *                         email:
 *                           type: string
 *                           example: "santhosh@example.com"
 *                         role:
 *                           type: string
 *                           example: "faculty"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       400:
 *         description: Validation error or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Email already registered. Please use a different email or log in."
 *       500:
 *         description: Server error
 */
router.post('/signup', signupHandler);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Login user and get JWT token
 *     description: Authenticate user with email and password. Returns JWT token for subsequent authenticated requests.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "santhosh@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "StrongPassword123!"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: JWT token to use in Authorization header
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         fullName:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                         isActive:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Invalid email or password"
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post('/login', loginHandler);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     description: Returns information about the currently authenticated user. Requires valid JWT token in Authorization header.
 *     tags:
 *       - Authentication
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Current user information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Current user information retrieved"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439011"
 *                         fullName:
 *                           type: string
 *                           example: "Ramini Sai Santhosh"
 *                         email:
 *                           type: string
 *                           example: "santhosh@example.com"
 *                         role:
 *                           type: string
 *                           enum: [admin, faculty]
 *                           example: "admin"
 *                         isActive:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Missing or invalid authorization token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "Invalid token. Please log in again."
 *       404:
 *         description: User not found or inactive
 *       500:
 *         description: Server error
 */
router.get('/me', authenticate, getMeHandler);

export { router as authRouter };
