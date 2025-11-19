import { render, screen, waitFor } from '@testing-library/react';
import SteamPlaytime from '../app/components/SteamPlaytime';
import { server } from '../test/fetchMock';
import { describe, it, expect } from 'vitest';

describe('SteamPlaytime', () => {
  it('prompts when no steamid is provided', () => {
    render(<SteamPlaytime />);
    expect(screen.getByText(/Provide a SteamID64 to show playtime\./i)).toBeInTheDocument();
  });

  it('renders playtime for both games when API returns data', async () => {
    server.use(
      server.respondWith('/api/steam-playtime', 200, {
        spaceEngineers: { appid: 244850, name: 'Space Engineers', hours: 12.3, hours_2weeks: 1.2 },
        warframe: { appid: 230410, name: 'Warframe', hours: 45.6, hours_2weeks: 2.5 },
      })
    );

    render(<SteamPlaytime steamid="76561198000000000" />);

    // wait for both totals to appear
    await waitFor(() => expect(screen.getByText(/Total: 12.3 hrs/i)).toBeInTheDocument());
    expect(screen.getByText(/Last 2 weeks: 1.2 hrs/i)).toBeInTheDocument();
    expect(screen.getByText(/Total: 45.6 hrs/i)).toBeInTheDocument();
    expect(screen.getByText(/Last 2 weeks: 2.5 hrs/i)).toBeInTheDocument();
  });
});
