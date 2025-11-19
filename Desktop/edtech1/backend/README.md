# EngiLearn Backend API

Backend API server for the EngiLearn educational platform - built with Node.js, Express, TypeScript, and SQLite.

## Features

- User authentication with JWT tokens
- Course management system
- Progress tracking and gamification
- XP and leveling system
- RESTful API design
- SQLite database (easily upgradeable to PostgreSQL)

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: SQLite (via Sequelize ORM)
- **Authentication**: JWT (jsonwebtoken)
- **Validation**: express-validator
- **Security**: helmet, express-rate-limit

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

The default `.env` is already configured for development with SQLite.

### 3. Start Development Server

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### 4. Seed Database (Optional)

```bash
npm run seed
```

This creates:
- 2 test users (student and instructor)
- 6 sample courses
- 4 lessons for the Arduino course

## API Documentation

### Base URL

```
http://localhost:5000/api/v1
```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your_access_token>
```

---

## API Endpoints

### Authentication (`/api/v1/auth`)

#### Register User
```http
POST /api/v1/auth/register
```

**Body**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "Password123!"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "level": 1,
    "totalXp": 0
  },
  "tokens": {
    "accessToken": "jwt_token",
    "refreshToken": "refresh_token"
  }
}
```

#### Login
```http
POST /api/v1/auth/login
```

**Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Response**: Same as register

#### Get Profile
```http
GET /api/v1/auth/profile
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "username": "username",
    "level": 12,
    "totalXp": 2847,
    "streakCount": 7,
    "avatarUrl": null,
    "bio": null
  }
}
```

#### Update Profile
```http
PUT /api/v1/auth/profile
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "username": "new_username",
  "bio": "My bio",
  "avatarUrl": "https://example.com/avatar.jpg"
}
```

---

### Courses (`/api/v1/courses`)

#### Get All Courses
```http
GET /api/v1/courses?category=arduino&difficulty=beginner&search=pwm&page=1&limit=12
```

**Query Parameters**:
- `category` (optional): Filter by category
- `difficulty` (optional): beginner | intermediate | advanced
- `search` (optional): Search in title and description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)

**Response**:
```json
{
  "courses": [
    {
      "id": "uuid",
      "title": "Arduino Foundations",
      "description": "Master Arduino programming...",
      "difficulty": "beginner",
      "category": "arduino",
      "estimatedHours": 12.5,
      "moduleCount": 6,
      "coverImage": "https://...",
      "rating": 4.8,
      "studentCount": 1247,
      "instructor": {
        "id": "uuid",
        "username": "prof_arduino",
        "avatarUrl": "https://..."
      },
      "isEnrolled": false
    }
  ],
  "pagination": {
    "total": 6,
    "page": 1,
    "limit": 12,
    "pages": 1
  }
}
```

#### Get Course by ID
```http
GET /api/v1/courses/:id
```

**Response**:
```json
{
  "course": {
    "id": "uuid",
    "title": "Arduino Foundations",
    "description": "...",
    "difficulty": "beginner",
    "lessons": [
      {
        "id": "uuid",
        "title": "Introduction to Arduino",
        "orderNumber": 1,
        "duration": 15,
        "xpReward": 50,
        "lessonType": "video"
      }
    ],
    "isEnrolled": true,
    "progress": 65,
    "completedLessons": 3,
    "totalLessons": 4
  }
}
```

#### Enroll in Course
```http
POST /api/v1/courses/:id/enroll
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "message": "Enrolled successfully",
  "courseId": "uuid"
}
```

#### Create Course (Instructor/Admin only)
```http
POST /api/v1/courses
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "title": "New Course",
  "description": "Course description",
  "difficulty": "beginner",
  "category": "arduino",
  "estimatedHours": 10,
  "moduleCount": 5,
  "coverImage": "https://..."
}
```

---

### Progress (`/api/v1/progress`)

#### Get Dashboard Data
```http
GET /api/v1/progress/dashboard
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "user": {
    "id": "uuid",
    "level": 12,
    "totalXp": 2847,
    "streakCount": 7
  },
  "recentLessons": [
    {
      "id": "uuid",
      "progressPercentage": 80,
      "lastAccessed": "2025-11-18T10:30:00Z",
      "lesson": {
        "id": "uuid",
        "title": "PWM Control Basics",
        "duration": 25,
        "xpReward": 75
      },
      "course": {
        "id": "uuid",
        "title": "Arduino Foundations",
        "coverImage": "https://..."
      }
    }
  ],
  "stats": {
    "level": 12,
    "totalXp": 2847,
    "streakCount": 7,
    "lessonsCompleted": 42
  }
}
```

#### Get User Stats
```http
GET /api/v1/progress/stats
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "stats": {
    "level": 12,
    "totalXp": 2847,
    "xpToNextLevel": 153,
    "streakCount": 7,
    "lessonsCompleted": 42,
    "coursesEnrolled": 6,
    "totalLearningTime": 45000
  }
}
```

#### Get Course Progress
```http
GET /api/v1/progress/course/:courseId
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "progress": [
    {
      "id": "uuid",
      "status": "completed",
      "progressPercentage": 100,
      "timeSpent": 1800,
      "completedAt": "2025-11-18T10:00:00Z",
      "lesson": {
        "id": "uuid",
        "title": "Introduction to Arduino",
        "orderNumber": 1,
        "xpReward": 50
      }
    }
  ],
  "stats": {
    "totalLessons": 4,
    "completedLessons": 3,
    "completionPercentage": 75,
    "totalTimeSpent": 5400
  }
}
```

#### Get Lesson Progress
```http
GET /api/v1/progress/lesson/:lessonId
```

**Headers**: `Authorization: Bearer <token>`

**Response**:
```json
{
  "progress": {
    "id": "uuid",
    "status": "in_progress",
    "progressPercentage": 50,
    "timeSpent": 600,
    "notes": "My notes here"
  }
}
```

#### Update Lesson Progress
```http
POST /api/v1/progress/lesson/:lessonId
```

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "courseId": "uuid",
  "progressPercentage": 75,
  "timeSpent": 300,
  "notes": "Updated notes"
}
```

**Response**:
```json
{
  "message": "Progress updated",
  "progress": {
    "id": "uuid",
    "status": "in_progress",
    "progressPercentage": 75,
    "timeSpent": 900
  }
}
```

---

## Test Credentials

After running `npm run seed`, you can use these credentials:

### Student Account
- **Email**: `alex@student.com`
- **Password**: `password123`

### Instructor Account
- **Email**: `instructor@engilearn.com`
- **Password**: `password123`

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts           # Database configuration
│   ├── models/
│   │   ├── User.ts                # User model
│   │   ├── Course.ts              # Course model
│   │   ├── Lesson.ts              # Lesson model
│   │   ├── Progress.ts            # Progress model
│   │   └── index.ts               # Model associations
│   ├── controllers/
│   │   ├── authController.ts      # Auth logic
│   │   ├── courseController.ts    # Course logic
│   │   └── progressController.ts  # Progress logic
│   ├── routes/
│   │   ├── auth.ts                # Auth routes
│   │   ├── courses.ts             # Course routes
│   │   └── progress.ts            # Progress routes
│   ├── middleware/
│   │   ├── auth.ts                # JWT authentication
│   │   └── validation.ts          # Input validation
│   ├── services/
│   │   └── gamificationService.ts # XP & leveling
│   ├── utils/
│   │   └── jwt.ts                 # JWT utilities
│   ├── scripts/
│   │   └── seed.ts                # Database seeding
│   └── app.ts                     # Express app
├── .env                           # Environment variables
├── .env.example                   # Example environment
├── tsconfig.json                  # TypeScript config
└── package.json                   # Dependencies
```

---

## Gamification System

### XP Rewards
- Lesson Complete: 50 XP
- Quiz Perfect Score: 100 XP
- Quiz Pass: 50 XP
- Daily Login: 10 XP
- 7-Day Streak: 100 XP
- 30-Day Streak: 500 XP

### Level Calculation
```
Level = floor(sqrt(totalXP / 100))
XP for Next Level = (currentLevel + 1)² × 100
```

Example:
- Level 1: 0-99 XP
- Level 2: 100-399 XP
- Level 3: 400-899 XP
- Level 12: 14,400-16,899 XP

---

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (String, Unique)
- `username` (String, Unique)
- `passwordHash` (String)
- `level` (Integer, Default: 1)
- `totalXp` (Integer, Default: 0)
- `streakCount` (Integer, Default: 0)
- `lastLogin` (DateTime)
- `avatarUrl` (String)
- `bio` (Text)
- `subscriptionTier` (Enum: free | pro | lifetime)
- `emailVerified` (Boolean)

### Courses Table
- `id` (UUID, Primary Key)
- `title` (String)
- `description` (Text)
- `difficulty` (Enum: beginner | intermediate | advanced)
- `category` (String)
- `estimatedHours` (Float)
- `moduleCount` (Integer)
- `coverImage` (String)
- `instructorId` (UUID, Foreign Key → Users)
- `isPublished` (Boolean)
- `rating` (Float)
- `studentCount` (Integer)

### Lessons Table
- `id` (UUID, Primary Key)
- `courseId` (UUID, Foreign Key → Courses)
- `orderNumber` (Integer)
- `title` (String)
- `duration` (Integer, minutes)
- `content` (JSON)
- `videoUrl` (String)
- `xpReward` (Integer)
- `lessonType` (Enum: video | reading | quiz | lab)

### Progress Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key → Users)
- `lessonId` (UUID, Foreign Key → Lessons)
- `courseId` (UUID, Foreign Key → Courses)
- `status` (Enum: not_started | in_progress | completed)
- `progressPercentage` (Integer, 0-100)
- `timeSpent` (Integer, seconds)
- `lastAccessed` (DateTime)
- `completedAt` (DateTime)
- `notes` (Text)

---

## Error Handling

All API endpoints return errors in this format:

```json
{
  "error": {
    "message": "Error description",
    "status": 400
  }
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Security Features

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Input validation with express-validator

---

## Scripts

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Run compiled production build
npm run seed     # Seed database with sample data
```

---

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=5000

# Database (SQLite)
DATABASE_URL=sqlite:./engilearn.db

# JWT Secrets
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

---

## Upgrading to PostgreSQL

To switch from SQLite to PostgreSQL:

1. Install PostgreSQL:
```bash
npm install pg pg-hstore
```

2. Update `.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/engilearn
```

3. Update `src/config/database.ts`:
```typescript
const sequelize = new Sequelize(process.env.DATABASE_URL!, {
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false
});
```

---

## Next Steps

- [ ] Implement Arduino simulator backend
- [ ] Add quiz system
- [ ] Implement achievement system
- [ ] Add email notifications
- [ ] Implement file upload (AWS S3)
- [ ] Add search functionality (Algolia)
- [ ] Create admin dashboard
- [ ] Add WebSocket for real-time features
- [ ] Implement payment system (Stripe)
- [ ] Add social features (comments, forums)

---

## License

MIT

---

## Support

For issues and questions, contact: support@engilearn.com
