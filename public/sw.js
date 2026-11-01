// Offline support: serve from cache, refresh the cache in the background.
const CACHE = "stancebook-v22";
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["./", "./index.html"])));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // The page itself: always ask GitHub for the newest copy (skipping the browser's 10-minute HTTP cache), so opening
  // or reloading the book picks up a new release right away. Offline falls back to the cached page.
  if (e.request.mode === "navigate") {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        fetch(e.request, { cache: "no-cache" })
          .then((r) => { if (r.ok) c.put("./index.html", r.clone()); return r; })
          .catch(async () => (await c.match(e.request)) || c.match("./index.html")),
      ),
    );
    return;
  }
  // Everything else has a content hash in its name, so a cached copy is never stale.
  e.respondWith(
    caches.open(CACHE).then(async (c) => {
      const hit = await c.match(e.request);
      const net = fetch(e.request).then((r) => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit); // offline: keep the cached copy
      return hit || net;
    }),
  );
});
