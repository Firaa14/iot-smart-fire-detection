import db from '../config/database.js';

class SensorLog {
  static async create(data) {
    const connection = await db.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO sensor_logs (device_id, temperature, humidity, pump_state, total_runtime, status, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [data.device_id, data.temperature, data.humidity, data.pump_state || 'idle', data.total_runtime || 0, data.status || 'normal']
      );
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }

  static async getLatest(device_id, limit = 100) {
    const connection = await db.getConnection();
    try {
      const [data] = await connection.query(
        'SELECT * FROM sensor_logs WHERE device_id = ? ORDER BY created_at DESC LIMIT ?',
        [device_id, limit]
      );
      return data;
    } finally {
      connection.release();
    }
  }

  static async getByDateRange(device_id, startDate, endDate) {
    const connection = await db.getConnection();
    try {
      const [data] = await connection.query(
        'SELECT * FROM sensor_logs WHERE device_id = ? AND created_at BETWEEN ? AND ? ORDER BY created_at',
        [device_id, startDate, endDate]
      );
      return data;
    } finally {
      connection.release();
    }
  }
}

export default SensorLog;