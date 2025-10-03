# ⚡ Quick Deploy to Vercel - Cheat Sheet

## 🚀 5-Minute Deploy

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd "C:\Users\Moid Sufiyan\OneDrive - Vardhaman College of Engineering\Documents\MyWorkspace\ELI5"
vercel
```

### Step 4: Add API Key
Go to Vercel Dashboard → Your Project → Settings → Environment Variables

Add:
- **Name**: `GEMINI_API_KEY`
- **Value**: `your-google-gemini-api-key`
- **Environments**: ✅ Production ✅ Preview ✅ Development

### Step 5: Redeploy
```bash
vercel --prod
```

## ✅ That's It!

Your app is live at: `https://your-project.vercel.app`

---

## 📋 Files Created for Deployment

- ✅ `/api/_utils.py` - Shared utilities
- ✅ `/api/simplify.py` - Main simplification endpoint
- ✅ `/api/simplify-stream.py` - Streaming endpoint
- ✅ `/api/wiki.py` - Wikipedia lookup
- ✅ `/requirements.txt` - Python dependencies
- ✅ `/vercel.json` - Vercel configuration
- ✅ `/.vercelignore` - Exclude files

## 🧪 Test Your Deployment

Visit your URL and test:
- ✅ Text simplification (all 3 levels)
- ✅ Streaming mode (Professional level)
- ✅ Wikipedia integration
- ✅ Theme switching (light/dark)
- ✅ Mobile responsiveness

## 🐛 Quick Troubleshooting

**API Key Error?**
```bash
vercel env add GEMINI_API_KEY
# Then redeploy
vercel --prod
```

**Build Failed?**
```bash
vercel logs
```

**Need Help?**
Check `VERCEL_DEPLOYMENT.md` for full guide.

---

## 🔄 Update Deployment

After making changes:
```bash
git add .
git commit -m "your changes"
git push origin main
```

Vercel auto-deploys from Git! 🎉

Or manual deploy:
```bash
vercel --prod
```

---

**Pro Tip**: Connect your GitHub repo to Vercel for automatic deployments on every push!
