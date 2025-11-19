# EngiLearn - Educational Platform

A modern, gamified educational platform focused on Arduino, electronics, and embedded systems education.

## 📁 Project Structure

This monorepo contains:

```
edtech1/
├── new/          # Frontend (React + TypeScript + Vite)
├── backend/      # Backend API (Node.js + Express + TypeScript)
└── README.md     # This file
```

## 🚀 Quick Start

### Frontend (EngiLearn UI)

```bash
cd new
npm install
npm run dev
```

Frontend runs at `http://localhost:3000`

**Features**:
- Interactive dashboard with gamification
- Course library with 6+ courses
- Lesson viewer with Arduino simulator
- User profile with achievements
- Progress tracking

### Backend API

```bash
cd backend
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

**Features**:
- RESTful API
- JWT authentication
- Course management
- Progress tracking
- Gamification (XP, levels, streaks)
- SQLite database

## 📚 Documentation

- **Frontend**: See `new/README.md`
- **Backend API**: See `backend/README.md`
- **Build Guide**: See `new/docs/BACKEND_BUILD_GUIDE.md`
- **Requirements**: See `new/docs/FULL_STACK_REQUIREMENTS.md`

## 🔑 Test Credentials

After seeding the database:

**Student Account**:
- Email: `alex@student.com`
- Password: `password123`

**Instructor Account**:
- Email: `instructor@engilearn.com`
- Password: `password123`

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS v4
- shadcn/ui components
- Recharts

### Backend
- Node.js 18+
- Express.js
- TypeScript
- SQLite (Sequelize ORM)
- JWT authentication
- bcryptjs

## 📦 Deployment

### Deploy to Vercel

#### Frontend
```bash
cd new
vercel
```

#### Backend
```bash
cd backend
vercel
```

Make sure to set environment variables in Vercel dashboard:
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `DATABASE_URL` (use PostgreSQL for production)

## 🗃️ Database

### Development
Uses SQLite for easy local development.

### Production
Recommended: PostgreSQL on:
- Vercel Postgres
- Supabase
- Railway
- Neon

Update `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

## 🔒 Environment Variables

### Frontend (`new/.env`)
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Backend (`backend/.env`)
```env
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
FRONTEND_URL=https://your-frontend.vercel.app
```

## 📖 API Endpoints

Base URL: `http://localhost:5000/api/v1`

### Authentication
- `POST /auth/register` - Register user
- `POST /auth/login` - Login
- `GET /auth/profile` - Get profile

### Courses
- `GET /courses` - List all courses
- `GET /courses/:id` - Get course details
- `POST /courses/:id/enroll` - Enroll in course

### Progress
- `GET /progress/dashboard` - Dashboard data
- `GET /progress/stats` - User statistics
- `POST /progress/lesson/:id` - Update progress

Full API documentation: `backend/README.md`

## 🎮 Gamification System

- **XP Rewards**: Earn XP for completing lessons, quizzes
- **Levels**: Level up based on total XP
- **Streaks**: Daily login streaks with rewards
- **Achievements**: Unlock badges for milestones

Level formula: `Level = floor(sqrt(XP / 100))`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

Jonathan Mulondo
- Email: jonathanmulondoj@gmail.com
- GitHub: [@jonathanmulondo](https://github.com/jonathanmulondo)

## 🙏 Acknowledgments

- shadcn/ui for the beautiful component library
- Unsplash for images
- The Arduino community

---

**Built with ❤️ for engineering education**
