export const metadata = {
  title: 'About — CanadienDragon',
  description: 'CanadienDragon is a community-driven gaming hub. Learn about our stream schedule, community, and how to join.',
  openGraph: {
    title: 'About — CanadienDragon',
    description: 'CanadienDragon is a community-driven gaming hub. Learn about our stream schedule, community, and how to join.',
  },
};

import GamePlaytime from "../components/GamePlaytime";

export default function AboutPage() {
  // Using provided SteamID so the About page can load playtime without requiring a local env change
  const steamid = "76561198153222775";

  return (
    <div className="min-h-screen">
      <main className="w-full max-w-4xl mx-auto py-20 px-6">
        <div className="mb-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="md:text-left">
              <h1 className="text-4xl font-bold text-white">About CanadienDragon</h1>
              <p className="mt-3 text-purple-200 max-w-2xl mx-auto md:mx-0">Welcome to the DragonsDen! I&apos;m a passionate gamer, content creator, and community builder who&apos;s been dominating the digital battlefield for over a decade. From clutch plays to epic fails, I share it all with my amazing community.</p>
              <div className="mt-6 flex justify-center md:justify-start gap-4">
                {/* <a href="#" className="bg-purple-600 text-white px-5 py-2 rounded-md">Join the Squad</a> */}
                <a href="#" className="border border-zinc-700 text-purple-100 px-5 py-2 rounded-md">Support Me</a>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-5xl">💀</div>
            </div>
          </div>
        </div>



        <section className="bg-zinc-900 rounded-xl p-6 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Main Games</h2>
          <p className="text-purple-200 mb-4">What you&apos;ll see me playing on stream</p>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-zinc-800 rounded-md p-4 text-center">
                <div className="text-xl font-semibold text-white">7 Days to Die</div>
                <GamePlaytime steamid={steamid || undefined} appid={251570} />
              </div>

              <div className="bg-zinc-800 rounded-md p-4 text-center">
                <div className="text-xl font-semibold text-white">Warframe</div>
                <GamePlaytime steamid={steamid || undefined} appid={230410} />
              </div>

              <div className="bg-zinc-800 rounded-md p-4 text-center">
                <div className="text-xl font-semibold text-white">Space Engineers</div>
                <GamePlaytime steamid={steamid || undefined} appid={244850} />
              </div>
            </div>
          </div>
        </section>

        <div className="mb-2 text-center">
          <h2 className="text-2xl font-semibold text-white">The Real Me</h2>
          <p className="text-purple-200">Beyond the gaming setup</p>
        </div>

        <section className="bg-zinc-900 rounded-xl p-6 mb-6 space-y-4 text-center">
          <p className="text-purple-200">I enjoy gaming with friends, I&apos;m a hobby programmer currently creating a Twitch<a href="https://github.com/skullgaming31/opendevbot">(OpenDevBot)</a> and Discord<a href="https://github.com/skullgaming31/opendevbot">(DragonBot)</a>bot along with this website with the help of AI (GitHub Copilot)</p>
        </section>

        <section className="bg-zinc-900 rounded-xl p-6 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
          <p className="text-purple-200">For business inquiries or partnerships, email <a href="mailto:skullgamingg31@gmail.com" className="underline">skullgamingg31@gmail.com</a></p>
        </section>

        <section className="bg-zinc-900 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-semibold text-white mb-4 text-center">FAQ</h2>
          <div className="space-y-3 max-w-3xl mx-auto text-purple-200">
            <details className="bg-zinc-800 rounded-md p-4">
              <summary className="cursor-pointer font-medium">How often do you stream?</summary>
              <p className="mt-2 text-sm">Currently on a hiatus from streaming but hopeing to come back to stream sometime in the near future, keep an eye on socials for the return announcement</p>
            </details>

            <details className="bg-zinc-800 rounded-md p-4">
              <summary className="cursor-pointer font-medium">How can I join the Discord?</summary>
              <p className="mt-2 text-sm">Click the &quot;Join Discord&quot; button in the header or footer to join. Read the #rules channel after joining to get full access.</p>
            </details>

            <details className="bg-zinc-800 rounded-md p-4">
              <summary className="cursor-pointer font-medium">How do I submit a clip or highlight?</summary>
              <p className="mt-2 text-sm">Post clips in the #clips channel on Discord or use the VODs page to find and submit highlights.</p>
            </details>

            <details className="bg-zinc-800 rounded-md p-4">
              <summary className="cursor-pointer font-medium">Can I sponsor or partner with CanadienDragon?</summary>
              <p className="mt-2 text-sm">Yes — for sponsorship inquiries, email <a href="mailto:skullgamingg31@gmail.com" className="underline">skullgamingg31@gmail.com</a> with details about your proposal.</p>
            </details>

            <details className="bg-zinc-800 rounded-md p-4">
              <summary className="cursor-pointer font-medium">Is the community friendly to new players?</summary>
              <p className="mt-2 text-sm">Absolutely — we encourage players of all skill levels. Our moderators help maintain a welcoming environment.</p>
            </details>
          </div>
        </section>

        {/* FAQPage JSON-LD for SEO rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How often do you stream?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Currently on a hiatus from streaming but hoping to come back to stream sometime in the near future; keep an eye on socials for the return announcement." }
                },
                {
                  "@type": "Question",
                  "name": "How can I join the Discord?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Click the \"Join Discord\" button in the header or footer to join. Read the #rules channel after joining to get full access." }
                },
                {
                  "@type": "Question",
                  "name": "How do I submit a clip or highlight?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Post clips in the #clips channel on Discord or use the VODs page to find and submit highlights." }
                },
                {
                  "@type": "Question",
                  "name": "Can I sponsor or partner with CanadienDragon?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Yes — for sponsorship inquiries, email skullgamingg31@gmail.com with details about your proposal." }
                },
                {
                  "@type": "Question",
                  "name": "Is the community friendly to new players?",
                  "acceptedAnswer": { "@type": "Answer", "text": "Absolutely — we encourage players of all skill levels. Our moderators help maintain a welcoming environment." }
                }
              ]
            }),
          }}
        />

      </main>
    </div>
  );
}
