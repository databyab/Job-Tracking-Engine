import express from 'express';
import { register, login, verifyToken } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/verify - verify token is still valid
router.get('/verify', authenticate, verifyToken);

export default router;
