/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import * as clipsRoute from '../../app/api/twitch/clips/route';

describe('clips API route', () => {
  it('returns error when TWITCH creds are missing', async () => {
    const origClientId = process.env.TWITCH_CLIENT_ID;
    const origClientSecret = process.env.TWITCH_CLIENT_SECRET;
    delete process.env.TWITCH_CLIENT_ID;
    delete process.env.TWITCH_CLIENT_SECRET;

    try {
      const res = await (clipsRoute as any).GET(new Request('http://localhost'));
      const body = typeof res.json === 'function' ? await res.json() : res;
      expect(body).toBeDefined();
      expect(body.error).toBe('no_twitch_credentials');
    } finally {
      process.env.TWITCH_CLIENT_ID = origClientId;
      process.env.TWITCH_CLIENT_SECRET = origClientSecret;
    }
  });
});
