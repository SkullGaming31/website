"use client";

import { useEffect, useMemo, useState } from "react";

type TwitchCategory = { id?: string; name?: string;[key: string]: unknown };
type TwitchSegment = {
  id: string;
  start_time?: string;
  end_time?: string;
  title?: string;
  canceled_until?: string | null;
  category?: TwitchCategory;
  is_recurring?: boolean;
  [key: string]: unknown;
};

type SchedulePayload = {
  vacation: unknown | null;
  segments: TwitchSegment[];
  fetchedAt?: string;
};

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function ScheduleGridClient({ initialPayload }: { initialPayload?: SchedulePayload | null }) {
  const [payload, setPayload] = useState<SchedulePayload | null>(initialPayload ?? null);

  useEffect(() => {
    let mounted = true;
    async function fetchSchedule() {
      try {
        const res = await fetch("/api/twitch/schedule");
        if (!res.ok) return;
        const j = await res.json();
        if (!mounted) return;
        setPayload(j as SchedulePayload);
      } catch {
        // ignore
      } finally {
        // noop
      }
    }

    // If we don't have payload or segments are empty, fetch client-side
    if (!payload || !Array.isArray(payload.segments) || payload.segments.length === 0) {
      fetchSchedule();
    }

    const id = setInterval(fetchSchedule, 30_000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [payload]);

  const dayMap = useMemo(() => {
    const map: Record<string, TwitchSegment[]> = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
      Sunday: [],
    };
    if (payload && Array.isArray(payload.segments)) {
      for (const seg of payload.segments) {
        const st = typeof seg.start_time === "string" ? new Date(seg.start_time) : null;
        if (st && !Number.isNaN(st.getTime())) {
          const idx = st.getDay() === 0 ? 6 : st.getDay() - 1;
          const dayName = WEEK_DAYS[idx];
          map[dayName].push(seg);
        }
      }
    }
    return map;
  }, [payload]);

  const todayIndex = new Date().getDay();
  const highlightIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  const formatStart = (s?: string) => {
    if (!s) return "";
    try {
      const d = new Date(s);
      return d.toLocaleString("en-US", { timeZone: "America/St_Johns", hour: "numeric", minute: "2-digit", hour12: true });
    } catch {
      return s;
    }
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {WEEK_DAYS.map((day, i) => {
          const segs = dayMap[day] ?? [];
          const isHighlighted = i === highlightIndex;
          const first = segs[0];

          return (
            <div
              key={day}
              className={`relative rounded-xl p-5 transition-transform transform hover:-translate-y-1 bg-zinc-900 ${isHighlighted ? "ring-2 ring-purple-500" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{segs.length ? "🎮" : "🛌"}</div>
                  <div>
                    <div className="text-lg font-semibold text-white">{day} <span className="ml-1 text-sm">📅</span></div>
                    {first ? (
                      <div className="text-sm text-purple-200 break-words">{first.title ?? "Scheduled Stream"}</div>
                    ) : (
                      <div className="text-sm text-purple-200 break-words">No scheduled stream</div>
                    )}
                  </div>
                </div>

                <div className="text-sm">
                  <span className="inline-block bg-zinc-800 text-purple-100 px-3 py-1 rounded-full text-xs">{first ? formatStart(first.start_time) : "—"}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Note card */}
        <div className={`relative rounded-xl p-5 transition-transform transform bg-zinc-900`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">📣</div>
              <div>
                <div className="text-lg font-semibold text-white">Note</div>
                <div className="text-sm text-purple-200">Info</div>
              </div>
            </div>

            <div className="text-sm">
              <span className="inline-block bg-zinc-800 text-purple-100 px-3 py-1 rounded-full text-xs">—</span>
            </div>
          </div>

          <div className="mt-3 text-sm text-purple-200">Times are subject to change. Follow on socials for updates!</div>
        </div>
      </div>
    </>
  );
}
