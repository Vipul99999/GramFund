const CACHE='gramfund-v1';
self.addEventListener('install', e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['/','/icon.svg','/logo.svg']))); self.skipWaiting();});
self.addEventListener('activate', e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim();});
self.addEventListener('fetch', e=>{ if(e.request.method!=='GET') return; e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone(); caches.open(CACHE).then(c=>c.put(e.request,copy)); return resp;}).catch(()=>caches.match('/'))));});
