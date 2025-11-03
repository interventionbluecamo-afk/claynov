# Deploy to Vercel

## Quick Deploy

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository
   - Vercel will auto-detect Vite settings

3. **Environment Variables (Important!):**
   - In Vercel project settings → Environment Variables
   - Add: `VITE_CLAUDE_API_KEY` = `your_api_key_here`
   - Optional: `VITE_CLAUDE_API_VERSION` = `2024-02-15-preview`
   - Optional: `VITE_CLAUDE_MODEL` = `claude-3-5-sonnet-20241022`

4. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

## Manual Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# For production
vercel --prod
```

## Notes

- The `vercel.json` file is already configured
- Build output goes to `dist/` directory
- All routes are handled by the React app (SPA routing)
- Environment variables starting with `VITE_` are automatically exposed to the client

## Troubleshooting

If build fails:
1. Check that all dependencies are in `package.json`
2. Ensure Node.js version is 18+
3. Check Vercel build logs for errors

If API doesn't work:
1. Verify environment variables are set correctly in Vercel
2. Check that API key has credits
3. Check browser console for errors

