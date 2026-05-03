// Youth Educated Service Worker
// Bump CACHE_VERSION on every deploy to invalidate old caches.
const CACHE_VERSION = 'v2';
const CACHE_NAME = `youth-educated-${CACHE_VERSION}`;

const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-mark.png',
  '/logo.png',
];

// ── Install: pre-cache shell assets ─────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS))
  );
  // Activate immediately — don't wait for old tabs to close
  self.skipWaiting();
});

// ── Activate: delete all caches from previous versions ──────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name.startsWith('youth-educated-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  // Take control of all open clients without requiring a reload
  self.clients.claim();
});

// ── Fetch: network-first for API/Supabase, cache-first for static assets ────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser-extension URLs
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) return;

  // Network-first for Supabase and Gemini API calls — always want fresh data
  const isApiCall =
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('generativelanguage.googleapis.com');

  if (isApiCall) {
    event.respondWith(
      fetch(request).catch(() =>
        new Response(JSON.stringify({ error: 'offline' }), {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );
    return;
  }

  // Cache-first for static assets (JS chunks, CSS, images)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        // Only cache successful same-origin responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, toCache));
        return response;
      });
    })
  );
});
