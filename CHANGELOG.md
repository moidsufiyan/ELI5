# CHANGELOG

All notable changes from the 2026-06-23 audit and repair are documented here.

---

## [2.1.0] - 2026-06-23 — Next.js Upgrade & Hydration Fix

### UPGRADE & RUNTIME FIXES

**`package.json`**
- Upgraded `next` to `14.2.35` (the latest stable release in 14.x branch) to resolve the outdated version dev overlay warning.

**`src/pages/_app.tsx`**
- Refactored Service Worker registration to load inside client-side `useEffect` callback, eliminating interactive `<Script>` tags from the initial rendering path and aligning elements between SSR and client-side hydration.
- Added `suppressHydrationWarning` on the main layout `div` inside `<ThemeProvider>` to ignore CSS classes/theme mismatch warnings.

**`src/pages/about.tsx`**
- Corrected outdated "Powered by OpenAI GPT" copy to say "Powered by Groq AI (LLaMA)", matching correct model configuration.

---

## [2.0.0] - 2026-06-23 — Audit Repair

### CRITICAL FIXES

#### Phase 1 – Environment & Startup

**`.env.local` (populated)**
- Added all required Next.js environment variables: NEXTAUTH_SECRET, NEXTAUTH_URL,
  GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, MONGODB_URI, BACKEND_URL.
- Previously these were only in the root `.env` which is loaded by the Express backend,
  not by Next.js, causing auth routes to fail with 500 errors on first start.

**`src/lib/dbConnect.ts`**
- FIXED: Moved `throw new Error(...)` from module scope into the function body.
- Previously the module-level throw crashed the entire Next.js process if MONGODB_URI
  was not in `.env.local`, even on pages that never touched the database.

**`next.config.js`**
- FIXED: Removed `Cache-Control: max-age=300, s-maxage=600` from all routes.
- HTML pages (`/`, `/simplify`, etc.) now get `no-cache, no-store, must-revalidate`.
- `/_next/static/**` (hashed assets) keeps `immutable` (unchanged).
- This ensures new deployments are reflected immediately without CDN/browser caching
  the old HTML shell.

#### Phase 2 – Stale Cache / PWA

**`public/sw.js`**
- FIXED: Rewrote service worker to use **network-first** strategy for HTML navigation.
- Added `self.skipWaiting()` + `self.clients.claim()` for immediate activation.
- Added versioned `CACHE_NAME` — increment `CACHE_VERSION` on each deployment.
- API calls (`/api/*`) are now explicitly never cached.
- Root cause of "hosted website shows older version until hard refresh" — resolved.

**`src/pages/_app.tsx`**
- FIXED: Disabled service worker registration on `localhost`/`127.0.0.1` and unregistered active service workers in development. This resolves the infinite "Fast Refresh had to perform a full reload" loop caused by the service worker caching webpack's hot reload manifests.

### BACKEND FIXES

#### Phase 3 – Backend Correctness

**`backend/src/middlewares/validate.js`**
- ADDED: `simplifyStreamSchema` — the streaming endpoint now has input validation.
- ADDED: `explanationsSchema` — for the new unified `/api/explanations` endpoint.
- Stream endpoint previously accepted any payload including empty bodies.

**`backend/src/routes/simplifyRoutes.js`**
- FIXED: Applied `validate(simplifyStreamSchema)` to `POST /api/simplify-stream`.
- ADDED: `POST /api/explanations` — unified endpoint accepting `{ text, mode, stream }`.
- Old routes unchanged for backward compatibility.

**`backend/src/controllers/simplifyController.js`**
- FIXED: `searchTopic.replace(' ', '_')` → `replaceAll(' ', '_')` (Wikipedia slug bug
  where only the first space was replaced, breaking multi-word topic lookups).
- FIXED: Added `req.on('close')` handler to detect client disconnects mid-stream.
  Previously the server would attempt to write to a closed socket, causing errors.
- ADDED: `X-Accel-Buffering: no` header to prevent nginx/proxy from buffering SSE.
- REFACTORED: Extracted `fetchWikiContext()`, `buildPrompt()`, `saveToDb()` shared
  helpers to eliminate the ~60 lines of duplicated logic between the two controllers.
- ADDED: `exports.explanations` — unified handler that delegates to stream or regular
  based on `req.body.stream` flag.
- IMPROVED: Errors now logged to `console.error` instead of silently swallowed.

### FRONTEND FIXES

#### Phase 4 – Frontend Cleanup

**`src/lib/hooks/useSimplify.ts`**
- REFACTORED: Merged `useSimplify` and `useSimplifyWithRetry` into a single hook.
- File reduced from 485 lines → ~170 lines.
- `lastParams` now stored in a `useRef` (not state) to avoid stale closures on retry.
- Added proper exponential backoff in retry logic.
- `useSimplifyWithRetry` kept as a re-export alias for backward compatibility.

**`src/lib/utils.ts`**
- FIXED: Removed duplicate `ComplexityLevel` type definition.
- Now re-exports the type from `store.ts` (single source of truth).

**`src/pages/index.tsx`**
- FIXED: Changed "Advanced OpenAI GPT" to "Powered by Groq's ultra-fast LLaMA model".
  The app has always used Groq (LLaMA-3.3-70b), not OpenAI GPT.
- FIXED: Resolved a React hydration mismatch error ("text content does not match server rendered html") caused by checking `typeof window !== 'undefined'` in the rendering lifecycle for SEO metadata. Replaced it with a static `NEXT_PUBLIC_APP_URL` variable.

**`src/pages/about.tsx`**
- FIXED: Resolved a React hydration mismatch error in SEO metadata by replacing dynamic `window.location.origin` lookups with the static `NEXT_PUBLIC_APP_URL` variable.

**`src/pages/api/auth/[...nextauth].ts`**
- FIXED: Added production guard — throws a clear error on startup if `NEXTAUTH_SECRET`
  is not set in a production environment.
- Removed insecure `|| 'secret_placeholder_for_local_development'` fallback from the
  secret field (it now passes `undefined` in dev which NextAuth handles safely).

### DOCUMENTATION

**`README.md`**
- Updated to reflect the actual Node.js Express backend.
- Corrected startup commands (`npm start` for backend, not `python main.py`).
- Updated environment variable documentation.

**`PROJECT_AUDIT.md`** (new file)
- Complete 15-category audit report with severity ratings.

---

## Files Modified

| File | Change Type |
|------|-------------|
| `.env.local` | Modified — populated all required vars |
| `src/lib/dbConnect.ts` | Modified — guard moved inside function |
| `next.config.js` | Modified — Cache-Control headers fixed |
| `public/sw.js` | Rewritten — network-first, skipWaiting, versioned |
| `backend/src/middlewares/validate.js` | Modified — added stream + unified schemas |
| `backend/src/routes/simplifyRoutes.js` | Modified — added validation + new route |
| `backend/src/controllers/simplifyController.js` | Rewritten — shared helpers, bug fixes |
| `src/lib/hooks/useSimplify.ts` | Rewritten — deduplicated |
| `src/lib/utils.ts` | Modified — removed duplicate type |
| `src/pages/index.tsx` | Modified — fixed AI provider copy |
| `src/pages/api/auth/[...nextauth].ts` | Modified — production secret guard |
| `README.md` | Modified — corrected backend documentation |
| `PROJECT_AUDIT.md` | New file |
| `CHANGELOG.md` | New file |

---

## Commands to Run Locally

```powershell
# Terminal 1 — Backend
cd backend
npm start
# Backend running at http://localhost:8000
# Expected output: "ELI5 Standalone Backend listening on port 8000"
#                  "MongoDB Connected to MVC backend daemon."

# Terminal 2 — Frontend
# (from project root)
npm run dev
# Frontend running at http://localhost:3000
```

If you get the EINVAL error on Windows/OneDrive:
```powershell
# From project root — delete the .next cache and restart
Remove-Item -Recurse -Force .next
npm run dev
```

---

## Deployment Instructions

### Vercel (Frontend)

Set the following environment variables in your Vercel project settings:

```
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_atlas_uri
BACKEND_URL=https://your-backend-service-url
NODE_ENV=production
```

### Backend (Render / Railway / any Node host)

Set in the hosting platform environment:

```
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
MONGODB_URI=your_mongodb_atlas_uri
PORT=8000
NODE_ENV=production
ALLOWED_ORIGINS=https://your-domain.vercel.app
```

**Important:** After each deployment, increment `CACHE_VERSION` in `public/sw.js` to
invalidate the service worker cache for all users.
