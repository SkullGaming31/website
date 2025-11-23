import React from 'react';
import { render, screen } from '@testing-library/react';
import GameHeroBackground from '../app/components/GameHeroBackground';
import { describe, it, expect } from 'vitest';

describe('GameHeroBackground extra', () => {
  it('renders with default theme when no initialTheme provided and has layers', () => {
    // stub matchMedia to a stable value
    (window as any).matchMedia = (query: string) => ({ matches: false, media: query, addEventListener: () => {}, removeEventListener: () => {} });

    render(<GameHeroBackground />);
    const container = document.querySelector('.game-hero-bg') as HTMLElement | null;
    expect(container).toBeTruthy();
    // default theme should be gta5
    expect(container?.getAttribute('data-theme')).toBe('gta5');
    // layers exist
    expect(container?.querySelectorAll('.ghb-layer').length).toBeGreaterThanOrEqual(2);
  });

  it('respects provided initialTheme prop', () => {
    (window as any).matchMedia = (query: string) => ({ matches: true, media: query, addEventListener: () => {}, removeEventListener: () => {} });
    render(<GameHeroBackground initialTheme="space" />);
    const container = document.querySelector('.game-hero-bg') as HTMLElement | null;
    expect(container?.getAttribute('data-theme')).toBe('space');
    // caption should reflect the theme for screen readers
    expect(screen.getByText(/Background decorative: space/i)).toBeInTheDocument();
  });
});
