/**
 * Department Model
 * Represents academic departments
 * @module models/department
 */

import { Document, Schema, model } from 'mongoose';

/**
 * Department interface
 * Extends Mongoose Document for type safety
 */
export interface IDepartment extends Document {
  name: string;
  code: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Department Schema
 * Defines the structure and validation for department documents
 */
const departmentSchema = new Schema<IDepartment>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      trim: true,
      minlength: [2, 'Department name must be at least 2 characters'],
      maxlength: [100, 'Department name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z]{2,10}$/,
        'Department code must be 2-10 uppercase letters',
      ],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
    collection: 'departments',
  }
);

// Indexes for performance optimization
departmentSchema.index({ code: 1 });
departmentSchema.index({ name: 1 });
departmentSchema.index({ createdAt: -1 });

/**
 * Department Model
 */
export const Department = model<IDepartment>(
  'Department',
  departmentSchema
);
