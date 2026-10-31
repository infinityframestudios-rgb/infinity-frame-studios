// Service worker dell'app dello studio. Cancella solo le PROPRIE cache vecchie (if-v*), mai quelle delle app dei fotografi sullo stesso dominio.
const C='if-v72',B='/infinity-frame-studios/';
self.addEventListener('install',e=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>/^if-v\d+$/.test(x)&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
// notifiche push (consegne alle 9 di mattina, prova): arrivano dal Worker dello studio
self.addEventListener('push',e=>{let d={};try{d=e.data?e.data.json():{}}catch(x){d={body:e.data?e.data.text():''}}
const url=new URL(B+(d.url||''),location.origin).href;
e.waitUntil(self.registration.showNotification(d.title||'Infinity Frame',{body:d.body||'',icon:B+'icon-192.png',badge:B+'icon-192.png',tag:'infinity-frame-'+(d.tag||'consegne'),data:{url}}))});
self.addEventListener('notificationclick',e=>{e.notification.close();const url=(e.notification.data&&e.notification.data.url)||new URL(B,location.origin).href;
e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(l=>{for(const c of l){if(c.url.startsWith(location.origin+B)&&'focus' in c){if(c.navigate)c.navigate(url).catch(()=>{});return c.focus()}}return clients.openWindow(url)}))});
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin||!u.pathname.startsWith(B))return;
if(u.pathname.endsWith('/cliente.html')||u.pathname.endsWith('/video.html')||u.pathname.includes('/volti/'))return;
e.respondWith(fetch(e.request,e.request.mode==='navigate'||u.pathname.endsWith('/sw.js')?{cache:'no-store'}:{}).then(r=>{const c=r.clone();caches.open(C).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request,{cacheName:C}).then(r=>r||(e.request.mode==='navigate'?caches.open(C).then(x=>x.match(B)):undefined))))});
