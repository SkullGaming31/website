import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { vi, describe, it, expect } from 'vitest';

// Mock next/font/google used in layout to avoid runtime errors in test environment
vi.mock('next/font/google', () => ({
  Geist: (opts: any) => ({ variable: '--font-geist-sans' }),
  Geist_Mono: (opts: any) => ({ variable: '--font-geist-mono' }),
}));

import RootLayout from '../app/layout';
import { server } from '../test/fetchMock';

describe('RootLayout', () => {
  it('renders header, footer and children', () => {
    render(
      <RootLayout>
        <div>Child content</div>
      </RootLayout>
    );

    // header brand — find within the header region to avoid matching footer
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent(/CanadienDragon/i);
    // child content
    expect(screen.getByText('Child content')).toBeInTheDocument();
    // footer copyright (year may vary) — assert presence of the site name in footer
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent(/CanadienDragon — All rights reserved\./i);
  });

  it('shows LiveBanner when stream API reports live', async () => {
    // override the stream handler to return live status
    server.use(
      server.respondWith('/api/twitch/stream', 200, { live: true, title: 'Testing Live', game_name: 'Test Game' })
    );

    render(
      <RootLayout>
        <div />
      </RootLayout>
    );

    // LiveBanner content is fetched asynchronously — wait for LIVE label to appear
    await waitFor(() => expect(screen.getByText(/LIVE/i)).toBeInTheDocument());
    expect(screen.getByText(/Testing Live/)).toBeInTheDocument();
  });
});
