export default function AboutPage() {
  return (
  <div className="min-h-screen">
      <main className="w-full max-w-4xl mx-auto py-20 px-6">
        <div className="mb-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="md:text-left">
              <h1 className="text-4xl font-bold text-white">About Skull</h1>
              <p className="mt-3 text-purple-200 max-w-2xl mx-auto md:mx-0">Welcome to the HQ! I'm a passionate gamer, content creator, and community builder who's been dominating the digital battlefield for over a decade. From clutch plays to epic fails, I share it all with my amazing community.</p>
              <div className="mt-6 flex justify-center md:justify-start gap-4">
                {/* <a href="#" className="bg-purple-600 text-white px-5 py-2 rounded-md">Join the Squad</a>
                <a href="#" className="border border-zinc-700 text-purple-100 px-5 py-2 rounded-md">Support Me</a> */}
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-5xl">💀</div>
            </div>
          </div>
        </div>

        

        <section className="bg-zinc-900 rounded-xl p-6 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Main Games</h2>
          <p className="text-purple-200 mb-4">What you'll see me playing on stream</p>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-xl font-semibold text-white">GTA RP</div>
              <div className="text-sm text-purple-200 mt-2">Hours played: 8</div>
            </div>

            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-xl font-semibold text-white">Warframe</div>
              <div className="text-sm text-purple-200 mt-2">Hours played: 68.2</div>
            </div>

            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-xl font-semibold text-white">Space Engineers</div>
              <div className="text-sm text-purple-200 mt-2">Hours played: 421.2</div>
            </div>
          </div>
        </div>
        </section>

        <div className="mb-2 text-center">
          <h2 className="text-2xl font-semibold text-white">The Real Me</h2>
          <p className="text-purple-200">Beyond the gaming setup</p>
        </div>

  <section className="bg-zinc-900 rounded-xl p-6 mb-6 space-y-4 text-center">
          <p className="text-purple-200">I enjoy gaming with friends, I'm a hobby programmer currently creating a Twitch<a href="https://github.com/skullgaming31/opendevbot">(OpenDevBot)</a> and Discord<a href="https://github.com/skullgaming31/opendevbot">(DragonBot)</a>bot along with this website with the help of AI (GitHub Copilot)</p>
        </section>

        <section className="bg-zinc-900 rounded-xl p-6 mb-6 text-center">
          <h2 className="text-2xl font-semibold text-white mb-3">Contact</h2>
          <p className="text-purple-200">For business inquiries or partnerships, email <a href="mailto:skullgamingg31@gmail.com" className="underline">skullgamingg31@gmail.com</a></p>
        </section>

      </main>
    </div>
  );
}
