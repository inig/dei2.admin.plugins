self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(res => {
          return caches.open('v1').then(cache => {
            cache.put(event.request, res.clone())
            return res
          })
        })
      )
    })
  )
  console.log('请求：', event)
})

self.addEventListener('sync', event => {
  console.log('网络恢复：', event)
})
