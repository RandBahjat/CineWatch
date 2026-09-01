// CineWatch Service Worker — PASSTHROUGH MODE (no caching)
// Deliberately does NOT cache so the download page iframe always shows fresh content.

self.addEventListener('install', event => {
  // Delete ALL old caches immediately
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(names.map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Always fetch fresh from network — zero caching
self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
