export function unregisterAllServiceWorkers() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(registrations => {
            for (let registration of registrations) {
                registration.unregister();
                console.log('ServiceWorker unregistered:', registration.scope);
            }
        });
    }
}

export function clearSiteData() {
    if ('caches' in window) {
        caches.keys().then(cacheNames => {
            cacheNames.forEach(cacheName => {
                caches.delete(cacheName);
                console.log('Cache deleted:', cacheName);
            });
        });
    }
}