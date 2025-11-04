# Quick Start: Use Real Claude API Locally

## Fastest Way (2 minutes)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `.env.local` file** (in project root):
   ```bash
   CLAUDE_API_KEY=sk-ant-your-actual-api-key-here
   ```

3. **Start Vercel dev** (serves API):
   ```bash
   vercel dev
   ```
   Press Enter to accept defaults, then it will start on port 3000

4. **In a NEW terminal, start Vite:**
   ```bash
   npm run dev
   ```

5. **Done!** Your app at `http://localhost:5173` will now use the real Claude API.

## Why This Works

- `vercel dev` serves your `/api/optimize.js` serverless function locally
- It reads `CLAUDE_API_KEY` from `.env.local`
- Your Vite app calls `http://localhost:3000/api/optimize`
- Real API calls happen, using your credits!

## Troubleshooting

**"Port 3000 already in use":**
- Change Vite port: Edit `vite.config.js` → `server.port: 5173`
- Or stop other services on port 3000

**"API key not found":**
- Make sure `.env.local` exists (not `.env`)
- Restart `vercel dev` after creating the file
- Check the key starts with `sk-ant-`

**Still getting 404:**
- Make sure `api/optimize.js` exists
- Check `vercel dev` is running
- Look for "Ready! Available at" message in terminal

## Alternative: Deploy to Vercel

If you want to test on production:
1. Push to GitHub
2. Deploy to Vercel
3. Add `CLAUDE_API_KEY` in Vercel dashboard → Settings → Environment Variables
4. Your deployed app will use real API automatically

