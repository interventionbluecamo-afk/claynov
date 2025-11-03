# 🚀 Quick Setup Guide - Clay Resume Optimizer

## What We Just Did (Agent Actions)

✅ Installed Supabase client library  
✅ Created Supabase integration files  
✅ Updated auth to use Supabase (with localStorage fallback)  
✅ Created setup documentation

## What You Need to Do (Human Actions - ~15 min)

### 1️⃣ Create Supabase Account (2 min)
- Go to: https://supabase.com/dashboard
- Click "Start your project" (big green button)
- **OR** go directly to signup: https://supabase.com/dashboard/sign-up
- Sign up with GitHub (easiest) or email
- ⚠️ **If it redirects to Vercel**: Close that tab and go directly to https://supabase.com/dashboard
- Verify email if needed

### 2️⃣ Create Project (3 min)
- Click "New Project"
- Name: `clay-resume-optimizer`
- **Generate password** (SAVE IT!)
- Choose region (closest to you)
- Click "Create new project"
- Wait ~2 minutes

### 3️⃣ Get API Keys (1 min)
- Project → Settings (⚙️) → API
- Copy **Project URL**
- Copy **anon public** key

### 4️⃣ Set Up Database (3 min)
- Click **"SQL Editor"** in sidebar
- Click **"New query"**
- Copy/paste the SQL from `docs/SUPABASE_SETUP.md` (Step 5)
- Click **"Run"** (or Cmd+Enter)

### 5️⃣ Add Environment Variables (1 min)
1. Open `.env` file in project root
2. Add:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
3. Replace with YOUR values from Step 3

### 6️⃣ Test It! (2 min)
1. Run `npm run dev`
2. Click "Sign up"
3. Create test account
4. Check Supabase Dashboard → Authentication → Users
5. ✅ User should appear!

---

## 🔍 Verification

**Check these in Supabase Dashboard:**

✅ **Authentication → Users**: Your test user appears  
✅ **Table Editor → profiles**: Profile created automatically  
✅ **SQL Editor**: Can query profiles table

**In your app:**

✅ Can sign up new account  
✅ Can sign in  
✅ Can sign out  
✅ User persists on refresh

---

## 🆘 Troubleshooting

**"Invalid API key"**
→ Check `.env` file has correct keys (no extra spaces)

**"Profile not created"**
→ Run SQL from Step 5 again (trigger might not exist)

**"Can't sign in"**
→ Check Supabase → Authentication → Users (user exists?)

**Still using localStorage?**
→ Supabase not configured yet - check `.env` file

---

## 📋 Full Details

See `docs/SUPABASE_SETUP.md` for complete step-by-step guide with screenshots descriptions.

---

**Total time: ~15 minutes**  
**Difficulty: Easy**  
**Support: Supabase docs are excellent**

