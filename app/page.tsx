import TwitchPlayer from "./components/TwitchPlayer";
import VodsSection from "./components/VodsSection";
import ScheduleSection from "./components/ScheduleSection";
import CallToAction from "./components/CallToAction";
import GameHeroBackground from "./components/GameHeroBackground";
import Button from "./components/Button";
import { HeartIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const channel = "canadiendragon";

  return (
    <>
      <div className="min-h-screen font-sans flex items-center relative">
        {/* decorative watermark layer (non-interactive) */}
        <div className="watermark-layer" aria-hidden="true" />
        {/* homepage hero background (client-only, animated) */}
        <GameHeroBackground />
        <main className="w-full max-w-6xl mx-auto py-20 px-8">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left column: welcome text */}
            <div className="col-span-6 text-left text-white">
              <h1 className="text-6xl font-extrabold tracking-wide">Welcome to</h1>
              <h2 className="text-6xl font-extrabold text-purple-300 tracking-wide">The DragonDen</h2>
              <p className="mt-6 max-w-lg text-lg text-purple-100">The official hub for CanadienDragon. Catch live streams, watch the latest VODs, and join the community.</p>

              <div className="mt-8 flex gap-4">
                <Button
                  href={`https://twitch.tv/${channel}`}
                  external
                  aria-label={`Follow ${channel} on Twitch (opens in new tab)`}
                  className="px-6 py-3"
                >
                  <HeartIcon aria-hidden="true" className="w-5 h-5 flex-shrink-0" />
                  <span className="font-semibold">Follow on Twitch</span>
                </Button>
                <Button href="#vods" variant="outline" className="px-6 py-3">Enable notifications</Button>
              </div>
            </div>

            {/* Right column: Twitch player */}
            <div className="col-span-6">
              <div className="rounded-xl p-1" style={{ background: "linear-gradient(90deg,#7c3aed,#a78bfa)" }}>
                <div className="rounded-lg overflow-hidden" style={{ boxShadow: "0 30px 40px rgba(124,58,237,0.25)" }}>
                  <TwitchPlayer channel={channel} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="max-w-6xl mx-auto px-8">
        <VodsSection limit={5} featuredOnly={true} />
        <ScheduleSection showWeeklyOverview={false} />
      </div>

      <div className="mt-12">
        <CallToAction />
      </div>
    </>
  );
}
