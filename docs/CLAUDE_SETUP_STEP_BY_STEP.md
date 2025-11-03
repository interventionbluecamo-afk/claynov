# Claude AI Setup - Step by Step Guide

## 🎯 Goal
Get real AI-powered resume optimization working (instead of mock data)

---

## Step 1: Get Your Claude API Key

### Option A: You Already Have an Anthropic Account
1. Go to: https://console.anthropic.com/
2. Sign in
3. Navigate to **API Keys** (left sidebar)
4. Click **"Create Key"**
5. Give it a name (e.g., "Clay Resume Optimizer")
6. Copy the key (starts with `sk-ant-...`)

### Option B: Create New Account
1. Go to: https://console.anthropic.com/signup
2. Sign up with your email
3. Verify your email
4. Go to **API Keys** section
5. Click **"Create Key"**
6. Copy the key

**Important**: You'll need credits in your Anthropic account. New accounts often get free credits to start.

---

## Step 2: Add API Key to Your Project

### Option A: Quick Setup (I'll do this for you)
Run this command in your terminal:
```bash
cd /Users/admin/claynov
echo "VITE_CLAUDE_API_KEY=your_key_here" >> .env
```

Then edit `.env` and replace `your_key_here` with your actual key.

### Option B: Manual Setup
1. Open `.env` file in your project root
2. Find or add this line:
   ```
   VITE_CLAUDE_API_KEY=sk-ant-your-actual-key-here
   ```
3. Save the file

---

## Step 3: Restart Dev Server

**Important**: After adding the API key, you MUST restart your dev server for changes to take effect.

1. Stop your current dev server (Ctrl+C or Cmd+C)
2. Start it again:
   ```bash
   npm run dev
   ```

---

## Step 4: Test It Out

1. **Upload a resume** (PDF, DOC, or DOCX)
2. **Paste a job description**
3. **Click "Optimize Resume"**
4. **Watch the magic happen!** ✨

You should see:
- Real AI processing (takes 10-30 seconds)
- Actual optimized resume text
- Realistic ATS and match scores
- Job-specific improvements

---

## Step 5: Verify It's Working

### Signs it's working:
- ✅ Processing takes 10-30 seconds (not 2 seconds like mock)
- ✅ Optimized resume is actually different from original
- ✅ Improvements are specific to the job description
- ✅ ATS/Match scores vary based on actual analysis

### Signs it's still using mock:
- ❌ Processing is instant (2 seconds)
- ❌ Same generic improvements every time
- ❌ Scores are always 85-100

---

## Troubleshooting

### "Claude API key not configured"
- Make sure `.env` file exists
- Check that `VITE_CLAUDE_API_KEY=...` is set
- Restart dev server after adding key

### "API request failed: 401"
- Your API key is invalid
- Check you copied the full key (starts with `sk-ant-`)
- Make sure there are no extra spaces

### "API request failed: 429"
- You've hit your rate limit
- Check your Anthropic account for usage limits
- Wait a bit and try again

### "API request failed: 402"
- You're out of credits
- Add credits to your Anthropic account
- Check billing at: https://console.anthropic.com/billing

### Still seeing mock data?
1. Check browser console (F12) for errors
2. Verify `.env` file has the key
3. Make sure dev server was restarted
4. Check that key starts with `sk-ant-`

---

## Cost Estimate

Claude API pricing (approximate):
- **Claude 3.5 Sonnet**: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- **Average resume optimization**: ~$0.05 - $0.15 per optimization
- **Free tier**: Many accounts get $5-10 free credits to start

**For MVP**: Free credits should be enough for testing!

---

## Next Steps

Once it's working:
1. ✅ Test with different resumes
2. ✅ Try different tones (Professional, Creative, etc.)
3. ✅ Test with various job descriptions
4. ✅ Monitor your Anthropic account usage
5. ✅ Consider adding more credits if needed

---

## Need Help?

- **Anthropic Docs**: https://docs.anthropic.com/
- **API Status**: https://status.anthropic.com/
- **Console**: https://console.anthropic.com/

