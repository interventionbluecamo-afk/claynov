# API 404 Error - Troubleshooting

## Issue
The `/api/optimize` endpoint returns 404 (Not Found).

## Causes

1. **Vercel serverless function not deployed**
   - The `api/optimize.js` file exists but isn't being served
   - Vercel might not recognize the API route

2. **Development environment**
   - Local dev server doesn't serve Vercel serverless functions
   - Need to use mock API or deploy to Vercel

3. **Incorrect API URL**
   - The endpoint path might be wrong
   - CORS or routing issues

## Solutions

### Option 1: Use Mock API (Development)

The app automatically falls back to mock API if the serverless function fails. This is fine for development.

### Option 2: Deploy to Vercel

1. Push code to GitHub
2. Deploy to Vercel
3. Add `CLAUDE_API_KEY` to Vercel environment variables
4. The `/api/optimize` endpoint will work automatically

### Option 3: Local Development with API

For local development with the API:
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel dev`
3. This will serve the API routes locally

### Current Implementation

The code now:
- Tries `/api/optimize` in production
- Falls back to mock API if endpoint doesn't exist
- Shows a helpful message: "Using demo optimization (backend not configured)"

## Verification

Check if the endpoint exists:
- **Production**: `https://yourdomain.com/api/optimize`
- **Local**: `http://localhost:3000/api/optimize` (only with `vercel dev`)

If you see 404, the mock API will be used automatically - the app will still work!

