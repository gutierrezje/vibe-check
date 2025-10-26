# Netlify Deployment Guide for Vibe Check

This guide walks you through deploying your Vibe Check app to Netlify with UploadThing integration.

## Prerequisites

1. UploadThing account and API keys ([uploadthing.com](https://uploadthing.com))
2. Netlify account ([netlify.com](https://netlify.com))
3. Git repository connected to your project

## Quick Start

### 1. Set Up Environment Variables

First, copy the example environment file:

```bash
cp .env.example .env
```

Add your UploadThing token to `.env`:

```env
UPLOADTHING_TOKEN=your_token_here
```

**Note:** UploadThing v7 uses a single `UPLOADTHING_TOKEN` instead of separate SECRET and APP_ID.

**Important:** Never commit `.env` to your repository!

### 2. Test Locally with Netlify Dev

Run the app with Netlify Functions locally:

```bash
pnpm dev:netlify
```

This will:

- Start your Vite dev server
- Start Netlify Functions locally
- Make the UploadThing API available at `http://localhost:8888/.netlify/functions/uploadthing`

Test the upload functionality before deploying.

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify CLI

1. Install Netlify CLI globally (if not already):

```bash
pnpm add -g netlify-cli
```

2. Login to Netlify:

```bash
netlify login
```

3. Initialize your site:

```bash
netlify init
```

4. Set environment variables:

```bash
netlify env:set UPLOADTHING_TOKEN "your_token_here"
```

5. Deploy:

```bash
netlify deploy --prod
```

#### Option B: Deploy via Netlify Dashboard

1. Push your code to GitHub/GitLab/Bitbucket

2. Go to [app.netlify.com](https://app.netlify.com) and click "Add new site"

3. Connect your Git repository

4. Configure build settings:
   - **Build command:** `pnpm build`
   - **Publish directory:** `dist`
   - **Functions directory:** `netlify/functions`

5. Add environment variables in Site settings → Environment variables:
   - `UPLOADTHING_TOKEN`

6. Click "Deploy site"

## Important Configuration Files

### netlify.toml

This file is already configured with:

- pnpm as package manager
- Node.js 20
- Redirects for API endpoints
- SPA fallback routing

```toml
[build]
  command = "pnpm build"
  publish = "dist"
  functions = "netlify/functions"

[build.environment]
  NODE_VERSION = "20"
```

### netlify/functions/uploadthing.ts

Your UploadThing API handler is configured as a Netlify Function. It:

- Handles file uploads via UploadThing
- Supports CORS for your frontend
- Returns upload URLs and file keys

## Troubleshooting

### Upload Fails in Production

1. **Check environment variables:**

   ```bash
   netlify env:list
   ```

   Make sure `UPLOADTHING_TOKEN` is set.

2. **Check function logs:**
   - Go to Netlify Dashboard → Functions → uploadthing
   - View the function logs for errors

3. **Verify UploadThing API keys:**
   - Go to your UploadThing dashboard
   - Regenerate keys if necessary

### CORS Errors

The Netlify Function is configured with CORS headers. If you still see CORS errors:

1. Check that the function is being called at `/api/uploadthing`
2. Verify the redirect in `netlify.toml` is working
3. Check browser DevTools → Network tab for the actual endpoint being called

### Build Fails

1. **pnpm not recognized:**
   - Netlify should auto-detect pnpm from `pnpm-lock.yaml`
   - If not, add to `netlify.toml`: `NPM_FLAGS = "--shamefully-hoist"`

2. **TypeScript errors:**

   ```bash
   pnpm build
   ```

   Fix any errors locally first.

3. **Function build errors:**
   - Check `netlify/functions/uploadthing.ts` for syntax errors
   - Ensure all imports are correct

### Function Timeout

If uploads fail with timeout errors:

1. Check UploadThing dashboard for any issues
2. Verify file sizes are under 10MB limit
3. Check Netlify function execution time (default: 10s on free tier)

## Local Development Tips

### Using Netlify Dev

```bash
pnpm dev:netlify
```

This runs Vite + Netlify Functions together. Benefits:

- Test functions locally before deploying
- Environment variables from `.env` are automatically loaded
- Matches production environment closely

### Using Vite Only

```bash
pnpm dev
```

This runs only Vite. Note: UploadThing won't work without the backend function.

## Environment Variables Reference

| Variable            | Description          | Where to Get                                     |
| ------------------- | -------------------- | ------------------------------------------------ |
| `UPLOADTHING_TOKEN` | API Token (v7)       | UploadThing Dashboard → API Keys → Copy Token   |

**Note:** UploadThing v7 uses a single token instead of separate SECRET and APP_ID.

## Post-Deployment Checklist

- [ ] Environment variables set in Netlify
- [ ] Test image upload on production site
- [ ] Check Netlify Functions logs for errors
- [ ] Verify uploads appear in UploadThing dashboard
- [ ] Test on different browsers and devices
- [ ] Set up custom domain (optional)

## Support Resources

- [Netlify Documentation](https://docs.netlify.com)
- [Netlify Functions Guide](https://docs.netlify.com/functions/overview/)
- [UploadThing Documentation](https://docs.uploadthing.com)
- [Vite Deployment Guide](https://vite.dev/guide/static-deploy.html)

## Common Commands

```bash
# Local development with Netlify
pnpm dev:netlify

# Build for production
pnpm build

# Preview production build
pnpm preview

# Deploy to production
netlify deploy --prod

# View function logs
netlify functions:log uploadthing

# Open Netlify dashboard
netlify open
```
