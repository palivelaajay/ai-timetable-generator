/**
 * User Model
 * Represents system users (admin and faculty)
 * @module models/user
 */

import { Document, Schema, model } from 'mongoose';

/**
 * User role enumeration
 */
export enum UserRole {
  ADMIN = 'admin',
  FACULTY = 'faculty',
}

/**
 * User interface
 * Extends Mongoose Document for type safety
 */
export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * User Schema
 * Defines the structure and validation for user documents
 */
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: {
        values: Object.values(UserRole),
        message: `Role must be one of: ${Object.values(UserRole).join(', ')}`,
      },
      required: [true, 'Role is required'],
      default: UserRole.FACULTY,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

// Indexes for performance optimization
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ createdAt: -1 });

// Remove password from JSON representation
userSchema.set('toJSON', {
  transform: (_doc: any, ret: any) => {
    delete ret.password;
    return ret;
  },
});

/**
 * User Model
 */
export const User = model<IUser>('User', userSchema);
