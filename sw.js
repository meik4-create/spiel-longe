/* Service Worker: Netzwerk zuerst (du bekommst immer die neueste Version), Zwischenspeicher als Notfall ohne Internet. */
const V = "sl-v3";
self.addEventListener("install", e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(["./", "./index.html"])).catch(() => {}).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(res => { if (res.ok) { const c = res.clone(); caches.open(V).then(ch => ch.put(r, c)); } return res; })
      .catch(() => caches.match(r).then(m => m || caches.match("./index.html")))
  );
});
