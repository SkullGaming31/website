import TwitchPlayer from "./components/TwitchPlayer";
import VodsSection from "./components/VodsSection";
import ScheduleSection from "./components/ScheduleSection";
import CallToAction from "./components/CallToAction";

export default function Home() {
  const channel = "skullgaminghq";

  return (
    <>
  <div className="min-h-screen font-sans flex items-center">
      <main className="w-full max-w-6xl mx-auto py-20 px-8">
        <div className="grid grid-cols-12 gap-8 items-center">
          {/* Left column: welcome text */}
          <div className="col-span-6 text-left text-white">
            <h1 className="text-6xl font-extrabold tracking-wide">Welcome to</h1>
            <h2 className="text-6xl font-extrabold text-purple-300 tracking-wide">The HQ</h2>
            <p className="mt-6 max-w-lg text-lg text-purple-100">The official hub for SkullGamingHQ. Catch live streams, watch the latest VODs, and join the community.</p>

            <div className="mt-8 flex gap-4">
              <a href={`https://twitch.tv/${channel}`} className="inline-block bg-purple-600 text-white px-6 py-3 rounded-md">Follow on Twitch</a>
              <a href="#vods" className="inline-block border border-purple-600 text-purple-100 px-6 py-3 rounded-md">Enable notifications</a>
            </div>
          </div>

          {/* Right column: Twitch player */}
          <div className="col-span-6">
            <div className="rounded-xl p-1" style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }}>
              <div className="rounded-lg overflow-hidden" style={{ boxShadow: "0 30px 40px rgba(124,58,237,0.25)" }}>
                <TwitchPlayer channel={channel} parent={typeof window !== "undefined" ? window.location.hostname : "localhost"} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
    <div className="max-w-6xl mx-auto px-8">
      <VodsSection limit={5} />
      <ScheduleSection showWeeklyOverview={false} />
    </div>

    <div className="mt-12">
      <CallToAction />
    </div>
    </>
  );
}
