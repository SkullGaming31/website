"use client";

import { useEffect, useState } from "react";

type Playtime = {
  appid: number;
  name?: string;
  minutes?: number | null;
  hours?: number | null;
  minutes_2weeks?: number | null;
  hours_2weeks?: number | null;
} | null;

export default function SteamPlaytime({ steamid }: { steamid?: string }) {
  const [data, setData] = useState<null | { spaceEngineers: Playtime; warframe: Playtime }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!steamid) return;
    let cancelled = false;

    (async () => {
      // ensure we don't call setState synchronously during render
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const r = await fetch(`/api/steam-playtime?steamid=${encodeURIComponent(steamid)}`);
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.error || `HTTP ${r.status}`);
        }
        const j = await r.json();
        if (!cancelled) setData(j);
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e);
        if (!cancelled) setError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [steamid]);

  return (
    <div>
      {!steamid && <div className="text-sm text-yellow-300">Provide a SteamID64 to show playtime.</div>}
      {loading && <div className="text-sm">Loading playtime…</div>}
      {error && <div className="text-sm text-red-400">Error: {error}</div>}

      {data && (
        <div className="flex gap-6">
          <div>
            <div className="font-semibold">{data.spaceEngineers?.name ?? "Space Engineers"}</div>
            <div className="text-sm">
              {data.spaceEngineers ? (
                <>
                  <div>Total: {data.spaceEngineers.hours} hrs</div>
                  <div>Last 2 weeks: {data.spaceEngineers.hours_2weeks ?? 0} hrs</div>
                </>
              ) : (
                "Not available / private"
              )}
            </div>
          </div>

          <div>
            <div className="font-semibold">{data.warframe?.name ?? "Warframe"}</div>
            <div className="text-sm">
              {data.warframe ? (
                <>
                  <div>Total: {data.warframe.hours} hrs</div>
                  <div>Last 2 weeks: {data.warframe.hours_2weeks ?? 0} hrs</div>
                </>
              ) : (
                "Not available / private"
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
