import { render, screen, waitFor } from '@testing-library/react';
import VodsSection from '../app/components/VodsSection';
import { vi, describe, it, expect, afterEach } from 'vitest';

describe('VodsSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders clips from the API when available', async () => {
    const payload = {
      clips: [
        // game_id should be the Twitch game id (string of numbers) rather than the game name
        { id: 'c1', title: 'Clip One', url: 'https://clips.twitch.tv/c1', thumbnail_url: '', game_id: '12345' },
      ],
      fetchedAt: new Date().toISOString(),
    };

  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve({ ok: true, json: async () => payload })) as unknown as typeof globalThis.fetch);

    render(<VodsSection limit={5} />);

    await waitFor(() => expect(screen.getByText(/Clip One/i)).toBeInTheDocument());
    const link = screen.getByRole('link', { name: /Clip One/i }) as HTMLAnchorElement;
    expect(link).toBeTruthy();
  // href may be resolved/normalized by the environment; assert the id/path is present
  expect(link.href).toContain('c1');
  });

  it('falls back to sample data when fetch fails', async () => {
  vi.stubGlobal('fetch', vi.fn(() => Promise.reject(new Error('network'))) as unknown as typeof globalThis.fetch);

    render(<VodsSection limit={5} />);

    await waitFor(() => expect(screen.getByText(/Epic Valorant Clutch/i)).toBeInTheDocument());
  });
});
