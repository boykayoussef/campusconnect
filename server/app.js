import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

let dbPromise;
const ensureDB = () => {
  if (!dbPromise) dbPromise = connectDB();
  return dbPromise;
};

// Keep health checks independent of MongoDB so deployment status can be diagnosed.
app.get('/api/health', (req, res) => res.json({ success: true, message: 'CampusConnect API is running' }));

// Database-backed routes connect lazily on first request.
app.use(async (req, res, next) => {
  try {
    await ensureDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
