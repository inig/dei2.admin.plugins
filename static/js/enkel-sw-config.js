
var ENKEL_SW_CONFIG = {
  'cdn': 'https://g.alicdn.com/kg/workbox/3.3.0/',
  'caches': {
    'version': 'v1',
    'prefix': 'enkel:',
    'html': {
      'cacheName': 'html',
      'entries': 10,
      'maxAgeSeconds': 43200,
      'strategies': 'staleWhileRevalidate'
    },
    'js': {
      'cacheName': 'js',
      'entries': 20,
      'maxAgeSeconds': 43200,
      'strategies': 'staleWhileRevalidate'
    },
    'css': {
      'cacheName': 'css',
      'entries': 30,
      'maxAgeSeconds': 43200,
      'strategies': 'staleWhileRevalidate'
    },
    'img': {
      'cacheName': 'img',
      'entries': 40,
      'maxAgeSeconds': 43200,
      'strategies': 'staleWhileRevalidate'
    },
    'font': {
      'cacheName': 'font',
      'entries': 40,
      'maxAgeSeconds': 43200,
      'strategies': 'staleWhileRevalidate'
    },
    'routes': [
      // {
      //   "pathname": "/pwa",
      //   "strategies": "staleWhileRevalidate",
      //   "cacheName": "route-pwa",
      //   "entries": 10,
      //   "maxAgeSeconds": 43200
      // }
      {
        'match': /^(?!.*?(sockjs-node)|(\.hot-update\.json)).*$/,
        'strategies': 'staleWhileRevalidate',
        'cacheName': 'route',
        'entries': 30,
        'maxAgeSeconds': 43200
      }
    ]
  }
}
