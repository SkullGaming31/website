/** @vitest-environment node */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
// We'll dynamically import the route module inside each test to ensure module-level caches are reset.

// Helper to build a mock Response-like object
function mockResponse(ok: boolean, body: unknown, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
}

describe('clips route (detailed)', () => {
  const OLD_CLIENT = process.env.TWITCH_CLIENT_ID;
  const OLD_SECRET = process.env.TWITCH_CLIENT_SECRET;

  beforeEach(() => {
    process.env.TWITCH_CLIENT_ID = 'test-id';
    process.env.TWITCH_CLIENT_SECRET = 'test-secret';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.TWITCH_CLIENT_ID = OLD_CLIENT;
    process.env.TWITCH_CLIENT_SECRET = OLD_SECRET;
  });

  it('returns clips when token, user and clips endpoints succeed', async () => {
    // Sequence: token POST -> users GET -> clips GET
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const usersBody = { data: [{ id: 'b1' }] };
    const clipsBody = { data: [{ id: 'c1', title: 'Clip One' }] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, usersBody, 200))
      .mockResolvedValueOnce(mockResponse(true, clipsBody, 200));

    (globalThis as any).fetch = fetchMock;

  vi.resetModules();
  const clipsRoute = await import('../../app/api/twitch/clips/route');
  const res = await (clipsRoute as any).GET(new Request('http://localhost/?limit=5'));
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(Array.isArray(body.clips)).toBe(true);
    expect(body.clips.length).toBe(1);
    expect(body.clips[0].id).toBe('c1');
  });

  it('returns user_not_found when users endpoint returns no data', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const usersBody = { data: [] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, usersBody, 200));

    (globalThis as any).fetch = fetchMock;

  vi.resetModules();
  const clipsRoute = await import('../../app/api/twitch/clips/route');
  const res = await (clipsRoute as any).GET(new Request('http://localhost'));
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(body.error).toBe('user_not_found');
  });

  it('returns helix_clips_<status> when clips endpoint fails', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const usersBody = { data: [{ id: 'b1' }] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, usersBody, 200))
      .mockResolvedValueOnce(mockResponse(false, 'bad', 502));

    (globalThis as any).fetch = fetchMock;

  vi.resetModules();
  const clipsRoute = await import('../../app/api/twitch/clips/route');
  const res = await (clipsRoute as any).GET(new Request('http://localhost'));
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(body.error).toMatch(/^helix_clips_/);
  });
});
