import express from 'express';
import * as fireEventController from '../controllers/fireEventController.js';
import { verifyToken } from '../middleware/auth.js';  // ← IMPORT INI

const router = express.Router();

// HARUS ADA verifyToken!
router.get('/', verifyToken, fireEventController.getAllEvents);
router.get('/device/:device_id', verifyToken, fireEventController.getDeviceEvents);
router.post('/', verifyToken, fireEventController.createFireEvent);
router.post('/:event_id/clear', verifyToken, fireEventController.clearFireEvent);

export default router;