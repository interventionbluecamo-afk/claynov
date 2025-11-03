# How to Reset Use Count for Testing

## Quick Fix: Clear LocalStorage

### Option 1: Browser Console (Easiest)
1. Open your app: http://localhost:3000
2. Open browser console (F12 or Cmd+Option+I)
3. Run this command:
   ```javascript
   localStorage.removeItem('clay_use_count');
   ```
4. Refresh the page

### Option 2: Clear All LocalStorage
1. Open browser console (F12)
2. Run:
   ```javascript
   localStorage.clear();
   ```
3. Refresh the page
   ⚠️ **Note**: This will clear all localStorage data (sign out, etc.)

### Option 3: Developer Tools
1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Find `clay_use_count` and delete it
5. Refresh the page

---

## Reset in Supabase (If Signed In)

If you're signed in, the use count is stored in Supabase:

### Option A: SQL Query
1. Go to Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run:
   ```sql
   UPDATE profiles 
   SET use_count = 0 
   WHERE email = 'your-email@example.com';
   ```

### Option B: Table Editor
1. Go to Supabase Dashboard → **Table Editor**
2. Find `profiles` table
3. Find your user row
4. Edit `use_count` column → set to `0`
5. Save

---

## Use Dev Bypass (For Testing)

You can also use the dev bypass to unlock Pro features:

1. **Sign in** to your account
2. Press **`Ctrl+Shift+B`** (or **`Cmd+Shift+B`** on Mac)
3. This unlocks Pro features temporarily
4. Press again to disable

---

## Quick Test Script

Paste this in browser console to reset everything:

```javascript
// Reset use count
localStorage.removeItem('clay_use_count');
console.log('✅ Use count cleared! Refresh page to see changes.');
```

