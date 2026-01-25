import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import Header from '../app/components/Header';
import { server } from '../test/fetchMock';

describe('Header', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders brand and navigation links and shows live status', async () => {
    // override stream handler to return live
    server.use(server.respondWith('/api/twitch/stream', 200, { live: true }));

    render(<Header />);

    // Brand text
    expect(screen.getByText(/CanadienDragon/i)).toBeTruthy();

    // Nav links
    expect(screen.getByText(/Schedule/i)).toBeTruthy();
    expect(screen.getByText(/Videos/i)).toBeTruthy();

    // LiveStatusBadge starts as 'Live: ...' then updates
    await waitFor(() => expect(screen.getByText(/Live: Online/i)).toBeInTheDocument());
  });
});
