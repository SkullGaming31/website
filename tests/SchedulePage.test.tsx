/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

// Mock child components to keep this test deterministic
vi.mock('../app/components/ScheduleSection', () => ({ default: (props: any) => <div data-testid="schedule-section">Schedule showWeekly:{String(props.showWeeklyOverview)}</div> }));
vi.mock('../app/components/StayConnected', () => ({ default: () => <div data-testid="stay-connected">StayConnected</div> }));
vi.mock('../app/components/Button', () => ({ default: (props: any) => <a href={props.href} data-testid="button">{props.children}</a> }));
vi.mock('next/font/google', () => ({ Geist: () => ({ variable: '--font-geist-sans' }), Geist_Mono: () => ({ variable: '--font-geist-mono' }) }));

import SchedulePage from '../app/schedule/page';

describe('Schedule page', () => {
  it('renders header, timezone note and action buttons', async () => {
    // Await the async server component to get its rendered JSX
    const element = await (SchedulePage as any)();
    render(element as any);

    expect(screen.getByText(/Stream Schedule/i)).toBeInTheDocument();
    expect(screen.getByText(/Never miss a stream/i)).toBeInTheDocument();

    // buttons
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons.some((b) => b.getAttribute('href')?.includes('twitch.tv'))).toBe(true);

    // timezone note
    expect(screen.getByText(/All times shown in Newfoundland Standard Time/i)).toBeInTheDocument();

    // mocked child components present
    expect(screen.getByTestId('schedule-section')).toBeInTheDocument();
    expect(screen.getByTestId('stay-connected')).toBeInTheDocument();
  });
});
