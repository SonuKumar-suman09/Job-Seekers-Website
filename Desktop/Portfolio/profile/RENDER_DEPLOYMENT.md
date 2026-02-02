# Render Deployment Guide

## 📋 Prerequisites
- Render account (free at https://render.com)
- GitHub account with your repo

## 🚀 Step 1: Push to GitHub

```bash
# Add your GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Deploy Frontend (React App) on Render

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. Click **New +** → **Web Service**
3. **Connect GitHub Repository**
   - Search for your portfolio repo
   - Click "Connect"
4. **Configure Deployment:**
   - **Name:** portfolio-frontend
   - **Root Directory:** `profile/`
   - **Environment:** Node
   - **Build Command:** `npm run build`
   - **Start Command:** `npm preview` (or just `npm run preview`)
   - **Plan:** Free (or Starter)
5. Click **Create Web Service**
6. Wait for deployment (2-3 minutes)
7. You'll get a URL like: `https://portfolio-frontend.onrender.com`

## 🔧 Step 3: Deploy Backend (Node.js API) on Render

1. **Go to Render Dashboard**
2. Click **New +** → **Web Service**
3. **Connect same GitHub Repository**
4. **Configure Deployment:**
   - **Name:** portfolio-backend
   - **Root Directory:** `profile/`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm run server`
   - **Plan:** Free
5. **Add Environment Variables:**
   ```
   PORT=5000
   SMTP_HOST=smtp.gmail.com       (optional - for emails)
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   FROM_EMAIL=your_email@gmail.com
   TO_EMAIL=your_email@gmail.com
   ```
6. Click **Create Web Service**
7. You'll get a URL like: `https://portfolio-backend.onrender.com`

## 🔗 Step 4: Connect Frontend to Backend

Update your frontend config to use the backend URL:

In `src/` or `vite.config.js`, update the API proxy:

```javascript
// If using env variables
const API_URL = process.env.VITE_API_URL || 'https://portfolio-backend.onrender.com';
```

Or in your contact form/API calls:
```javascript
const res = await fetch('https://portfolio-backend.onrender.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});
```

## ✅ Final Steps

1. **Test your site:** Visit your frontend URL
2. **Test contact form:** Make sure emails work (if SMTP configured)
3. **Custom Domain (Optional):**
   - On Render dashboard, go to frontend service → Settings
   - Add custom domain under "Custom Domain"
4. **Auto-deploy:** Push to GitHub to auto-deploy changes

## 🎯 Troubleshooting

- **502 Bad Gateway:** Check backend logs on Render dashboard
- **Contact form not working:** Verify API URL and SMTP settings
- **Build fails:** Check build logs in Render dashboard
- **Free tier cold starts:** Expect 30-50 second startup time on first request

## 📱 Your URLs
- **Frontend:** `https://portfolio-frontend.onrender.com`
- **Backend API:** `https://portfolio-backend.onrender.com/api/contact`
