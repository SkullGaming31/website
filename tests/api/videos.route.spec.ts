/** @vitest-environment node */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

describe('videos route', () => {
  const OLD_CLIENT = process.env.TWITCH_CLIENT_ID;
  const OLD_SECRET = process.env.TWITCH_CLIENT_SECRET;

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.TWITCH_CLIENT_ID = 'test-id';
    process.env.TWITCH_CLIENT_SECRET = 'test-secret';
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env.TWITCH_CLIENT_ID = OLD_CLIENT;
    process.env.TWITCH_CLIENT_SECRET = OLD_SECRET;
  });

  it('returns error when twitch credentials are missing', async () => {
    process.env.TWITCH_CLIENT_ID = '';
    process.env.TWITCH_CLIENT_SECRET = '';

    vi.resetModules();
    const route = await import('../../app/api/twitch/videos/route');

    const req = new Request('https://example.test/api/twitch/videos');
    const res = await (route as any).GET(req);
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(body.error).toBe('no_twitch_credentials');
    expect(Array.isArray(body.videos)).toBe(true);
    expect(body.videos.length).toBe(0);
  });

  it('fetches videos successfully from helix', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const usersBody = { data: [{ id: 'b1' }] };
    const videosBody = { data: [{ id: 'v1', title: 'Video 1' }] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, usersBody, 200))
      .mockResolvedValueOnce(mockResponse(true, videosBody, 200));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/videos/route');

    const req = new Request('https://example.test/api/twitch/videos?limit=2');
    const res = await (route as any).GET(req);
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(Array.isArray(body.videos)).toBe(true);
    expect(body.videos.length).toBe(1);
    expect(body.videos[0].id).toBe('v1');
  });

  it('returns 404 when user not found', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const usersBody = { data: [] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, usersBody, 200));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/videos/route');

    const req = new Request('https://example.test/api/twitch/videos');
    const res = await (route as any).GET(req);
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect((res as Response).status || 200).toBe(404);
    expect(body.error).toBe('user_not_found');
  });

  it('returns 502 when helix videos endpoint fails', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const usersBody = { data: [{ id: 'b1' }] };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, usersBody, 200))
      .mockResolvedValueOnce(mockResponse(false, 'bad', 500));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/videos/route');

    const req = new Request('https://example.test/api/twitch/videos');
    const res = await (route as any).GET(req);
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect((res as Response).status).toBe(502);
    expect(body.error).toMatch(/helix_videos_500/);
    expect(body.detail).toBeDefined();
  });

  it('returns 500 when token fetch fails', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(mockResponse(false, 'nope', 400));
    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/videos/route');

    const req = new Request('https://example.test/api/twitch/videos');
    const res = await (route as any).GET(req);
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect((res as Response).status).toBe(500);
    expect(body.error).toMatch(/token fetch failed: 400/);
  });
});
