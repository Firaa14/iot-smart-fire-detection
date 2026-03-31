import express from 'express';
import * as authController from '../controllers/authController.js';
import { verifyToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);

// Admin only routes
router.get('/users', verifyToken, isAdmin, authController.getAllUsers);
router.patch('/users/:id/status', verifyToken, isAdmin, authController.updateUserStatus);
router.delete('/users/:id', verifyToken, isAdmin, authController.deleteUser);

export default router;