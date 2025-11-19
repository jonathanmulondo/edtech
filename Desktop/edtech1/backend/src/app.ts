import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { connectDB } from './config/database';
import authRoutes from './routes/auth';
import courseRoutes from './routes/courses';
import progressRoutes from './routes/progress';

// Load models to ensure associations are set up
import './models';

dotenv.config();

const app: Application = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// API routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'EngiLearn API v1',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      courses: '/api/v1/courses',
      progress: '/api/v1/progress'
    }
  });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/progress', progressRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: {
      message,
      status,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('');
    console.log('🚀 ===================================');
    console.log(`🚀  EngiLearn Backend Server`);
    console.log(`🚀  Port: ${PORT}`);
    console.log(`🚀  Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🚀  API: http://localhost:${PORT}/api/v1`);
    console.log('🚀 ===================================');
    console.log('');
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
