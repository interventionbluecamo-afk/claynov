# Step-by-Step Guide: Setting Up Claude AI for Resume Optimization

## Overview
Your app is already coded to use Claude AI! You just need to get API credentials and configure environment variables. Here's exactly what to do:

---

## STEP 1: Get Your Claude API Key

### 1.1 Create an Anthropic Account
1. Go to **https://console.anthropic.com/**
2. Click **"Sign Up"** or **"Log In"**
3. Complete the registration/login process

### 1.2 Get Your API Key
1. Once logged in, go to **https://console.anthropic.com/settings/keys**
2. Click **"Create Key"**
3. Give it a name like "Clay Resume Optimizer"
4. **COPY THE KEY IMMEDIATELY** - you won't be able to see it again!
   - Format: `sk-ant-api03-...` (starts with `sk-ant-`)

### 1.3 Understand Pricing
- Claude API is **pay-as-you-go**
- Current model: `claude-3-5-sonnet-20241022`
- **Cost**: ~$0.003 per 1K input tokens, ~$0.015 per 1K output tokens
- **Average resume optimization**: ~$0.10 - $0.30 per resume
- Anthropic gives **$5 free credits** when you sign up
- You can set **spending limits** in your account settings

---

## STEP 2: Set Up Environment Variables Locally

### 2.1 Create `.env` File
1. In your project root (`/Users/admin/claynov/`), create a file named `.env`
2. Copy the contents from `env.example`:

```bash
cp env.example .env
```

### 2.2 Edit `.env` File
Open `.env` and add your API key:

```env
# Claude AI API Configuration
VITE_CLAUDE_API_KEY=sk-ant-api03-YOUR_ACTUAL_KEY_HERE

# Optional: Claude API version (defaults to 2024-02-15-preview if not set)
VITE_CLAUDE_API_VERSION=2024-02-15-preview

# Optional: Claude model to use
# claude-3-5-sonnet-20241022 (best quality, recommended)
# claude-3-opus-20240229 (most powerful, slower, more expensive)
# claude-3-sonnet-20240229 (balanced)
# claude-3-haiku-20240307 (fastest, cheapest, lower quality)
VITE_CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

### 2.3 Replace the Placeholder
Replace `YOUR_ACTUAL_KEY_HERE` with the actual API key you copied from Anthropic console.

**Important Notes:**
- ✅ `.env` is in `.gitignore` - your key won't be committed to GitHub
- ✅ Keys start with `VITE_` so they're available in your React app
- ✅ Never share your API key publicly

---

## STEP 3: Test Locally

### 3.1 Restart Dev Server
After creating `.env`, restart your dev server:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3.2 Test the Integration
1. Open http://localhost:3000
2. Upload a resume (PDF, DOC, or DOCX)
3. Paste a job description
4. Click "Optimize Resume"
5. **Check your browser console** (F12 → Console tab)
   - If working: You'll see the API call succeed
   - If error: You'll see the error message

### 3.3 Verify It's Using Claude (Not Mock)
- **With API key**: Real optimization takes 5-15 seconds, results are unique
- **Without API key**: Falls back to mock data, instant results, same every time

### 3.4 Check API Usage
1. Go to **https://console.anthropic.com/usage**
2. You'll see your API calls and costs in real-time

---

## STEP 4: Deploy to Vercel with Environment Variables

### 4.1 Push Code to GitHub (Without .env)
- Make sure `.env` is NOT committed (it should be in `.gitignore`)
- Push your code as normal

### 4.2 Add Environment Variables in Vercel
1. Go to your Vercel dashboard: **https://vercel.com/dashboard**
2. Select your **Clay** project
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"** and add these 3 variables:

   **Variable 1:**
   - **Name**: `VITE_CLAUDE_API_KEY`
   - **Value**: `sk-ant-api03-YOUR_ACTUAL_KEY_HERE` (paste your key)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

   **Variable 2 (Optional):**
   - **Name**: `VITE_CLAUDE_API_VERSION`
   - **Value**: `2024-02-15-preview`
   - **Environment**: Select all
   - Click **"Save"**

   **Variable 3 (Optional):**
   - **Name**: `VITE_CLAUDE_MODEL`
   - **Value**: `claude-3-5-sonnet-20241022`
   - **Environment**: Select all
   - Click **"Save"**

### 4.3 Redeploy Your App
1. After adding environment variables, go to **Deployments** tab
2. Click the **3 dots** (⋯) on your latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### 4.4 Verify It Works
1. Visit your live Vercel URL
2. Try optimizing a resume
3. Check it's using Claude (should take 5-15 seconds, unique results)

---

## STEP 5: Monitor Usage & Costs

### 5.1 Set Spending Limits (Recommended)
1. Go to **https://console.anthropic.com/settings/billing**
2. Set a **monthly spending limit** (e.g., $50)
3. This prevents unexpected charges

### 5.2 Monitor Usage
- Check **https://console.anthropic.com/usage** regularly
- Track costs per resume optimization
- Adjust spending limits as needed

### 5.3 Cost Estimate
- **Free tier**: $5 credit (covers ~16-50 resumes)
- **After free tier**: ~$0.10-$0.30 per resume
- **100 resumes/month**: ~$10-$30

---

## TROUBLESHOOTING

### Issue: "Claude API key not configured"
**Solution**: 
- Check `.env` file exists in project root
- Verify key is named `VITE_CLAUDE_API_KEY`
- Restart dev server after creating `.env`
- On Vercel: Check environment variables are set correctly

### Issue: "API request failed: 401"
**Solution**: 
- Your API key is invalid or expired
- Get a new key from Anthropic console
- Update `.env` and Vercel environment variables

### Issue: "API request failed: 429" (Rate Limit)
**Solution**: 
- Too many requests too quickly
- Wait a few minutes and try again
- Consider upgrading your Anthropic plan

### Issue: "Invalid response format from AI"
**Solution**: 
- Claude sometimes returns non-JSON
- The code has a fallback to mock API
- Check Anthropic console for API status
- Try again - this is usually a temporary issue

### Issue: App still uses mock data after setting up API key
**Solution**: 
1. Check browser console for errors
2. Verify `.env` file is in project root (not in `src/`)
3. Restart dev server completely
4. Clear browser cache
5. Check Vercel environment variables are set correctly

---

## HOW IT WORKS (Technical Details)

### The Flow:
1. **User uploads resume** → Parsed to text via `fileParser.js`
2. **User enters job description** → Stored in state
3. **User clicks "Optimize"** → `handleOptimize()` in `App.jsx` runs
4. **API Check**: Code checks for `VITE_CLAUDE_API_KEY`
   - **If present**: Calls `optimizeResume()` from `claudeApi.js`
   - **If missing**: Falls back to `mockOptimizeResume()` from `mockApi.js`
5. **Claude API Call**:
   - Sends resume + job description to Claude
   - Claude analyzes and optimizes
   - Returns JSON with optimized resume, scores, and changes
6. **Display Results**: Shows scores, optimized text, and download option

### The API Code:
- **File**: `src/utils/claudeApi.js`
- **Function**: `optimizeResume(resumeText, jobDescription, tone)`
- **Endpoint**: `https://api.anthropic.com/v1/messages`
- **Method**: POST
- **Headers**: 
  - `x-api-key`: Your API key
  - `anthropic-version`: API version
- **Body**: JSON with model, system prompt, user prompt, max tokens

### The Prompt:
The system prompt tells Claude:
- Act as an ATS specialist
- Return specific JSON format
- Optimize for the job description
- Maintain resume structure
- Apply the selected tone (professional/creative/technical/executive)

---

## NEXT STEPS

1. ✅ Get API key from Anthropic
2. ✅ Create `.env` file locally
3. ✅ Test locally
4. ✅ Add environment variables to Vercel
5. ✅ Redeploy on Vercel
6. ✅ Monitor usage and costs
7. ✅ Consider adding payment processing for Pro users

---

## SECURITY NOTES

- ⚠️ **Never commit `.env` to GitHub** - it's in `.gitignore`
- ⚠️ **Never share your API key** publicly
- ⚠️ **Set spending limits** to prevent unexpected charges
- ⚠️ **Monitor usage** regularly
- ✅ **Vercel environment variables** are encrypted and secure

---

## SUPPORT

- **Anthropic API Docs**: https://docs.anthropic.com/
- **Anthropic Status**: https://status.anthropic.com/
- **Anthropic Support**: https://support.anthropic.com/

---

**You're all set!** Once you add your API key, your app will use real Claude AI to optimize resumes. 🚀


