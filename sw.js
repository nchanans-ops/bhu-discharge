const CACHE_NAME = 'bhu-discharge-v7';
const URLS = [
  '/bhu-discharge/login.html',
  '/bhu-discharge/discharge-tracker.html',
  '/bhu-discharge/admin.html',
  '/bhu-discharge/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

// Network-first: ดึงจากเน็ตก่อนเสมอ, fallback cache เมื่อออฟไลน์
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // อัปเดต cache ด้วยไฟล์ใหม่
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
