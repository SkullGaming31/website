import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import VodsSection from '../app/components/VodsSection';
import { vi, describe, it, expect, afterEach } from 'vitest';
import { server } from '../test/fetchMock';

describe('VodsSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders clips from the API when available', async () => {
    // default handlers (from MSW) return one sample clip with id 'c1' — no setup required

    render(<VodsSection limit={5} />);

    await waitFor(() => expect(screen.getByText(/Clip One/i)).toBeInTheDocument());
    const link = screen.getByRole('link', { name: /Clip One/i }) as HTMLAnchorElement;
    expect(link).toBeTruthy();
  // href may be resolved/normalized by the environment; assert the id/path is present
  expect(link.href).toContain('c1');
  });

  it('falls back to sample data when fetch fails', async () => {
  // simulate network error for clips endpoint
  server.use(server.networkError('/api/twitch/clips'));

    render(<VodsSection limit={5} />);

    await waitFor(() => expect(screen.getByText(/Epic Valorant Clutch/i)).toBeInTheDocument());
  });

  it('renders videos from the API when available', async () => {
    server.use(server.respondWith('/api/twitch/videos', 200, { videos: [
      { id: 'v1', title: 'Video One', user_name: 'StreamerX', view_count: 500, type: 'highlight', url: 'https://videos/v1', duration: '12:34' }
    ] }));

    render(<VodsSection limit={5} />);

    await waitFor(() => expect(screen.getByText(/Video One/i)).toBeInTheDocument());
    const link = screen.getByRole('link', { name: /Video One/i }) as HTMLAnchorElement;
    expect(link.href).toContain('videos/v1');
  });

  it('shows empty state when filters remove all items (debounced search)', async () => {
    render(<VodsSection limit={5} />);

    // type a search term that won't match sample data (debounced in component)
    const input = screen.getByPlaceholderText(/Search videos.../i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'this-wont-match-anything-xyz' } });

    // wait for debounce (component uses 250ms) and for the empty state to appear
    await waitFor(() => expect(screen.getByText(/No videos match the selected filters./i)).toBeInTheDocument(), { timeout: 2000 });
  });
});
