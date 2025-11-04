/**
 * Stripe Payment Integration
 * Handles one-time payment for Pro upgrade
 * 
 * Setup:
 * 1. Install: npm install @stripe/stripe-js
 * 2. Get your Stripe publishable key from: https://dashboard.stripe.com/apikeys
 * 3. Add to .env: VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
 * 4. Create a Stripe Checkout Session on your backend
 */

import { analytics, EVENTS } from './analytics';

/**
 * Initiate Stripe Checkout for Pro upgrade
 * 
 * NOTE: This requires @stripe/stripe-js package and a backend API.
 * For MVP, use redirectToStripePayment() instead (no dependencies needed).
 * 
 * @param {Object} userData - Current user data
 * @returns {Promise<Object>} Checkout session or error
 */
export async function createCheckoutSession(userData) {
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey) {
    throw new Error('Stripe not configured. Please contact support.');
  }

  try {
    // TODO: Replace with your backend API endpoint
    // This should call your backend to create a Stripe Checkout Session
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData?.email,
        userId: userData?.id,
        priceId: 'price_xxx', // Your Stripe Price ID for $7.99 one-time payment
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create checkout session');
    }

    const { sessionId } = await response.json();
    
    // NOTE: Uncomment when @stripe/stripe-js is installed (npm install @stripe/stripe-js)
    // const { loadStripe } = await import('@stripe/stripe-js');
    // const stripe = await loadStripe(stripeKey);
    // if (!stripe) {
    //   throw new Error('Failed to load Stripe');
    // }
    // const { error } = await stripe.redirectToCheckout({ sessionId });
    // if (error) throw error;

    // For now, redirect to checkout URL directly (backend should provide this)
    window.location.href = `/checkout?session_id=${sessionId}`;
    
    return { success: true };
  } catch (error) {
    console.error('Stripe checkout error:', error);
    throw error;
  }
}

/**
 * For MVP: Simple redirect-based payment (no backend needed initially)
 * Uses Stripe Payment Links - easier setup
 */
export function redirectToStripePayment(userData) {
  // Check for dev bypass
  if (localStorage.getItem('clay_dev_bypass') === 'true') {
    // In dev bypass mode, just upgrade locally
    console.log('🛠️ Dev bypass: Skipping Stripe payment');
    return { bypassed: true };
  }
  
  // Get your Stripe Payment Link from: https://dashboard.stripe.com/payment-links
  // Format: https://buy.stripe.com/...
  const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK || 'https://buy.stripe.com/6oU5kv9kV4kSbUf79rcAo00';
  
  if (!paymentLink || paymentLink.includes('your_payment_link_here')) {
    throw new Error('Stripe payment link not configured. Please set VITE_STRIPE_PAYMENT_LINK in your environment variables.');
  }

  // Store user email and ID in localStorage for post-payment verification
  if (userData?.email) {
    localStorage.setItem('clay_pending_upgrade_email', userData.email);
    localStorage.setItem('clay_pending_upgrade_user_id', userData.id || '');
    localStorage.setItem('clay_pending_upgrade_timestamp', Date.now().toString());
  }

  // Track payment started (safely - don't block redirect if analytics fails)
  // Use setTimeout to defer and avoid blocking redirect
  setTimeout(() => {
    try {
      analytics.track(EVENTS.PAYMENT_STARTED, {
        userId: userData?.id,
        email: userData?.email,
        isPro: userData?.isPro || false,
      });
    } catch (error) {
      // Don't block payment redirect if analytics fails
      if (import.meta.env.DEV) {
        console.warn('Analytics error (non-blocking):', error);
      }
    }
  }, 0);

  // Redirect to Stripe Payment Link
  // Note: Make sure your Stripe Payment Link has a return URL set to your app
  // e.g., https://yourdomain.com?payment=success
  window.location.href = paymentLink;
}

/**
 * Verify payment completion (call after redirect back)
 * For MVP: This can be a simple webhook or manual verification
 */
export async function verifyPayment(email) {
  // TODO: Call your backend to verify payment
  // Or use Stripe webhooks for automatic verification
  const response = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    return { verified: false };
  }

  const data = await response.json();
  return { verified: data.paid || false };
}

