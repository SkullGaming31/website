"use client";
import { useEffect, useRef, useState } from "react";

type Theme = "gta5" | "warframe" | "space";

export default function GameHeroBackground({ initialTheme }: { initialTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>(initialTheme ?? "gta5");
  const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rafRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const phaseRef = useRef(0);

  // auto-rotate themes every 8s if no explicit initialTheme provided
  useEffect(() => {
    if (initialTheme) return;
    const themes: Theme[] = ["gta5", "warframe", "space"];
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % themes.length;
      setTheme(themes[i]);
    }, 8000);
    return () => clearInterval(t);
  }, [initialTheme]);

  // subtle auto animation using requestAnimationFrame
  useEffect(() => {
    if (prefersReduced) return;
    function tick() {
      phaseRef.current += 0.0025;
      const phase = phaseRef.current;
      const el = containerRef.current;
      if (el) {
        // move layers with transforms for cheap GPU-accelerated animation
        const layer1 = el.querySelector<HTMLElement>(".ghb-layer-1");
        const layer2 = el.querySelector<HTMLElement>(".ghb-layer-2");
        if (layer1) layer1.style.transform = `translate3d(${Math.sin(phase) * 8}px, ${Math.cos(phase) * 4}px, 0)`;
        if (layer2) layer2.style.transform = `translate3d(${Math.cos(phase) * -12}px, ${Math.sin(phase) * -6}px, 0)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [theme, prefersReduced]);

  // simple theme renderers: purely CSS-driven layers and shapes
  return (
    <div ref={containerRef} aria-hidden="true" className="game-hero-bg pointer-events-none" data-theme={theme}>
      <div className="ghb-layer ghb-layer-1" />
      <div className="ghb-layer ghb-layer-2" />
      <div className="ghb-overlay" />
      <div className="ghb-caption sr-only">Background decorative: {theme}</div>
    </div>
  );
}
