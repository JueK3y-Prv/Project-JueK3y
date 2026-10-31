// TravelFlow flight — ERZEUGT, hier nicht bearbeiten.
// Quelle: TravelFlow server/flight-netlify.mjs (Stand 27e666c)
// Neu bauen: npm run proxy:netlify -- --out <netlify/functions>
// Netlify-Umgebungsvariablen: AERODATABOX_RAPIDAPI_KEY und/oder AVIATIONSTACK_KEY

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

// server/flight-core.mjs
var LIVE_MIN_INTERVAL_MS = 30 * 60 * 1e3;
var MONTHLY_LIMIT_PER_PROVIDER = Number(process.env.FLIGHT_MONTHLY_LIMIT || 500);
function cacheKey(flight, date) {
  return `${String(flight).toUpperCase().replace(/\s/g, "")}|${date}`;
}
function currentMonth() {
  return (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
}
function isTodayIso(dateStr) {
  return String(dateStr) === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function hasAnyProviderKey() {
  return Boolean(process.env.AVIATIONSTACK_KEY || process.env.AERODATABOX_RAPIDAPI_KEY);
}
function parseFlightNumber(raw) {
  const s = String(raw ?? "").trim().toUpperCase().replace(/\s/g, "");
  const m = s.match(/^([A-Z]{3}|[A-Z][A-Z0-9]|[0-9][A-Z])(\d{1,4})$/);
  if (!m) return null;
  return { iata: s, airline: m[1], number: m[2] };
}
function parseFlightDate(raw) {
  const value = String(raw ?? "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = /* @__PURE__ */ new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.toISOString().slice(0, 10) !== value) return null;
  return value;
}
function normalizeStatus(raw) {
  const s = String(raw ?? "").toLowerCase();
  if (s.includes("cancel")) return "cancelled";
  if (s.includes("land") || s.includes("arriv")) return "landed";
  if (s.includes("board")) return "boarding";
  if (s.includes("active") || s.includes("en-route") || s.includes("en route")) return "active";
  if (s.includes("delay")) return "delayed";
  return "scheduled";
}
function isoOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function buildRecord({
  flightNumber,
  date,
  from,
  to,
  status = "scheduled",
  delayMinutes = 0,
  terminal,
  gate,
  airline,
  provider,
  fetchedAt = (/* @__PURE__ */ new Date()).toISOString(),
  frozen = false,
  savingsMode = false,
  cacheOnly = false
}) {
  return {
    flightNumber: String(flightNumber).toUpperCase(),
    date,
    status,
    delayMinutes: Math.max(0, Number(delayMinutes) || 0),
    from,
    to,
    data: {
      number: String(flightNumber).toUpperCase(),
      terminal: terminal ?? null,
      gate: gate ?? null,
      airline: airline ?? null
    },
    fetchedAt,
    provider: provider ?? null,
    frozen,
    savingsMode,
    cacheOnly
  };
}
async function quotaAvailable(providerId, store) {
  const q = await store.getQuota(providerId) ?? { month: currentMonth(), count: 0 };
  if (q.month !== currentMonth()) return true;
  return q.count < MONTHLY_LIMIT_PER_PROVIDER;
}
async function incrementQuota(providerId, store) {
  const month = currentMonth();
  const q = await store.getQuota(providerId) ?? { month, count: 0 };
  const next = q.month !== month ? { month, count: 1 } : { month, count: q.count + 1 };
  await store.setQuota(providerId, next);
}
async function fetchAviationstack(flight, date, store) {
  const key = process.env.AVIATIONSTACK_KEY;
  if (!key) return null;
  if (!isTodayIso(date)) return null;
  const url = new URL("https://api.aviationstack.com/v1/flights");
  url.searchParams.set("access_key", key);
  url.searchParams.set("flight_iata", flight);
  const res = await fetch(url);
  if (res.status === 403) return null;
  if (!res.ok) throw new Error(`aviationstack ${res.status}`);
  await incrementQuota("aviationstack", store);
  const json = await res.json();
  const row = (json?.data ?? []).find((r) => r?.flight_date === date) ?? json?.data?.[0];
  if (!row) return null;
  const dep = row.departure ?? {};
  const arr = row.arrival ?? {};
  const depTime = dep.scheduled || dep.estimated || dep.actual;
  const arrTime = arr.scheduled || arr.estimated || arr.actual;
  return buildRecord({
    flightNumber: flight,
    date,
    status: normalizeStatus(row.flight_status),
    delayMinutes: dep.delay ?? arr.delay ?? 0,
    terminal: dep.terminal,
    gate: dep.gate,
    airline: row.airline?.name,
    provider: "aviationstack",
    from: {
      code: dep.iata ?? dep.airport?.split(" ")?.[0],
      city: dep.city ?? dep.airport,
      name: dep.airport,
      time: isoOrNull(depTime),
      terminal: dep.terminal,
      gate: dep.gate,
      location: dep.latitude && dep.longitude ? { lat: Number(dep.latitude), lng: Number(dep.longitude) } : void 0
    },
    to: {
      code: arr.iata,
      city: arr.city ?? arr.airport,
      name: arr.airport,
      time: isoOrNull(arrTime),
      terminal: arr.terminal,
      gate: arr.gate,
      location: arr.latitude && arr.longitude ? { lat: Number(arr.latitude), lng: Number(arr.longitude) } : void 0
    }
  });
}
async function fetchAeroDataBox(flight, date, store) {
  const key = process.env.AERODATABOX_RAPIDAPI_KEY;
  if (!key) return null;
  const url = new URL("https://aerodatabox.p.rapidapi.com/");
  url.pathname = `/flights/Number/${encodeURIComponent(flight)}/${encodeURIComponent(date)}`;
  const res = await fetch(url, {
    headers: {
      "X-RapidAPI-Key": key,
      "X-RapidAPI-Host": "aerodatabox.p.rapidapi.com"
    }
  });
  if (!res.ok) throw new Error(`aerodatabox ${res.status}`);
  await incrementQuota("aerodatabox", store);
  const rows = await res.json();
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row) return null;
  const dep = row.departure ?? {};
  const arr = row.arrival ?? {};
  return buildRecord({
    flightNumber: flight,
    date,
    status: normalizeStatus(row.status),
    delayMinutes: 0,
    terminal: dep.terminal?.name ?? dep.terminal,
    gate: dep.gate,
    airline: row.airline?.name,
    provider: "aerodatabox",
    from: {
      code: dep.airport?.iata ?? dep.airport?.icao,
      city: dep.airport?.municipalityName ?? dep.airport?.name,
      name: dep.airport?.name,
      time: isoOrNull(dep.scheduledTime?.utc ?? dep.scheduledTime?.local),
      terminal: dep.terminal?.name,
      gate: dep.gate,
      location: dep.airport?.position ? { lat: dep.airport.position.latitude, lng: dep.airport.position.longitude } : void 0
    },
    to: {
      code: arr.airport?.iata ?? arr.airport?.icao,
      city: arr.airport?.municipalityName ?? arr.airport?.name,
      name: arr.airport?.name,
      time: isoOrNull(arr.scheduledTime?.utc ?? arr.scheduledTime?.local),
      terminal: arr.terminal?.name,
      gate: arr.gate,
      location: arr.airport?.position ? { lat: arr.airport.position.latitude, lng: arr.airport.position.longitude } : void 0
    }
  });
}
var PROVIDERS = [
  { id: "aviationstack", fetch: fetchAviationstack, configEnv: "AVIATIONSTACK_KEY" },
  { id: "aerodatabox", fetch: fetchAeroDataBox, configEnv: "AERODATABOX_RAPIDAPI_KEY" }
];
async function providerStatus(store) {
  const providers = [];
  for (const p of PROVIDERS) {
    providers.push({
      id: p.id,
      configured: Boolean(process.env[p.configEnv]),
      quota: await store.getQuota(p.id) ?? { month: currentMonth(), count: 0 },
      limit: MONTHLY_LIMIT_PER_PROVIDER
    });
  }
  return providers;
}
async function lookupFlight(flightRaw, dateRaw, { live = false, store } = {}) {
  const parsedFlight = parseFlightNumber(flightRaw);
  const date = parseFlightDate(dateRaw);
  if (!parsedFlight || !date) return { error: "invalid_params", status: 400 };
  const flight = parsedFlight.iata;
  const key = cacheKey(flight, date);
  const cached = await store.getFlight(key);
  const now = Date.now();
  const depMs = cached?.from?.time ? new Date(cached.from.time).getTime() : null;
  const landed = depMs && cached?.status === "landed" && now > depMs;
  if (cached?.frozen || landed) {
    return { ...cached, cacheOnly: true, frozen: true };
  }
  const hoursUntilDep = depMs ? (depMs - now) / 36e5 : Infinity;
  const inLiveWindow = hoursUntilDep <= 24 && hoursUntilDep >= -24;
  if (!live && cached?.from?.time) return { ...cached, cacheOnly: true };
  if (live && cached?.fetchedAt) {
    const age = now - new Date(cached.fetchedAt).getTime();
    if (age < LIVE_MIN_INTERVAL_MS) return { ...cached, cacheOnly: true };
  }
  if (!inLiveWindow && cached?.from?.time) return { ...cached, cacheOnly: true };
  if (!hasAnyProviderKey()) {
    if (cached) return { ...cached, savingsMode: true, cacheOnly: true };
    return { error: "no_providers", savingsMode: true, status: 503 };
  }
  let lastError = null;
  for (const provider of PROVIDERS) {
    if (!await quotaAvailable(provider.id, store)) continue;
    try {
      const record = await provider.fetch(flight, date, store);
      if (record?.from?.time) {
        await store.setFlight(key, record);
        return record;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[flight-core] ${provider.id} failed:`, err.message);
    }
  }
  if (cached) {
    return { ...cached, savingsMode: true, cacheOnly: true, provider: cached.provider };
  }
  return {
    error: "lookup_failed",
    savingsMode: true,
    message: lastError?.message ?? "all_providers_failed",
    status: 503
  };
}

// server/flight-netlify.mjs
var DEFAULT_RATE_MAX = 12;
function toNumber(raw, fallback) {
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}
function createMemoryStore() {
  const flights = /* @__PURE__ */ new Map();
  const quota = /* @__PURE__ */ new Map();
  return {
    async getFlight(key) {
      return flights.get(key) ?? null;
    },
    async setFlight(key, record) {
      flights.set(key, record);
    },
    async getQuota(id) {
      return quota.get(id) ?? null;
    },
    async setQuota(id, value) {
      quota.set(id, value);
    },
    get size() {
      return flights.size;
    }
  };
}
function createFlightHandler({
  env = process.env,
  store = createMemoryStore(),
  lookup = lookupFlight,
  status = providerStatus,
  now = () => Date.now(),
  log = console
} = {}) {
  const allowedOrigins = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  const limiter = createRateLimiter({
    windowMs: toNumber(env.FLIGHT_RATE_WINDOW_MS, 6e4),
    max: toNumber(env.FLIGHT_RATE_MAX, DEFAULT_RATE_MAX),
    now
  });
  const rejectedOrigins = /* @__PURE__ */ new Set();
  function corsHeaders(req) {
    const cors = resolveCorsOrigin(req.headers.get("origin"), allowedOrigins);
    if (!cors.allowed && cors.origin && !rejectedOrigins.has(cors.origin)) {
      rejectedOrigins.add(cors.origin);
      log.warn(`[cors] Herkunft abgelehnt: ${cors.origin} \u2014 ggf. ALLOWED_ORIGINS ergaenzen`);
    }
    return cors.header ? { "Access-Control-Allow-Origin": cors.header } : {};
  }
  function json(req, statusCode, body, extraHeaders = {}) {
    return new Response(JSON.stringify(body), {
      status: statusCode,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...corsHeaders(req),
        Vary: "Origin",
        "Cache-Control": "no-store",
        ...extraHeaders
      }
    });
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
      return json(req, 200, { providers: await status(store), cacheEntries: store.size });
    }
    const gate = limiter.take(context?.ip || "unknown");
    if (!gate.allowed) {
      return json(req, 429, { error: "rate_limited" }, {
        "Retry-After": String(Math.ceil(gate.retryAfterMs / 1e3))
      });
    }
    try {
      const result = await lookup(
        url.searchParams.get("flight"),
        url.searchParams.get("date"),
        { live: url.searchParams.get("live") === "1", store }
      );
      if (result.error && !result.from) return json(req, result.status ?? 502, result);
      return json(req, 200, result);
    } catch (err) {
      log.error("[flight] server_error:", err.message);
      return json(req, 500, { error: "server_error" });
    }
  };
}
var flight_netlify_default = createFlightHandler();
export {
  DEFAULT_RATE_MAX,
  createFlightHandler,
  createMemoryStore,
  flight_netlify_default as default
};
