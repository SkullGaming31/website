"use client";

import { useEffect, useState } from "react";

type StreamStatus = {
  live: boolean;
  title?: string;
  viewer_count?: number;
  game_name?: string;
};

export default function LiveBanner() {
  const [status, setStatus] = useState<StreamStatus>({ live: false });

  useEffect(() => {
    let mounted = true;

    async function fetchStatus() {
      try {
        const res = await fetch("/api/twitch/stream");
        const j = await res.json();
        if (!mounted) return;
        setStatus({ live: !!j.live, title: j.title, viewer_count: j.viewer_count, game_name: j.game_name });
      } catch {
        // fail silently
      }
    }

    fetchStatus();
    const i = setInterval(fetchStatus, 30_000); // 30s
    return () => {
      mounted = false;
      clearInterval(i);
    };
  }, []);

  if (!status.live) return null;

  const href = "https://twitch.tv/skullgaminghq";

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="w-full block bg-red-600 text-white text-center py-2">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center gap-4">
        <span className="inline-block font-bold px-2 py-1 bg-white text-red-600 rounded">LIVE</span>
        <div className="text-sm">
          <strong>{status.title ?? "Live now"}</strong>
          {status.game_name ? <span className="ml-2">— {status.game_name}</span> : null}
        </div>
      </div>
    </a>
  );
}
