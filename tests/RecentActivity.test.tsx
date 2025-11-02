import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RecentActivity from '../app/components/RecentActivity';

describe('RecentActivity', () => {
  it('renders recent activity items', () => {
    render(<RecentActivity />);

    expect(screen.getByText(/Recent Activity/i)).toBeTruthy();
    expect(screen.getByText(/Wraith/)).toBeTruthy();
    expect(screen.getByText(/Joined voice channel/)).toBeTruthy();
    expect(screen.getByText(/2m ago/)).toBeTruthy();
  });
});
