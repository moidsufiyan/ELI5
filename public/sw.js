// ELI5 Service Worker
// IMPORTANT: Increment CACHE_VERSION on every deployment to bust stale caches.
// This value is intentionally simple – change it whenever you ship a new release.
const CACHE_VERSION = 'v2';
const CACHE_NAME = `eli5-cache-${CACHE_VERSION}`;

// Only cache truly static, rarely-changing public assets.
const STATIC_ASSETS = [
  '/favicon.ico',
  '/manifest.json',
];

// ── Install: pre-cache static assets ─────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  // Activate immediately without waiting for existing tabs to close.
  self.skipWaiting();
});

// ── Activate: delete old cache versions ──────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  // Take control of all open clients immediately.
  self.clients.claim();
});

// ── Fetch: network-first for HTML, cache-first for static assets ─────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // ❶ HTML navigation requests → ALWAYS go to network first.
  //    This ensures new deployments are served immediately without a hard refresh.
  if (request.mode === 'navigate' || request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // ❷ API calls → never cache, always network.
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(request));
    return;
  }

  // ❸ Static assets (_next/static, images, icons) → cache-first with network fallback.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Only cache successful responses for static files.
        if (response.ok && (url.pathname.startsWith('/_next/static/') || STATIC_ASSETS.includes(url.pathname))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return response;
      }).catch(() => cached);
    })
  );
});
