import ScheduleSection from "../components/ScheduleSection";
import StayConnected from "../components/StayConnected";

export default async function SchedulePage() {
  let payload = null;
  try {
    const res = await fetch(`/api/twitch/schedule`, { cache: "no-store" });
    if (res.ok) {
      payload = await res.json();
    }
  } catch {
    payload = null;
  }

  return (
    <div className="min-h-screen font-sans flex items-start pt-24">
      <main className="w-full max-w-6xl mx-auto py-12 px-8">
        <header className="text-center text-white mb-8">
          <h1 className="text-4xl font-bold">Stream Schedule</h1>
          <p className="mt-3 text-lg text-purple-200">Never miss a stream! Here is when you can catch SkullGamingHQ live on Twitch.</p>

          <div className="mt-6 flex items-center justify-center gap-4">
            <a href="https://www.twitch.tv/skullgaminghq/schedule" className="inline-block bg-purple-600 text-white px-5 py-2 rounded-md">Twitch Schedule</a> {/* Twitch Schedule */}
            <a href="https://discord.com/invite/6TGV75sDjW" className="inline-block border border-purple-600 text-purple-100 px-5 py-2 rounded-md">Join Discord</a>
          </div>
          <div className="mt-4 flex justify-center">
            <div className="text-sm text-purple-100 border border-zinc-700 px-3 py-1 rounded-md">All times shown in Newfoundland Standard Time (NST)</div>
          </div>
        </header>

  <ScheduleSection showWeeklyOverview={false} payload={payload} />
        <div className="mt-8">
          <StayConnected />
        </div>
      </main>
    </div>
  );
}
