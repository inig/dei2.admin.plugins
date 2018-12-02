const CACHE_VERSION = 'v6'

self.addEventListener('install', event => {
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      console.log('>>>>', cacheNames)
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log('=======', cacheName, CACHE_VERSION)
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(res => {
          return caches.open(CACHE_VERSION).then(cache => {
            cache.put(event.request, res.clone())
            return res
          })
        })
      )
    })
  )
})

self.addEventListener('sync', event => {
  switch (event.tag) {
    case 'offline':
      console.log('offline: ', event)
      break
    case 'online':
      console.log('online: ', event)
      break
    default:
      break
  }
})
