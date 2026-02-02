# 🚀 COMPLETE RENDER DEPLOYMENT GUIDE

## ⚡ QUICK START (5 Minutes)

### Step 1: Create GitHub Repository
1. Go to **https://github.com/new**
2. Repository name: `portfolio`
3. Click **Create repository**
4. Copy the HTTPS URL

### Step 2: Push Your Code
```powershell
cd "c:\Users\sonuk\Desktop\Portfolio\profile"
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy Frontend on Render

**URL:** https://render.com

1. Click **New +** → **Web Service**
2. Select GitHub repo: `portfolio`
3. Fill in:
   ```
   Name: portfolio-frontend
   Root Directory: profile/
   Environment: Node
   Build Command: npm run build
   Start Command: npm run preview
   ```
4. Click **Create Web Service**
5. ⏳ Wait 2-3 minutes
6. **Copy your frontend URL** (looks like: `https://portfolio-frontend.onrender.com`)

### Step 4: Deploy Backend on Render

1. **New +** → **Web Service**
2. Select same repo: `portfolio`
3. Fill in:
   ```
   Name: portfolio-backend
   Root Directory: profile/
   Environment: Node
   Build Command: npm install
   Start Command: npm run server
   ```
4. **Add Environment Variables:**
   - `PORT` = `5000`
5. Click **Create Web Service**
6. **Copy your backend URL** (looks like: `https://portfolio-backend.onrender.com`)

### Step 5: Connect Frontend to Backend

1. Go to **portfolio-frontend** service
2. Go to **Settings** → **Environment**
3. Add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://portfolio-backend.onrender.com`
4. Click **Save** (auto-redeploys in 1-2 min)

---

## 🎉 DONE!

Your portfolio is now live:
- **🌐 Website:** `https://portfolio-frontend.onrender.com`
- **🔗 API:** `https://portfolio-backend.onrender.com/api/contact`

---

## 📝 What's Included

✅ React Frontend (Vite)  
✅ Node.js Backend (Express)  
✅ Contact Form with Email Support  
✅ Dark/Light Theme Toggle  
✅ Mobile Responsive  
✅ Animations & Effects  

---

## 🔧 Environment Variables Reference

### Frontend (portfolio-frontend)
```
VITE_API_URL=https://portfolio-backend.onrender.com
```

### Backend (portfolio-backend)
```
PORT=5000
SMTP_HOST=smtp.gmail.com (optional)
SMTP_PORT=587 (optional)
SMTP_USER=your_email@gmail.com (optional)
SMTP_PASS=your_app_password (optional)
FROM_EMAIL=your_email@gmail.com (optional)
TO_EMAIL=your_email@gmail.com (optional)
```

---

## 💡 Tips & Troubleshooting

### Issue: 502 Bad Gateway
- Check backend logs on Render dashboard
- Ensure `npm run server` starts successfully

### Issue: Contact form not working
- Verify `VITE_API_URL` is set on frontend
- Check backend logs for errors

### Issue: Build fails
- Click on service → Logs
- Check error messages
- Ensure `npm install` runs successfully

### Performance: Slow first load
- Free tier has cold starts (30-50 seconds)
- Upgrade to Starter plan for faster response

---

## 🔄 Auto-Deploy Setup

Every time you push to GitHub, Render automatically:
1. Pulls latest code
2. Runs build commands
3. Deploys new version

Just push and wait 2-3 minutes!

```powershell
git add .
git commit -m "your message"
git push
```

---

## 📧 Setup Email (Optional)

To enable contact form emails:

1. Get Gmail App Password:
   - Go to **accounts.google.com/account/security**
   - Enable 2-Factor Authentication
   - Generate App Password
   - Copy the 16-character password

2. Add to Backend Environment:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_16_char_app_password
   FROM_EMAIL=your_email@gmail.com
   TO_EMAIL=your_email@gmail.com
   ```

3. Redeploy backend → Test contact form

---

## 🎯 Project Structure

```
portfolio/
├── profile/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   ├── ThemeContext.jsx
│   │   └── index.css
│   ├── server/
│   │   └── index.js (Express backend)
│   ├── dist/ (built files)
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
└── README.md
```

---

## ✨ Features

- **Dark/Light Theme** - Toggle in navbar
- **Responsive Design** - Mobile, tablet, desktop
- **Smooth Animations** - Framer Motion
- **Contact Form** - Working backend API
- **Skills Filter** - Search skills
- **Project Showcase** - GitHub integration ready
- **Testimonials** - Dynamic components
- **Timeline** - Experience section

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Vite Docs:** https://vitejs.dev
- **Express Docs:** https://expressjs.com

---

**Happy Deploying! 🚀**
