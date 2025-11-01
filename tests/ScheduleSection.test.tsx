import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, afterEach } from 'vitest';
import ScheduleSection from '../app/components/ScheduleSection';
import { server } from '../test/fetchMock';

describe('ScheduleSection', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders no-scheduled message when API returns empty segments', async () => {
  // default MSW handler returns empty schedule — no setup required

    // ScheduleSection is an async server component; call it and await the element
    // then render the returned JSX into the test DOM
    // hide the weekly overview to simplify assertions
  // call the async server component and render the result
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const jsx = await ScheduleSection({ showWeeklyOverview: false });
  render(jsx as unknown as React.ReactElement);

    // Expect the "No scheduled stream" placeholder to appear for at least one day
    await waitFor(() => expect(screen.getAllByText(/No scheduled stream/i).length).toBeGreaterThan(0));
  // And the section heading should exist (exact match)
  expect(screen.getByText(/^Schedule$/i)).toBeTruthy();
  });

  it('renders a provided payload with a scheduled segment', async () => {
    const seg = {
      id: 's1',
      title: 'Special Stream',
      start_time: '2025-01-06T19:00:00.000Z', // a Monday
    };
    const payload = { vacation: null, segments: [seg], fetchedAt: new Date().toISOString() };

    // Provide payload directly to avoid fetch
    // Override the schedule handler to return our test payload
    server.use(server.respondWith('/api/twitch/schedule', 200, payload));

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const jsx = await ScheduleSection({ showWeeklyOverview: false, payload });
  render(jsx as unknown as React.ReactElement);

    // The title of the segment should be visible
    await waitFor(() => expect(screen.getByText(/Special Stream/i)).toBeInTheDocument());
  // And the Schedule heading (exact match)
  expect(screen.getByText(/^Schedule$/i)).toBeTruthy();
  });
});
