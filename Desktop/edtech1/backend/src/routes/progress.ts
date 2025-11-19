import { Router } from 'express';
import {
  updateProgress,
  getLessonProgress,
  getCourseProgress,
  getUserStats,
  getDashboardData
} from '../controllers/progressController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/dashboard', authenticate, getDashboardData);
router.get('/stats', authenticate, getUserStats);
router.get('/lesson/:lessonId', authenticate, getLessonProgress);
router.get('/course/:courseId', authenticate, getCourseProgress);
router.post('/lesson/:lessonId', authenticate, updateProgress);

export default router;
