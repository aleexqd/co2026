const CACHE_NAME = "catehism-cache-v1";

const FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./catehism.json",
  "./PEISAJ.jpg",
  "./Sf Cruce.PNG",
  "./icon-192.png",
  "./icon-512.png"
];

// Instalare
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
  self.skipWaiting();
});

// Activare
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );

  self.clients.claim();
});

// Strategia:
// - încearcă internetul
// - dacă merge, salvează automat în cache
// - dacă nu merge, folosește copia offline

self.addEventListener("fetch", event => {

  if(event.request.method !== "GET") return;

  event.respondWith(

    fetch(event.request)

      .then(response => {

        const copy = response.clone();

        caches.open(CACHE_NAME)
          .then(cache => cache.put(event.request, copy));

        return response;

      })

      .catch(() => {

        return caches.match(event.request);

      })

  );

});
