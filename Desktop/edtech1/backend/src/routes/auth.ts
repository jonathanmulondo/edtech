import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
