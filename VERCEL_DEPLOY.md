# 🚀 Deploy to Vercel - Step by Step Guide

## Method 1: GitHub + Vercel (Recommended - 5 minutes)

### Step 1: Push to GitHub
```bash
# If you haven't initialized git yet
git init
git add .
git commit -m "Initial commit - Clay Resume Optimizer"

# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/clay-resume-optimizer.git
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your GitHub repo
5. Click **"Import"**

### Step 3: Configure Project
Vercel will auto-detect Vite, but verify:
- **Framework Preset**: Vite ✅
- **Root Directory**: `./` ✅
- **Build Command**: `npm run build` ✅
- **Output Directory**: `dist` ✅
- **Install Command**: `npm install` ✅

### Step 4: Add Environment Variables (CRITICAL!)
Before clicking Deploy, click **"Environment Variables"**:

```
Name: VITE_CLAUDE_API_KEY
Value: [Your Claude API Key from Anthropic Console]

(Optional)
Name: VITE_CLAUDE_API_VERSION  
Value: 2024-02-15-preview

(Optional)
Name: VITE_CLAUDE_MODEL
Value: claude-3-5-sonnet-20241022
```

⚠️ **Important**: 
- Add to **Production**, **Preview**, AND **Development** environments
- Click "Add" for each variable

### Step 5: Deploy
1. Click **"Deploy"**
2. Wait 1-2 minutes for build
3. Your app is live! 🎉

---

## Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
cd /Users/admin/claynov
vercel

# Follow prompts:
# - Link to existing project? No (first time)
# - Project name? clay-resume-optimizer
# - Directory? ./
# - Override settings? No

# Add environment variables
vercel env add VITE_CLAUDE_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

---

## 🔍 **Verify Deployment**

### Check These:
1. ✅ App loads without errors
2. ✅ File upload works
3. ✅ API calls work (check browser console)
4. ✅ Mobile responsive
5. ✅ Footer credit shows correctly

### Test Checklist:
- [ ] Upload a PDF resume
- [ ] Paste job description
- [ ] Click optimize (should call Claude API)
- [ ] Download works
- [ ] Before/After section displays
- [ ] Emojis show correctly (4 professional emojis)
- [ ] CTA scroll works

---

## 🐛 **Troubleshooting**

### Build Fails
**Error**: "Module not found" or dependency errors
**Fix**: 
```bash
# Locally, ensure this works:
npm run build

# If it fails, check package.json and node_modules
rm -rf node_modules package-lock.json
npm install
npm run build
```

### API Not Working
**Error**: "Claude API key not configured"
**Fix**:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_CLAUDE_API_KEY` is set
3. Make sure it's added to **Production** environment
4. Redeploy (environment changes require new deploy)

### 404 Errors on Refresh
**Already Fixed**: `vercel.json` has rewrites configured ✅

### Bundle Too Large
**Warning**: "Some chunks are larger than 500 kB"
**Solution**: Acceptable for MVP, optimize later with code splitting

---

## 📊 **Post-Deployment**

### 1. Update README
Add your live URL to README.md:
```markdown
## 🌐 Live Demo
Visit: https://your-project.vercel.app
```

### 2. Monitor Performance
- Check Vercel Analytics (built-in)
- Monitor API usage in Anthropic Console
- Set up error tracking (optional)

### 3. Custom Domain (Optional)
1. Vercel Dashboard → Project → Settings → Domains
2. Add your domain
3. Update DNS records
4. Vercel auto-configures SSL

---

## ✅ **Deployment Checklist**

- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Environment variables added (`VITE_CLAUDE_API_KEY`)
- [ ] Build successful
- [ ] App loads in browser
- [ ] API calls work
- [ ] Mobile tested
- [ ] Footer credit shows

---

## 🎉 **You're Done!**

Your app is now live at: `https://your-project.vercel.app`

Share it with the world! 🌍

