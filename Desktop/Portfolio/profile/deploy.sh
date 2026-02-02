#!/bin/bash
# Sonu's Portfolio - Automated Render Deployment Script

echo "======================================"
echo "🚀 Portfolio Deployment to Render"
echo "======================================"
echo ""

# Step 1: Verify GitHub repo
echo "📋 Step 1: Setting up GitHub..."
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/portfolio.git): " GITHUB_REPO

if [ -z "$GITHUB_REPO" ]; then
    echo "❌ GitHub URL cannot be empty!"
    exit 1
fi

# Step 2: Add remote and push
echo ""
echo "📤 Pushing code to GitHub..."
git remote remove origin 2>/dev/null
git remote add origin "$GITHUB_REPO"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub successfully!"
else
    echo "❌ Failed to push to GitHub. Check your URL and credentials."
    exit 1
fi

echo ""
echo "======================================"
echo "✅ GITHUB SETUP COMPLETE!"
echo "======================================"
echo ""
echo "📋 NEXT STEPS ON RENDER:"
echo ""
echo "1. Go to: https://render.com"
echo "2. Sign up free (or login)"
echo "3. Click: New + → Web Service"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 FRONTEND DEPLOYMENT:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Name: portfolio-frontend"
echo "Root Directory: profile/"
echo "Build Command: npm run build"
echo "Start Command: npm run preview"
echo "Plan: Free"
echo ""
echo "Environment Variable:"
echo "VITE_API_URL = https://portfolio-backend.onrender.com"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔧 BACKEND DEPLOYMENT:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Name: portfolio-backend"
echo "Root Directory: profile/"
echo "Build Command: npm install"
echo "Start Command: npm run server"
echo "Plan: Free"
echo ""
echo "Environment Variables:"
echo "PORT = 5000"
echo ""
echo "======================================"
echo "✅ YOUR GITHUB REPO:"
echo "$GITHUB_REPO"
echo "======================================"
