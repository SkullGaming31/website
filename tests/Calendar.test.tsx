import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Calendar from '../app/components/Calendar';

describe('Calendar component', () => {
  it('renders nothing (returns null)', () => {
    const { container } = render(<Calendar />);
    expect(container.innerHTML).toBe('');
  });
});
