# ✅ Testing Checklist - Supabase Setup

## After Running SQL Successfully

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Test Sign Up (2 min)

1. **Open your app** (usually http://localhost:5173)
2. **Click "Sign up"** button
3. **Create test account:**
   - Name: Test User
   - Email: test@example.com
   - Password: test123456
4. **Submit** - Should work without errors!
5. **Check for success toast**: "Account created successfully!"

### Step 3: Verify in Supabase Dashboard

1. **Go to**: https://supabase.com/dashboard → Your Project

2. **Check Authentication:**
   - Click **"Authentication"** → **"Users"**
   - ✅ Should see your test user with email `test@example.com`

3. **Check Profile Table:**
   - Click **"Table Editor"** → **"profiles"**
   - ✅ Should see a row with your user's info
   - ✅ `is_pro` should be `false`
   - ✅ `email` should match
   - ✅ `name` should be "Test User"

4. **Test Sign In:**
   - Sign out of the app
   - Click "Sign up" → Switch to "Sign in"
   - Use: test@example.com / test123456
   - ✅ Should sign in successfully!

### Step 4: Check Console (Developer Tools)

1. **Open browser console** (F12 or Cmd+Option+I)
2. **Look for:**
   - ✅ No "Supabase not configured" warnings
   - ✅ No localStorage fallback messages
   - ✅ User data from Supabase

---

## ✅ Success Indicators

If you see these, everything is working:

✅ User appears in Supabase Authentication → Users  
✅ Profile auto-created in Table Editor → profiles  
✅ Can sign up new accounts  
✅ Can sign in  
✅ Can sign out  
✅ User persists on page refresh  
✅ No localStorage fallback in console

---

## 🐛 If Something's Wrong

### "Profile not created"
- Check: Table Editor → profiles (might need to refresh)
- Check: SQL trigger exists (run SQL again)

### "Can't sign in"
- Check: Authentication → Users (user exists?)
- Check: Browser console for errors

### "Still using localStorage"
- Check: `.env` file has correct Supabase keys
- Restart dev server: `npm run dev`
- Check: No typos in `.env` file

---

## 🎉 Next Steps After Testing

Once everything works:
1. ✅ Real authentication is working
2. ✅ Profiles auto-create on signup
3. ✅ Ready for Stripe integration
4. ✅ Ready to upgrade users to Pro

**You're all set!** 🚀

