import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Use PostgreSQL in production (Vercel), SQLite in development
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const databaseUrl = process.env.DATABASE_URL;

let sequelize: Sequelize;

if (isProduction && databaseUrl) {
  // Production: Use PostgreSQL
  sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Development: Use SQLite
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './engilearn.db',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  });
}

let isConnected = false;

export const connectDB = async () => {
  // Avoid reconnecting if already connected (for serverless)
  if (isConnected) {
    return;
  }

  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    isConnected = true;

    // Sync models in development only
    if (!isProduction) {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    // Don't exit in serverless environment
    if (!isProduction) {
      process.exit(1);
    }
    throw error;
  }
};

export default sequelize;
