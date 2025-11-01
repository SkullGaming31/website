import ScheduleVacationBanner from "./ScheduleVacationBanner";

type TwitchCategory = { id?: string; name?: string; [key: string]: unknown };
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
  fetchedAt: string;
};

const WEEK_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function ScheduleSection({
  showWeeklyOverview = true,
  payload: initialPayload,
}: {
  showWeeklyOverview?: boolean;
  payload?: SchedulePayload | null;
}) {
  // Use payload passed in (from a parent page) when available, otherwise fetch
  let payload: SchedulePayload | null = initialPayload ?? null;
  if (!payload) {
    try {
      const res = await fetch(`/api/twitch/schedule`, { cache: "no-store" });
      if (res.ok) {
        const j = await res.json();
        payload = j as SchedulePayload;
      }
    } catch {
      payload = null;
    }
  }

  // Map segments to weekdays (Monday..Sunday)
  const dayMap: Record<string, TwitchSegment[]> = {
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
        // getDay(): 0=Sunday,1=Monday,... convert to Monday=0 index
        const idx = st.getDay() === 0 ? 6 : st.getDay() - 1;
        const dayName = WEEK_DAYS[idx];
        dayMap[dayName].push(seg);
      }
    }
  }

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
    <section id="schedule" className="mt-24">
      <ScheduleVacationBanner />

      {/* Weekly overview (static) */}
      {showWeeklyOverview ? (
        <div className="mt-6 border border-zinc-700 rounded-xl p-6 bg-transparent">
          <div className="flex items-center gap-3 mb-4">
            <h4 className="text-2xl font-semibold text-white">Weekly Overview</h4>
            <div className="text-2xl">📅</div>
          </div>

          <div className="py-2">
            <div className="grid grid-cols-7 gap-4">
              {[
                { day: "Mon", time: "7:00 PM EST", activity: "Valorant Ranked", icon: "🎮" },
                { day: "Tue", time: "6:00 PM EST", activity: "Apex Legends", icon: "🔫" },
                { day: "Wed", time: "7:00 PM EST", activity: "Story Game Wednesday", icon: "📖" },
                { day: "Thu", time: "7:30 PM EST", activity: "Cyberpunk 2077", icon: "🤖", live: true },
                { day: "Fri", time: "8:00 PM EST", activity: "Community Games", icon: "🎉" },
                { day: "Sat", time: "5:00 PM EST", activity: "Apex Legends Marathon", icon: "🏆" },
                { day: "Sun", time: "3:00 PM EST", activity: "Call of Duty", icon: "🔫" },
              ].map((o) => (
                <div key={o.day} className="relative rounded-xl p-4 transition-transform transform hover:-translate-y-1 bg-zinc-900 min-h-[68px]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{o.icon}</div>
                      <div>
                        <div className="text-base font-semibold text-white">{o.day} <span className="ml-1 text-sm">📅</span></div>
                        <div className="text-sm text-purple-200 break-words">{o.activity}</div>
                      </div>
                    </div>

                    <div className="absolute bottom-2 right-2">
                      <span className="inline-block bg-zinc-800 text-purple-100 px-2 py-1 rounded-full text-xs">{o.time}</span>
                    </div>
                  </div>

                  {o.live ? (
                    <div className="absolute top-2 right-2">
                      <span className="inline-block bg-red-600 text-white px-2 py-0.5 rounded-full text-xs">LIVE</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <h3 className="text-3xl font-bold text-white">Schedule</h3>
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
    </section>
  );
}
