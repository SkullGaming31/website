import Button from "./Button";

export default function StayConnected() {
  return (
    <section className="mt-12 mb-8 bg-gradient-to-r from-purple-700 via-purple-600 to-purple-500 rounded-xl p-6 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <h3 className="text-2xl font-bold mb-2">Stay Connected</h3>
        <p className="text-sm text-purple-100 mb-4">Schedule subject to change. Follow our social media for the latest updates and announcements. Join the Discord community to get notified when streams go live!</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href="https://discord.com/invite/UhQuaASkKR" external className="px-5 py-2" aria-label="Join Discord">
            Discord
          </Button>

          <Button href="https://twitter.com/canadiendragon1" variant="outline" className="px-5 py-2" aria-label="Twitter">
            Twitter
          </Button>

          <Button href="https://www.youtube.com/@canadiendragonyt" variant="outline" className="px-5 py-2" aria-label="YouTube">
            YouTube
          </Button>
        </div>
      </div>
    </section>
  );
}
