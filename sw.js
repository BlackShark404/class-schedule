const CACHE_NAME = 'schedule-pwa-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './ctu-logo.png'
];

// Install: Cache core assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: Delete old caches and claim clients
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

// Fetch: Rock-solid offline handler
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // 1. Navigation requests (Opening the app / page reload)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('./index.html').then((cached) => {
        if (cached) return cached;
        return caches.match('./').then((rootCached) => {
          if (rootCached) return rootCached;
          return fetch(request).catch(() => caches.match('./index.html'));
        });
      })
    );
    return;
  }

  // 2. Static Assets (Cache-First)
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          request.url.startsWith('http')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Return empty 404 response for failed subresources, do NOT return HTML
        return new Response('', { status: 408, statusText: 'Offline' });
      });
    })
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        let client = clientList[0];
        for (let i = 0; i < clientList.length; i++) {
          if (clientList[i].focused) {
            client = clientList[i];
          }
        }
        return client.focus();
      }
      return clients.openWindow('./index.html');
    })
  );
});
