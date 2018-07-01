const cacheName = 'cache_currency';

const FilesToCache = [
    './index.html',                
    'javascript/script.js',
    'javascript/jquery-1.9.1.min.js',
    'stylesheet/styles.css',
    'https://fonts.googleapis.com/css?family=Maven+Pro:900|Yantramanav:400,500,700',
    'https://free.currencyconverterapi.com/api/v5/currencies'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
        .then(cache => {
            console.info('caching files');
            return cache.addAll(FilesToCache);
        })
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(
      caches.keys()
        .then(keyList => Promise.all(keyList.map(keyCache => {
        if (keyCache !== cacheName){
            console.log("removing cached files", keyCache);
            return caches.delete(keyCache);        
        }
    })))
    );
  return self.clients.claim();
});


self.addEventListener('fetch', event => {
  event.respondWith(caches.match(event.request)
    .then(response => response || fetch(event.request)
      .then(response => caches.open(cacheName)
        .then(cache => {
          cache.put(event.request, response);
            return response.clone();
          }) 
          .catch(event => {
          console.log('error caching and fetching');
        }))
      );
    });