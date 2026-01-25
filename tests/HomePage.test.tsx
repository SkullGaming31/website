/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

// Mock components used by the page to keep test focused and deterministic
vi.mock('next/font/google', () => ({ Geist: () => ({ variable: '--font-geist-sans' }), Geist_Mono: () => ({ variable: '--font-geist-mono' }) }));
vi.mock('../app/components/TwitchPlayer', () => ({ default: (props: any) => <div data-testid="twitch-player">TwitchPlayer:{props.channel}</div> }));
vi.mock('../app/components/VodsSection', () => ({ default: (props: any) => <div data-testid="vods-section">Vods limit:{props.limit}</div> }));
vi.mock('../app/components/ScheduleSection', () => ({ default: (props: any) => <div data-testid="schedule-section">Schedule showWeekly:{String(props.showWeeklyOverview)}</div> }));
vi.mock('../app/components/CallToAction', () => ({ default: () => <div data-testid="call-to-action">CTA</div> }));
vi.mock('../app/components/GameHeroBackground', () => ({ default: () => <div data-testid="game-hero">HeroBG</div> }));
vi.mock('../app/components/Button', () => ({ default: (props: any) => <a href={props.href} data-testid="button">{props.children}</a> }));
vi.mock('@heroicons/react/24/solid', () => ({ HeartIcon: (props: any) => <svg data-testid="heart-icon" /> }));

import Home from '../app/page';

describe('Home page', () => {
  it('renders hero headings and primary CTA', () => {
    render(<Home />);

    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/The DragonDen/i)).toBeInTheDocument();

    // mocked Twitch player should render with the channel name
    expect(screen.getByTestId('twitch-player')).toHaveTextContent('TwitchPlayer:canadiendragon');

    // mocked Vods and Schedule sections
    expect(screen.getByTestId('vods-section')).toBeInTheDocument();
    expect(screen.getByTestId('schedule-section')).toBeInTheDocument();

    // buttons: there are multiple; ensure one links to Twitch and the heart icon exists
    const buttons = screen.getAllByTestId('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
    expect(buttons.some((b) => b.getAttribute('href')?.includes('twitch.tv'))).toBe(true);
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });
});
