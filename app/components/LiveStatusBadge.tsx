"use client";

import { useEffect, useState } from "react";

export default function LiveStatusBadge() {
  const [live, setLive] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/twitch/stream");
        const j = await res.json();
        if (!mounted) return;
        setLive(!!j.live);
      } catch (e) {
        if (!mounted) return;
        setLive(false);
      }
    }

    fetchStatus();
    const id = setInterval(fetchStatus, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  const bg = live === null ? "bg-zinc-800 text-white" : live ? "bg-green-600 text-white" : "bg-red-600 text-white";
  const label = live === null ? "Live: ..." : live ? "Live: Online" : "Live: Offline";

  return (
    <div className={`inline-flex items-center text-sm font-medium px-3 py-1 rounded border border-zinc-700 ${bg}`}>
      {label}
    </div>
  );
}
