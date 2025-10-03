# 🚀 ELI5 AI Simplifier - Vercel Serverless Deployment Guide

## 📋 Overview

Your ELI5 AI Simplifier has been configured for serverless deployment on Vercel. The backend Python FastAPI application has been converted to Python serverless functions that work seamlessly with your Next.js frontend.

## 🏗️ Architecture Changes

### Before (Traditional)
```
Frontend (Next.js) → Backend Server (FastAPI on port 8000) → Google Gemini AI
```

### After (Serverless)
```
Frontend (Next.js) → Vercel Serverless Functions (Python) → Google Gemini AI
         ↓
   Single Deployment
```

## 📁 New Project Structure

```
ELI5/
├── api/                      # Python serverless functions
│   ├── _utils.py             # Shared utilities
│   ├── simplify.py          # /api/simplify endpoint
│   ├── simplify-stream.py   # /api/simplify-stream endpoint
│   └── wiki.py              # /api/wiki endpoint
├── src/                      # Next.js frontend (unchanged)
├── requirements.txt          # Python dependencies for Vercel
├── vercel.json              # Vercel configuration
├── .vercelignore            # Files to exclude from deployment
└── backend/                  # Original backend (can be kept for local dev)
```

## ✅ Pre-Deployment Checklist

- [x] Python serverless functions created in `/api` folder
- [x] `requirements.txt` at project root with minimal dependencies
- [x] `vercel.json` configuration file created
- [x] `.vercelignore` to exclude unnecessary files
- [x] Frontend already uses relative API paths (`/api/*`)
- [x] CORS headers configured in Python functions

## 🚀 Deployment Steps

### 1. **Install Vercel CLI** (if not already installed)

```bash
npm install -g vercel
```

### 2. **Login to Vercel**

```bash
vercel login
```

### 3. **Link Your Project** (First Time Only)

```bash
vercel link
```

Follow the prompts to:
- Select or create a Vercel account
- Choose "Create new project" or link to existing
- Confirm project settings

### 4. **Set Environment Variables**

You need to add your Gemini API key to Vercel. Choose one method:

#### Option A: Using Vercel Dashboard (Recommended)
1. Go to your project on [vercel.com](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: Your Google Gemini API key
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

#### Option B: Using Vercel CLI
```bash
vercel env add GEMINI_API_KEY
```
Then paste your API key when prompted.

### 5. **Deploy to Preview** (Testing)

```bash
vercel
```

This creates a preview deployment. Test all features:
- Text simplification
- Streaming mode
- Wikipedia integration
- Theme switching
- All complexity levels

### 6. **Deploy to Production**

Once testing is successful:

```bash
vercel --prod
```

## 🔧 Configuration Details

### vercel.json Explained

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"           // Builds Next.js frontend
    },
    {
      "src": "api/*.py",
      "use": "@vercel/python"          // Builds Python functions
    }
  ],
  "routes": [
    {
      "src": "/api/simplify",
      "dest": "/api/simplify.py"       // Routes to Python function
    },
    {
      "src": "/api/simplify-stream",
      "dest": "/api/simplify-stream.py"
    },
    {
      "src": "/api/wiki/(.*)",
      "dest": "/api/wiki.py"
    }
  ],
  "functions": {
    "api/*.py": {
      "runtime": "python3.9",          // Python runtime version
      "maxDuration": 60                // 60 seconds timeout
    }
  }
}
```

### Python Dependencies (requirements.txt)

Only essential packages needed for serverless:
- `google-genai==0.2.2` - Google Gemini AI SDK
- `httpx==0.28.1` - Async HTTP client for Wikipedia
- `python-dotenv==1.0.1` - Environment variable management

## 🌐 API Endpoints

After deployment, your API endpoints will be:

```
https://your-project.vercel.app/api/simplify
https://your-project.vercel.app/api/simplify-stream
https://your-project.vercel.app/api/wiki/{topic}
```

## 📊 Testing Your Deployment

### 1. Test Basic Simplification
```bash
curl -X POST https://your-project.vercel.app/api/simplify \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Quantum entanglement is a physical phenomenon",
    "level": "ELI5",
    "use_wiki": true,
    "topic": "Quantum entanglement"
  }'
```

### 2. Test Wikipedia Lookup
```bash
curl https://your-project.vercel.app/api/wiki/Quantum%20mechanics
```

### 3. Test Frontend
Visit your deployed URL and:
- ✅ Enter complex text
- ✅ Select different complexity levels
- ✅ Test streaming mode (Professional level)
- ✅ Try Wikipedia context toggle
- ✅ Test theme switching
- ✅ Check copy to clipboard
- ✅ Test on mobile device

## 🔍 Troubleshooting

### Issue: "GEMINI_API_KEY not found"
**Solution**: Make sure you've added the environment variable in Vercel dashboard and redeployed.

### Issue: Python function timeout
**Solution**: The `maxDuration` is set to 60 seconds. For longer processing:
1. Reduce input text length
2. Optimize prompts
3. Consider upgrading Vercel plan for longer timeouts

### Issue: CORS errors
**Solution**: All Python functions already include CORS headers (`Access-Control-Allow-Origin: *`). If still seeing errors, check browser console for details.

### Issue: Streaming not working
**Solution**: Vercel supports streaming with proper headers. If issues persist:
1. Check browser DevTools Network tab
2. Verify `Content-Type: text/event-stream` header
3. Test with non-streaming mode first

### Issue: Build fails
**Solution**: Check Vercel deployment logs:
```bash
vercel logs
```
Common causes:
- Missing dependencies in `requirements.txt`
- Syntax errors in Python files
- Invalid `vercel.json` configuration

## 🔄 Local Development

You can still use your original backend for local development:

### Terminal 1 - Backend (Optional for local dev)
```bash
cd backend
python main.py
```

### Terminal 2 - Frontend
```bash
npm run dev
```

## 📈 Monitoring & Logs

### View Deployment Logs
```bash
vercel logs your-project-url
```

### View Real-time Logs
```bash
vercel logs --follow
```

### Check Function Metrics
Go to Vercel Dashboard → Your Project → Analytics to see:
- Request count
- Error rate
- Function duration
- Bandwidth usage

## 💰 Vercel Limits (Hobby Plan)

- **Deployments**: Unlimited
- **Bandwidth**: 100GB/month
- **Function Execution**: 100GB-Hrs/month
- **Function Duration**: 10 seconds (configurable up to 60s)
- **Concurrent Executions**: 1000

For production apps, consider Pro plan for:
- Longer function timeouts
- More bandwidth
- Team collaboration
- Custom domains

## 🔐 Security Best Practices

1. **Never commit API keys** - Always use environment variables
2. **Use Vercel Secrets** - Store sensitive data securely
3. **Enable Preview Protection** - Require authentication for preview deployments
4. **Monitor Usage** - Check Vercel analytics regularly
5. **Rate Limiting** - Consider adding rate limiting for API endpoints

## 🎉 Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ All pages load correctly
- ✅ Text simplification works (all levels)
- ✅ Streaming mode functions properly
- ✅ Wikipedia integration works
- ✅ Theme switching persists
- ✅ No console errors in browser
- ✅ Mobile responsive design works

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/runtimes/python)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Google Gemini AI](https://ai.google.dev/docs)

## 🆘 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review browser console errors
3. Test API endpoints directly with curl
4. Verify environment variables are set
5. Check Vercel status page

## 🎯 Next Steps After Deployment

1. **Custom Domain**: Add your custom domain in Vercel settings
2. **Analytics**: Enable Vercel Analytics for insights
3. **Performance**: Monitor and optimize function performance
4. **SEO**: Add meta tags and sitemap
5. **Monitoring**: Set up error tracking (Sentry, LogRocket)

---

**🎉 Congratulations!** Your ELI5 AI Simplifier is now deployed as a fully serverless application on Vercel!

Your app is:
- ✅ Globally distributed via Vercel's CDN
- ✅ Automatically scaled based on traffic
- ✅ Zero server management required
- ✅ Fast edge network delivery
- ✅ Continuous deployment from Git

**Live URL**: `https://your-project.vercel.app`

Enjoy your serverless ELI5 AI Simplifier! 🚀
