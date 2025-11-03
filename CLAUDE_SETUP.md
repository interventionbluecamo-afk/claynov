# 🚀 Quick Start: Get Claude AI Working

## Current Status
- ✅ App is ready for Claude API
- ✅ Code checks for API key automatically
- ❌ **API key not set yet** (that's what we'll do now)

---

## Step 1: Get Your Claude API Key (5 minutes)

### A. If You Already Have an Account:
1. Go to: **https://console.anthropic.com/**
2. Click **"API Keys"** in the left sidebar
3. Click **"Create Key"**
4. Name it: "Clay Resume Optimizer"
5. **Copy the key** (starts with `sk-ant-...`)

### B. If You Need to Sign Up:
1. Go to: **https://console.anthropic.com/signup**
2. Sign up with your email
3. Verify email
4. Go to **API Keys** → **Create Key**
5. **Copy the key**

💡 **Pro Tip**: New accounts often get $5-10 in free credits to start!

---

## Step 2: Add API Key to Your Project

### Quick Method (I'll help you):
Just tell me your API key and I'll add it for you.

### Or Do It Manually:

1. **Open your `.env` file** (in project root: `/Users/admin/claynov/.env`)

2. **Add this line** (or update if it exists):
   ```
   VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
   ```

3. **Save the file**

4. **Restart your dev server**:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

---

## Step 3: Test It! 🎉

1. **Open your app**: http://localhost:3000
2. **Upload a resume** (any PDF/DOC/DOCX)
3. **Paste a job description**
4. **Click "Optimize Resume"**

### What You Should See:
- ⏱️ Processing takes **10-30 seconds** (not 2 seconds)
- ✨ Real AI-generated improvements
- 📊 Scores based on actual analysis
- 🎯 Job-specific optimizations

### If It's Still Using Mock:
- ⚠️ Processing is instant (2 seconds)
- ⚠️ Same generic text every time
- ⚠️ Check browser console (F12) for errors

---

## Troubleshooting

### "Claude API key not configured"
- ✅ Check `.env` file has `VITE_CLAUDE_API_KEY=...`
- ✅ Make sure key starts with `sk-ant-`
- ✅ **Restart dev server** after adding key

### "API request failed: 401"
- ❌ Invalid API key
- ✅ Double-check you copied the full key
- ✅ No extra spaces

### "API request failed: 402"
- 💰 Out of credits
- ✅ Add credits: https://console.anthropic.com/billing

### Still seeing mock data?
1. Check browser console (F12)
2. Verify `.env` has the key
3. **Restart dev server** (important!)
4. Check key format: `sk-ant-...`

---

## Cost Info

- **Per optimization**: ~$0.05 - $0.15
- **Free credits**: Most accounts get $5-10 to start
- **For testing**: Free credits should be plenty!

---

## Ready?

**Just need your API key!** Once you have it:
1. Add it to `.env` file
2. Restart dev server
3. Test it out!

Or tell me your key and I'll add it for you. 🚀

