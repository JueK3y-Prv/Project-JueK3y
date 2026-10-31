// TravelFlow Geocoding-Proxy — ERZEUGT, hier nicht bearbeiten.
// Quelle: TravelFlow server/geocode-netlify.mjs (Stand 5ef3568)
// Neu bauen: npm run proxy:netlify -- --out <netlify/functions>
// Netlify-Umgebungsvariable: GEOCODE_USER_AGENT (Pflicht)

// server/request-guard.mjs
function createRateLimiter({
  windowMs = 6e4,
  max = 40,
  now = () => Date.now()
} = {}) {
  const hits = /* @__PURE__ */ new Map();
  return {
    /** @returns {{ allowed: boolean, retryAfterMs: number }} */
    take(clientId) {
      const id = String(clientId ?? "anonymous");
      const t = now();
      const recent = (hits.get(id) ?? []).filter((at) => t - at < windowMs);
      if (recent.length >= max) {
        hits.set(id, recent);
        return { allowed: false, retryAfterMs: windowMs - (t - recent[0]) };
      }
      recent.push(t);
      hits.set(id, recent);
      return { allowed: true, retryAfterMs: 0 };
    },
    /** Einträge aufräumen, deren Fenster abgelaufen ist. */
    sweep() {
      const t = now();
      for (const [id, times] of hits) {
        const recent = times.filter((at) => t - at < windowMs);
        if (recent.length === 0) hits.delete(id);
        else hits.set(id, recent);
      }
      return hits.size;
    },
    get size() {
      return hits.size;
    }
  };
}
var DEFAULT_ALLOWED_ORIGINS = Object.freeze([
  "https://localhost",
  // Capacitor Android (androidScheme: https)
  "capacitor://localhost",
  // Capacitor iOS (Standard-Schema)
  "ionic://localhost",
  // aeltere Ionic-/Capacitor-Staende
  "http://localhost:5173",
  // Vite im Entwicklungsbetrieb
  "http://localhost:4173"
  // Vite-Vorschau
]);
function parseAllowedOrigins(raw, fallback = DEFAULT_ALLOWED_ORIGINS) {
  const configured = String(raw ?? "").split(",").map((value) => value.trim()).filter(Boolean);
  return configured.length > 0 ? configured : [...fallback];
}
function resolveCorsOrigin(requestOrigin, allowedOrigins) {
  const origin = typeof requestOrigin === "string" ? requestOrigin.trim() : "";
  if (!origin) return { allowed: true, header: null, origin: null };
  if (allowedOrigins.includes("*")) return { allowed: true, header: "*", origin };
  if (allowedOrigins.includes(origin)) return { allowed: true, header: origin, origin };
  return { allowed: false, header: null, origin };
}

// server/geocode-core.mjs
var NOMINATIM_BASE = "https://nominatim.openstreetmap.org";
var UPSTREAM_MIN_INTERVAL_MS = 1100;
var CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1e3;
var CACHE_STALE_MS = 30 * 24 * 60 * 60 * 1e3;
var MIN_QUERY_LENGTH = 2;
var MAX_QUERY_LENGTH = 120;
var MAX_LIMIT = 10;
var DEFAULT_LIMIT = 6;
var ALLOWED_LANGUAGES = /* @__PURE__ */ new Set(["de,en", "en,de", "de", "en"]);
var DEFAULT_LANGUAGE = "de,en";
var FIXED_SEARCH_PARAMS = {
  format: "json",
  addressdetails: "1",
  namedetails: "1",
  extratags: "1"
};
function normalizeLanguage(raw) {
  const value = String(raw ?? "").trim();
  return ALLOWED_LANGUAGES.has(value) ? value : DEFAULT_LANGUAGE;
}
function normalizeQuery(raw) {
  const collapsed = String(raw ?? "").replace(/\s+/g, " ").trim();
  if (collapsed.length < MIN_QUERY_LENGTH) return null;
  if (collapsed.length > MAX_QUERY_LENGTH) return null;
  return { query: collapsed, key: collapsed.toLowerCase() };
}
function normalizeLimit(raw) {
  const n = Number(raw);
  if (!Number.isFinite(n)) return DEFAULT_LIMIT;
  return Math.min(MAX_LIMIT, Math.max(1, Math.floor(n)));
}
function normalizeViewbox(raw) {
  if (raw == null || raw === "") return null;
  const parts = String(raw).split(",");
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => Number(p.trim()));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  const [left, top, right, bottom] = nums;
  const lonOk = [left, right].every((v) => v >= -180 && v <= 180);
  const latOk = [top, bottom].every((v) => v >= -90 && v <= 90);
  if (!lonOk || !latOk) return null;
  return nums.map((n) => n.toFixed(6)).join(",");
}
function normalizeCoord(raw, max) {
  const n = Number(raw);
  if (!Number.isFinite(n) || n < -max || n > max) return null;
  return n;
}
function buildSearchRequest({
  q,
  limit,
  viewbox,
  bounded,
  lang
} = {}) {
  const normalized = normalizeQuery(q);
  if (!normalized) return { error: "invalid_query" };
  const box = normalizeViewbox(viewbox);
  if (viewbox && !box) return { error: "invalid_viewbox" };
  const count = normalizeLimit(limit);
  const language = normalizeLanguage(lang);
  const strict = String(bounded) === "1" ? "1" : "0";
  const url = new URL(`${NOMINATIM_BASE}/search`);
  url.searchParams.set("q", normalized.query);
  url.searchParams.set("limit", String(count));
  for (const [k, v] of Object.entries(FIXED_SEARCH_PARAMS)) url.searchParams.set(k, v);
  if (box) {
    url.searchParams.set("viewbox", box);
    url.searchParams.set("bounded", strict);
  }
  const key = ["s", normalized.key, count, box ?? "-", box ? strict : "-", language].join("|");
  return { url: url.toString(), key, language };
}
function buildReverseRequest({ lat, lng, zoom, lang } = {}) {
  const latitude = normalizeCoord(lat, 90);
  const longitude = normalizeCoord(lng, 180);
  if (latitude === null || longitude === null) return { error: "invalid_coordinates" };
  const z = Number(zoom);
  const level = Number.isFinite(z) ? Math.min(18, Math.max(0, Math.floor(z))) : 14;
  const language = normalizeLanguage(lang);
  const url = new URL(`${NOMINATIM_BASE}/reverse`);
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("zoom", String(level));
  for (const [k, v] of Object.entries(FIXED_SEARCH_PARAMS)) url.searchParams.set(k, v);
  const key = ["r", latitude.toFixed(5), longitude.toFixed(5), level, language].join("|");
  return { url: url.toString(), key, language };
}
function isFresh(entry, now = Date.now(), ttlMs = CACHE_TTL_MS) {
  if (!entry || !Number.isFinite(entry.storedAt)) return false;
  return now - entry.storedAt <= ttlMs;
}
function isUsableWhenUpstreamFails(entry, now = Date.now(), staleMs = CACHE_STALE_MS) {
  if (!entry || !Number.isFinite(entry.storedAt)) return false;
  return now - entry.storedAt <= staleMs;
}
function createUpstreamQueue({
  minIntervalMs = UPSTREAM_MIN_INTERVAL_MS,
  now = () => Date.now(),
  sleep = (ms) => new Promise((resolve) => {
    setTimeout(resolve, ms);
  })
} = {}) {
  let lastStartedAt = Number.NEGATIVE_INFINITY;
  let tail = Promise.resolve();
  return {
    run(task) {
      const result = tail.then(async () => {
        const wait = minIntervalMs - (now() - lastStartedAt);
        if (wait > 0) await sleep(wait);
        lastStartedAt = now();
        return task();
      });
      tail = result.then(() => void 0, () => void 0);
      return result;
    },
    get pending() {
      return tail;
    }
  };
}

// server/geocode-netlify.mjs
var CDN_CACHE_CONTROL = "public, durable, s-maxage=604800, stale-while-revalidate=86400";
var MAX_MEMORY_ENTRIES = 500;
var MAX_WAITING = 4;
function toNumber(raw, fallback) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function createGeocodeHandler({
  env = process.env,
  fetchImpl = (...args) => fetch(...args),
  now = () => Date.now(),
  sleep,
  log = console
} = {}) {
  const userAgent = String(env.GEOCODE_USER_AGENT ?? "").trim();
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const timeoutMs = toNumber(env.GEOCODE_TIMEOUT_MS, 4e3);
  const limiter = createRateLimiter({
    windowMs: toNumber(env.GEOCODE_RATE_WINDOW_MS, 6e4),
    max: toNumber(env.GEOCODE_RATE_MAX, 40),
    now
  });
  const queue = createUpstreamQueue({ minIntervalMs: UPSTREAM_MIN_INTERVAL_MS, now, sleep });
  const memory = /* @__PURE__ */ new Map();
  const rejectedOrigins = /* @__PURE__ */ new Set();
  let waiting = 0;
  let warnedUserAgent = false;
  function remember(key, data) {
    memory.delete(key);
    memory.set(key, { storedAt: now(), data });
    while (memory.size > MAX_MEMORY_ENTRIES) {
      memory.delete(memory.keys().next().value);
    }
  }
  function corsHeaders(req) {
    const cors = resolveCorsOrigin(req.headers.get("origin"), allowedOrigins);
    if (!cors.allowed && cors.origin && !rejectedOrigins.has(cors.origin)) {
      rejectedOrigins.add(cors.origin);
      log.warn(`[cors] Herkunft abgelehnt: ${cors.origin} \u2014 ggf. ALLOWED_ORIGINS ergaenzen`);
    }
    return cors.header ? { "Access-Control-Allow-Origin": cors.header } : {};
  }
  function json(req, status, body, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...corsHeaders(req),
        // Die CORS-Kopfzeile haengt von der Herkunft ab. Ohne Vary bekaeme die
        // iOS-App aus dem CDN die Antwort, die fuer Android gespeichert wurde.
        Vary: "Origin",
        // Standard: nichts zwischenspeichern. Nur Treffer heben das auf.
        "Cache-Control": "no-store",
        ...extraHeaders
      }
    });
  }
  async function fetchUpstream(request) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(request.url, {
        headers: {
          Accept: "application/json",
          "Accept-Language": request.language,
          "User-Agent": userAgent
        },
        signal: controller.signal
      });
      if (!response.ok) {
        const err = new Error(`upstream ${response.status}`);
        err.status = response.status;
        throw err;
      }
      return await response.json();
    } finally {
      clearTimeout(timer);
    }
  }
  async function resolve(req, request) {
    const cached = memory.get(request.key);
    const fallback = () => isUsableWhenUpstreamFails(cached, now(), CACHE_STALE_MS) ? json(req, 200, cached.data, { "X-Geocode-Cache": "stale" }) : null;
    if (isFresh(cached, now(), CACHE_TTL_MS)) {
      return json(req, 200, cached.data, {
        "X-Geocode-Cache": "hit",
        "Cache-Control": "public, max-age=3600",
        "Netlify-CDN-Cache-Control": CDN_CACHE_CONTROL
      });
    }
    if (waiting >= MAX_WAITING) {
      return fallback() ?? json(req, 503, { error: "busy" }, { "Retry-After": "2" });
    }
    waiting += 1;
    try {
      const data = await queue.run(() => fetchUpstream(request));
      remember(request.key, data);
      return json(req, 200, data, {
        "X-Geocode-Cache": "miss",
        "Cache-Control": "public, max-age=3600",
        "Netlify-CDN-Cache-Control": CDN_CACHE_CONTROL
      });
    } catch (err) {
      const stale = fallback();
      if (stale) return stale;
      log.warn("[geocode] upstream:", err.message);
      const status = err.name === "AbortError" ? 504 : 502;
      return json(req, status, { error: "upstream_unavailable" });
    } finally {
      waiting -= 1;
    }
  }
  return async function handler(req, context) {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          ...corsHeaders(req),
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          Vary: "Origin"
        }
      });
    }
    if (req.method !== "GET") return json(req, 405, { error: "method_not_allowed" });
    const url = new URL(req.url);
    const pathname = url.pathname.replace(/\/+$/, "");
    if (pathname.endsWith("/status")) {
      return json(req, 200, {
        userAgentConfigured: Boolean(userAgent),
        cacheEntries: memory.size
      });
    }
    const isSearch = pathname.endsWith("/search");
    const isReverse = pathname.endsWith("/reverse");
    if (!isSearch && !isReverse) return json(req, 404, { error: "not_found" });
    if (!userAgent) {
      if (!warnedUserAgent) {
        warnedUserAgent = true;
        log.error("[geocode] GEOCODE_USER_AGENT fehlt \u2014 Anfragen werden abgelehnt");
      }
      return json(req, 503, { error: "not_configured" });
    }
    const gate = limiter.take(context?.ip || "unknown");
    if (!gate.allowed) {
      return json(req, 429, { error: "rate_limited" }, {
        "Retry-After": String(Math.ceil(gate.retryAfterMs / 1e3))
      });
    }
    const p = url.searchParams;
    const request = isSearch ? buildSearchRequest({
      q: p.get("q"),
      limit: p.get("limit"),
      viewbox: p.get("viewbox"),
      bounded: p.get("bounded"),
      lang: p.get("lang")
    }) : buildReverseRequest({
      lat: p.get("lat"),
      lng: p.get("lng"),
      zoom: p.get("zoom"),
      lang: p.get("lang")
    });
    if (request.error) return json(req, 400, { error: request.error });
    try {
      return await resolve(req, request);
    } catch (err) {
      log.error("[geocode] server_error:", err.message);
      return json(req, 500, { error: "server_error" });
    }
  };
}
var geocode_netlify_default = createGeocodeHandler();
export {
  CDN_CACHE_CONTROL,
  MAX_MEMORY_ENTRIES,
  MAX_WAITING,
  createGeocodeHandler,
  geocode_netlify_default as default
};
