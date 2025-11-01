/** @vitest-environment node */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Helper to build a mock Response-like object
function mockResponse(ok: boolean, body: unknown, status = 200) {
  return {
    ok,
    status,
    json: async () => body,
    text: async () => (typeof body === 'string' ? body : JSON.stringify(body)),
  } as unknown as Response;
}

describe('stream route', () => {
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

  it('returns live payload when helix stream returns data', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const streamBody = { data: [{ id: 'st1', title: 'Live!', viewer_count: 10, game_name: 'Game' }] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, streamBody, 200));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/stream/route');
    const res = await (route as any).GET();
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(body.live).toBe(true);
    expect(body.title).toBe('Live!');
    expect(body.viewer_count).toBe(10);
  });

  it('returns live=false when helix stream returns empty data', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const streamBody = { data: [] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, streamBody, 200));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/stream/route');
    const res = await (route as any).GET();
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(body.live).toBe(false);
  });
});
