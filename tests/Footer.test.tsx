import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '../app/components/Footer';

describe('Footer', () => {
  it('renders copyright year and social links', () => {
    render(<Footer />);

    const year = new Date().getFullYear();
    expect(screen.getByText(new RegExp(String(year)))).toBeTruthy();

    // social links by aria-label
    expect(screen.getByLabelText('twitter')).toBeTruthy();
    expect(screen.getByLabelText('youtube')).toBeTruthy();
    expect(screen.getByLabelText('twitch')).toBeTruthy();
    expect(screen.getByLabelText('instagram')).toBeTruthy();
  });
});
