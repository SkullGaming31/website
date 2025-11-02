import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ServerMembers, { statusColor } from '../app/components/ServerMembers';

describe('ServerMembers', () => {
  it('renders member row and action button', () => {
    render(<ServerMembers />);

    // header
    expect(screen.getByText(/Server Members/i)).toBeTruthy();

    // member name
    expect(screen.getByText('modvlog')).toBeTruthy();

    // status text
    expect(screen.getByText('Offline')).toBeTruthy();

    // action button (aria-label contains member name)
    const btn = screen.getByLabelText(/More actions for modvlog/i);
    expect(btn).toBeTruthy();
  });

  it('statusColor returns expected classes for Online/Idle/Offline', () => {
    expect(statusColor('Online')).toBe('bg-green-400');
    expect(statusColor('Idle')).toBe('bg-yellow-400');
    expect(statusColor('Offline')).toBe('bg-zinc-600');
    // unknown falls back to offline color
    expect(statusColor('Unknown' as unknown as string)).toBe('bg-zinc-600');
  });
});
