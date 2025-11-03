# 🔍 Debug Blank Screen on Vercel

## Common Causes:

### 1. **Missing Files on GitHub**
Make sure these are uploaded:
- ✅ `src/App.jsx`
- ✅ `src/index.css`
- ✅ `src/main.jsx`
- ✅ `src/utils/auth.js`
- ✅ `src/utils/mockApi.js`
- ✅ `src/utils/fileParser.js`
- ✅ `src/utils/claudeApi.js`
- ✅ `src/utils/resumeGenerator.js`
- ✅ `index.html`
- ✅ `package.json`

### 2. **Check Vercel Build Logs**
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click on latest deployment
5. Click "View Build Logs"
6. Look for **red error messages**

### 3. **Browser Console Errors**
1. Open your Vercel URL
2. Press F12 (or Right-click → Inspect)
3. Go to **Console** tab
4. Look for red errors
5. **Share the error message** - that will tell us exactly what's wrong!

### 4. **Common Errors:**

**"Module not found"**
→ Missing file on GitHub

**"Cannot read property of undefined"**
→ Runtime error in code

**"Parsing error"**
→ Syntax error in JavaScript

**"Failed to load module"**
→ Import path wrong or file missing

---

## Quick Fix Checklist:

- [ ] All files uploaded to GitHub (especially `src/App.jsx`)
- [ ] Check Vercel build logs for errors
- [ ] Check browser console for runtime errors
- [ ] Verify `index.html` is in root of GitHub repo

---

## Most Likely Issue:

Since build works locally, it's probably:
1. **Missing file on GitHub** - Check that all `src/utils/*.js` files are there
2. **Runtime error** - Check browser console for specific error

**Share the error from browser console or Vercel logs and I'll fix it!**


