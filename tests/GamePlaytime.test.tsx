import { render, screen, waitFor } from '@testing-library/react';
import GamePlaytime from '../app/components/GamePlaytime';
import { server } from '../test/fetchMock';
import { describe, it, expect } from 'vitest';

describe('GamePlaytime', () => {
  it('shows placeholder when no steamid provided', () => {
    render(<GamePlaytime appid={244850} />);
    expect(screen.getByText(/Hours played: —/i)).toBeInTheDocument();
  });

  it('shows hours when API returns data', async () => {
    server.use(
      server.respondWith('/api/steam-playtime', 200, {
        spaceEngineers: { appid: 244850, hours: 5, hours_2weeks: 1 },
        warframe: null,
      })
    );

    render(<GamePlaytime steamid="76561198000000000" appid={244850} />);

    await waitFor(() => expect(screen.getByText(/Total: 5 hrs/i)).toBeInTheDocument());
    expect(screen.getByText(/Last 2 weeks: 1 hrs/i)).toBeInTheDocument();
  });

  it('shows Error on API failure', async () => {
    server.use(server.respondWith('/api/steam-playtime', 502, { error: 'Steam down' }));
    render(<GamePlaytime steamid="76561198000000000" appid={244850} />);
    await waitFor(() => expect(screen.getByText(/Error/i)).toBeInTheDocument());
  });
});
