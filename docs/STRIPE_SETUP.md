# Stripe Payment Integration Guide

## Quick Setup (Easiest - Recommended for MVP)

### Option 1: Stripe Payment Links (No Backend Required)

1. **Create a Stripe Account**
   - Go to: https://dashboard.stripe.com/register
   - Complete account setup

2. **Create a Product**
   - Go to: https://dashboard.stripe.com/products
   - Click "Add product"
   - Name: "Clay Pro - Unlimited Resume Optimizations"
   - Price: $7.99
   - Billing: One time
   - Save

3. **Create a Payment Link**
   - Go to: https://dashboard.stripe.com/payment-links
   - Click "New payment link"
   - Select your product
   - Customize if needed
   - Copy the payment link (format: `https://buy.stripe.com/...`)

4. **Add to Environment Variables**
   - Copy `.env.example` to `.env`
   - Add: `VITE_STRIPE_PAYMENT_LINK=https://buy.stripe.com/your_link_here`
   - For Vercel: Add to Project Settings → Environment Variables

5. **That's it!** The app will redirect users to Stripe for payment.

### Option 2: Stripe Checkout (Requires Backend)

For a more custom experience with webhooks and automatic verification:

1. **Get API Keys**
   - Go to: https://dashboard.stripe.com/apikeys
   - Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)

2. **Set up Backend**
   - Create an API endpoint: `/api/create-checkout-session`
   - Use Stripe server-side SDK to create checkout sessions
   - Handle webhooks to verify payments

3. **Add to Environment**
   - Add: `VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...`

## Payment Flow

### Current Implementation

1. User clicks "Upgrade to Pro"
2. If not signed in → Redirects to sign up
3. After sign up → Redirects to Stripe Payment Link
4. User completes payment on Stripe
5. Stripe redirects back (configure in Stripe dashboard)
6. User gets Pro access (manual verification initially)

### Future Enhancement: Automatic Verification

Add webhook endpoint to automatically upgrade users:
- Stripe sends webhook on successful payment
- Backend verifies webhook signature
- Updates user status in database
- User gets instant Pro access

## Testing

### Test Mode
- Use test API keys (starts with `pk_test_`)
- Use test card: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

### Production
- Switch to live keys (starts with `pk_live_`)
- Update Payment Link to production
- Test with real card first

## Security Notes

1. **Never expose secret keys** in frontend code
2. **Verify webhooks** server-side for automatic upgrades
3. **Store payment status** in your database (not just localStorage)
4. **Use HTTPS** in production (required by Stripe)

## Troubleshooting

### Payment Link Not Working
- Check environment variable is set correctly
- Verify Payment Link is active in Stripe dashboard
- Check browser console for errors

### User Not Getting Pro Access
- Current implementation requires manual verification
- Add webhook handler for automatic upgrades
- Or verify payments via Stripe dashboard

## Next Steps

1. ✅ Payment Link setup (current)
2. ⏳ Add webhook handler for auto-verification
3. ⏳ Add payment success page
4. ⏳ Add payment history for users
5. ⏳ Add refund handling


