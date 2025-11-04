/**
 * Claude AI API integration for resume optimization
 * Uses Vercel serverless function as proxy to avoid CORS issues
 * API key should be stored in Vercel environment variables (CLAUDE_API_KEY)
 */

export async function optimizeResume(resumeText, jobDescription, tone = 'professional') {
  // Use serverless function proxy instead of direct API call
  // This avoids CORS issues and keeps the API key secure on the server
  // 
  // Priority:
  // 1. VITE_API_URL env var (if set)
  // 2. In dev: Try localhost:3000 (Vercel dev) or current origin
  // 3. In production: Use /api/optimize (Vercel serverless function)
  const isDev = import.meta.env.DEV || window.location.hostname === 'localhost';
  let apiUrl = import.meta.env.VITE_API_URL;
  
  if (!apiUrl) {
    if (isDev) {
      // Try Vercel dev server first, then fallback to same origin
      apiUrl = 'http://localhost:3000/api/optimize';
    } else {
      // Production: use relative path (Vercel will route to serverless function)
      apiUrl = '/api/optimize';
    }
  }

  try {
    // Call our Vercel serverless function proxy
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resumeText,
        jobDescription,
        tone
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    
    // The proxy already parses the JSON response
    if (!data.success) {
      throw new Error(data.error || 'Failed to optimize resume');
    }

    return {
      success: true,
      ...data
    };
  } catch (error) {
    console.error('Claude API error:', error);
    
    // If proxy fails, check if it's a CORS/network error (proxy might not be deployed)
    if (error.message?.includes('Failed to fetch') || error.name === 'TypeError') {
      throw new Error('CORS_BLOCKED: Backend proxy not available. Please deploy the Vercel serverless function or use mock API for development.');
    }
    
    throw error;
  }
}

