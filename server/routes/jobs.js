import express from 'express';
import {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from '../controllers/jobsController.js';
import {
  authenticateUser,
  authorizePermissions,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', authenticateUser, authorizePermissions('admin'), createJob);
router.put('/:id', authenticateUser, authorizePermissions('admin'), updateJob);
router.delete(
  '/:id',
  authenticateUser,
  authorizePermissions('admin'),
  deleteJob,
);

export default router;
