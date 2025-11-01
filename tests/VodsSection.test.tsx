import { render, screen, waitFor } from '@testing-library/react';
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
});
