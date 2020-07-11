// version
// files to cache
var version = 'v0.01';
var files = [
    './',
    './index.html',
    '../inside.html',
    '../assets/css/index.css',
    '../assets/js/index.js',
    '../assets/images/favicon.ico'
  ];

//  install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(version)
      .then(cache => {
        return cache.addAll(files)
        .catch(err => {
          console.error('Error in adding files during install of SW.', err)
        })
      })
  )
  console.log('SW installed.')
  self.skipWaiting();
})

//  activate
self.addEventListener('activate', event =>{
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
            cacheNames.map(cache => {
              if(cache !== version){
                return caches.delete(cache)
              }
            })
          )
      })
  )  
  self.clients.claim();
})

//  fetch
self.addEventListener('fetch', event => {
  event.respondWith(
/*    
    caches.match(event.request)
      .then(res => {
        return res || fetch(event.request);
      })
*/

    fetch(event.request)
      .catch(() => caches.match(event.request))

  )
})