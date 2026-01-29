import { render, screen } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";

// Ensure we mock matchMedia BEFORE importing the component so the module-level
// `prefersReduced` value picks up the mocked result.
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: string) => ({
    matches: true,
    media: query,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    onchange: null,
    dispatchEvent: () => false,
  }),
});

// Spy on RAF to ensure it's NOT called when prefers-reduced-motion is enabled
const rafSpy = vi.fn();
const cafSpy = vi.fn();
Object.defineProperty(window, "requestAnimationFrame", { value: rafSpy, writable: true });
Object.defineProperty(window, "cancelAnimationFrame", { value: cafSpy, writable: true });

// Import the component after our mocks
import GameHeroBackground from "../app/components/GameHeroBackground";

describe("GameHeroBackground prefers-reduced-motion", () => {
  it("does not start RAF animation when prefers-reduced-motion is set", async () => {
    render(<GameHeroBackground initialTheme="gta5" />);

    // Background should render. The component includes an sr-only caption with the theme.
    const caption = screen.getByText(/Background decorative:/i);
    expect(caption).toBeInTheDocument();

    // RAF should not be scheduled when prefers-reduced-motion is true
    expect(rafSpy).not.toHaveBeenCalled();
    expect(cafSpy).not.toHaveBeenCalled();
  });
});
