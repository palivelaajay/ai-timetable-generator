/**
 * Subject Model
 * Represents academic subjects/courses
 * @module models/subject
 */

import { Document, Schema, model, Types } from 'mongoose';

/**
 * Subject interface
 * Extends Mongoose Document for type safety
 */
export interface ISubject extends Document {
  name: string;
  code: string;
  department: Types.ObjectId;
  semester: number;
  credits: number;
  hoursPerWeek: number;
  faculty: Types.ObjectId;
  isLab: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Subject Schema
 * Defines the structure and validation for subject documents
 */
const subjectSchema = new Schema<ISubject>(
  {
    name: {
      type: String,
      required: [true, 'Subject name is required'],
      trim: true,
      minlength: [2, 'Subject name must be at least 2 characters'],
      maxlength: [100, 'Subject name cannot exceed 100 characters'],
    },
    code: {
      type: String,
      required: [true, 'Subject code is required'],
      trim: true,
      uppercase: true,
      match: [
        /^[A-Z0-9]{3,10}$/,
        'Subject code must be 3-10 alphanumeric characters',
      ],
    },
    department: {
      type: Schema.Types.ObjectId,
      ref: 'Department',
      required: [true, 'Department reference is required'],
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8'],
    },
    credits: {
      type: Number,
      required: [true, 'Credits are required'],
      min: [1, 'Credits must be at least 1'],
      max: [10, 'Credits cannot exceed 10'],
    },
    hoursPerWeek: {
      type: Number,
      required: [true, 'Hours per week is required'],
      min: [1, 'Hours per week must be at least 1'],
      max: [20, 'Hours per week cannot exceed 20'],
    },
    faculty: {
      type: Schema.Types.ObjectId,
      ref: 'Faculty',
      required: [true, 'Faculty reference is required'],
    },
    isLab: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'subjects',
  }
);

// Indexes for performance optimization
subjectSchema.index({ code: 1 });
subjectSchema.index({ department: 1 });
subjectSchema.index({ faculty: 1 });
subjectSchema.index({ semester: 1 });
subjectSchema.index({ department: 1, semester: 1 });
subjectSchema.index({ createdAt: -1 });

/**
 * Subject Model
 */
export const Subject = model<ISubject>('Subject', subjectSchema);
