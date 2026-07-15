// netlify/functions/flight.mjs — TravelFlow Flug-Proxy (zero-dependency)
// Keys NUR als Netlify-Env-Variablen: AVIATIONSTACK_KEY, AERODATABOX_RAPIDAPI_KEY

const LIVE_MIN_INTERVAL_MS = 30 * 60 * 1000;
const MONTHLY_LIMIT_PER_PROVIDER = Number(process.env.FLIGHT_MONTHLY_LIMIT || 500);
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const cacheKey = (f, d) => `${String(f).toUpperCase().replace(/\s/g, '')}|${d}`;
const currentMonth = () => new Date().toISOString().slice(0, 7);
const isTodayIso = (d) => String(d) === new Date().toISOString().slice(0, 10);
const hasAnyProviderKey = () =>
  Boolean(process.env.AVIATIONSTACK_KEY || process.env.AERODATABOX_RAPIDAPI_KEY);

function normalizeStatus(raw) {
  const s = String(raw ?? '').toLowerCase();
  if (s.includes('cancel')) return 'cancelled';
  if (s.includes('land') || s.includes('arriv')) return 'landed';
  if (s.includes('board')) return 'boarding';
  if (s.includes('active') || s.includes('en-route') || s.includes('en route')) return 'active';
  if (s.includes('delay')) return 'delayed';
  return 'scheduled';
}
function isoOrNull(v) {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function buildRecord(x) {
  return {
    flightNumber: String(x.flightNumber).toUpperCase(),
    date: x.date,
    status: x.status ?? 'scheduled',
    delayMinutes: Math.max(0, Number(x.delayMinutes) || 0),
    from: x.from,
    to: x.to,
    data: { number: String(x.flightNumber).toUpperCase(), terminal: x.terminal ?? null, gate: x.gate ?? null, airline: x.airline ?? null },
    fetchedAt: x.fetchedAt ?? new Date().toISOString(),
    provider: x.provider ?? null,
    frozen: Boolean(x.frozen),
    savingsMode: Boolean(x.savingsMode),
    cacheOnly: Boolean(x.cacheOnly),
  };
}

// In-Memory-Speicher (pro warmer Instanz)
const store = {
  flights: {},
  quota: {},
  getFlight(k) { return this.flights[k] ?? null; },
  setFlight(k, v) { this.flights[k] = v; },
  quotaAvailable(id) {
    const q = this.quota[id] ?? { month: currentMonth(), count: 0 };
    return q.month !== currentMonth() ? true : q.count < MONTHLY_LIMIT_PER_PROVIDER;
  },
  increment(id) {
    const month = currentMonth();
    const q = this.quota[id] ?? { month, count: 0 };
    this.quota[id] = q.month !== month ? { month, count: 1 } : { month, count: q.count + 1 };
  },
};

async function fetchAviationstack(flight, date) {
  const key = process.env.AVIATIONSTACK_KEY;
  if (!key) return null;
  if (!isTodayIso(date)) return null; // Free-Tier kann kein flight_date (403)
  const url = new URL('https://api.aviationstack.com/v1/flights');
  url.searchParams.set('access_key', key);
  url.searchParams.set('flight_iata', flight);
  const res = await fetch(url);
  if (res.status === 403) return null;
  if (!res.ok) throw new Error(`aviationstack ${res.status}`);
  store.increment('aviationstack');
  const json = await res.json();
  const row = (json?.data ?? []).find((r) => r?.flight_date === date) ?? json?.data?.[0];
  if (!row) return null;
  const dep = row.departure ?? {}, arr = row.arrival ?? {};
  return buildRecord({
    flightNumber: flight, date, status: normalizeStatus(row.flight_status),
    delayMinutes: dep.delay ?? arr.delay ?? 0, terminal: dep.terminal, gate: dep.gate,
    airline: row.airline?.name, provider: 'aviationstack',
    from: { code: dep.iata, city: dep.city ?? dep.airport, name: dep.airport, time: isoOrNull(dep.scheduled || dep.estimated || dep.actual), terminal: dep.terminal, gate: dep.gate },
    to: { code: arr.iata, city: arr.city ?? arr.airport, name: arr.airport, time: isoOrNull(arr.scheduled || arr.estimated || arr.actual), terminal: arr.terminal, gate: arr.gate },
  });
}

async function fetchAeroDataBox(flight, date) {
  const key = process.env.AERODATABOX_RAPIDAPI_KEY;
  if (!key) return null;
  const url = `https://aerodatabox.p.rapidapi.com/flights/Number/${encodeURIComponent(flight)}/${date}`;
  const res = await fetch(url, { headers: { 'X-RapidAPI-Key': key, 'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com' } });
  if (!res.ok) throw new Error(`aerodatabox ${res.status}`);
  store.increment('aerodatabox');
  const rows = await res.json();
  const row = Array.isArray(rows) ? rows[0] : rows;
  if (!row) return null;
  const dep = row.departure ?? {}, arr = row.arrival ?? {};
  return buildRecord({
    flightNumber: flight, date, status: normalizeStatus(row.status),
    terminal: dep.terminal?.name ?? dep.terminal, gate: dep.gate, airline: row.airline?.name, provider: 'aerodatabox',
    from: { code: dep.airport?.iata ?? dep.airport?.icao, city: dep.airport?.municipalityName ?? dep.airport?.name, name: dep.airport?.name, time: isoOrNull(dep.scheduledTime?.utc ?? dep.scheduledTime?.local), terminal: dep.terminal?.name, gate: dep.gate, location: dep.airport?.position ? { lat: dep.airport.position.latitude, lng: dep.airport.position.longitude } : undefined },
    to: { code: arr.airport?.iata ?? arr.airport?.icao, city: arr.airport?.municipalityName ?? arr.airport?.name, name: arr.airport?.name, time: isoOrNull(arr.scheduledTime?.utc ?? arr.scheduledTime?.local), terminal: arr.terminal?.name, gate: arr.gate, location: arr.airport?.position ? { lat: arr.airport.position.latitude, lng: arr.airport.position.longitude } : undefined },
  });
}

const PROVIDERS = [
  { id: 'aviationstack', fetch: fetchAviationstack, env: 'AVIATIONSTACK_KEY' },
  { id: 'aerodatabox', fetch: fetchAeroDataBox, env: 'AERODATABOX_RAPIDAPI_KEY' },
];

async function lookupFlight(flightRaw, date, live) {
  const flight = String(flightRaw ?? '').trim().toUpperCase().replace(/\s/g, '');
  if (!flight || !date) return { error: 'missing_params', status: 400 };
  const key = cacheKey(flight, date);
  const cached = store.getFlight(key);
  const now = Date.now();
  const depMs = cached?.from?.time ? new Date(cached.from.time).getTime() : null;
  const landed = depMs && cached?.status === 'landed' && now > depMs;
  if (cached?.frozen || landed) return { ...cached, cacheOnly: true, frozen: true };
  const inLiveWindow = depMs ? (depMs - now) / 3600000 <= 24 : false;
  if (!live && cached?.from?.time) return { ...cached, cacheOnly: true };
  if (live && cached?.fetchedAt && now - new Date(cached.fetchedAt).getTime() < LIVE_MIN_INTERVAL_MS)
    return { ...cached, cacheOnly: true };
  if (!inLiveWindow && cached?.from?.time) return { ...cached, cacheOnly: true };
  if (!hasAnyProviderKey())
    return cached ? { ...cached, savingsMode: true, cacheOnly: true } : { error: 'no_providers', savingsMode: true, status: 503 };
  let lastError = null;
  for (const p of PROVIDERS) {
    if (!store.quotaAvailable(p.id)) continue;
    try {
      const rec = await p.fetch(flight, date);
      if (rec?.from?.time) { store.setFlight(key, rec); return rec; }
    } catch (err) { lastError = err; console.warn(`[flight] ${p.id}:`, err.message); }
  }
  if (cached) return { ...cached, savingsMode: true, cacheOnly: true };
  return { error: 'lookup_failed', savingsMode: true, message: lastError?.message ?? 'all_providers_failed', status: 503 };
}

export default async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  if (url.pathname.endsWith('/status')) {
    const providers = PROVIDERS.map((p) => ({ id: p.id, configured: Boolean(process.env[p.env]), quota: store.quota[p.id] ?? { month: currentMonth(), count: 0 }, limit: MONTHLY_LIMIT_PER_PROVIDER }));
    return Response.json({ providers }, { headers: CORS });
  }
  try {
    const result = await lookupFlight(url.searchParams.get('flight'), url.searchParams.get('date'), url.searchParams.get('live') === '1');
    if (result.error && !result.from) return Response.json(result, { status: result.status ?? 502, headers: CORS });
    return Response.json(result, { headers: CORS });
  } catch (err) {
    return Response.json({ error: 'server_error', message: err.message }, { status: 500, headers: CORS });
  }
};