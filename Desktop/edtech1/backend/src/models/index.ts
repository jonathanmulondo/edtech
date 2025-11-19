import User from './User';
import Course from './Course';
import Lesson from './Lesson';
import Progress from './Progress';

// Define associations

// User -> Course (instructor)
User.hasMany(Course, {
  foreignKey: 'instructorId',
  as: 'courses'
});
Course.belongsTo(User, {
  foreignKey: 'instructorId',
  as: 'instructor'
});

// Course -> Lesson
Course.hasMany(Lesson, {
  foreignKey: 'courseId',
  as: 'lessons',
  onDelete: 'CASCADE'
});
Lesson.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// User -> Progress
User.hasMany(Progress, {
  foreignKey: 'userId',
  as: 'progress',
  onDelete: 'CASCADE'
});
Progress.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Lesson -> Progress
Lesson.hasMany(Progress, {
  foreignKey: 'lessonId',
  as: 'progress',
  onDelete: 'CASCADE'
});
Progress.belongsTo(Lesson, {
  foreignKey: 'lessonId',
  as: 'lesson'
});

// Course -> Progress
Course.hasMany(Progress, {
  foreignKey: 'courseId',
  as: 'progress',
  onDelete: 'CASCADE'
});
Progress.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

export {
  User,
  Course,
  Lesson,
  Progress
};
