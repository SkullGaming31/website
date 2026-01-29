import { render, screen, waitFor } from '@testing-library/react';
import SteamPlaytime from '../app/components/SteamPlaytime';
import { server } from '../test/fetchMock';
import { describe, it, expect } from 'vitest';
import { vi } from 'vitest';

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

  it('shows loading state while fetching', async () => {
    const oldFetch = (globalThis as any).fetch;
    let resolveFetch: (value: any) => void = () => { };
    const fetchPromise = new Promise((res) => { resolveFetch = res; });
    (globalThis as any).fetch = vi.fn().mockReturnValue(fetchPromise);

    try {
      render(<SteamPlaytime steamid="76561198000000000" />);
      // component should show loading while the fetch promise is unresolved
      await waitFor(() => expect(screen.getByText(/Loading playtime…/i)).toBeInTheDocument());

      // now resolve the fetch with a successful response
      resolveFetch({
        ok: true, json: async () => ({
          spaceEngineers: { appid: 244850, name: 'Space Engineers', hours: 1, hours_2weeks: 0 },
          warframe: { appid: 230410, name: 'Warframe', hours: 2, hours_2weeks: 0 },
        })
      });

      // wait for the totals to appear
      await waitFor(() => expect(screen.getByText(/Total: 1 hrs/i)).toBeInTheDocument());
    } finally {
      (globalThis as any).fetch = oldFetch;
    }
  });

  it('shows error when fetch returns non-ok', async () => {
    server.use(server.respondWith('/api/steam-playtime', 500, { error: 'bad' }));

    render(<SteamPlaytime steamid="76561198000000000" />);

    await waitFor(() => expect(screen.getByText(/Error:/i)).toBeInTheDocument());
  });

  it('renders "Not available / private" when game entries are null', async () => {
    server.use(
      server.respondWith('/api/steam-playtime', 200, {
        spaceEngineers: null,
        warframe: null,
      })
    );

    render(<SteamPlaytime steamid="76561198000000000" />);

    await waitFor(() => expect(screen.getAllByText(/Not available \/ private/i).length).toBeGreaterThanOrEqual(1));
  });

  it('falls back to default names when game name is missing', async () => {
    server.use(
      server.respondWith('/api/steam-playtime', 200, {
        spaceEngineers: { appid: 244850, hours: 3, hours_2weeks: 0 },
        warframe: null,
      })
    );

    render(<SteamPlaytime steamid="76561198000000000" />);

    // wait for the totals to appear to ensure data was rendered
    await waitFor(() => expect(screen.getByText(/Total: 3 hrs/i)).toBeInTheDocument());
    // warframe is null so should show Not available
    expect(screen.getByText(/Not available \/ private/i)).toBeInTheDocument();
  });

  it('does not attempt to set state after unmount (cancel path)', async () => {
    const oldFetch = (globalThis as any).fetch;
    let resolveFetch: (value: any) => void = () => { };
    const fetchPromise = new Promise((res) => { resolveFetch = res; });
    (globalThis as any).fetch = vi.fn().mockReturnValue(fetchPromise);

    try {
      const { unmount } = render(<SteamPlaytime steamid="76561198000000000" />);
      // unmount before the fetch resolves to trigger the cancelled path
      unmount();

      // resolve the fetch; component should not throw when resolving after unmount
      resolveFetch({ ok: true, json: async () => ({ spaceEngineers: null, warframe: null }) });

      // allow microtasks to settle
      await Promise.resolve();
    } finally {
      (globalThis as any).fetch = oldFetch;
    }
  });
});
