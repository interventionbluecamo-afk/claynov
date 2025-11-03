# 🎉 Supabase Setup - Next Steps

## ✅ What's Done
- ✅ Supabase project created
- ✅ API keys added to `.env` file
- ✅ Credentials configured

## 🔧 What You Need to Do Now

### Step 1: Set Up Database Schema (3 min)

1. **Go to Supabase Dashboard**
   - URL: https://akwmrfkwwpbplaixytdo.supabase.co
   - Or: https://supabase.com/dashboard → Your Project

2. **Open SQL Editor**
   - Click **"SQL Editor"** in left sidebar
   - Click **"New query"**

3. **Run the SQL**
   - Open `docs/SUPABASE_DATABASE_SETUP.sql`
   - Copy ALL the SQL code
   - Paste into SQL Editor
   - Click **"Run"** (or press Cmd/Ctrl + Enter)

4. **Verify Success**
   - Should see: "Success. No rows returned"
   - If errors, check the error message

---

### Step 2: Test Your Setup (2 min)

1. **Start your dev server**
   ```bash
   npm run dev
   ```

2. **Test signup**
   - Go to your app
   - Click "Sign up"
   - Create a test account
   - Should work without errors!

3. **Verify in Supabase**
   - Go to: **Authentication → Users**
   - You should see your test user!
   - Go to: **Table Editor → profiles**
   - You should see a profile automatically created!

---

### Step 3: Verify Everything Works

**In Supabase Dashboard:**

✅ **Authentication → Users**: Test user appears  
✅ **Table Editor → profiles**: Profile created automatically  
✅ **SQL Editor**: Can query `SELECT * FROM profiles;`

**In your app:**

✅ Can sign up new account  
✅ Can sign in  
✅ Can sign out  
✅ User persists on refresh  
✅ No localStorage fallback messages in console

---

## 🐛 Troubleshooting

### "Invalid API key"
→ Check `.env` file - no extra spaces, correct keys

### "Profile not created"
→ Re-run SQL from Step 1 (trigger might not exist)

### "RLS policy violation"
→ Check Row Level Security policies were created

### "Can't sign in"
→ Check Authentication → Users (user exists?)

### Still using localStorage?
→ Check `.env` file has correct keys, restart dev server

---

## 🎯 You're Almost Done!

Once the database schema is set up:
1. ✅ Users can sign up
2. ✅ Profiles auto-create
3. ✅ Pro status tracking works
4. ✅ Ready for Stripe integration

**Next**: Set up Stripe webhook to upgrade users to Pro after payment.

