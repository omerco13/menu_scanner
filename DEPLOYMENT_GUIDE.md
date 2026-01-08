# Deployment Guide - Menu Scanner

This guide walks you through deploying your Menu Scanner application to production using **Render** for the backend and **Vercel** for the frontend.

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- OpenAI API key (for OCR functionality)

---

## Part 1: Backend Deployment on Render

### Step 1: Push Code to Git Repository

If you haven't already, initialize a git repository and push your code:

```bash
cd c:\omer\projects\project3
git init
git add .
git commit -m "Initial commit - Menu Scanner application"
git remote add origin <your-repo-url>
git push -u origin main
```

### Step 2: Create a Render Account

1. Go to https://render.com
2. Sign up using GitHub/GitLab (recommended for easy repo connection)

### Step 3: Create PostgreSQL Database

1. From Render dashboard, click **"New +"** → **"PostgreSQL"**
2. Configure database:
   - **Name**: `menu-scanner-db`
   - **Database**: `menu_scanner`
   - **User**: `menu_scanner_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
3. Click **"Create Database"**
4. **IMPORTANT**: Copy the **Internal Database URL** (starts with `postgres://`) - you'll need this

### Step 4: Create Web Service for Backend

1. From Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your Git repository
3. Configure the service:
   - **Name**: `menu-scanner-backend` (or your preferred name)
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `./build.sh`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan**: Free (or paid for production)

4. **Environment Variables** - Add these:
   - `DATABASE_URL`: Paste the Internal Database URL from Step 3
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `FRONTEND_URL`: Leave blank for now (we'll update after deploying frontend)
   - `PYTHON_VERSION`: `3.11.0`

5. Click **"Create Web Service"**

6. Wait for deployment to complete (5-10 minutes)

7. **Copy your backend URL** (e.g., `https://menu-scanner-backend.onrender.com`)

### Step 5: Update Backend Environment Variable

1. Go back to your Render backend service
2. Navigate to **Environment** tab
3. Update `FRONTEND_URL` with your future Vercel URL format: `https://your-app-name.vercel.app`
   - (You can update this later with the actual URL)

---

## Part 2: Frontend Deployment on Vercel

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up using GitHub (recommended)

### Step 2: Deploy Frontend

1. From Vercel dashboard, click **"Add New"** → **"Project"**
2. Import your Git repository
3. Configure the project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)

4. **Environment Variables** - Add this:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Render backend URL from Part 1, Step 4.7
     - Example: `https://menu-scanner-backend.onrender.com`

5. Click **"Deploy"**

6. Wait for deployment (2-5 minutes)

7. **Copy your frontend URL** (e.g., `https://menu-scanner.vercel.app`)

### Step 3: Update Backend CORS Settings

1. Go back to Render dashboard
2. Open your backend service
3. Go to **Environment** tab
4. Update `FRONTEND_URL` with your actual Vercel URL from Step 2.7
5. Click **"Save Changes"**
6. Wait for automatic redeploy

---

## Part 3: Verify Deployment

### Test Backend

1. Open your backend URL in browser: `https://menu-scanner-backend.onrender.com`
2. You should see: `{"message":"Menu Scanner API is running (Using: OpenAI Vision)"}`

### Test Frontend

1. Open your frontend URL: `https://menu-scanner.vercel.app`
2. Try uploading a menu image
3. Verify the menu is processed and displayed correctly
4. Check that saved menus are persisted (refresh page and see if they're still there)

---

## Part 4: Post-Deployment Configuration

### Domain Setup (Optional)

**For Vercel (Frontend):**
1. Go to Vercel project settings → **Domains**
2. Add your custom domain (e.g., `menusnap.com`)
3. Follow DNS configuration instructions
4. Update `FRONTEND_URL` in Render backend environment

**For Render (Backend):**
1. Go to Render service settings → **Custom Domain**
2. Add your custom domain (e.g., `api.menusnap.com`)
3. Update `NEXT_PUBLIC_API_URL` in Vercel environment

### Environment Variable Management

**Backend (.env) - DO NOT commit to Git:**
```env
DATABASE_URL=<provided-by-render>
OPENAI_API_KEY=<your-key>
FRONTEND_URL=https://your-app.vercel.app
```

**Frontend (.env.local) - DO NOT commit to Git:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

### Security Best Practices

1. **Never commit `.env` files** - Add to `.gitignore`:
   ```gitignore
   backend/.env
   frontend/.env.local
   backend/menus.db
   backend/uploads/
   ```

2. **Rotate API keys periodically** - Update in Render/Vercel dashboards

3. **Monitor usage** - Check OpenAI API usage to avoid unexpected charges

4. **Set up alerts** - Configure Render/Vercel to notify you of deployment failures

---

## Troubleshooting

### Backend Issues

**Database Connection Error:**
- Verify `DATABASE_URL` is correct in Render environment
- Check database is running on Render dashboard
- Ensure URL format is `postgresql://` not `postgres://` (code handles this automatically)

**CORS Error:**
- Verify `FRONTEND_URL` matches your Vercel URL exactly
- Check Render logs: Service → Logs tab
- Make sure no trailing slash in URL

**OCR Not Working:**
- Verify `OPENAI_API_KEY` is set correctly
- Check OpenAI account has credits
- Review Render logs for API errors

### Frontend Issues

**API Calls Failing:**
- Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Check backend is running: visit backend URL directly
- Open browser console for error messages

**Environment Variable Not Working:**
- In Vercel, go to Settings → Environment Variables
- Ensure variable name is exactly `NEXT_PUBLIC_API_URL`
- Redeploy after adding/changing variables

**Build Failing:**
- Check Vercel build logs
- Ensure all dependencies in `package.json`
- Verify Node.js version compatibility

### View Logs

**Render Logs:**
- Dashboard → Your Service → Logs tab
- Shows real-time backend errors

**Vercel Logs:**
- Dashboard → Your Project → Deployments → Click deployment → View Function Logs
- Shows build and runtime errors

---

## Updating Your Application

### Backend Updates

1. Push changes to Git:
   ```bash
   git add .
   git commit -m "Update backend"
   git push
   ```
2. Render automatically rebuilds and redeploys

### Frontend Updates

1. Push changes to Git:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```
2. Vercel automatically rebuilds and redeploys

### Manual Redeploy

**Render:** Dashboard → Service → Manual Deploy → Deploy latest commit

**Vercel:** Dashboard → Project → Deployments → Click "..." → Redeploy

---

## Cost Estimates

### Free Tier Limits

**Render Free Tier:**
- 750 hours/month (enough for one always-on service)
- PostgreSQL: 90 days free, then $7/month
- Backend spins down after 15 minutes of inactivity (cold starts take 30-60 seconds)

**Vercel Free Tier:**
- 100 GB bandwidth/month
- Unlimited deployments
- Serverless function executions included

**OpenAI API:**
- Vision API: ~$0.01-0.03 per image
- Estimate: ~$5-10/month for moderate use

### Paid Recommendations for Production

- **Render Starter Plan:** $7/month (no spin down)
- **Render PostgreSQL:** $7/month (persistent beyond 90 days)
- **Vercel Pro:** $20/month (more bandwidth, better support)

---

## Next Steps

1. **Set up monitoring** - Use Render metrics and Vercel analytics
2. **Add error tracking** - Consider Sentry or similar
3. **Set up backups** - Schedule PostgreSQL backups on Render
4. **Add testing** - Set up CI/CD with GitHub Actions
5. **Performance optimization** - Add caching, CDN, image optimization

---

## Support

- **Render Documentation:** https://render.com/docs
- **Vercel Documentation:** https://vercel.com/docs
- **FastAPI Documentation:** https://fastapi.tiangolo.com
- **Next.js Documentation:** https://nextjs.org/docs

---

## Quick Reference

| Component | Platform | URL Format |
|-----------|----------|------------|
| Backend API | Render | `https://your-service.onrender.com` |
| Frontend | Vercel | `https://your-app.vercel.app` |
| Database | Render | Internal PostgreSQL |

**Environment Variables:**

Backend (Render):
- `DATABASE_URL` - Auto from PostgreSQL service
- `OPENAI_API_KEY` - Your OpenAI key
- `FRONTEND_URL` - Your Vercel URL

Frontend (Vercel):
- `NEXT_PUBLIC_API_URL` - Your Render backend URL

---

🎉 **Congratulations!** Your Menu Scanner application is now live in production!
