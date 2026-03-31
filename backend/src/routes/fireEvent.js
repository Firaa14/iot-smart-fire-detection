import express from 'express';
import * as fireEventController from '../controllers/fireEventController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Semua routes memerlukan token
router.get('/', verifyToken, fireEventController.getAllEvents);
router.get('/device/:device_id', verifyToken, fireEventController.getDeviceEvents);
router.post('/', verifyToken, fireEventController.createFireEvent);
router.patch('/:event_id/clear', verifyToken, fireEventController.clearFireEvent);

export default router;