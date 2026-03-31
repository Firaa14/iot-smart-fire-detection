import express from 'express';
import * as deviceController from '../controllers/deviceController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Semua routes memerlukan token
router.get('/', verifyToken, deviceController.getAllDevices);
router.get('/:device_id', verifyToken, deviceController.getDevice);
router.post('/register', verifyToken, deviceController.registerDevice);
router.post('/:device_id/pump/activate', verifyToken, deviceController.activatePump);
router.post('/:device_id/pump/deactivate', verifyToken, deviceController.deactivatePump);

export default router;