import { Router } from 'express';
import { getAllCourses, getCourseById, createCourse, enrollCourse } from '../controllers/courseController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', authenticate, createCourse);
router.post('/:id/enroll', authenticate, enrollCourse);

export default router;
