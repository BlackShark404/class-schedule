const CACHE_NAME = 'schedule-pwa-v4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './ctu-logo.png',
  'index.html',
  'manifest.json',
  'ctu-logo.png'
];

// Install Event
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        STATIC_ASSETS.map((url) => {
          return cache.add(url).catch((err) => {
            console.warn('Failed to cache asset on install:', url, err);
          });
        })
      );
    })
  );
});

// Activate Event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Handle HTML navigation (Opening app, clicking links, reloads)
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Offline: Return cached HTML
        return caches.match('./index.html')
          .then((r) => r || caches.match('index.html'))
          .then((r) => r || caches.match('./'))
          .then((r) => r || caches.match('/'));
      })
    );
    return;
  }

  // Handle other resources (images, icons, manifest)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && request.url.startsWith('http')) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      }).catch(() => {
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});
