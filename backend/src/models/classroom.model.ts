/**
 * Classroom Model
 * Represents physical classroom/laboratory spaces
 * @module models/classroom
 */

import { Document, Schema, model } from 'mongoose';

/**
 * Classroom type enumeration
 */
export enum RoomType {
  CLASSROOM = 'classroom',
  LABORATORY = 'laboratory',
  SEMINAR = 'seminar',
}

/**
 * Classroom interface
 * Extends Mongoose Document for type safety
 */
export interface IClassroom extends Document {
  roomNumber: string;
  building: string;
  capacity: number;
  roomType: RoomType;
  hasProjector: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Classroom Schema
 * Defines the structure and validation for classroom documents
 */
const classroomSchema = new Schema<IClassroom>(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
      minlength: [1, 'Room number must be at least 1 character'],
      maxlength: [20, 'Room number cannot exceed 20 characters'],
    },
    building: {
      type: String,
      required: [true, 'Building name is required'],
      trim: true,
      minlength: [1, 'Building name must be at least 1 character'],
      maxlength: [50, 'Building name cannot exceed 50 characters'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
      max: [500, 'Capacity cannot exceed 500'],
    },
    roomType: {
      type: String,
      enum: {
        values: Object.values(RoomType),
        message: `Room type must be one of: ${Object.values(RoomType).join(', ')}`,
      },
      required: [true, 'Room type is required'],
    },
    hasProjector: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'classrooms',
  }
);

// Indexes for performance optimization
classroomSchema.index({ roomNumber: 1, building: 1 });
classroomSchema.index({ building: 1 });
classroomSchema.index({ roomType: 1 });
classroomSchema.index({ capacity: 1 });
classroomSchema.index({ createdAt: -1 });

/**
 * Classroom Model
 */
export const Classroom = model<IClassroom>('Classroom', classroomSchema);
