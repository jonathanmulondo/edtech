import app from '../src/app';
import { connectDB } from '../src/config/database';

// Initialize database connection for serverless
let dbInitialized = false;

async function initDatabase() {
  if (!dbInitialized) {
    await connectDB();
    dbInitialized = true;
  }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  try {
    await initDatabase();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
