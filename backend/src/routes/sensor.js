import express from 'express';
import * as sensorController from '../controllers/sensorController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Semua routes memerlukan token
router.post('/', verifyToken, sensorController.storeSensorData);
router.get('/:device_id/latest', verifyToken, sensorController.getLatestData);
router.get('/:device_id/chart', verifyToken, sensorController.getChartData);

export default router;