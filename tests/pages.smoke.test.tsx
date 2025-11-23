import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock child components to keep server page rendering deterministic
vi.mock('../app/components/DiscordDashboard', () => ({ default: () => <div data-testid="discord-dashboard">DiscordDashboardStub</div> }));
vi.mock('../app/components/ServerMembers', () => ({ default: () => <div data-testid="server-members">ServerMembersStub</div> }));
vi.mock('../app/components/RecentActivity', () => ({ default: () => <div data-testid="recent-activity">RecentActivityStub</div> }));
vi.mock('../app/components/VodsSection', () => ({ default: () => <div data-testid="vods-section">VodsSectionStub</div> }));
vi.mock('next/font/google', () => ({ Geist: () => ({ variable: '--font-geist-sans' }), Geist_Mono: () => ({ variable: '--font-geist-mono' }) }));

import DashboardPage from '../app/dashboard/page';
import VideosPage from '../app/videos/page';

describe('Server pages smoke tests', () => {
  it('renders dashboard page with expected child components', async () => {
    const element = await (DashboardPage as any)();
    render(element as any);

    expect(screen.getByTestId('discord-dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('server-members')).toBeInTheDocument();
    expect(screen.getByTestId('recent-activity')).toBeInTheDocument();
  });

  it('renders videos page with heading and vods section', async () => {
    const element = await (VideosPage as any)();
    render(element as any);

    expect(screen.getByText(/Video Library/i)).toBeInTheDocument();
    expect(screen.getByTestId('vods-section')).toBeInTheDocument();
  });
});
