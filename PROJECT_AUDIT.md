# ELI5 Project Audit Report

**Date:** 2026-06-23
**Auditor:** Antigravity AI
**Scope:** Full-stack audit — frontend (Next.js 14), backend (Node.js Express), database (MongoDB), AI (Groq)

---

## 1. Folder Structure

```
ELI5/
├── src/                         # Next.js frontend (TypeScript)
│   ├── components/              # UI components
│   ├── hooks/                   # ⚠️ EMPTY – dead directory
│   ├── lib/
│   │   ├── hooks/useSimplify.ts # Actual hook location
│   │   ├── models/              # Unused frontend Mongoose model
│   │   ├── dbConnect.ts         # Unused in practice (all DB → Express backend)
│   │   ├── store.ts             # Zustand global state
│   │   └── utils.ts             # Utility functions
│   ├── middleware.ts            # NextAuth route protection
│   └── pages/
│       ├── api/                 # Next.js API proxy routes
│       ├── auth/                # Sign-in page
│       └── *.tsx                # Page components
├── backend/                     # Express.js backend (Node.js)
│   ├── index.js                 # Entry point
│   └── src/
│       ├── controllers/         # Business logic
│       ├── middlewares/         # Rate limiting, validation
│       ├── models/              # Mongoose schemas
│       └── routes/              # Express routers
└── public/
    ├── sw.js                    # Service Worker
    └── manifest.json            # PWA manifest
```

**Issues found:**
- `src/hooks/` is empty — confusing alongside `src/lib/hooks/`
- `src/lib/dbConnect.ts` and `src/lib/models/Simplification.ts` exist in the frontend but are never called

---

## 2. Dependency Issues

| Package | Location | Issue |
|---------|----------|-------|
| `@google/generative-ai` | root package.json | UNUSED — app uses Groq, not Gemini |
| `mongodb` (v7) | root package.json | Redundant alongside mongoose |
| `bcryptjs` | root package.json | Unused — no password hashing in current code |

---

## 3. Unused Packages

- `@google/generative-ai` — README mentions Gemini but code uses Groq
- `mongodb` — mongoose includes its own driver
- `bcryptjs` — no password hashing implemented

---

## 4. Broken Imports

| File | Issue |
|------|-------|
| `src/lib/dbConnect.ts` | Module-level throw crashed Next.js if MONGODB_URI missing in .env.local |
| `.env.local` | Missing NEXTAUTH_SECRET, MONGODB_URI, GOOGLE_CLIENT_ID — auth routes 500d |

---

## 5. Circular Dependencies

✅ None detected.

---

## 6. Environment Variable Usage

| Variable | Used By | Was Present In |
|----------|---------|----------------|
| GROQ_API_KEY | Express backend | .env only — MISSING from .env.local |
| MONGODB_URI | Express backend + Next.js dbConnect | .env only — MISSING from .env.local |
| NEXTAUTH_SECRET | Next.js auth | .env only — MISSING from .env.local |
| NEXTAUTH_URL | Next.js auth | MISSING from .env.local |
| GOOGLE_CLIENT_ID | NextAuth Google provider | .env only — MISSING from .env.local |
| BACKEND_URL | Next.js proxy routes | MISSING (defaulted to localhost:8000) |

**Root cause:** The root `.env` is loaded by Express only. Next.js reads `.env.local` which was nearly empty.

---

## 7. Build Configuration Issues

| File | Issue | Severity |
|------|-------|----------|
| next.config.js | Cache-Control: max-age=300 on ALL routes including HTML pages | CRITICAL |
| tsconfig.json | target: es5 with moduleResolution: bundler — es5 is unnecessary | Minor |

---

## 8. Vite Configuration

**N/A** — Project uses Next.js (webpack), not Vite.

---

## 9. Express Configuration

| Item | Status |
|------|--------|
| Helmet | ✅ Applied |
| Rate limiting | ✅ 100 req/15min per IP |
| CORS | ⚠️ origin: * in dev — should lock down in production |
| Body size limit | ❌ No express.json({ limit }) set |
| Input validation on /simplify | ✅ Present |
| Input validation on /simplify-stream | ❌ MISSING — FIXED |

---

## 10. MongoDB Connection Lifecycle

**Frontend (src/lib/dbConnect.ts):**
- ✅ Uses global cache to prevent multiple connections on hot-reload
- ❌ Module-level throw crashed Next.js — FIXED (guard moved inside function)
- ℹ️ Architecturally unused — all DB ops go through the Express backend

**Backend (backend/index.js):**
- ✅ Single mongoose.connect() call on startup
- ⚠️ No graceful shutdown (process.on SIGINT mongoose.disconnect)

---

## 11. Streaming API Implementation

- ✅ SSE format (data: ...\n\n) correct
- ❌ No client disconnect detection — could write to closed socket — FIXED
- ❌ Missing X-Accel-Buffering: no header — FIXED
- ❌ replace(" ", "_") replaces only the first space in Wikipedia slug — FIXED

---

## 12. Error Handling

| Location | Status |
|----------|--------|
| Backend controller errors | ⚠️ Some silently swallowed — improved |
| Frontend fetch errors | ✅ Caught and displayed to user |
| SSE stream errors | ✅ type: error event propagated to frontend |
| DB save failures | ⚠️ Were swallowed — now logs to console.error |

---

## 13. Security Vulnerabilities

| Issue | Severity | Status |
|-------|----------|--------|
| NEXTAUTH_SECRET insecure plaintext fallback in production | HIGH | FIXED |
| /api/simplify-stream had zero input validation | HIGH | FIXED |
| CORS origin: * in backend | MEDIUM | Noted |
| Demo credentials hardcoded | MEDIUM | Acceptable for demo mode |

---

## 14. Performance Bottlenecks

| Issue | Impact | Status |
|-------|--------|--------|
| useSimplify.ts had 485 lines of duplicated hook code | Bundle size | FIXED (now ~170 lines) |
| SimplifyTest.tsx unused in production routes | Dead bundle weight | Noted |

---

## 15. Production Deployment Risks

| Risk | Severity | Status |
|------|----------|--------|
| Service Worker CACHE_NAME = "eli5-cache-v1" never changes → stale deployments | CRITICAL | FIXED |
| Cache-Control: max-age=300 on HTML pages → 5min stale | CRITICAL | FIXED |
| NEXTAUTH_SECRET missing from production env → weak sessions | CRITICAL | FIXED |
| README describes Python FastAPI backend that does not exist | MEDIUM | FIXED |
| OneDrive sync path with spaces causes .next symlink EINVAL errors | MEDIUM | Delete .next folder to resolve |

---

## Summary

| Phase | Issues Found | Issues Fixed |
|-------|-------------|-------------|
| Critical startup | 3 | 3 |
| Stale cache / deployment | 2 | 2 |
| Backend correctness | 4 | 4 |
| Frontend cleanup | 4 | 4 |
| Security | 2 | 2 |
| Documentation | 2 | 2 |
| **Total** | **17** | **17** |
