// Lightweight centralized fetch mock used in tests instead of MSW.
// Matches requests by substring path (works for absolute or relative URLs).

type RespBody = unknown;
type Resolved = { status: number; body: RespBody } | { type: 'networkError' };

type Handler = {
  path: string; // substring to match against the request url
  method?: string; // e.g. 'GET'
  resolver: (req: { url: string; method: string }) => Promise<Resolved> | Resolved;
};

const DEFAULT_HANDLERS: Handler[] = [
  {
    path: '/api/twitch/clips',
    method: 'GET',
    resolver: () => ({
      status: 200,
    body: { clips: [{ id: 'c1', title: 'Clip One', creator_name: 'Streamer', url: 'https://clips.twitch.tv/c1' }] },
    }),
  },
  {
    path: '/api/twitch/videos',
    method: 'GET',
    resolver: () => ({ status: 200, body: { videos: [] } }),
  },
  {
    path: '/api/twitch/schedule',
    method: 'GET',
    resolver: () => ({ status: 200, body: { vacation: null, segments: [], fetchedAt: new Date().toISOString() } }),
  },
  {
    path: '/api/twitch/stream',
    method: 'GET',
    resolver: () => ({ status: 200, body: { live: false } }),
  },
];

let originalFetch: typeof fetch | undefined = undefined;
let overrides: Handler[] = [];

function matchHandler(url: string, method: string) {
  // search overrides first (LIFO so later .use() wins), then defaults
  const all = [...overrides.slice().reverse(), ...DEFAULT_HANDLERS];
  return all.find((h) => {
    if (h.method && h.method.toUpperCase() !== method.toUpperCase()) return false;
    return url.includes(h.path);
  });
}

async function mockedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input.toString();
  const method = init?.method ?? (typeof input === 'string' ? 'GET' : (input as Request).method ?? 'GET');

  const handler = matchHandler(url, method);
  if (!handler) {
    return new Response(null, { status: 404 });
  }

  const result = await handler.resolver({ url, method });
  if ((result as Resolved).hasOwnProperty('type') && (result as Resolved & { type?: string }).type === 'networkError') {
    // simulate network error by rejecting with TypeError like fetch does
    return Promise.reject(new TypeError('Failed to fetch'));
  }

  const { status, body } = result as { status: number; body: RespBody };
  const bodyString = typeof body === 'string' ? body : JSON.stringify(body);
  return new Response(bodyString, { status, headers: { 'Content-Type': 'application/json' } });
}

export const server = {
  // start replacing global fetch
  start() {
    if (typeof globalThis === 'undefined') return;
    // store original only once
  if (!originalFetch) originalFetch = (globalThis as unknown as { fetch?: typeof fetch }).fetch;
  (globalThis as unknown as { fetch?: typeof fetch }).fetch = mockedFetch;
  },
  // stop and restore original fetch
  close() {
    if (typeof globalThis === 'undefined') return;
  if (originalFetch) (globalThis as unknown as { fetch?: typeof fetch }).fetch = originalFetch;
  originalFetch = undefined;
    overrides = [];
  },
  // add an override handler; later uses take precedence
  use(h: Handler) {
    overrides.push(h);
  },
  // reset any overrides
  resetHandlers() {
    overrides = [];
  },
  // convenience: create a network-error handler for a path
  networkError(path: string) {
    return { path, method: 'GET', resolver: () => ({ type: 'networkError' } as const) } as Handler;
  },
  // convenience: create a response handler for a path
  respondWith(path: string, status: number, body: RespBody) {
    return { path, method: 'GET', resolver: () => ({ status, body }) } as Handler;
  },
};

export {};
