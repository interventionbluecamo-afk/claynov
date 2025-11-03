# Local Testing Guide

## Quick Start

The dev server is starting. Open your browser to:

**http://localhost:5173**

---

## What to Test

### 1. ✅ User Authentication
- **Sign Up**: Create a new account
- **Sign In**: Log in with existing account
- **Profile**: Click your avatar → Edit name → Save
- **Sign Out**: Sign out from profile page

### 2. ✅ Use Count Persistence
- **Before**: Use count was in localStorage (cleared when you clear browser data)
- **Now**: Use count is in Supabase database (persists!)

**To Test**:
1. Sign up with an account
2. Upload resume and optimize (use mock data)
3. Check Supabase Dashboard → `profiles` table
4. See `use_count` column increment
5. Clear browser localStorage
6. Refresh page
7. ✅ Use count should still be there (from database)

### 3. ✅ Payment Verification Flow
- **New**: App checks for pending payments on load
- **New**: Shows "Payment processing..." message if payment initiated

**To Test**:
1. Sign up/login
2. Click "Pro" button → "Upgrade to Pro"
3. (Will show error since Stripe link not set - that's expected)
4. Manually set in localStorage:
   ```js
   localStorage.setItem('clay_pending_upgrade_email', 'your@email.com');
   localStorage.setItem('clay_pending_upgrade_timestamp', Date.now().toString());
   ```
5. Refresh page
6. ✅ Should show "Payment processing..." toast message

### 4. ✅ Pro Upgrade Flow
**To Test**:
1. Manually upgrade a user in Supabase:
   ```sql
   UPDATE profiles 
   SET is_pro = true 
   WHERE email = 'your@email.com';
   ```
2. Sign out and sign back in
3. ✅ Use count should reset to 0
4. ✅ All tone options should be unlocked
5. ✅ Unlimited optimizations

### 5. ✅ All Other Features
- Upload resume (PDF/DOC/DOCX)
- Paste job description
- Optimize (uses mock data for now)
- Download optimized resume
- Switch tones
- View results page

---

## Running Dev Server

```bash
npm run dev
```

Server runs at: **http://localhost:5173**

---

## Environment Variables (Local)

Your `.env` file should have:
- `VITE_SUPABASE_URL` - Your Supabase URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon key
- `VITE_STRIPE_PAYMENT_LINK` - (Optional for now, you'll add later)

**Note**: Make sure Supabase credentials are in your `.env` file!

---

## Test Checklist

- [ ] Sign up works
- [ ] Sign in works
- [ ] Profile page loads
- [ ] Edit name works
- [ ] Use count persists (check Supabase)
- [ ] Payment check message shows (after setting localStorage)
- [ ] Pro upgrade resets use count
- [ ] Upload resume works
- [ ] Optimization flow works (mock data)
- [ ] Download works

---

## Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
npm run dev
```

**Can't connect to Supabase?**
- Check `.env` file has correct credentials
- Verify Supabase project is active
- Check network connection

**Changes not showing?**
- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear browser cache
- Restart dev server

---

## Next Steps After Testing

1. ✅ Run SQL migration for `use_count` column
2. ✅ Create Stripe Payment Link
3. ✅ Add Stripe link to Vercel env vars
4. ✅ Deploy when Vercel unlocks

