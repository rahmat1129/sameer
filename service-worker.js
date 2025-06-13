// Cache ka naam aur version
const CACHE_NAME = 'mera-app-cache-v2';

// Files jo cache karni hain (offline available karani hain)
const urlsToCache = [
  '/', // Yeh website ke root ko cache karta hai
  'index.html',
  'icon/favicon.jpg' // Humara icon
];

// Install event: Service worker install hone par cache mein files daal do
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache khola gaya aur files add ki ja rahi hain');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Jab bhi page koi file maangta hai
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Agar file cache mein mil jati hai, to wahan se de do
        if (response) {
          return response;
        }
        // Agar cache mein nahi hai, to internet se lao
        return fetch(event.request);
      })
  );
});

// Activate event: Purane version ke cache ko saaf karne ke liye
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
