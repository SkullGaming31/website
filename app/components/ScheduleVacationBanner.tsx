"use client";

import { useEffect, useState } from "react";

type Vacation = { start_time: string; end_time: string } | null;

export default function ScheduleVacationBanner() {
  const [vacation, setVacation] = useState<Vacation | "loading">("loading");

  useEffect(() => {
    let mounted = true;
    async function fetchSchedule() {
      try {
        const res = await fetch("/api/twitch/schedule");
        if (!res.ok) return setVacation(null);
        const j = await res.json();
        if (!mounted) return;
        if (j.vacation) setVacation(j.vacation);
        else setVacation(null);
      } catch (e) {
        if (!mounted) return;
        setVacation(null);
      }
    }
    fetchSchedule();
    const id = setInterval(fetchSchedule, 60_000); // refresh every 60s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  if (vacation === "loading" || !vacation) return null;

  // parse the RFC3339 timestamps for display
  const start = new Date(vacation.start_time).toLocaleString();
  const end = new Date(vacation.end_time).toLocaleString();

  return (
    <div className="w-full bg-yellow-500 text-black rounded-md p-3 mb-6">
      <strong>On vacation</strong> — The broadcaster is on vacation from {start} to {end}. Streams may be paused during this time.
    </div>
  );
}
