/**
 * Models Index
 * Central export point for all Mongoose models
 * @module models/index
 */

export { User, UserRole, type IUser } from './user.model.js';
export { Department, type IDepartment } from './department.model.js';
export { Faculty, type IFaculty } from './faculty.model.js';
export { Subject, type ISubject } from './subject.model.js';
export {
  Classroom,
  RoomType,
  type IClassroom,
} from './classroom.model.js';
export {
  Timetable,
  TimetableStatus,
  DayOfWeek,
  type ITimetable,
  type ITimetableEntry,
} from './timetable.model.js';
