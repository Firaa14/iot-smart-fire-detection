import db from '../config/database.js';
import bcrypt from 'bcryptjs';

class User {
  static async create(data) {
    const connection = await db.getConnection();
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        [data.name, data.email, hashedPassword, data.role || 'petugas_k3', 'active']
      );
      
      return { id: result.insertId, name: data.name, email: data.email, role: data.role };
    } finally {
      connection.release();
    }
  }

  static async getByEmail(email) {
    const connection = await db.getConnection();
    try {
      const [user] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);
      return user[0];
    } finally {
      connection.release();
    }
  }

  static async getById(id) {
    const connection = await db.getConnection();
    try {
      const [user] = await connection.query('SELECT id, name, email, role, status, created_at FROM users WHERE id = ?', [id]);
      return user[0];
    } finally {
      connection.release();
    }
  }

  static async getAll() {
    const connection = await db.getConnection();
    try {
      const [users] = await connection.query('SELECT id, name, email, role, status, created_at FROM users');
      return users;
    } finally {
      connection.release();
    }
  }

  static async updateStatus(id, status) {
    const connection = await db.getConnection();
    try {
      await connection.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
      return true;
    } finally {
      connection.release();
    }
  }

  static async delete(id) {
    const connection = await db.getConnection();
    try {
      await connection.query('DELETE FROM users WHERE id = ?', [id]);
      return true;
    } finally {
      connection.release();
    }
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

export default User;