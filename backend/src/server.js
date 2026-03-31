import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIO } from 'socket.io';
import dotenv from 'dotenv';

// Import routes
import sensorRoutes from './routes/sensor.js';
import deviceRoutes from './routes/device.js';
import fireEventRoutes from './routes/fireEvent.js';
import authRoutes from './routes/auth.js';

// Import socket events
import setupSocketEvents from './events/socketEvents.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Attach io to app untuk digunakan di controllers
app.io = io;

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sensor', sensorRoutes);
app.use('/api/device', deviceRoutes);
app.use('/api/fire-event', fireEventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Socket events
setupSocketEvents(io);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║  🔥 Fire Detection System Backend     ║
  ║  🚀 Running on http://localhost:${PORT}   ║
  ║  💾 Database: ${process.env.DB_NAME}      ║
  ╚════════════════════════════════════════╝
  `);
});

export default app;