// Basic Service Worker for Neon Defense
const APP_VERSION = "1.0.2";
const CACHE_NAME = `neon-defense-${APP_VERSION}`;
const ASSETS = [
  "/",
  "/index.html",
  "/style.css",
  "/game.js",
  "/config.js",
  "/manifest.json",
  "/assets/img/neon_logo.png",
  "/assets/img/icon-192.png",
  "/assets/img/icon-512.png",
  "/assets/sounds/level_1.mp3",
  "/assets/sounds/startscreen.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k.startsWith("neon-defense-") && k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req))
  );
});
