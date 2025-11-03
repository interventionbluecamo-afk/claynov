# Vercel Environment Variables Setup

## Add Supabase Credentials to Vercel

Your Supabase setup will work on Vercel once you add the environment variables.

### Step 1: Get Your Supabase Credentials

You already have these:
- **URL**: `https://akwmrfkwwpbplaixytdo.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd21yZmt3d3BicGxhaXh5dGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE4NDEsImV4cCI6MjA3Nzc1Nzg0MX0.TjbL06rn1w_dfAGYHBvzwSMeqi-WYE-IVrKchT0_ZRA`

### Step 2: Add to Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Find your **Clay** project

2. **Open Project Settings**
   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Variables**
   Click **"Add New"** for each:

   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://akwmrfkwwpbplaixytdo.supabase.co`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrd21yZmt3d3BicGxhaXh5dGRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIxODE4NDEsImV4cCI6MjA3Nzc1Nzg0MX0.TjbL06rn1w_dfAGYHBvzwSMeqi-WYE-IVrKchT0_ZRA`
   - Environments: ✅ Production, ✅ Preview, ✅ Development

4. **Save** each variable

5. **Redeploy**
   - Go to **Deployments** tab
   - Click **"..."** on latest deployment
   - Click **"Redeploy"**

---

## Verify It Works

After redeploying:
1. Visit your Vercel URL
2. Try signing up
3. Check Supabase Dashboard → Authentication → Users
4. ✅ Should see new users appearing!

---

## 🔒 Security Note

- Never commit `.env` files to Git (already in `.gitignore`)
- Vercel environment variables are encrypted
- Only the anon key is exposed (this is safe - it's public)
- Never expose service_role key

