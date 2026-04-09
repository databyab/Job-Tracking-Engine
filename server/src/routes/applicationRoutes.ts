import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createApplication,
  getApplications,
  getStats,
  getApplication,
  updateApplication,
  deleteApplication
} from '../controllers/applicationController';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// POST /api/applications - create a new application
router.post('/', createApplication);

// GET /api/applications - get all applications
router.get('/', getApplications);

// GET /api/applications/stats - get application statistics
router.get('/stats', getStats);

// GET /api/applications/:id - get a single application
router.get('/:id', getApplication);

// PUT /api/applications/:id - update an application
router.put('/:id', updateApplication);

// DELETE /api/applications/:id - delete an application
router.delete('/:id', deleteApplication);

export default router;
