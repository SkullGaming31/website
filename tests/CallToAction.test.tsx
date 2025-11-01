import { render, screen } from '@testing-library/react';
import CallToAction from '../app/components/CallToAction';
import { describe, it, expect } from 'vitest'

describe('CallToAction', () => {
  it('renders heading and join link', () => {
    render(<CallToAction />);
    expect(screen.getByText(/Join the Community/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /Join Discord/i }) as HTMLAnchorElement;
    expect(link).toBeInTheDocument();
    expect(link.href).toContain('discord.com');
  });
});
