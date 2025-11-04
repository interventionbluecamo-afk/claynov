# Analytics Setup Guide

## Overview

Analytics tracking is implemented using PostHog (recommended) with graceful fallback to console logging in development. All critical user events are tracked to help you make data-driven decisions.

## Quick Start

### 1. Sign up for PostHog (Free tier available)

1. Go to [https://posthog.com](https://posthog.com)
2. Sign up for a free account
3. Create a new project
4. Copy your Project API Key

### 2. Add PostHog to Your Site

Add the PostHog snippet to `index.html` before the closing `</head>` tag:

```html
<script>
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return e.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId getSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('YOUR_PROJECT_API_KEY',{api_host:'https://app.posthog.com'})
</script>
```

**Replace `YOUR_PROJECT_API_KEY` with your actual PostHog project key.**

### 3. Verify It's Working

1. Open your site in the browser
2. Open browser DevTools → Console
3. You should see: `📊 Analytics: page_viewed` (in development mode)
4. Check PostHog dashboard → Events → You should see events flowing in

## Tracked Events

### Acquisition Events
- `page_viewed` - Any page view
- `landing_page_viewed` - Homepage view

### Activation Events
- `resume_uploaded` - User uploads a resume file
- `job_description_entered` - User enters job description
- `optimization_started` - User clicks "Optimize"
- `optimization_completed` - Optimization succeeds
- `optimization_failed` - Optimization fails
- `resume_downloaded` - User downloads optimized resume

### Engagement Events
- `tone_changed` - User changes writing style
- `format_changed` - User changes format (Pro feature)
- `section_expanded` - User expands a collapsible section
- `interview_questions_generated` - User generates questions (Pro)
- `regenerate_clicked` - User clicks "Regenerate"

### Conversion Events
- `email_captured` - Email collected (if implemented)
- `signup_started` - User opens signup page
- `signup_completed` - User successfully signs up
- `signup_failed` - Signup fails
- `upgrade_modal_viewed` - Pricing page shown
- `upgrade_clicked` - User clicks upgrade button
- `pricing_page_viewed` - Pricing page viewed
- `payment_started` - User redirected to Stripe
- `payment_completed` - Payment detected (via localStorage flag)
- `payment_failed` - Payment error

### Retention Events
- `new_optimization_started` - User starts a new optimization
- `returning_user` - User returns after previous visit

### Friction Events
- `error_occurred` - Any error in the app
- `free_limit_reached` - User hits 3 free uses limit
- `exit_intent_shown` - Exit intent popup shown (if implemented)

## Event Properties

Each event includes relevant properties for analysis:

**Example: `optimization_started`**
```javascript
{
  useCount: 2,
  isPro: false,
  tone: 'professional',
  resumeLength: 2450,
  resumeWordCount: 380,
  jobDescLength: 1200,
  jobDescWordCount: 180,
  hasAccount: true
}
```

## Privacy Considerations

- **No PII in events**: File names are anonymized (only extension shown)
- **User identification**: Only done for authenticated users (with consent)
- **IP addresses**: Not logged in events (PostHog may collect separately)
- **GDPR compliance**: PostHog supports GDPR compliance features

## Development Mode

In development, all events are logged to the console:
```
📊 Analytics: resume_uploaded { fileType: 'pdf', fileSize: 245, ... }
👤 Analytics Identify: user-123 { email: 'user@example.com', isPro: false }
📄 Page View: Step 1
```

## Custom Events

To track a custom event:

```javascript
import { analytics, EVENTS } from './utils/analytics';

// Track a custom event
analytics.track('custom_event_name', {
  property1: 'value1',
  property2: 'value2',
});

// Or use predefined events
analytics.track(EVENTS.OPTIMIZATION_STARTED, {
  useCount: 3,
  isPro: false,
});
```

## User Identification

Users are automatically identified when they sign up:

```javascript
analytics.identify(userId, {
  email: user.email,
  isPro: user.isPro,
  name: user.name,
  signupDate: user.created_at,
});
```

## Analytics Dashboard Recommendations

### Key Metrics to Track

1. **Conversion Funnel:**
   - Landing page → Resume upload → Job desc → Optimization → Download
   - Track drop-off at each step

2. **Upgrade Funnel:**
   - Limit reached → Pricing page viewed → Upgrade clicked → Payment started → Payment completed

3. **Engagement Metrics:**
   - Average optimizations per user
   - Tone changes per session
   - Interview questions usage (Pro feature)

4. **Error Tracking:**
   - Error frequency by type
   - Error rate by step
   - Most common failure points

### PostHog Insights to Create

1. **Funnel Analysis:**
   - Landing → Upload → Optimize → Download
   - Signup → Upgrade → Payment

2. **Retention:**
   - Day 1, Day 7, Day 30 retention
   - Returning user rate

3. **Feature Usage:**
   - Tone changes by user segment
   - Pro feature adoption

4. **Conversion:**
   - Free → Pro conversion rate
   - Time to upgrade

## Troubleshooting

### Events not showing in PostHog

1. Check browser console for errors
2. Verify PostHog script is loaded: `window.posthog` in console
3. Check PostHog dashboard → Project Settings → API Keys
4. Verify CORS settings in PostHog (if using custom domain)

### Development logs not showing

- Ensure `import.meta.env.DEV` is true (Vite default)
- Check browser console (not server logs)

### Too many events

- PostHog free tier: 1M events/month
- Consider sampling for high-volume events
- Filter out development events in PostHog

## Alternative Analytics Tools

If you prefer other tools, you can easily swap PostHog:

1. **Google Analytics 4:**
   ```javascript
   // In analytics.js
   if (window.gtag) {
     window.gtag('event', event, properties);
   }
   ```

2. **Mixpanel:**
   ```javascript
   if (window.mixpanel) {
     window.mixpanel.track(event, properties);
   }
   ```

3. **Amplitude:**
   ```javascript
   if (window.amplitude) {
     window.amplitude.getInstance().logEvent(event, properties);
   }
   ```

## Next Steps

1. ✅ Add PostHog script to `index.html`
2. ✅ Verify events are flowing
3. ✅ Set up key dashboards in PostHog
4. ✅ Create conversion funnels
5. ✅ Set up alerts for critical errors
6. ⚪ Implement A/B testing (PostHog supports this)
7. ⚪ Add session recordings (PostHog feature)

## Support

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Community](https://posthog.com/community)
- Analytics code: `src/utils/analytics.js`

