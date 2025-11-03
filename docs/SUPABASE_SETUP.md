# Supabase Account Setup - Step by Step Guide

## 🎯 Goal
Set up real user accounts with secure authentication, replacing the localStorage system.

## ⏱️ Estimated Time
**15-20 minutes** (mostly waiting for setup)

---

## Step 1: Create Supabase Account (5 min)

1. **Go directly to** [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - ⚠️ **Avoid** links that mention Vercel - they redirect to Vercel integration
   - **Direct signup**: [https://supabase.com/dashboard/sign-up](https://supabase.com/dashboard/sign-up)
2. **Click** "Start your project" or "Sign Up"
3. **Sign up** with:
   - GitHub (easiest) OR
   - Email + password
4. **Verify your email** if using email signup
5. **If it redirects to Vercel**: Close that tab, manually type `supabase.com/dashboard` in browser

---

## Step 2: Create New Project (3 min)

1. **In Supabase Dashboard**, click **"New Project"**
2. **Fill in details:**
   - **Organization**: Use default or create new
   - **Project Name**: `clay-resume-optimizer` (or your choice)
   - **Database Password**: Generate a strong password (SAVE THIS - you'll need it)
     - Click "Generate" next to password field
     - **Copy and save** this password somewhere safe
   - **Region**: Choose closest to you (e.g., US East, US West, EU West)
   - **Pricing Plan**: Free tier (perfect for MVP)
3. **Click** "Create new project"
4. **Wait** ~2 minutes for project to initialize (green checkmark when done)

---

## Step 3: Get Your API Keys (2 min)

Once project is ready:

1. **Click** on your project name
2. **Go to** Settings (gear icon in left sidebar)
3. **Click** "API" in settings menu
4. **Copy these values:**

   ```
   Project URL: https://xxxxxxxxxxxxx.supabase.co
   anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   service_role key: (keep this SECRET - don't use in frontend!)
   ```

   ⚠️ **Important**: Only use the `anon public` key in your frontend. Never expose the `service_role` key.

---

## Step 4: Set Up Authentication (3 min)

1. **In Supabase Dashboard**, go to **"Authentication"** (left sidebar)
2. **Click** "Providers" tab
3. **Enable Email provider:**
   - Should be enabled by default
   - **Confirm** "Enable Email Provider" is ON
   - **Email Template**: Leave default (or customize later)

4. **Optional - Enable Google OAuth** (for "Continue with Google"):
   - Click "Google" provider
   - Toggle "Enable Google provider" to ON
   - You'll need Google OAuth credentials (we can skip for now)
   - For MVP, we can use email/password only

---

## Step 5: Set Up Database Schema (5 min)

We need a table to store user profiles and Pro status.

### Option A: Using SQL Editor (Recommended)

1. **In Supabase Dashboard**, click **"SQL Editor"** (left sidebar)
2. **Click** "New query"
3. **Paste** this SQL:

```sql
-- Create profiles table to extend auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  is_pro BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create function to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, is_pro)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    false
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to run function on new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

4. **Click** "Run" (or press Cmd/Ctrl + Enter)
5. **Verify**: Should see "Success. No rows returned"

### Option B: Using Table Editor (Visual)

1. Go to **"Table Editor"** (left sidebar)
2. Click **"New table"**
3. Name: `profiles`
4. Add columns:
   - `id` (type: uuid, primary key, foreign key to auth.users)
   - `email` (type: text)
   - `name` (type: text)
   - `is_pro` (type: boolean, default: false)
   - `created_at` (type: timestamptz, default: now())
   - `updated_at` (type: timestamptz, default: now())
5. Enable RLS (Row Level Security)
6. Create policies (similar to SQL above)

---

## Step 6: Add Environment Variables (2 min)

1. **In your project** (`/Users/admin/claynov`), open `.env` file (or create it)
2. **Add these lines**:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. **Replace** `your-project-id` and `your-anon-key-here` with values from Step 3
4. **Update** `env.example` file too (for reference)

---

## Step 7: Test the Setup

1. **Run** `npm install` to install Supabase client
2. **Run** `npm run dev`
3. **Try signing up** with a test email
4. **Check** Supabase Dashboard → Authentication → Users
   - Should see your new user
5. **Check** Table Editor → profiles
   - Should see corresponding profile

---

## ✅ Verification Checklist

- [ ] Supabase account created
- [ ] Project created and initialized
- [ ] API keys copied (URL + anon key)
- [ ] Email authentication enabled
- [ ] Database schema created (profiles table + trigger)
- [ ] Environment variables added to `.env`
- [ ] `env.example` updated
- [ ] Can sign up new user
- [ ] User appears in Supabase dashboard
- [ ] Profile created automatically

---

## 🐛 Troubleshooting

### "Invalid API key"
- Double-check you copied the **anon public** key (not service_role)
- Ensure no extra spaces in `.env` file

### "Profile not created"
- Check trigger exists: SQL Editor → Run `SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';`
- Verify function exists: `SELECT * FROM pg_proc WHERE proname = 'handle_new_user';`

### "RLS policy violation"
- Check Row Level Security is enabled
- Verify policies exist (see Step 5 SQL)

### "Can't sign in"
- Check Authentication → Users → find your user
- Try resetting password: Authentication → Users → [user] → Reset password

---

## 🔄 Migration from localStorage

The new Supabase auth will:
- ✅ Work alongside existing localStorage auth (backward compatible)
- ✅ Gradually migrate users to Supabase
- ✅ Allow existing localStorage users to continue working
- ✅ New signups will use Supabase

---

## 🚀 Next Steps After Setup

1. **Set up Stripe webhook** (to verify payments)
2. **Add email verification** (optional)
3. **Add password reset** flow
4. **Test payment flow** end-to-end

---

**Need help?** Check Supabase docs: https://supabase.com/docs/guides/auth

