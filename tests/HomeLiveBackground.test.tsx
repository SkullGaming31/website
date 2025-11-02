import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import HomeLiveBackground from '../app/components/HomeLiveBackground';

beforeEach(() => {
  vi.restoreAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('HomeLiveBackground', () => {
  it('has hero-gradient initially (loading)', () => {
    const { container } = render(<HomeLiveBackground><div>child</div></HomeLiveBackground>);
    expect(container.firstChild).toHaveClass('hero-gradient');
  });

  it('shows green gradient when stream is live', async () => {
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ live: true }) }));

    const { container } = render(<HomeLiveBackground><div>child</div></HomeLiveBackground>);

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('from-green-600');
    });
  });

  it('shows red gradient when stream is offline or fetch errors', async () => {
    // simulate fetch throwing
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')));

    const { container } = render(<HomeLiveBackground><div>child</div></HomeLiveBackground>);

    await waitFor(() => {
      expect(container.firstChild).toHaveClass('from-red-700');
    });
  });
});
