import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Course, Lesson, User, Progress } from '../models';
import { Op } from 'sequelize';

export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, search, page = '1', limit = '12' } = req.query;

    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'avatarUrl']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    // If user is authenticated, get enrollment status
    let coursesWithEnrollment = courses;
    if (req.user) {
      const enrollments = await Progress.findAll({
        where: {
          userId: req.user.userId,
          courseId: courses.map(c => c.id)
        },
        attributes: ['courseId', 'status']
      });

      const enrollmentMap = new Map(enrollments.map(e => [e.courseId, e.status]));

      coursesWithEnrollment = courses.map(course => {
        const courseData = course.toJSON() as any;
        courseData.isEnrolled = enrollmentMap.has(course.id);
        courseData.enrollmentStatus = enrollmentMap.get(course.id);
        return courseData;
      });
    }

    res.json({
      courses: coursesWithEnrollment,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'avatarUrl']
        },
        {
          model: Lesson,
          as: 'lessons',
          order: [['orderNumber', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const courseData = course.toJSON() as any;

    // Get user progress if authenticated
    if (req.user) {
      const progress = await Progress.findAll({
        where: {
          userId: req.user.userId,
          courseId: id
        }
      });

      const completedLessons = progress.filter(p => p.status === 'completed').length;
      const totalLessons = courseData.lessons.length;

      courseData.isEnrolled = progress.length > 0;
      courseData.progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
      courseData.completedLessons = completedLessons;
      courseData.totalLessons = totalLessons;
    }

    res.json({ course: courseData });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      difficulty,
      category,
      estimatedHours,
      moduleCount,
      coverImage
    } = req.body;

    const course = await Course.create({
      title,
      description,
      difficulty,
      category,
      estimatedHours,
      moduleCount,
      coverImage,
      instructorId: req.user!.userId
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

export const enrollCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existingEnrollment = await Progress.findOne({
      where: {
        userId: req.user!.userId,
        courseId: id
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    // Get first lesson and create progress entry
    const firstLesson = await Lesson.findOne({
      where: { courseId: id },
      order: [['orderNumber', 'ASC']]
    });

    if (firstLesson) {
      await Progress.create({
        userId: req.user!.userId,
        lessonId: firstLesson.id,
        courseId: id,
        status: 'not_started'
      });
    }

    // Increment student count
    course.studentCount = (course.studentCount || 0) + 1;
    await course.save();

    res.json({
      message: 'Enrolled successfully',
      courseId: id
    });
  } catch (error) {
    console.error('Enroll course error:', error);
    res.status(500).json({ error: 'Failed to enroll' });
  }
};
