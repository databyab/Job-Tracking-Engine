import express from 'express';
import { authenticate } from '../middleware/auth';
import { parseJobDescription } from '../controllers/aiController';

const router = express.Router();

// POST /api/ai/parse-jd - parse job description with AI
router.post('/parse-jd', authenticate, parseJobDescription);

export default router;
