import db from '../config/database.js';

class FireEvent {
  static async create(data) {
    const connection = await db.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO fire_events (device_id, detected_at, cleared_at, duration) VALUES (?, ?, ?, ?)',
        [data.device_id, new Date(), null, 0]
      );
      return { id: result.insertId, ...data };
    } finally {
      connection.release();
    }
  }

  static async getAll(limit = 100) {
    const connection = await db.getConnection();
    try {
      const [events] = await connection.query(
        'SELECT * FROM fire_events ORDER BY detected_at DESC LIMIT ?',
        [limit]
      );
      return events;
    } finally {
      connection.release();
    }
  }

  static async getByDevice(device_id, limit = 50) {
    const connection = await db.getConnection();
    try {
      const [events] = await connection.query(
        'SELECT * FROM fire_events WHERE device_id = ? ORDER BY detected_at DESC LIMIT ?',
        [device_id, limit]
      );
      return events;
    } finally {
      connection.release();
    }
  }

  static async clear(id) {
    const connection = await db.getConnection();
    try {
      await connection.query(
        'UPDATE fire_events SET cleared_at = NOW(), duration = TIMESTAMPDIFF(SECOND, detected_at, NOW()) WHERE id = ?',
        [id]
      );
      return true;
    } finally {
      connection.release();
    }
  }
}

export default FireEvent;