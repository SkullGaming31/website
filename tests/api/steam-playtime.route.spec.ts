/** @vitest-environment node */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET } from '../../app/api/steam-playtime/route';
import { server } from '../../test/fetchMock';
import { describe, it, expect } from 'vitest';

describe('GET /api/steam-playtime route', () => {
  it('returns 500 when STEAM_API_KEY missing', async () => {
    const old = process.env.STEAM_API_KEY;
    delete process.env.STEAM_API_KEY;
    try {
      const req = new Request('http://localhost/api/steam-playtime?steamid=1');
      const res = await GET(req as any);
      expect(res.status).toBe(500);
      const j = await res.json();
      expect(j.error).toMatch(/STEAM_API_KEY/);
    } finally {
      if (old !== undefined) process.env.STEAM_API_KEY = old;
    }
  });

  it('returns playtime when Steam API responds', async () => {
    const old = process.env.STEAM_API_KEY;
    process.env.STEAM_API_KEY = 'FAKEKEY';

    server.use(
      server.respondWith('/IPlayerService/GetOwnedGames', 200, {
        response: {
          games: [
            { appid: 244850, name: 'Space Engineers', playtime_forever: 120, playtime_2weeks: 30 },
            { appid: 230410, name: 'Warframe', playtime_forever: 300, playtime_2weeks: 60 },
          ],
        },
      })
    );

    try {
      const req = new Request('http://localhost/api/steam-playtime?steamid=76561198153222775');
      const res = await GET(req as any);
      expect(res.status).toBe(200);
      const j = await res.json();
      expect(j.spaceEngineers.hours).toBe(2.0);
      expect(j.spaceEngineers.hours_2weeks).toBe(0.5);
      expect(j.warframe.hours).toBe(5.0);
      expect(j.warframe.hours_2weeks).toBe(1.0);
    } finally {
      if (old !== undefined) process.env.STEAM_API_KEY = old;
      else delete process.env.STEAM_API_KEY;
    }
  });
});
