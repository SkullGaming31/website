export default function StayConnected() {
  return (
    <section className="mt-12 mb-8 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 rounded-xl p-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
        <p className="text-sm text-purple-100 mb-4">Schedule subject to change. Follow our social media for the latest updates and announcements. Join the Discord community to get notified when streams go live!</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a 
            href="https://discord.com/invite/6TGV75sDjW"
            className="inline-block bg-white text-purple-600 px-5 py-2 rounded-md font-semibold shadow hover:opacity-90"
            aria-label="Join Discord"
          >
            Discord
          </a>

          <a
            href="https://twitter.com/SkullGamingHQ"
            className="inline-block bg-transparent border border-white text-white px-5 py-2 rounded-md font-semibold hover:bg-white hover:text-purple-600"
            aria-label="Twitter"
          >
            Twitter
          </a>

          <a
            href="https://www.youtube.com/@SkullGamingHQ"
            className="inline-block bg-transparent border border-white text-white px-5 py-2 rounded-md font-semibold hover:bg-white hover:text-purple-600"
            aria-label="YouTube"
          >
            YouTube
          </a>
        </div>
      </div>
    </section>
  );
}
