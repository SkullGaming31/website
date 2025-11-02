import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LiveBanner from '../app/components/LiveBanner';

beforeEach(() => vi.restoreAllMocks());
afterEach(() => vi.restoreAllMocks());

describe('LiveBanner', () => {
  it('renders nothing when not live', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ live: false }) }));
    const { container } = render(<LiveBanner />);
    // initial effect may run; ensure component stays null
    await waitFor(() => {
      expect(container.innerHTML).toBe('');
    });
  });

  it('renders LIVE banner when stream is live', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({ live: true, title: 'Test Stream', game_name: 'Cool Game' }) }));
    const { container, getByText } = render(<LiveBanner />);

    await waitFor(() => {
      expect(getByText(/LIVE/)).toBeTruthy();
      expect(getByText(/Test Stream/)).toBeTruthy();
      expect(container.querySelector('a')).toBeTruthy();
    });
  });
});
