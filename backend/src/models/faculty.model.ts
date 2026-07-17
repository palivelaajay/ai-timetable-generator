/**
 * Faculty Model
 * Represents faculty members (teachers)
 * @module models/faculty
 */

import { Document, Schema, model, Types } from 'mongoose';

/**
 * Faculty interface
 * Extends Mongoose Document for type safety
 */
export interface IFaculty extends Document {
  name: string;
  email: string;
  employeeId: string;
  department: Types.ObjectId;
  maxHoursPerWeek: number;
  availableDays: string[];
  availableTimeSlots: Array<{
    startTime: string;
    endTime: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Faculty Schema
 * Defines the structure and validation for faculty documents
 */
const facultySchema = new Schema<IFaculty>(
  {
    name: {
      type: String,
      required: [true, 'Faculty name is required'],
      trim: true,
      minlength: [2, 'Faculty name must be at least 2 characters'],
      maxlength: [100, 'Faculty name cannot exceed 100 characters'],
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
    employeeId: {
      type: String,
      required: [true, 'Employee ID is required'],
      unique: true,
      trim: true,
      match: [/^[A-Z0-9]{5,10}$/, 'Employee ID must be 5-10 alphanumeric characters'],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required'],
    },
    maxHoursPerWeek: {
      type: Number,
      required: [true, 'Max hours per week is required'],
      min: [1, 'Max hours must be at least 1'],
      max: [60, 'Max hours cannot exceed 60'],
    },
    availableDays: [
      {
        type: String,
        enum: {
          values: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          message: 'Invalid day of week',
        },
      },
    ],
    availableTimeSlots: [
      {
        startTime: {
          type: String,
          required: [true, 'Start time is required'],
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
        },
        endTime: {
          type: String,
          required: [true, 'End time is required'],
          match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)'],
        },
      },
    ],
  },
  {
    timestamps: true,
    collection: 'faculties',
  }
);

// Indexes for performance optimization
facultySchema.index({ email: 1 });
facultySchema.index({ employeeId: 1 });
facultySchema.index({ department: 1 });
facultySchema.index({ createdAt: -1 });
facultySchema.index({ availableDays: 1 });

/**
 * Faculty Model
 */
export const Faculty = model<IFaculty>('Faculty', facultySchema);
