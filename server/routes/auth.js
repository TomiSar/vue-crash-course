import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateUser,
} from '../controllers/authController.js';
import {
  validateRegisterInput,
  validateLoginInput,
} from '../middleware/validationMiddleware.js';
import { authenticateUser } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);
router.post('/logout', logout);
router.get('/current-user', authenticateUser, getCurrentUser);
router.patch('/update-user', authenticateUser, updateUser);

export default router;
