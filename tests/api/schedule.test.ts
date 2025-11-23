/** @vitest-environment node */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import * as scheduleRoute from '../../app/api/twitch/schedule/route';

describe('schedule API route', () => {
  it('returns error when TWITCH creds are missing', async () => {
    // ensure env vars are undefined for this test
    const origClientId = process.env.TWITCH_CLIENT_ID;
    const origClientSecret = process.env.TWITCH_CLIENT_SECRET;
    delete process.env.TWITCH_CLIENT_ID;
    delete process.env.TWITCH_CLIENT_SECRET;

    try {
      const res = await (scheduleRoute as any).GET();
      // NextResponse should behave like a Response and support json()
      const body = typeof res.json === 'function' ? await res.json() : res;
      expect(body).toBeDefined();
      expect(body.error).toBe('no_twitch_credentials');
    } finally {
      process.env.TWITCH_CLIENT_ID = origClientId;
      process.env.TWITCH_CLIENT_SECRET = origClientSecret;
    }
  });
});
