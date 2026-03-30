const PROXY = 'https://api.allorigins.win/raw?url=';

self.addEventListener('fetch', (event) => {
    // Don't loop the proxy if it's already being used
    if (event.request.url.includes('api.allorigins.win')) return;

    event.respondWith(
        fetch(event.request).catch(() => {
            // If the request fails (blocked), try the bridge
            return fetch(PROXY + encodeURIComponent(event.request.url));
        })
    );
});
