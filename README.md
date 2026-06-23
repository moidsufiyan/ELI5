# ELI5 AI - Transform Complex Ideas into Simple Explanations

A modern, AI-powered text simplification platform that transforms complex topics into crystal-clear explanations using **Groq AI (LLaMA-3.3-70b)**.

## Tech Stack

### Frontend
- **Next.js 14** — React framework with Pages Router
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **NextAuth.js** — Authentication (Google + GitHub OAuth)
- **Zustand** — Global state management
- **Framer Motion** — Animations

### Backend
- **Node.js + Express** — REST API server
- **Groq AI API** — LLaMA-3.3-70b language model
- **MongoDB + Mongoose** — Simplification history storage
- **Helmet + express-rate-limit** — Security middleware

## Quick Start

### Prerequisites
- Node.js 18+
- A [Groq API key](https://console.groq.com/) (free tier available)
- MongoDB Atlas connection string

### 1. Clone & Install

```powershell
git clone <repository-url>
cd ELI5

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment

Copy and fill in both environment files:

**Root `.env.local`** (for Next.js frontend):
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate: openssl rand -base64 32>
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
MONGODB_URI=your_mongodb_atlas_connection_string
BACKEND_URL=http://localhost:8000
NODE_ENV=development
```

**`backend/.env`** or root `.env` (for the Express backend):
```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=8000
NODE_ENV=development
```

### 3. Start Development Servers

**Terminal 1 — Backend (Express)**
```powershell
cd backend
npm start
# Backend running at http://localhost:8000
```

**Terminal 2 — Frontend (Next.js)**
```powershell
npm run dev
# Frontend running at http://localhost:3000
```

## API Reference

### Backend Endpoints (port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/simplify` | Non-streaming simplification |
| `POST` | `/api/simplify-stream` | SSE streaming simplification |
| `POST` | `/api/explanations` | Unified endpoint (`{ text, mode, stream }`) |
| `GET` | `/api/history` | Last 10 simplifications |

### Request Body (`/api/simplify`)
```json
{
  "text": "Text to simplify (10-5000 chars)",
  "complexity": "ELI5 | ELI15 | normal",
  "useWikipedia": true,
  "topic": "optional topic for Wikipedia lookup"
}
```

### Request Body (`/api/explanations` — unified)
```json
{
  "text": "Text to simplify",
  "mode": "ELI5 | ELI15 | normal",
  "stream": false,
  "useWikipedia": true,
  "topic": "optional"
}
```

## Troubleshooting

### EINVAL error on Windows / OneDrive

If you see `EINVAL: invalid argument, readlink '.next/...'`:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

This is caused by OneDrive creating junction points in the `.next` build cache.
Consider moving the project outside of OneDrive.

### Backend not starting

1. Verify `GROQ_API_KEY` is set in the root `.env`
2. Run `cd backend && npm start` — check for missing module errors
3. Ensure MongoDB URI is accessible from your network

### Auth redirect loop

Ensure `.env.local` contains `NEXTAUTH_SECRET` and `NEXTAUTH_URL`.

## Deployment

Deploy the backend Node/Express server and frontend Next.js application to your cloud providers (e.g., Vercel, Render, Railway), making sure to set all environment variables listed in the configuration section.

**Important after each deployment:** Increment `CACHE_VERSION` in `public/sw.js` to invalidate
the PWA service worker cache for all users.
