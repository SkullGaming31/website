import React from 'react';
import { render, cleanup } from '@testing-library/react';
import GameHeroBackground from '../app/components/GameHeroBackground';
import { describe, it, expect, vi, afterEach } from 'vitest';

describe('GameHeroBackground RAF animation', () => {
  afterEach(() => {
    cleanup();
    // restore globals
    // @ts-ignore
    delete (global as any).requestAnimationFrame;
    // @ts-ignore
    delete (global as any).cancelAnimationFrame;
  });

  it('updates layer transforms when RAF callbacks run and cancels on unmount', () => {
    // stub matchMedia to allow animation
    (window as any).matchMedia = (query: string) => ({ matches: false, media: query, addEventListener: () => { }, removeEventListener: () => { } });

    const callbacks = new Map<number, FrameRequestCallback>();
    let nextId = 1;

    // simple RAF mock that stores callbacks so tests can invoke them manually
    // @ts-ignore
    global.requestAnimationFrame = (cb: FrameRequestCallback) => {
      const id = nextId++;
      callbacks.set(id, cb);
      return id;
    };

    const cancelSpy = vi.fn((id: number) => callbacks.delete(id));
    // @ts-ignore
    global.cancelAnimationFrame = cancelSpy;

    const { unmount } = render(<GameHeroBackground />);

    const layer1 = document.querySelector('.ghb-layer-1') as HTMLElement;
    const layer2 = document.querySelector('.ghb-layer-2') as HTMLElement;

    expect(layer1).toBeTruthy();
    expect(layer2).toBeTruthy();

    // no transform applied yet
    expect(layer1.style.transform).toBe('');

    // invoke the first scheduled RAF callback(s) to simulate frames
    const ids = Array.from(callbacks.keys());
    expect(ids.length).toBeGreaterThan(0);
    // call a few frames to accumulate phase
    for (let i = 0; i < Math.min(3, ids.length); i++) {
      const id = ids[i];
      const cb = callbacks.get(id)!;
      cb(performance.now());
    }

    // after running RAF, transforms should have been written
    expect(layer1.style.transform).not.toBe('');
    expect(layer1.style.transform).toMatch(/translate3d\(/);
    expect(layer2.style.transform).toMatch(/translate3d\(/);

    // unmount should call cancelAnimationFrame for last scheduled id
    unmount();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
