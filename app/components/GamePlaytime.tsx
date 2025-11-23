"use client";

import { useEffect, useState } from "react";

export default function GamePlaytime({
  steamid,
  appid,
}: {
  steamid?: string;
  appid: number;
}) {
  const [hours, setHours] = useState<number | null>(null);
  const [hours2, setHours2] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!steamid) return;
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (cancelled) return;
      setLoading(true);
      setError(null);
      try {
        const r = await fetch(`/api/steam-playtime?steamid=${encodeURIComponent(steamid)}`);
        if (!r.ok) {
          const j = await r.json().catch(() => ({}));
          throw new Error(j?.error || `HTTP ${r.status}`);
        }
        const j = await r.json();
        if (cancelled) return;
        const entry = appid === 244850 ? j.spaceEngineers : appid === 251570 ? j.sevenDays : appid === 230410 ? j.warframe : null;
        if (entry) {
          setHours(typeof entry.hours === 'number' ? entry.hours : null);
          setHours2(typeof entry.hours_2weeks === 'number' ? entry.hours_2weeks : null);
        } else {
          setHours(null);
          setHours2(null);
        }
      } catch (e) {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [steamid, appid]);

  if (!steamid) return <div className="text-sm text-purple-200 mt-2">Hours played: —</div>;
  if (loading) return <div className="text-sm text-purple-200 mt-2">Loading…</div>;
  if (error) return <div className="text-sm text-red-400 mt-2">Error</div>;
  if (hours === null) return <div className="text-sm text-purple-200 mt-2">Hours played: Not available</div>;

  return (
    <div className="text-sm text-purple-200 mt-2">
      <div>Total: {hours} hrs</div>
      <div>Last 2 weeks: {hours2 ?? 0} hrs</div>
    </div>
  );
}
