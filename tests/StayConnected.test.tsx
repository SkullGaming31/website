import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StayConnected from '../app/components/StayConnected';

describe('StayConnected', () => {
  it('renders heading and social buttons', () => {
    render(<StayConnected />);

    expect(screen.getByText(/Stay Connected/i)).toBeTruthy();
    expect(screen.getByLabelText(/Join Discord/i)).toBeTruthy();
    expect(screen.getByLabelText(/Twitter/i)).toBeTruthy();
    expect(screen.getByLabelText(/YouTube/i)).toBeTruthy();
  });
});
