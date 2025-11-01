import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, afterEach, vi, expect } from 'vitest';
import ScheduleVacationBanner from '../app/components/ScheduleVacationBanner';
import { server } from '../test/fetchMock';

describe('ScheduleVacationBanner', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('shows banner when vacation is returned by API', async () => {
  const payload = { vacation: { start_time: '2025-12-01T00:00:00Z', end_time: '2025-12-07T00:00:00Z' } };
  // override handler for this test
  server.use(server.respondWith('/api/twitch/schedule', 200, payload));

  render(<ScheduleVacationBanner />);

  // assert the more unique trailing text to avoid matching nested strong elements
  await waitFor(() => expect(screen.getByText(/Streams may be paused/i)).toBeInTheDocument());
  });

  it('renders nothing when no vacation present', async () => {
  // default MSW handler returns no vacation
  const { container } = render(<ScheduleVacationBanner />);

    // allow effect to run
    await waitFor(() => {
      // component returns null when no vacation
      expect(container.firstChild).toBeNull();
    });
  });
});
