const C='poker-v2';
const FILES=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
function fromNet(req){return new Promise((ok,no)=>{const t=setTimeout(no,2500);fetch(req,{cache:'no-store'}).then(r=>{clearTimeout(t);if(r.ok){const cp=r.clone();caches.open(C).then(c=>c.put(req,cp));}ok(r);},e=>{clearTimeout(t);no(e);});});}
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;
  if(req.mode==='navigate'||req.url.endsWith('.html')||req.url.endsWith('/')){
    e.respondWith(fromNet(req).catch(()=>caches.match(req,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));return;}
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req)));});
