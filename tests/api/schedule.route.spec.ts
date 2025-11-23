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

describe('schedule route', () => {
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

  it('returns schedule payload when token and schedule endpoints succeed', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };
    const scheduleBody = { data: { vacation: null, segments: [{ id: 's1', title: 'Segment 1' }] } };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(true, scheduleBody, 200));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/schedule/route');
    const res = await (route as any).GET();
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(Array.isArray(body.segments)).toBe(true);
    expect(body.segments.length).toBe(1);
    expect(body.segments[0].id).toBe('s1');
  });

  it('returns helix_schedule_<status> when schedule endpoint fails', async () => {
    const tokenBody = { access_token: 'tok', expires_in: 3600 };

    const fetchMock = vi.fn()
      .mockResolvedValueOnce(mockResponse(true, tokenBody, 200))
      .mockResolvedValueOnce(mockResponse(false, 'bad', 502));

    (globalThis as any).fetch = fetchMock;

    vi.resetModules();
    const route = await import('../../app/api/twitch/schedule/route');
    const res = await (route as any).GET();
    const body = typeof res.json === 'function' ? await res.json() : res;

    expect(body).toBeDefined();
    expect(body.error).toMatch(/^helix_schedule_/);
  });
});
