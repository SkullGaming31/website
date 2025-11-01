import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, afterEach, vi, expect } from 'vitest';
import LiveStatusBadge from '../app/components/LiveStatusBadge';
import { server } from '../test/fetchMock';

describe('LiveStatusBadge', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('shows loading then online when API reports live', async () => {
  // override stream handler to report live
  server.use(server.respondWith('/api/twitch/stream', 200, { live: true }));

  render(<LiveStatusBadge />);

    // initial label
    expect(screen.getByText(/Live: .../i)).toBeTruthy();

    await waitFor(() => expect(screen.getByText(/Live: Online/i)).toBeInTheDocument());
  });

  it('shows offline when API fails or returns not live', async () => {
  // simulate network failure for stream endpoint
  server.use(server.networkError('/api/twitch/stream'));

  render(<LiveStatusBadge />);

    await waitFor(() => expect(screen.getByText(/Live: Offline/i)).toBeInTheDocument());
  });
});
