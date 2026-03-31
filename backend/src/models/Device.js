import db from '../config/database.js';

class Device {
  static async getAll() {
    const connection = await db.getConnection();
    try {
      const [devices] = await connection.query('SELECT * FROM devices');
      return devices;
    } finally {
      connection.release();
    }
  }

  static async getByDeviceId(device_id) {
    const connection = await db.getConnection();
    try {
      const [device] = await connection.query('SELECT * FROM devices WHERE device_id = ?', [device_id]);
      return device[0];
    } finally {
      connection.release();
    }
  }

  static async create(data) {
    const connection = await db.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO devices (device_id, api_key, status, spray_duration, cooldown_period, location, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [data.device_id, data.api_key, data.status || 'alert', 5, 10, data.location]
      );
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }

  static async updateStatus(device_id, status) {
    const connection = await db.getConnection();
    try {
      await connection.query('UPDATE devices SET status = ?, last_seen = NOW() WHERE device_id = ?', [status, device_id]);
      return true;
    } finally {
      connection.release();
    }
  }
}

export default Device;