import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Progress, User, Lesson, Course } from '../models';
import { awardXp } from '../services/gamificationService';

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { progressPercentage, timeSpent, notes, courseId } = req.body;
    const userId = req.user!.userId;

    const [progress, created] = await Progress.findOrCreate({
      where: { userId, lessonId },
      defaults: {
        userId,
        lessonId,
        courseId,
        progressPercentage: 0,
        timeSpent: 0,
        status: 'in_progress'
      }
    });

    if (progressPercentage !== undefined) {
      progress.progressPercentage = progressPercentage;
    }

    if (timeSpent) {
      progress.timeSpent += timeSpent;
    }

    progress.lastAccessed = new Date();

    if (notes !== undefined) {
      progress.notes = notes;
    }

    // Check if lesson is completed
    if (progress.progressPercentage >= 100 && progress.status !== 'completed') {
      progress.status = 'completed';
      progress.completedAt = new Date();

      // Award XP
      const lesson = await Lesson.findByPk(lessonId);
      if (lesson) {
        await awardXp(userId, lesson.xpReward);
      }
    } else if (progress.progressPercentage > 0 && progress.status === 'not_started') {
      progress.status = 'in_progress';
    }

    await progress.save();

    res.json({
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

export const getLessonProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user!.userId;

    const progress = await Progress.findOne({
      where: { userId, lessonId }
    });

    res.json({ progress: progress || null });
  } catch (error) {
    console.error('Get lesson progress error:', error);
    res.status(500).json({ error: 'Failed to get progress' });
  }
};

export const getCourseProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user!.userId;

    const progress = await Progress.findAll({
      where: { userId, courseId },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'orderNumber', 'xpReward']
        }
      ],
      order: [[{ model: Lesson, as: 'lesson' }, 'orderNumber', 'ASC']]
    });

    const totalLessons = await Lesson.count({ where: { courseId } });
    const completedLessons = progress.filter(p => p.status === 'completed').length;
    const totalTimeSpent = progress.reduce((sum, p) => sum + p.timeSpent, 0);

    res.json({
      progress,
      stats: {
        totalLessons,
        completedLessons,
        completionPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        totalTimeSpent
      }
    });
  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({ error: 'Failed to get course progress' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalCompleted = await Progress.count({
      where: { userId, status: 'completed' }
    });

    const totalTimeSpent = await Progress.sum('timeSpent', {
      where: { userId }
    }) || 0;

    const enrolledCourses = await Course.count({
      include: [{
        model: Progress,
        as: 'progress',
        where: { userId },
        required: true
      }]
    });

    // Calculate XP to next level
    const currentLevel = user.level;
    const nextLevelXp = Math.pow(currentLevel + 1, 2) * 100;
    const xpToNextLevel = nextLevelXp - user.totalXp;

    res.json({
      stats: {
        level: user.level,
        totalXp: user.totalXp,
        xpToNextLevel,
        streakCount: user.streakCount,
        lessonsCompleted: totalCompleted,
        coursesEnrolled: enrolledCourses,
        totalLearningTime: totalTimeSpent
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};

export const getDashboardData = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    // Get recent lessons in progress
    const recentLessons = await Progress.findAll({
      where: {
        userId,
        status: ['in_progress', 'completed']
      },
      include: [
        {
          model: Lesson,
          as: 'lesson',
          attributes: ['id', 'title', 'duration', 'xpReward']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'title', 'coverImage']
        }
      ],
      order: [['lastAccessed', 'DESC']],
      limit: 5
    });

    // Get user stats
    const user = await User.findByPk(userId);
    const totalCompleted = await Progress.count({
      where: { userId, status: 'completed' }
    });

    res.json({
      user: user?.toJSON(),
      recentLessons,
      stats: {
        level: user?.level,
        totalXp: user?.totalXp,
        streakCount: user?.streakCount,
        lessonsCompleted: totalCompleted
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ error: 'Failed to get dashboard data' });
  }
};
