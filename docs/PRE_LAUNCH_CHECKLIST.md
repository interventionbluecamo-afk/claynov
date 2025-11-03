# 🚀 Pre-Launch Checklist

## ✅ What's Working

### User Authentication
- ✅ Sign up / Sign in flow
- ✅ Profile management (view/edit name)
- ✅ Sign out
- ✅ Supabase integration (with localStorage fallback)
- ✅ Form validation

### User Flows
- ✅ Upload resume → Paste job description → Optimize
- ✅ Free tier: 3 optimizations limit
- ✅ Upgrade flow: Sign up → Pricing → Stripe
- ✅ Profile access from header
- ✅ Pricing page accessible without sign-up

### UI/UX
- ✅ Mobile-optimized design
- ✅ Error boundaries
- ✅ Toast notifications
- ✅ Loading states
- ✅ Step progress indicator
- ✅ Responsive pricing card

---

## 🔴 CRITICAL - Must Fix Before Launch

### 1. Stripe Payment Completion Flow ⚠️
**Issue**: After user pays on Stripe, there's no way to verify payment and upgrade them to Pro.

**Current State**:
- ✅ User clicks "Upgrade" → Redirects to Stripe Payment Link
- ❌ After payment, user returns to app but isn't upgraded
- ❌ No webhook handler to mark user as Pro in database

**What's Missing**:
- [ ] Stripe webhook endpoint to verify payment
- [ ] Update user `is_pro` status in Supabase after payment
- [ ] Success/return page after Stripe payment
- [ ] Handle Stripe redirect back to app

**Quick Fix Options**:
1. **Manual verification** (MVP): Check Stripe dashboard for payments, manually upgrade users
2. **Stripe webhook** (Recommended): Set up webhook to auto-upgrade after payment
3. **Return URL check**: Check localStorage for pending upgrade on app load

**Files to Update**:
- `src/utils/stripe.js` - Add payment verification
- `src/App.jsx` - Check for payment completion on mount
- Backend webhook (if using) or Supabase Edge Function

---

### 2. Use Count Persistence 🔴
**Issue**: Use count is stored in localStorage, not in Supabase database.

**Current State**:
- ✅ Free users get 3 uses
- ❌ Use count resets if localStorage is cleared
- ❌ Use count not synced across devices
- ❌ No way to track use count for Pro users (should be unlimited)

**What's Missing**:
- [ ] Store `use_count` in Supabase `profiles` table
- [ ] Update use count when optimization runs
- [ ] Load use count from database, not localStorage
- [ ] Reset use count when user upgrades to Pro

**Files to Update**:
- `src/App.jsx` - Load/save use count from Supabase
- `src/utils/supabaseAuth.js` - Add use count functions
- Supabase `profiles` table - Add `use_count` column

---

### 3. Post-Payment Redirect Handler ⚠️
**Issue**: After Stripe payment, user returns to app but nothing happens.

**Current State**:
- ✅ `localStorage` stores `clay_pending_upgrade_email`
- ❌ No code checks for this on app load
- ❌ No way to verify payment completed

**What's Missing**:
- [ ] Check for `clay_pending_upgrade_email` on app mount
- [ ] Verify payment in Stripe (or show "pending verification" message)
- [ ] Auto-upgrade user if payment verified
- [ ] Clear localStorage flags

**Files to Update**:
- `src/App.jsx` - Add useEffect to check pending payment
- `src/utils/stripe.js` - Add `verifyPayment()` function

---

## 🟡 HIGH PRIORITY - Should Fix Soon

### 4. Email Confirmation Flow
**Current**: Email confirmation might be enabled in Supabase (blocking signups)

**Action Needed**:
- [ ] Check Supabase Dashboard → Authentication → Settings
- [ ] Disable email confirmation for MVP (or enable and handle flow)
- [ ] See: `docs/EMAIL_CONFIRMATION_SETUP.md`

---

### 5. Error Handling for Edge Cases
**Missing**:
- [ ] What if user uploads corrupted PDF/DOCX?
- [ ] What if Stripe payment link is broken?
- [ ] What if Supabase is down?
- [ ] Network timeout handling
- [ ] Large file upload failures

**Files to Update**:
- `src/App.jsx` - Add more error cases
- `src/utils/fileParser.js` - Better error messages

---

### 6. Analytics / Tracking
**Missing**:
- [ ] User signups tracking
- [ ] Upgrade conversions
- [ ] Optimization usage
- [ ] Error logging (Sentry, LogRocket, etc.)

**Optional but Recommended**:
- Google Analytics
- Mixpanel / Amplitude
- Sentry for error tracking

---

### 7. Terms of Service / Privacy Policy
**Legal Requirement**:
- [ ] Terms of Service page
- [ ] Privacy Policy page
- [ ] Links in footer
- [ ] Cookie consent (if using analytics)

---

## 🟢 MEDIUM PRIORITY - Nice to Have

### 8. Password Reset Flow
**Missing**:
- [ ] "Forgot password?" link on Sign In
- [ ] Password reset email flow
- [ ] Reset password page

**Supabase**: Has this built-in, just need to add UI.

---

### 9. Email Verification (If Enabled)
**If you enable email confirmation**:
- [ ] "Resend verification email" option
- [ ] Email verification page
- [ ] Handle unverified users

---

### 10. Profile Enhancements
**Nice to Have**:
- [ ] Change password option
- [ ] Delete account option
- [ ] Usage history/stats

---

### 11. Loading States
**Missing in Some Places**:
- [ ] Initial app load (while checking auth)
- [ ] Profile save loading state
- [ ] Better skeleton screens

---

### 12. SEO & Meta Tags
**Missing**:
- [ ] Proper meta tags in `index.html`
- [ ] Open Graph tags for social sharing
- [ ] Title/description for each page

---

## 📋 Environment Variables Checklist

### Required for Production:
- [x] `VITE_SUPABASE_URL` - Already set up
- [x] `VITE_SUPABASE_ANON_KEY` - Already set up
- [ ] `VITE_STRIPE_PAYMENT_LINK` - **Need to create in Stripe dashboard**
- [ ] `VITE_CLAUDE_API_KEY` - Already have (for later)

### Verify on Vercel:
- [ ] All env vars added to Vercel
- [ ] Production values (not test keys)
- [ ] Redeployed after adding env vars

---

## 🧪 Testing Checklist

### User Flows to Test:
- [ ] **New User**: Sign up → Use 3 free optimizations → Try 4th → See pricing
- [ ] **Existing User**: Sign in → Upload → Optimize → Download
- [ ] **Upgrade Flow**: Not signed in → Click Pro → Sign up → Pricing → Stripe → Return
- [ ] **Pro User**: Sign in as Pro → Unlimited optimizations → All tones unlocked
- [ ] **Profile**: View profile → Edit name → Sign out
- [ ] **Mobile**: Test all flows on mobile device

### Edge Cases to Test:
- [ ] Upload invalid file type
- [ ] Upload file > 5MB
- [ ] Paste empty job description
- [ ] Network offline
- [ ] Stripe payment link broken
- [ ] Supabase down (should fallback to localStorage)

---

## 🚨 Critical Before Launch

1. **Fix Stripe payment verification** (webhook or manual check)
2. **Move use_count to Supabase** (persist across devices)
3. **Add post-payment redirect handler**
4. **Disable email confirmation** (or implement flow)
5. **Test complete upgrade flow end-to-end**

---

## 📝 Quick Wins (Do First)

These are easy and high impact:

1. **Add payment check on app load** (30 min):
   ```js
   // In App.jsx useEffect
   const pendingEmail = localStorage.getItem('clay_pending_upgrade_email');
   if (pendingEmail) {
     // Show "Payment processing..." message
     // Check Stripe or wait for webhook
   }
   ```

2. **Add use_count to Supabase** (1 hour):
   - Run SQL: `ALTER TABLE profiles ADD COLUMN use_count INTEGER DEFAULT 0;`
   - Update `App.jsx` to use Supabase instead of localStorage

3. **Create Stripe Payment Link** (10 min):
   - Go to Stripe Dashboard → Payment Links
   - Create $7.99 one-time payment
   - Add return URL to your app
   - Add to Vercel env vars

---

## 🎯 Launch Readiness Score

**Current**: ~75% ready

**Blocks Launch**: Payment verification, use_count persistence

**Can Launch With**: Manual payment verification (you check Stripe, upgrade users manually)

**Recommended**: Fix payment flow before launch for better UX

---

## Next Steps

1. ✅ **Right Now**: Create Stripe Payment Link and add to env vars
2. ✅ **Today**: Implement payment check on app load
3. ✅ **This Week**: Move use_count to Supabase
4. ✅ **Before Launch**: Test complete user flow end-to-end

---

**Remember**: The AI resume transformation itself isn't needed yet - the app can work with mock data for now. Focus on the payment and account flows first!

