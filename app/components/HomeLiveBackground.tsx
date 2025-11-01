"use client";

import { useEffect, useState } from "react";

export default function HomeLiveBackground({ children }: { children: React.ReactNode }) {
  const [online, setOnline] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/twitch/stream");
        const j = await res.json();
        if (!mounted) return;
        setOnline(!!j.live);
      } catch (e) {
        // on error treat as offline
        if (!mounted) return;
        setOnline(false);
      }
    }

    fetchStatus();
    const id = setInterval(fetchStatus, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // when online is null (loading) keep original hero-gradient to avoid flash
  const bgClass =
    online === null
      ? "hero-gradient"
      : online
      ? "bg-gradient-to-b from-green-600 via-green-500 to-green-400"
      : "bg-gradient-to-b from-red-700 via-red-600 to-red-500";

  return <div className={`min-h-screen ${bgClass} font-sans flex items-center`}>{children}</div>;
}
