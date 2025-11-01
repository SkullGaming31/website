import { render } from '@testing-library/react';
import GameHeroBackground from '../app/components/GameHeroBackground';
import { describe, it, expect } from 'vitest';

describe('GameHeroBackground', () => {
  it('renders with the provided initial theme', () => {
    // jsdom doesn't implement matchMedia by default; stub it for the component
    (window as any).matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });

    render(<GameHeroBackground initialTheme="space" />);
    const bg = document.querySelector('.game-hero-bg') as HTMLElement | null;
    expect(bg).toBeTruthy();
    expect(bg?.getAttribute('data-theme')).toBe('space');
  });
});
