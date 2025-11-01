import ScheduleVacationBanner from "./ScheduleVacationBanner";

export default function ScheduleSection({ showWeeklyOverview = true }: { showWeeklyOverview?: boolean }) {
  const schedule = [
    { day: "Monday", time: "8 PM ET", activity: "Casual/Community", icon: "🎮" },
    { day: "Tuesday", time: "7 PM ET", activity: "Practice", icon: "🛠️" },
    { day: "Wednesday", time: "9 PM ET", activity: "Ranked", icon: "⚔️" },
    { day: "Thursday", time: "8 PM ET", activity: "Community Games", icon: "👥" },
    { day: "Friday", time: "8 PM ET", activity: "Special Events", icon: "🎉" },
    { day: "Saturday", time: "6 PM ET", activity: "Variety Stream", icon: "🎲" },
    { day: "Sunday", time: "5 PM ET", activity: "Chill Stream", icon: "☕" },
  ];

  const todayIndex = new Date().getDay();
  // getDay(): 0=Sunday,1=Monday,... we map to our schedule indexes (Mon=0)
  const highlightIndex = todayIndex === 0 ? 6 : todayIndex - 1;

  return (
    <section id="schedule" className="mt-24">
      <ScheduleVacationBanner />
      {/* <h3 className="text-3xl font-bold text-white">Schedule</h3> */}

      {/* Weekly overview rendered as schedule-style cards */}
      {showWeeklyOverview ? (
          <div className="mt-6 border border-zinc-700 rounded-xl p-6 bg-transparent">
          <div className="flex items-center gap-3 mb-4">
              <h4 className="text-2xl font-semibold text-white">Weekly Overview</h4>
              <div className="text-2xl">📅</div>
          </div>
          
          <div className="py-2">
            <div className="grid grid-cols-7 gap-4">
            {/* We'll construct an overview array inline to keep the provided copy separate from the daily schedule */}
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

                  {/* time badge placed inside the card at bottom-right to avoid overflow */}
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
  {schedule.map((s, i) => {
          const isHighlighted = i === highlightIndex;
          return (
            <div
              key={s.day}
              className={`relative rounded-xl p-5 transition-transform transform hover:-translate-y-1 bg-zinc-900 ${isHighlighted ? "ring-2 ring-purple-500" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{s.icon}</div>
                  <div>
                    <div className="text-lg font-semibold text-white">{s.day} <span className="ml-1 text-sm">📅</span></div>
                    <div className="text-sm text-purple-200 break-words">{s.activity}</div>
                  </div>
                </div>

                <div className="text-sm">
                  <span className="inline-block bg-zinc-800 text-purple-100 px-3 py-1 rounded-full text-xs">{s.time}</span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Note card styled like the other schedule boxes */}
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
