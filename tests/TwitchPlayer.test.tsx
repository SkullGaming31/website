import { render, screen, waitFor } from '@testing-library/react';
import TwitchPlayer from '../app/components/TwitchPlayer';
import { describe, it, expect } from 'vitest';

describe('TwitchPlayer', () => {
  it('renders iframe with channel and parent params and appends embed script', async () => {
    // ensure no script present
    const existing = document.getElementById('twitch-embed-script');
    if (existing) existing.remove();

    render(<TwitchPlayer channel="skullgaminghq" parent={["localhost"]} width={640} height={360} />);

    // iframe should be present with correct src
    const iframe = screen.getByTitle(/Twitch stream skullgaminghq/i) as HTMLIFrameElement;
    expect(iframe).toBeTruthy();
    expect(iframe.src).toContain('channel=skullgaminghq');
    expect(iframe.src).toContain('parent=localhost');

    // use waitFor to allow effect to append script
    await waitFor(() => expect(document.getElementById('twitch-embed-script')).toBeTruthy());
  });
});
