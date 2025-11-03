# Stripe Payment Setup - Quick Guide

## Step 1: Create Stripe Payment Link

1. **Go to Stripe Dashboard**
   - https://dashboard.stripe.com/payment-links
   - Make sure you're in **Test mode** first (toggle in top right)

2. **Create New Payment Link**
   - Click **"Create payment link"**
   - Product name: `Clay Pro Upgrade`
   - Price: `$7.99` (one-time payment)
   - Description: `Unlimited resume optimizations, all tone options, and priority AI processing`
   - Click **"Create link"**

3. **Configure Return URL**
   - After creating, click on the payment link to edit
   - Scroll to **"After payment"** section
   - Set **Return URL** to: `https://your-vercel-domain.vercel.app` (or your production domain)
   - Or for testing: `http://localhost:5173` (your dev server)

4. **Copy Payment Link**
   - Copy the payment link (format: `https://buy.stripe.com/...`)

---

## Step 2: Add to Environment Variables

### Local Development (.env file):
```
VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your_link_here
```

### Vercel:
1. Go to Vercel Dashboard → Your Project
2. Settings → Environment Variables
3. Add:
   - Name: `VITE_STRIPE_PAYMENT_LINK`
   - Value: Your payment link from Step 1
   - Environments: ✅ Production, ✅ Preview, ✅ Development
4. **Redeploy** your project

---

## Step 3: Verify It Works

1. Test in your app:
   - Sign up/login
   - Click "Pro" button
   - Click "Upgrade to Pro"
   - Should redirect to Stripe checkout

2. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/34`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)

3. After payment:
   - You'll be redirected back to your app
   - App will show "Payment processing..." message
   - **You need to manually upgrade the user** (see Step 4)

---

## Step 4: Manual Payment Verification (MVP)

For MVP, you'll manually verify payments and upgrade users:

1. **After a user pays:**
   - Go to Stripe Dashboard → Payments
   - Find the payment (filter by email or amount)
   - Verify it's completed

2. **Upgrade the user in Supabase:**
   - Go to Supabase Dashboard → Table Editor → `profiles`
   - Find user by email
   - Update `is_pro` to `true`

**OR use SQL:**
```sql
UPDATE profiles 
SET is_pro = true 
WHERE email = 'user@example.com';
```

---

## Step 5: Automate Later (Optional)

For production, you'll want to automate this:

### Option A: Stripe Webhook (Recommended)
- Create a webhook endpoint
- Stripe will notify you when payment completes
- Auto-upgrade user in database

### Option B: Check on App Load
- Already implemented! 
- App checks for pending payments on load
- Shows "Payment processing..." message
- Still need webhook or manual verification

---

## Testing Checklist

- [ ] Payment link redirects correctly
- [ ] Test payment completes successfully
- [ ] Return URL works after payment
- [ ] App shows "Payment processing..." message
- [ ] User can be manually upgraded in Supabase
- [ ] Pro features unlock after upgrade

---

## Important Notes

- **Test mode first**: Always test in Stripe test mode before going live
- **Switch to live mode**: When ready, switch to live mode and create new payment link
- **Update return URL**: Make sure return URL points to your production domain
- **Manual upgrades**: For MVP, plan to manually upgrade users after payment

---

## Troubleshooting

**Payment link not working?**
- Check env var is set correctly
- Verify payment link URL is correct
- Check browser console for errors

**User not getting upgraded?**
- Check Supabase `profiles` table
- Verify `is_pro` is set to `true`
- User may need to refresh or sign out/in

**Return URL not working?**
- Make sure URL in Stripe matches your domain exactly
- Check if you need to add `?payment=success` query param
- Test with both dev and production URLs

