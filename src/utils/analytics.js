/**
 * Analytics tracking utility
 * Supports PostHog (recommended) and console logging for development
 * 
 * To enable PostHog:
 * 1. Sign up at https://posthog.com (free tier available)
 * 2. Add PostHog script to index.html:
 *    <script>
 *       !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return e.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys onSessionId getSessionId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
 *       posthog.init('YOUR_PROJECT_API_KEY',{api_host:'https://app.posthog.com'})
 *     </script>
 * 3. Replace 'YOUR_PROJECT_API_KEY' with your actual PostHog project key
 */

// Critical events to track
export const EVENTS = {
  // Acquisition
  PAGE_VIEW: 'page_viewed',
  LANDING_PAGE_VIEW: 'landing_page_viewed',

  // Activation
  RESUME_UPLOADED: 'resume_uploaded',
  JOB_DESC_ENTERED: 'job_description_entered',
  OPTIMIZATION_STARTED: 'optimization_started',
  OPTIMIZATION_COMPLETED: 'optimization_completed',
  OPTIMIZATION_FAILED: 'optimization_failed',
  RESUME_DOWNLOADED: 'resume_downloaded',

  // Engagement
  TONE_CHANGED: 'tone_changed',
  FORMAT_CHANGED: 'format_changed',
  SECTION_EXPANDED: 'section_expanded',
  INTERVIEW_QUESTIONS_GENERATED: 'interview_questions_generated',
  REGENERATE_CLICKED: 'regenerate_clicked',

  // Conversion
  EMAIL_CAPTURED: 'email_captured',
  SIGNUP_STARTED: 'signup_started',
  SIGNUP_COMPLETED: 'signup_completed',
  SIGNUP_FAILED: 'signup_failed',
  UPGRADE_MODAL_VIEWED: 'upgrade_modal_viewed',
  UPGRADE_CLICKED: 'upgrade_clicked',
  PRICING_PAGE_VIEWED: 'pricing_page_viewed',
  PAYMENT_STARTED: 'payment_started',
  PAYMENT_COMPLETED: 'payment_completed',
  PAYMENT_FAILED: 'payment_failed',

  // Retention
  NEW_OPTIMIZATION_STARTED: 'new_optimization_started',
  RETURNING_USER: 'returning_user',

  // Friction
  ERROR_OCCURRED: 'error_occurred',
  LIMIT_REACHED: 'free_limit_reached',
  EXIT_INTENT_SHOWN: 'exit_intent_shown',

  // Feature Usage
  PROFILE_VIEWED: 'profile_viewed',
  TERMS_VIEWED: 'terms_viewed',
  PRIVACY_VIEWED: 'privacy_viewed',
};

// Safe wrapper to check if PostHog is available (function declaration for hoisting)
function isPostHogReady() {
  try {
    return typeof window !== 'undefined' && 
           window.posthog && 
           typeof window.posthog.capture === 'function';
  } catch {
    return false;
  }
}

// Lazy initialization flag
let analyticsInitialized = false;

// Initialize analytics after a short delay to avoid initialization issues
const ensureAnalyticsReady = () => {
  if (analyticsInitialized) return;
  analyticsInitialized = true;
};

export const analytics = {
  /**
   * Track an event with optional properties
   * @param {string} event - Event name (use EVENTS constants)
   * @param {object} properties - Additional event properties
   */
  track: (event, properties = {}) => {
    // Defer execution to next tick to avoid initialization issues
    if (typeof window === 'undefined') return;
    
    try {
      // Use requestIdleCallback or setTimeout for non-blocking execution
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          try {
            ensureAnalyticsReady();
            if (isPostHogReady()) {
              window.posthog.capture(event, properties);
            }
            if (import.meta.env.DEV) {
              console.log('📊 Analytics:', event, properties);
            }
          } catch (err) {
            if (import.meta.env.DEV) {
              console.warn('Analytics error:', err);
            }
          }
        }, { timeout: 100 });
      } else {
        setTimeout(() => {
          try {
            ensureAnalyticsReady();
            if (isPostHogReady()) {
              window.posthog.capture(event, properties);
            }
            if (import.meta.env.DEV) {
              console.log('📊 Analytics:', event, properties);
            }
          } catch (err) {
            if (import.meta.env.DEV) {
              console.warn('Analytics error:', err);
            }
          }
        }, 0);
      }
    } catch (error) {
      // Silently fail - don't break the app if analytics fails
      if (import.meta.env.DEV) {
        console.warn('Analytics tracking error:', error);
      }
    }
  },

  /**
   * Identify a user with traits
   * @param {string} userId - User ID
   * @param {object} traits - User traits (email, isPro, etc.)
   */
  identify: (userId, traits = {}) => {
    if (typeof window === 'undefined') return;
    
    setTimeout(() => {
      try {
        ensureAnalyticsReady();
        if (isPostHogReady() && typeof window.posthog.identify === 'function') {
          window.posthog.identify(userId, traits);
          
          if (import.meta.env.DEV) {
            console.log('👤 Analytics Identify:', userId, traits);
          }
        }
      } catch (error) {
        // Silently fail - don't break the app if analytics fails
        if (import.meta.env.DEV) {
          console.warn('Analytics identify error:', error);
        }
      }
    }, 0);
  },

  /**
   * Track page view
   * @param {string} pageName - Name of the page
   * @param {object} properties - Additional properties
   */
  page: (pageName, properties = {}) => {
    if (typeof window === 'undefined') return;
    
    setTimeout(() => {
      try {
        ensureAnalyticsReady();
        if (isPostHogReady()) {
          window.posthog.capture('$pageview', { 
            page: pageName,
            ...properties 
          });
        }

        if (import.meta.env.DEV) {
          console.log('📄 Page View:', pageName, properties);
        }
      } catch (error) {
        // Silently fail - don't break the app if analytics fails
        if (import.meta.env.DEV) {
          console.warn('Analytics page tracking error:', error);
        }
      }
    }, 0);
  },

  /**
   * Reset user identification (on logout)
   */
  reset: () => {
    if (typeof window === 'undefined') return;
    
    setTimeout(() => {
      try {
        ensureAnalyticsReady();
        if (isPostHogReady() && typeof window.posthog.reset === 'function') {
          window.posthog.reset();
          
          if (import.meta.env.DEV) {
            console.log('🔄 Analytics Reset');
          }
        }
      } catch (error) {
        // Silently fail - don't break the app if analytics fails
        if (import.meta.env.DEV) {
          console.warn('Analytics reset error:', error);
        }
      }
    }, 0);
  },
};

// Helper to safely get file info without exposing sensitive data
export function getFileInfo(file) {
  if (!file) return {};
  
  const extension = file.name.split('.').pop()?.toLowerCase() || 'unknown';
  const sizeKB = Math.round(file.size / 1024);
  
  // Anonymize filename (only show extension)
  const anonymizedName = `file.${extension}`;
  
  return {
    fileType: extension,
    fileSize: sizeKB,
    fileName: anonymizedName,
    // Size categories for analysis
    sizeCategory: sizeKB < 100 ? 'small' : sizeKB < 500 ? 'medium' : 'large',
  };
}

// Helper to safely get text length info
export function getTextInfo(text) {
  if (!text) return { length: 0, wordCount: 0 };
  
  return {
    length: text.length,
    wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
    category: text.length < 1000 ? 'short' : text.length < 5000 ? 'medium' : 'long',
  };
}

