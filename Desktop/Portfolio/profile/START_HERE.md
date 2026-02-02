# 🚀 START HERE - Portfolio Deployment Guide

Welcome! Your portfolio is **100% ready to deploy**. Follow these simple steps.

---

## ⚡ 5-MINUTE DEPLOYMENT

### Step 1: Create GitHub Repository (2 min)
```
1. Go to: https://github.com/new
2. Name: portfolio
3. Make it Public
4. Copy the HTTPS URL (you'll need this)
```

### Step 2: Push Your Code (1 min)
```powershell
cd "c:\Users\sonuk\Desktop\Portfolio\profile"
git remote add origin [PASTE_YOUR_GITHUB_URL_HERE]
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Render (2 min)
```
1. Go to: https://render.com
2. Sign up free (use GitHub)
3. See "Step-by-Step Instructions" below
```

---

## 📋 Step-by-Step Instructions

### DEPLOY FRONTEND

1. On Render: **New +** → **Web Service**
2. Connect GitHub → Select `portfolio`
3. Fill in:
   ```
   Name: portfolio-frontend
   Root Directory: profile/
   Build Command: npm run build
   Start Command: npm run preview
   Plan: Free
   ```
4. Click **Create Web Service**
5. ⏳ Wait 2-3 minutes
6. **Copy your frontend URL** (you'll need this for step 6)

### DEPLOY BACKEND

1. On Render: **New +** → **Web Service**
2. Same repo: `portfolio`
3. Fill in:
   ```
   Name: portfolio-backend
   Root Directory: profile/
   Build Command: npm install
   Start Command: npm run server
   Plan: Free
   ```
4. **Environment Variables** → Add:
   ```
   PORT: 5000
   ```
5. Click **Create Web Service**
6. **Copy your backend URL** (you'll need this for step 7)

### CONNECT THEM TOGETHER

1. Go to **portfolio-frontend** service
2. **Settings** → **Environment**
3. Add new variable:
   ```
   VITE_API_URL: [PASTE_BACKEND_URL_HERE]
   ```
4. Click **Save**
5. ⏳ Auto-redeploys in 1-2 minutes

---

## ✅ Done!

Your portfolio is now LIVE:
- **Website:** `https://portfolio-frontend.onrender.com`
- **API:** `https://portfolio-backend.onrender.com/api/contact`

---

## 📖 Need More Help?

Pick a guide based on what you need:

- **DEPLOY_NOW.txt** - Quick reference with all info
- **DEPLOYMENT_COMPLETE.md** - Full guide with tips & troubleshooting
- **DEPLOYMENT_CHECKLIST.txt** - Detailed step-by-step checklist
- **RENDER_DEPLOYMENT.md** - Render-specific instructions

---

## 💡 Quick Tips

- **First load slow?** → Normal on free tier (cold start)
- **Want emails?** → Add SMTP settings to backend environment
- **Auto-deploy?** → Push to GitHub and Render deploys automatically
- **Custom domain?** → Upgrade to Starter plan ($12/mo)

---

## 🎯 Auto-Deploy After First Deployment

From now on, just push to GitHub and it automatically deploys:
```powershell
git add .
git commit -m "your changes"
git push
```

That's it! 🚀

---

**Happy deploying!** Your portfolio is production-ready! 🎉
