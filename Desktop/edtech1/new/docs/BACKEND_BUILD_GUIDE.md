# Backend Build Guide for EngiLearn

> Step-by-step instructions to build the backend from scratch

**Difficulty**: Intermediate to Advanced
**Estimated Time**: 2-3 months (full-time) or 4-6 months (part-time)
**Prerequisites**: JavaScript/TypeScript, Node.js, SQL basics

---

## Table of Contents
1. [Setup & Environment](#step-1-setup--environment)
2. [Database Design](#step-2-database-design)
3. [Authentication System](#step-3-authentication-system)
4. [Course Management](#step-4-course-management)
5. [Progress Tracking](#step-5-progress-tracking)
6. [Gamification Engine](#step-6-gamification-engine)
7. [Arduino Simulator](#step-7-arduino-simulator)
8. [Quiz System](#step-8-quiz-system)
9. [File Upload & Storage](#step-9-file-upload--storage)
10. [Notifications](#step-10-notifications)
11. [Search Functionality](#step-11-search-functionality)
12. [Testing](#step-12-testing)
13. [Deployment](#step-13-deployment)

---

## STEP 1: Setup & Environment

### 1.1 Initialize Backend Project

```bash
# Create backend directory
mkdir backend
cd backend

# Initialize Node.js project
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install pg pg-hstore sequelize  # PostgreSQL ORM
npm install bcryptjs jsonwebtoken   # Authentication
npm install express-validator       # Input validation
npm install helmet express-rate-limit # Security
npm install morgan                   # Logging

# Install dev dependencies
npm install --save-dev nodemon typescript @types/node @types/express
npm install --save-dev ts-node @types/bcryptjs @types/jsonwebtoken
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### 1.2 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   └── redis.ts
│   ├── models/
│   │   ├── User.ts
│   │   ├── Course.ts
│   │   ├── Lesson.ts
│   │   ├── Progress.ts
│   │   └── Achievement.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── courseController.ts
│   │   ├── progressController.ts
│   │   └── userController.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── courses.ts
│   │   ├── progress.ts
│   │   └── users.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── services/
│   │   ├── emailService.ts
│   │   ├── gamificationService.ts
│   │   └── simulatorService.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── validators.ts
│   ├── types/
│   │   └── index.ts
│   └── app.ts
├── tests/
│   ├── unit/
│   └── integration/
├── .env.example
├── .gitignore
├── tsconfig.json
└── package.json
```

### 1.3 TypeScript Configuration

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "types": ["node", "jest"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 1.4 Environment Variables

Create `.env.example`:
```bash
# Server
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/engilearn
DB_HOST=localhost
DB_PORT=5432
DB_NAME=engilearn
DB_USER=postgres
DB_PASSWORD=your_password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
FROM_EMAIL=noreply@engilearn.com
FROM_NAME=EngiLearn

# AWS S3 (for file storage)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=engilearn-uploads

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Stripe (optional)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 1.5 Basic Express Server

Create `src/app.ts`:
```typescript
import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

dotenv.config();

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({ message: 'EngiLearn API v1' });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});

export default app;
```

### 1.6 Package.json Scripts

Update `package.json`:
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/app.ts",
    "build": "tsc",
    "start": "node dist/app.js",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint . --ext .ts",
    "lint:fix": "eslint . --ext .ts --fix"
  }
}
```

---

## STEP 2: Database Design

### 2.1 Install PostgreSQL

**macOS**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Windows**:
Download from https://www.postgresql.org/download/windows/

**Ubuntu/Linux**:
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2.2 Create Database

```bash
# Access PostgreSQL
psql postgres

# Create database
CREATE DATABASE engilearn;

# Create user
CREATE USER engilearn_user WITH PASSWORD 'your_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE engilearn TO engilearn_user;

# Exit
\q
```

### 2.3 Setup Sequelize ORM

Create `src/config/database.ts`:
```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE_URL || '',
  {
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('✅ Database synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
};

export default sequelize;
```

### 2.4 Define User Model

Create `src/models/User.ts`:
```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import bcrypt from 'bcryptjs';

interface UserAttributes {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  level: number;
  totalXp: number;
  streakCount: number;
  lastLogin?: Date;
  avatarUrl?: string;
  bio?: string;
  subscriptionTier: 'free' | 'pro' | 'lifetime';
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'level' | 'totalXp' | 'streakCount' | 'subscriptionTier' | 'emailVerified'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public username!: string;
  public passwordHash!: string;
  public level!: number;
  public totalXp!: number;
  public streakCount!: number;
  public lastLogin?: Date;
  public avatarUrl?: string;
  public bio?: string;
  public subscriptionTier!: 'free' | 'pro' | 'lifetime';
  public emailVerified!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to compare password
  public async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }

  // Static method to hash password
  public static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  // Instance method to get public profile
  public toJSON() {
    const values = { ...this.get() };
    delete values.passwordHash;
    return values;
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    totalXp: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    streakCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastLogin: {
      type: DataTypes.DATE
    },
    avatarUrl: {
      type: DataTypes.STRING(500)
    },
    bio: {
      type: DataTypes.TEXT
    },
    subscriptionTier: {
      type: DataTypes.ENUM('free', 'pro', 'lifetime'),
      defaultValue: 'free'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true
  }
);

export default User;
```

### 2.5 Define Course Model

Create `src/models/Course.ts`:
```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CourseAttributes {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  estimatedHours: number;
  moduleCount: number;
  coverImage?: string;
  instructorId: string;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CourseCreationAttributes extends Optional<CourseAttributes, 'id' | 'isPublished'> {}

class Course extends Model<CourseAttributes, CourseCreationAttributes> implements CourseAttributes {
  public id!: string;
  public title!: string;
  public description!: string;
  public difficulty!: 'beginner' | 'intermediate' | 'advanced';
  public category!: string;
  public estimatedHours!: number;
  public moduleCount!: number;
  public coverImage?: string;
  public instructorId!: string;
  public isPublished!: boolean;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Course.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    difficulty: {
      type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    estimatedHours: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    moduleCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    coverImage: {
      type: DataTypes.STRING(500)
    },
    instructorId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    isPublished: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  },
  {
    sequelize,
    tableName: 'courses',
    timestamps: true
  }
);

export default Course;
```

### 2.6 Define Lesson Model

Create `src/models/Lesson.ts`:
```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface LessonAttributes {
  id: string;
  courseId: string;
  orderNumber: number;
  title: string;
  duration: number; // in minutes
  content: any; // JSONB
  videoUrl?: string;
  xpReward: number;
  prerequisites?: string[]; // array of lesson IDs
  lessonType: 'video' | 'reading' | 'quiz' | 'lab';
  createdAt?: Date;
  updatedAt?: Date;
}

interface LessonCreationAttributes extends Optional<LessonAttributes, 'id' | 'xpReward'> {}

class Lesson extends Model<LessonAttributes, LessonCreationAttributes> implements LessonAttributes {
  public id!: string;
  public courseId!: string;
  public orderNumber!: number;
  public title!: string;
  public duration!: number;
  public content!: any;
  public videoUrl?: string;
  public xpReward!: number;
  public prerequisites?: string[];
  public lessonType!: 'video' | 'reading' | 'quiz' | 'lab';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Lesson.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    orderNumber: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    videoUrl: {
      type: DataTypes.STRING(500)
    },
    xpReward: {
      type: DataTypes.INTEGER,
      defaultValue: 50
    },
    prerequisites: {
      type: DataTypes.ARRAY(DataTypes.UUID),
      defaultValue: []
    },
    lessonType: {
      type: DataTypes.ENUM('video', 'reading', 'quiz', 'lab'),
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'lessons',
    timestamps: true
  }
);

export default Lesson;
```

### 2.7 Define Progress Model

Create `src/models/Progress.ts`:
```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface ProgressAttributes {
  id: string;
  userId: string;
  lessonId: string;
  courseId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progressPercentage: number;
  timeSpent: number; // in seconds
  lastAccessed?: Date;
  completedAt?: Date;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProgressCreationAttributes extends Optional<ProgressAttributes, 'id' | 'status' | 'progressPercentage' | 'timeSpent'> {}

class Progress extends Model<ProgressAttributes, ProgressCreationAttributes> implements ProgressAttributes {
  public id!: string;
  public userId!: string;
  public lessonId!: string;
  public courseId!: string;
  public status!: 'not_started' | 'in_progress' | 'completed';
  public progressPercentage!: number;
  public timeSpent!: number;
  public lastAccessed?: Date;
  public completedAt?: Date;
  public notes?: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Progress.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    lessonId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'lessons',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'courses',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('not_started', 'in_progress', 'completed'),
      defaultValue: 'not_started'
    },
    progressPercentage: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 100
      }
    },
    timeSpent: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    lastAccessed: {
      type: DataTypes.DATE
    },
    completedAt: {
      type: DataTypes.DATE
    },
    notes: {
      type: DataTypes.TEXT
    }
  },
  {
    sequelize,
    tableName: 'user_progress',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['userId', 'lessonId']
      }
    ]
  }
);

export default Progress;
```

### 2.8 Define Model Associations

Create `src/models/index.ts`:
```typescript
import User from './User';
import Course from './Course';
import Lesson from './Lesson';
import Progress from './Progress';

// User -> Course (instructor)
User.hasMany(Course, {
  foreignKey: 'instructorId',
  as: 'courses'
});
Course.belongsTo(User, {
  foreignKey: 'instructorId',
  as: 'instructor'
});

// Course -> Lesson
Course.hasMany(Lesson, {
  foreignKey: 'courseId',
  as: 'lessons'
});
Lesson.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

// User -> Progress
User.hasMany(Progress, {
  foreignKey: 'userId',
  as: 'progress'
});
Progress.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});

// Lesson -> Progress
Lesson.hasMany(Progress, {
  foreignKey: 'lessonId',
  as: 'progress'
});
Progress.belongsTo(Lesson, {
  foreignKey: 'lessonId',
  as: 'lesson'
});

// Course -> Progress
Course.hasMany(Progress, {
  foreignKey: 'courseId',
  as: 'progress'
});
Progress.belongsTo(Course, {
  foreignKey: 'courseId',
  as: 'course'
});

export {
  User,
  Course,
  Lesson,
  Progress
};
```

---

## STEP 3: Authentication System

### 3.1 JWT Utilities

Create `src/utils/jwt.ts`:
```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET!,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );
};

export const generateRefreshToken = (payload: { userId: string }): string => {
  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
};

export const verifyRefreshToken = (token: string): { userId: string } => {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as { userId: string };
};
```

### 3.2 Auth Middleware

Create `src/middleware/auth.ts`:
```typescript
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role?: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer '
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (roles.length && !roles.includes(req.user.role || '')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };
};
```

### 3.3 Input Validation

Create `src/middleware/validation.ts`:
```typescript
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Invalid email address'),
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username must be 3-50 characters and contain only letters, numbers, and underscores'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character')
];

export const validateLogin = [
  body('email').isEmail().withMessage('Invalid email'),
  body('password').notEmpty().withMessage('Password is required')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

### 3.4 Auth Controller

Create `src/controllers/authController.ts`:
```typescript
import { Request, Response } from 'express';
import { User } from '../models';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Check username
    const existingUsername = await User.findOne({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    // Hash password
    const passwordHash = await User.hashPassword(password);

    // Create user
    const user = await User.create({
      email,
      username,
      passwordHash
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    // TODO: Send verification email

    res.status(201).json({
      message: 'User registered successfully',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email
    });

    const refreshToken = generateRefreshToken({
      userId: user.id
    });

    res.json({
      message: 'Login successful',
      user: user.toJSON(),
      tokens: {
        accessToken,
        refreshToken
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['passwordHash'] }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};
```

### 3.5 Auth Routes

Create `src/routes/auth.ts`:
```typescript
import { Router } from 'express';
import { register, login, getProfile } from '../controllers/authController';
import { validateRegister, validateLogin, handleValidationErrors } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/profile', authenticate, getProfile);

export default router;
```

### 3.6 Update App.ts

Update `src/app.ts` to include routes:
```typescript
import authRoutes from './routes/auth';
import { connectDB } from './config/database';

// ... existing code ...

// Connect to database
connectDB();

// Routes
app.use('/api/v1/auth', authRoutes);

// ... rest of code ...
```

---

## STEP 4: Course Management

### 4.1 Course Controller

Create `src/controllers/courseController.ts`:
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Course, Lesson, User } from '../models';

export const getAllCourses = async (req: AuthRequest, res: Response) => {
  try {
    const { category, difficulty, search, page = 1, limit = 12 } = req.query;

    const where: any = { isPublished: true };

    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (search) {
      where.title = { [Op.iLike]: `%${search}%` };
    }

    const offset = (Number(page) - 1) * Number(limit);

    const { count, rows: courses } = await Course.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'avatarUrl']
        },
        {
          model: Lesson,
          as: 'lessons',
          attributes: ['id']
        }
      ],
      limit: Number(limit),
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      courses,
      pagination: {
        total: count,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
};

export const getCourseById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: 'instructor',
          attributes: ['id', 'username', 'avatarUrl']
        },
        {
          model: Lesson,
          as: 'lessons',
          order: [['orderNumber', 'ASC']]
        }
      ]
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({ course });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ error: 'Failed to get course' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, difficulty, category, estimatedHours, moduleCount } = req.body;

    const course = await Course.create({
      title,
      description,
      difficulty,
      category,
      estimatedHours,
      moduleCount,
      instructorId: req.user!.userId
    });

    res.status(201).json({
      message: 'Course created successfully',
      course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
};

// Add more controller methods: updateCourse, deleteCourse, enrollCourse, etc.
```

### 4.2 Course Routes

Create `src/routes/courses.ts`:
```typescript
import { Router } from 'express';
import { getAllCourses, getCourseById, createCourse } from '../controllers/courseController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', getAllCourses);
router.get('/:id', getCourseById);
router.post('/', authenticate, authorize('instructor', 'admin'), createCourse);

export default router;
```

---

## STEP 5: Progress Tracking

### 5.1 Progress Controller

Create `src/controllers/progressController.ts`:
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Progress, User } from '../models';

export const updateProgress = async (req: AuthRequest, res: Response) => {
  try {
    const { lessonId } = req.params;
    const { progressPercentage, timeSpent, notes } = req.body;
    const userId = req.user!.userId;

    const [progress, created] = await Progress.findOrCreate({
      where: { userId, lessonId },
      defaults: {
        userId,
        lessonId,
        courseId: req.body.courseId,
        progressPercentage: 0,
        timeSpent: 0,
        status: 'in_progress'
      }
    });

    // Update progress
    progress.progressPercentage = progressPercentage || progress.progressPercentage;
    progress.timeSpent += timeSpent || 0;
    progress.lastAccessed = new Date();

    if (notes) progress.notes = notes;

    if (progressPercentage >= 100) {
      progress.status = 'completed';
      progress.completedAt = new Date();

      // Award XP (integrate with gamification)
      // await awardXp(userId, lessonXp);
    } else if (progressPercentage > 0) {
      progress.status = 'in_progress';
    }

    await progress.save();

    res.json({
      message: 'Progress updated',
      progress
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};

export const getUserStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await User.findByPk(userId);

    const totalCompleted = await Progress.count({
      where: { userId, status: 'completed' }
    });

    const totalTimeSpent = await Progress.sum('timeSpent', {
      where: { userId }
    });

    res.json({
      stats: {
        level: user?.level,
        totalXp: user?.totalXp,
        streakCount: user?.streakCount,
        lessonsCompleted: totalCompleted,
        totalLearningTime: totalTimeSpent || 0
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
};
```

---

## STEP 6: Gamification Engine

### 6.1 Gamification Service

Create `src/services/gamificationService.ts`:
```typescript
import { User } from '../models';

const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  QUIZ_PERFECT: 100,
  QUIZ_PASS: 50,
  DAILY_LOGIN: 10,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500
};

export const calculateLevel = (totalXp: number): number => {
  return Math.floor(Math.sqrt(totalXp / 100));
};

export const xpForNextLevel = (currentLevel: number): number => {
  return (currentLevel + 1) ** 2 * 100;
};

export const awardXp = async (userId: string, xpAmount: number): Promise<User> => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  user.totalXp += xpAmount;
  user.level = calculateLevel(user.totalXp);

  await user.save();

  return user;
};

export const checkAndAwardAchievements = async (userId: string, event: string, metadata?: any) => {
  // Implementation for checking achievements
  // This will check various conditions and award achievements
};

export const updateStreak = async (userId: string): Promise<number> => {
  const user = await User.findByPk(userId);

  if (!user) {
    throw new Error('User not found');
  }

  const now = new Date();
  const lastLogin = user.lastLogin || new Date(0);
  const hoursSinceLastLogin = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastLogin < 24) {
    // Same day, no change
    return user.streakCount;
  } else if (hoursSinceLastLogin < 48) {
    // Next day, increment streak
    user.streakCount += 1;
    await awardXp(userId, XP_REWARDS.DAILY_LOGIN);

    // Check for streak milestones
    if (user.streakCount === 7) {
      await awardXp(userId, XP_REWARDS.STREAK_7_DAYS);
    } else if (user.streakCount === 30) {
      await awardXp(userId, XP_REWARDS.STREAK_30_DAYS);
    }
  } else {
    // Streak broken
    user.streakCount = 1;
  }

  user.lastLogin = now;
  await user.save();

  return user.streakCount;
};

export { XP_REWARDS };
```

---

## STEP 7: Arduino Simulator

### 7.1 Simulator Service

Create `src/services/simulatorService.ts`:
```typescript
// This is a simplified version - you'll need to integrate AVR8js or similar

export const compileArduinoCode = async (code: string, board: string = 'uno') => {
  try {
    // In production, this would:
    // 1. Send code to Arduino CLI or cloud compiler
    // 2. Return compiled hex file
    // 3. Handle errors

    // Mock implementation
    const hasErrors = code.includes('error');

    if (hasErrors) {
      return {
        success: false,
        errors: ['Compilation error: undefined reference']
      };
    }

    return {
      success: true,
      hex: 'mock_hex_data_base64',
      output: 'Sketch uses 924 bytes (2%) of program storage space.',
      warnings: []
    };
  } catch (error) {
    throw new Error('Compilation failed');
  }
};

export const executeSimulation = async (hex: string, input?: any) => {
  // This would run the AVR simulation
  // Return serial output, pin states, etc.

  return {
    serialOutput: ['PWM Output: 0', 'PWM Output: 25'],
    pinStates: {
      '13': 'HIGH'
    }
  };
};
```

---

## STEP 8: Quiz System

### 8.1 Quiz Models

Create `src/models/Quiz.ts` and `src/models/QuizAttempt.ts` following similar patterns to previous models.

### 8.2 Quiz Controller

Create `src/controllers/quizController.ts`:
```typescript
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';

export const submitQuiz = async (req: AuthRequest, res: Response) => {
  try {
    const { quizId, answers, timeSpent } = req.body;
    const userId = req.user!.userId;

    // Grade quiz
    // Save attempt
    // Award XP
    // Return results

    res.json({
      score: 80,
      passed: true,
      xpAwarded: 80
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
};
```

---

## STEP 9: File Upload & Storage

### 9.1 AWS S3 Setup

```bash
npm install aws-sdk multer multer-s3 @types/multer @types/multer-s3
```

Create `src/config/s3.ts`:
```typescript
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export const uploadToS3 = async (file: Buffer, key: string): Promise<string> => {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: key,
    Body: file,
    ACL: 'public-read'
  };

  const result = await s3.upload(params).promise();
  return result.Location;
};

export default s3;
```

---

## STEP 10: Notifications

### 10.1 Email Service

```bash
npm install @sendgrid/mail
```

Create `src/services/emailService.ts`:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendWelcomeEmail = async (email: string, username: string) => {
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Welcome to EngiLearn!',
    html: `<h1>Welcome ${username}!</h1><p>Start your engineering journey today.</p>`
  };

  await sgMail.send(msg);
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;

  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: 'Verify your email',
    html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
  };

  await sgMail.send(msg);
};
```

---

## STEP 11: Search Functionality

### 11.1 PostgreSQL Full-Text Search

Add to course controller:
```typescript
import { Op } from 'sequelize';

export const searchCourses = async (req: Request, res: Response) => {
  const { q } = req.query;

  const courses = await Course.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } }
      ]
    }
  });

  res.json({ results: courses });
};
```

---

## STEP 12: Testing

### 12.1 Unit Tests

Create `tests/unit/authController.test.ts`:
```typescript
import { register, login } from '../../src/controllers/authController';
import { User } from '../../src/models';

jest.mock('../../src/models');

describe('Auth Controller', () => {
  describe('register', () => {
    it('should create a new user', async () => {
      const mockReq = {
        body: {
          email: 'test@example.com',
          username: 'testuser',
          password: 'Test123!@#'
        }
      };

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      await register(mockReq as any, mockRes as any);

      expect(mockRes.status).toHaveBeenCalledWith(201);
    });
  });
});
```

---

## STEP 13: Deployment

### 13.1 Production Build

```bash
npm run build
```

### 13.2 Deploy to Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create engilearn-api

# Add PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### 13.3 Deploy to AWS/DigitalOcean

Use Docker:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/app.js"]
```

---

## NEXT STEPS

1. **Seed Database** with sample courses and lessons
2. **Connect Frontend** to backend APIs
3. **Add Redis** for caching and sessions
4. **Implement WebSockets** for real-time features
5. **Add Payment Integration** (Stripe)
6. **Set up Monitoring** (Sentry, New Relic)
7. **Configure CI/CD** pipeline
8. **Load Testing** and optimization
9. **Security Audit**
10. **Launch!** 🚀

---

## Useful Resources

- **Sequelize Docs**: https://sequelize.org/
- **Express.js Guide**: https://expressjs.com/
- **JWT Best Practices**: https://jwt.io/
- **PostgreSQL Tutorial**: https://www.postgresqltutorial.com/
- **AWS SDK Docs**: https://docs.aws.amazon.com/sdk-for-javascript/

Good luck building your backend! 💪
