// public/service-worker-fix.js
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Bypass handling of callback URLs to let the browser handle them normally
    if (event.request.url.includes('/callback')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch((error) => {
            console.error('Fetch error:', error);
            return new Response('Network error', { status: 503, statusText: 'Service Unavailable' });
        })
    );
});