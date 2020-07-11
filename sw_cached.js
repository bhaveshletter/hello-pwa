// version
// files to cache
var version = 'v0.02';

//  install
self.addEventListener('install', event => {
  // event.waitUntil(
  //   caches.open(version)
  //     .then(cache => {
  //       return cache.addAll(files)
  //       .catch(err => {
  //         console.error('Error in adding files during install of SW.', err)
  //       })
  //     })
  // )
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
    fetch(event.request)
      .then(res => {
        const resCp = res.clone();

        caches.open(version)
          .then(cache => {
            cache.put(event.request, resCp)
          })
        return res;
      })
      .catch(err => {
        console.error('Fetch catch: ', err);
        console.log(event.request);
        caches.match(event.request)
          .then(res => res) // returning res since used used arrow. other ways res => { return res ;}
      })
  )
})