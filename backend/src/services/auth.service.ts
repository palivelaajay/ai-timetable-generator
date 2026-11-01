/**
 * Authentication Service
 * Contains all authentication business logic
 * Controllers should only call this service
 * @module services/auth
 */

import { User, IUser, UserRole } from '../models/user.model.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/appError.js';
import { SignupInput, LoginInput } from '../validators/auth.validator.js';
import { logger } from '../utils/logger.js';

/**
 * User Registration (Signup)
 *
 * @param signupData - Validated signup request data
 * @returns Created user without password
 * @throws AppError if email already exists or creation fails
 */
export async function signup(signupData: SignupInput): Promise<Omit<IUser, 'password'>> {
  const { fullName, email, password, role } = signupData;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    logger.warn(`Signup attempt with existing email: ${email}`);
    throw new AppError('Email already registered. Please use a different email or log in.', 400);
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create new user
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
    role: role || UserRole.FACULTY,
    isActive: true,
  });

  // Save user to database
  await user.save();

  // Log successful signup
  logger.success(`New user registered: ${email} (Role: ${user.role})`);

  // Return user without password
  const userWithoutPassword = user.toObject();
  delete (userWithoutPassword as any).password;

  return userWithoutPassword as Omit<IUser, 'password'>;
}

/**
 * User Login
 *
 * @param loginData - Validated login request data
 * @returns Object containing JWT token and user information
 * @throws AppError if email not found or password is incorrect
 */
export async function login(loginData: LoginInput): Promise<{
  token: string;
  user: Omit<IUser, 'password'>;
}> {
  const { email, password } = loginData;

  // Find user by email (need password field which is excluded by default)
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    logger.warn(`Failed login attempt for email: ${email}`);
    throw new AppError('Invalid email or password', 401);
  }

  // Check if account is active
  if (!user.isActive) {
    logger.warn(`Login attempt for inactive account: ${email}`);
    throw new AppError('Your account is inactive. Please contact administrator.', 403);
  }

  // Generate JWT token
  const token = generateToken(user);

  // Log successful login
  logger.success(`User logged in: ${email}`);

  // Return token and user (without password)
  const userWithoutPassword = user.toObject();
  delete (userWithoutPassword as any).password;

  return {
    token,
    user: userWithoutPassword as Omit<IUser, 'password'>,
  };
}

/**
 * Get Current User
 * Returns the authenticated user's information
 *
 * @param user - Authenticated user from request
 * @returns User information without password
 */
export async function getCurrentUser(user: IUser): Promise<Omit<IUser, 'password'>> {
  // Refresh user data from database to get latest info
  const currentUser = await User.findById(user._id);

  if (!currentUser || !currentUser.isActive) {
    throw new AppError('User not found or account is inactive', 404);
  }

  const userWithoutPassword = currentUser.toObject();
  delete (userWithoutPassword as any).password;

  return userWithoutPassword as Omit<IUser, 'password'>;
}
