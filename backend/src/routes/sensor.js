import express from 'express';
import * as sensorController from '../controllers/sensorController.js';
import { verifyToken } from '../middleware/auth.js';  // ← IMPORT INI

const router = express.Router();

// HARUS ADA verifyToken di setiap route!
router.post('/', verifyToken, sensorController.storeSensorData);
router.get('/:device_id', verifyToken, sensorController.getLatestData);
router.get('/:device_id/chart', verifyToken, sensorController.getChartData);

export default router;