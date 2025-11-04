# Local Claude API Setup Guide

To use the **real Claude API** in local development (instead of mock data), you have two options:

## Option 1: Use Vercel CLI (Recommended)

Vercel CLI can run serverless functions locally, so your `/api/optimize` endpoint will work.

### Setup Steps:

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Create a `.env.local` file** in the project root:
   ```bash
   CLAUDE_API_KEY=sk-ant-your-api-key-here
   CLAUDE_API_VERSION=2024-02-15-preview
   CLAUDE_MODEL=claude-3-5-sonnet-20241022
   ```

4. **Run Vercel dev** (in one terminal):
   ```bash
   vercel dev
   ```
   This will:
   - Start a server that serves your API routes at `http://localhost:3000/api/optimize`
   - Load environment variables from `.env.local`
   - Hot-reload on changes

5. **Run your Vite dev server** (in another terminal):
   ```bash
   npm run dev
   ```

6. **Update your `.env.local`** to point to the Vercel dev server:
   ```bash
   VITE_API_URL=http://localhost:3000/api/optimize
   ```

## Option 2: Quick Test - Use Production API

If you just want to test quickly, you can temporarily point to your deployed Vercel API:

1. Deploy to Vercel (if not already)
2. Add `CLAUDE_API_KEY` to Vercel environment variables
3. Set in your local `.env`:
   ```bash
   VITE_API_URL=https://your-deployed-domain.vercel.app/api/optimize
   ```

## Option 3: Direct API Call (Not Recommended - Exposes Key)

⚠️ **Security Warning**: This exposes your API key in the client bundle. Only use for local testing!

1. Create `.env.local`:
   ```bash
   VITE_CLAUDE_API_KEY=sk-ant-your-api-key-here
   ```

2. Update `src/utils/claudeApi.js` to use direct API call in dev mode

## Current Setup

The app is configured to:
- Use `/api/optimize` in production (Vercel)
- Fall back to mock API if endpoint not found
- Try `http://localhost:3000/api/optimize` in development

## Quick Start (Recommended)

```bash
# Terminal 1: Start Vercel dev (serves API)
vercel dev

# Terminal 2: Start Vite dev (serves frontend)
npm run dev
```

Then visit `http://localhost:5173` (or whatever port Vite uses) and the real API will work!

## Troubleshooting

**404 on /api/optimize:**
- Make sure `vercel dev` is running
- Check that `api/optimize.js` exists
- Verify `.env.local` has `CLAUDE_API_KEY`

**CORS errors:**
- Vercel dev handles CORS automatically
- Make sure both servers are running

**API key errors:**
- Check `.env.local` has the correct key
- Restart `vercel dev` after adding env vars

