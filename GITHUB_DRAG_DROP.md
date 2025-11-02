# Upload to GitHub via Browser (Drag & Drop)

## Simple Method - No Git Commands Needed!

### Step 1: Create Repository on GitHub
1. Go to [github.com](https://github.com) and sign in
2. Click the **"+"** icon (top right) → **"New repository"**
3. Name: `clay-resume-optimizer`
4. Description: "AI-powered resume optimizer"
5. Choose **Public** or **Private**
6. **DO NOT** check any boxes (no README, .gitignore, or license)
7. Click **"Create repository"**

### Step 2: Upload Files
1. On the new repository page, click **"uploading an existing file"** link
   (It appears as a blue link near the top)
   
2. Open Finder on your Mac and navigate to:
   `/Users/admin/claynov`

3. Select ALL files and folders:
   - Select all files (Cmd+A)
   - Drag them into the GitHub browser window
   
   **Or select individually:**
   - `.gitignore`
   - `.vercelignore`
   - `CODE_REVIEW.md`
   - `DEPLOY.md`
   - `GIT_SETUP.md`
   - `index.html`
   - `package.json`
   - `package-lock.json`
   - `postcss.config.js`
   - `README.md`
   - `tailwind.config.js`
   - `vercel.json`
   - `vite.config.js`
   - `env.example`
   - `src/` folder (drag the entire folder)
   - Any other files

4. Scroll down and click **"Commit changes"**

5. Add commit message: `Initial commit - Clay Resume Optimizer`

6. Click **"Commit changes"**

### Step 3: Deploy to Vercel
Once files are on GitHub:
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variable: `VITE_CLAUDE_API_KEY`
5. Deploy!

---

## Note:
This method creates the repo without git history, which is fine for getting started. If you want to use git commands later, you can always:
```bash
git remote add origin YOUR_REPO_URL
git pull origin main --allow-unrelated-histories
```

