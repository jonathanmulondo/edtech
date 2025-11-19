# Deployment Guide - EngiLearn

Complete guide to deploy EngiLearn to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at https://vercel.com
2. **GitHub Connection**: Connect your GitHub account to Vercel
3. **Database**: Set up a PostgreSQL database (for production)

---

## Option 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Import Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select `jonathanmulondo/edtech`
4. Vercel will detect it as a monorepo

### Step 2: Configure Frontend Deployment

1. **Project Name**: `engilearn-frontend`
2. **Framework Preset**: Vite
3. **Root Directory**: `new`
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

**Environment Variables**:
```
VITE_API_URL=https://your-backend.vercel.app/api/v1
```

Click **Deploy**

### Step 3: Configure Backend Deployment

1. Create a new project in Vercel
2. Import the same repository: `jonathanmulondo/edtech`
3. **IMPORTANT: Set Root Directory to `backend`** ⚠️
4. **Project Name**: `engilearn-backend`
5. **Framework Preset**: Other (or Node.js)
6. **Root Directory**: `backend` ← **MUST BE SET**
7. **Build Command**: `tsc` (or leave default)
8. **Output Directory**: Leave empty
9. **Install Command**: `npm install`

**Environment Variables** (IMPORTANT):
```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-CHANGE-THIS
JWT_REFRESH_SECRET=your-refresh-secret-CHANGE-THIS
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=https://your-frontend.vercel.app
DATABASE_URL=postgresql://user:password@host:5432/database
```

Click **Deploy**

---

## Option 2: Deploy via Vercel CLI

### Install Vercel CLI

```bash
npm install -g vercel
```

### Login to Vercel

```bash
vercel login
```

### Deploy Frontend

```bash
cd new
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# What's your project's name? engilearn-frontend
# In which directory is your code located? ./
```

### Deploy Backend

```bash
cd ../backend
vercel

# Follow prompts:
# Set up and deploy? Yes
# Which scope? Your account
# Link to existing project? No
# What's your project's name? engilearn-backend
# In which directory is your code located? ./
```

### Set Environment Variables (Backend)

```bash
# In backend directory
vercel env add JWT_SECRET
# Enter: your-super-secret-key

vercel env add JWT_REFRESH_SECRET
# Enter: your-refresh-secret

vercel env add FRONTEND_URL
# Enter: https://your-frontend.vercel.app

vercel env add DATABASE_URL
# Enter: postgresql://...
```

### Redeploy with Environment Variables

```bash
vercel --prod
```

---

## Database Setup (Production)

### Option 1: Vercel Postgres (Easiest)

1. Go to your backend project in Vercel Dashboard
2. Click "Storage" tab
3. Click "Create Database"
4. Select "Postgres"
5. Create database
6. Copy connection string
7. Add to environment variables as `DATABASE_URL`

### Option 2: Supabase (Free Tier Available)

1. Go to https://supabase.com
2. Create new project
3. Get connection string from Settings → Database
4. Format: `postgresql://postgres:[password]@[host]:5432/postgres`
5. Add to Vercel environment variables

### Option 3: Railway

1. Go to https://railway.app
2. Create new PostgreSQL database
3. Copy connection string
4. Add to Vercel environment variables

### Option 4: Neon (Serverless Postgres)

1. Go to https://neon.tech
2. Create new project
3. Get connection string
4. Add to Vercel environment variables

---

## Update Backend for Production

After database is set up, you need to run migrations:

### One-Time Setup Script

Create `backend/src/scripts/migrate.ts`:

```typescript
import { connectDB } from '../config/database';
import sequelize from '../config/database';

async function migrate() {
  try {
    await connectDB();
    await sequelize.sync({ force: false });
    console.log('✅ Database migrated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
```

Add to `package.json`:
```json
{
  "scripts": {
    "migrate": "ts-node src/scripts/migrate.ts"
  }
}
```

Run locally with production database URL:
```bash
DATABASE_URL=postgresql://... npm run migrate
```

---

## Post-Deployment Steps

### 1. Update Frontend Environment

After backend is deployed, update frontend environment variable:

```bash
# In Vercel dashboard for frontend project
VITE_API_URL=https://engilearn-backend.vercel.app/api/v1
```

Redeploy frontend.

### 2. Seed Production Database

**Option A**: Via Vercel CLI
```bash
cd backend
vercel env pull .env.production
DATABASE_URL=$(cat .env.production | grep DATABASE_URL | cut -d '=' -f2) npm run seed
```

**Option B**: Create an admin endpoint (temporary)
```typescript
// backend/src/routes/admin.ts
router.post('/seed', async (req, res) => {
  const { secret } = req.body;
  if (secret !== process.env.ADMIN_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Run seed logic
  // Delete this endpoint after use
});
```

### 3. Test Deployment

Visit your deployed URLs:
- Frontend: `https://engilearn-frontend.vercel.app`
- Backend Health: `https://engilearn-backend.vercel.app/health`
- Backend API: `https://engilearn-backend.vercel.app/api/v1`

Test login with:
- Email: `alex@student.com`
- Password: `password123`

---

## Custom Domain Setup (Optional)

### Add Custom Domain

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., `engilearn.com`)
3. Follow Vercel's DNS configuration instructions
4. Update environment variables with new domain

**Frontend**:
```
VITE_API_URL=https://api.engilearn.com/api/v1
```

**Backend**:
```
FRONTEND_URL=https://engilearn.com
```

---

## Environment Variables Reference

### Frontend (.env)
```env
VITE_API_URL=https://your-backend.vercel.app/api/v1
```

### Backend (.env)
```env
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:5432/database

# JWT Secrets (CHANGE THESE!)
JWT_SECRET=use-a-very-long-random-string-here-min-32-chars
JWT_REFRESH_SECRET=another-very-long-random-string-here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
FRONTEND_URL=https://your-frontend.vercel.app
```

### Generate Secure Secrets

```bash
# On Linux/Mac
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Troubleshooting

### Backend Deployment Issues

**Problem**: Build fails
**Solution**: Check `vercel.json` is correct and TypeScript compiles locally

**Problem**: Database connection fails
**Solution**: Verify `DATABASE_URL` is correct and database is accessible

**Problem**: 502 Bad Gateway
**Solution**: Check server logs in Vercel dashboard, ensure `src/app.ts` exports the Express app

### Frontend Deployment Issues

**Problem**: API calls fail
**Solution**: Check CORS settings in backend and `VITE_API_URL` environment variable

**Problem**: 404 on routes
**Solution**: Ensure `vercel.json` has correct routing configuration

### Database Issues

**Problem**: Tables don't exist
**Solution**: Run migrations or seed script

**Problem**: Connection timeout
**Solution**: Check database is running and connection string is correct

---

## Monitoring & Logs

### View Logs

1. **Vercel Dashboard**: Go to your project → Deployments → Click deployment → Runtime Logs
2. **Vercel CLI**: `vercel logs [deployment-url]`

### Set Up Monitoring

1. **Vercel Analytics**: Enable in project settings
2. **Sentry** (recommended for errors):
   ```bash
   npm install @sentry/node @sentry/tracing
   ```

3. **Uptime Monitoring**: Use UptimeRobot or Pingdom

---

## Cost Estimates

### Free Tier Limits (Vercel)
- 100 GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- 6,000 serverless function execution hours/month

### Typical Monthly Costs
- **Vercel (Free)**: $0
- **Vercel Pro** (if needed): $20/month
- **Database (Supabase Free)**: $0 (up to 500MB)
- **Database (Supabase Pro)**: $25/month
- **Total (Free Tier)**: $0
- **Total (Pro)**: $20-45/month

---

## Production Checklist

- [ ] Backend deployed to Vercel
- [ ] Frontend deployed to Vercel
- [ ] PostgreSQL database created
- [ ] Environment variables set (both projects)
- [ ] Database migrated/seeded
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active (automatic via Vercel)
- [ ] CORS configured correctly
- [ ] Test user account created
- [ ] Error monitoring set up (Sentry)
- [ ] Analytics enabled
- [ ] Logs checked for errors

---

## Useful Commands

```bash
# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls

# Roll back deployment
vercel rollback

# Remove project
vercel remove [project-name]

# Environment variables
vercel env ls
vercel env add [name]
vercel env rm [name]
```

---

## Support

If you encounter issues:

1. Check Vercel documentation: https://vercel.com/docs
2. Check deployment logs in Vercel dashboard
3. Verify all environment variables are set
4. Test backend health endpoint
5. Check database connection

---

**Your EngiLearn platform is now live! 🚀**

Frontend: https://[your-app].vercel.app
Backend API: https://[your-backend].vercel.app/api/v1
