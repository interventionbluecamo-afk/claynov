# Claude API Setup - Backend Proxy

The Claude API cannot be called directly from the browser due to CORS restrictions. We use a Vercel serverless function as a proxy.

## Quick Setup

### 1. Add Environment Variable in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following:
   - **Name**: `CLAUDE_API_KEY`
   - **Value**: Your Anthropic API key (from https://console.anthropic.com/)
   - **Environment**: Production, Preview, Development (select all)

### 2. Optional: Additional Environment Variables

You can also add these (optional, defaults are set):
- `CLAUDE_API_VERSION` (default: `2024-02-15-preview`)
- `CLAUDE_MODEL` (default: `claude-3-5-sonnet-20241022`)

### 3. Deploy

The serverless function is already created at `/api/optimize.js`. Just push to GitHub and Vercel will automatically deploy it.

```bash
git add api/optimize.js
git commit -m "Add Claude API proxy serverless function"
git push origin main
```

### 4. Test

Once deployed, the app will automatically use the proxy instead of trying to call the API directly. The proxy:
- ✅ Avoids CORS issues
- ✅ Keeps your API key secure (never exposed to client)
- ✅ Works in production

## Local Development

For local development, you have two options:

### Option 1: Use Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Run dev server with serverless functions
vercel dev
```

This will run your app with serverless functions locally, and you can add `CLAUDE_API_KEY` to your local `.env` file.

### Option 2: Use Mock API

The app will automatically fall back to the mock API if the proxy is not available. This is fine for UI development but won't use real AI.

## How It Works

1. **Client** (`src/utils/claudeApi.js`) makes a request to `/api/optimize`
2. **Serverless Function** (`api/optimize.js`) receives the request
3. **Serverless Function** calls Anthropic API with the secure API key
4. **Serverless Function** returns the response to the client

This way:
- ✅ API key stays on the server (never exposed)
- ✅ No CORS issues
- ✅ Works in production

## Troubleshooting

### "Backend proxy not available" error

This means the serverless function isn't deployed or accessible. Make sure:
1. The `api/optimize.js` file exists
2. You've pushed to GitHub
3. Vercel has deployed the function
4. The environment variable `CLAUDE_API_KEY` is set in Vercel

### Still seeing CORS errors

If you're still seeing CORS errors, the serverless function might not be working. Check:
1. Vercel deployment logs
2. Browser network tab to see if `/api/optimize` is being called
3. That the function is deployed correctly

## Security Notes

- ✅ API key is stored in Vercel environment variables (secure)
- ✅ API key is never exposed to the client
- ✅ Serverless function validates requests
- ✅ Only POST requests are allowed

