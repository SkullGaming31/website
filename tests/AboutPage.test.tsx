/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';

// Mock the GamePlaytime client component so tests are deterministic
vi.mock('../app/components/GamePlaytime', () => ({
  default: (props: any) => (
    <div data-testid={`game-playtime-${props.appid}`}>Playtime for {props.appid}</div>
  ),
}));

import AboutPage from '../app/about/page';

describe('About page', () => {
  it('renders main headings, game cards and contact info', () => {
    render(<AboutPage />);

    expect(screen.getByText(/About CanadienDragon/i)).toBeInTheDocument();
    // Main Games section
    expect(screen.getByText(/Main Games/i)).toBeInTheDocument();
    // Ensure the three dynamic GamePlaytime components are rendered for 7 Days to Die, Warframe, and Space Engineers
    expect(screen.getByTestId('game-playtime-251570')).toBeInTheDocument();
    expect(screen.getByTestId('game-playtime-230410')).toBeInTheDocument();
    expect(screen.getByTestId('game-playtime-244850')).toBeInTheDocument();

    // Contact email present inside the Contact paragraph (avoids matching duplicate mentions elsewhere)
    const contactPara = screen.getByText(/For business inquiries or partnerships, email/i);
    expect(within(contactPara).getByText(/skullgamingg31@gmail.com/i)).toBeInTheDocument();

    // FAQ entries present (summary titles)
    expect(screen.getByText(/How often do you stream\?/i)).toBeInTheDocument();
    expect(screen.getByText(/How can I join the Discord\?/i)).toBeInTheDocument();
  });
});
