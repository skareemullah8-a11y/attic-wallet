// Attic Wallet service worker (4dad2eb098ac). Only the site's own files are cached; wallet data never passes through here.
const CACHE = 'attic-4dad2eb098ac';
const BASE = "/attic-wallet/";
const CORE = ["/attic-wallet/","/attic-wallet/app.4dad2eb098ac.js","/attic-wallet/manifest.webmanifest","/attic-wallet/favicon.png","/attic-wallet/icon-180.png","/attic-wallet/icon-192.png","/attic-wallet/icon-512.png"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('attic-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});
self.addEventListener('fetch', (e) => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== self.location.origin || !u.pathname.startsWith(BASE)) return;
  if (r.mode === 'navigate') {
    // Always try for the newest version; fall back to the saved page when offline.
    e.respondWith(fetch(r).catch(() => caches.match(BASE)));
    return;
  }
  e.respondWith(caches.match(r).then((hit) => hit || fetch(r)));
});
