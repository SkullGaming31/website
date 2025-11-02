import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VodsSection from '../app/components/VodsSection';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { server } from '../test/fetchMock';

describe('VodsSection extra coverage', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    server.resetHandlers();
  });

  it('renders clip game as formatted views when view_count is present', async () => {
    server.use(server.respondWith('/api/twitch/clips', 200, { clips: [
      { id: 'c2', title: 'Clip Two', creator_name: 'Clipster', view_count: 1234, url: 'https://clips/c2' }
    ] }));

    render(<VodsSection limit={5} />);

    // wait for the clip title then assert the formatted views text appears in the card
    await waitFor(() => expect(screen.getByText(/Clip Two/i)).toBeInTheDocument());
    expect(screen.getByText(/1,234 views/i)).toBeInTheDocument();
  });

  it('uses video duration when view_count is missing', async () => {
    server.use(server.respondWith('/api/twitch/videos', 200, { videos: [
      { id: 'v2', title: 'Video Two', user_name: 'Uploader', duration: '01:23:45', url: 'https://videos/v2' }
    ] }));

    render(<VodsSection limit={5} />);

    await waitFor(() => expect(screen.getByText(/Video Two/i)).toBeInTheDocument());
    // duration should be used in the 'game' position when view_count is undefined
    expect(screen.getByText(/01:23:45/i)).toBeInTheDocument();
  });

  it('filters by game selection', async () => {
    // ensure server returns empty arrays so component falls back to sampleVods
    server.use(server.respondWith('/api/twitch/clips', 200, { clips: [] }));
    server.use(server.respondWith('/api/twitch/videos', 200, { videos: [] }));

    render(<VodsSection />);

    // wait for sample data to render
    await waitFor(() => expect(screen.getByText(/Epic Valorant Clutch/i)).toBeInTheDocument());

    const selects = screen.getAllByRole('combobox');
    const select = selects[0] as HTMLSelectElement;
    // change to 'Minecraft' which exists in sampleVods
    fireEvent.change(select, { target: { value: 'Minecraft' } });

    await waitFor(() => expect(screen.queryByText(/Minecraft Speedrun/i)).toBeInTheDocument());
  });

  it('respects the limit prop and only shows that many items', async () => {
    // ensure server returns empty arrays so component uses sampleVods and then limit applies
    server.use(server.respondWith('/api/twitch/clips', 200, { clips: [] }));
    server.use(server.respondWith('/api/twitch/videos', 200, { videos: [] }));

    render(<VodsSection limit={3} />);

    // wait for items to render and then count links
    await waitFor(() => expect(screen.getAllByRole('link').length).toBeGreaterThanOrEqual(1));
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(3);
  });
});
