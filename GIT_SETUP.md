# Git Setup - Quick Guide

## ✅ Git is Already Initialized!

Your repository is ready. Here's what to do next:

## Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon → **"New repository"**
3. Repository name: `clay-resume-optimizer` (or any name you like)
4. Description: "AI-powered resume optimizer built with React and Claude AI"
5. Choose **Public** or **Private**
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click **"Create repository"**

## Step 2: Connect and Push

After creating the repo, GitHub will show you commands. Use these:

```bash
cd /Users/admin/claynov

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/clay-resume-optimizer.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Or if you prefer SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/clay-resume-optimizer.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

Once pushed to GitHub:
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variable: `VITE_CLAUDE_API_KEY`
4. Deploy!

See `VERCEL_DEPLOY.md` for detailed instructions.

---

## Troubleshooting

### If you get authentication errors:
```bash
# Check your remote
git remote -v

# Update if needed
git remote set-url origin https://github.com/YOUR_USERNAME/clay-resume-optimizer.git
```

### If files are missing:
```bash
git add .
git commit -m "Add missing files"
git push
```

