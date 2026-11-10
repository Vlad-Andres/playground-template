const PRECACHE_MANIFEST = { version: "development", urls: [] };
const CACHE_PREFIX = "dis-study-";
const CACHE_NAME = `${CACHE_PREFIX}${PRECACHE_MANIFEST.version}`;
const scopeUrl = new URL(self.registration.scope);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(PRECACHE_MANIFEST.urls.map((url) => new Request(new URL(url, scopeUrl), { cache: "reload" })));
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
          .map((name) => caches.delete(name)),
      );
      await self.clients.claim();
    })(),
  );
});

const findCachedPage = async (url) => {
  const pagePath = url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  return (await caches.match(new URL(pagePath, scopeUrl))) ?? (await caches.match(new URL("404.html", scopeUrl)));
};

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== scopeUrl.origin || !url.pathname.startsWith(scopeUrl.pathname)) {
    return;
  }

  // In-browser PostgreSQL (PGlite) binaries: too large to precache, so cached on first use.
  if (url.pathname.startsWith(`${scopeUrl.pathname}pglite/`) || /\/_next\/static\/media\/.+\.(wasm|data)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then(
        (cached) =>
          cached ??
          fetch(event.request).then(async (response) => {
            if (response.ok) await (await caches.open(CACHE_NAME)).put(event.request, response.clone());
            return response;
          }),
      ),
    );
    return;
  }

  if (url.pathname.startsWith(`${scopeUrl.pathname}_next/static/`)) {
    event.respondWith(caches.match(event.request).then((cached) => cached ?? fetch(event.request)));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request, { ignoreSearch: true });
      if (cached) return cached;
      if (event.request.mode === "navigate") return (await findCachedPage(url)) ?? Response.error();
      return Response.error();
    }),
  );
});
