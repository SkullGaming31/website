export default function CallToAction() {
  return (
    <section className="w-full py-12">
      <div className="max-w-6xl mx-auto px-6 flex justify-center">
        <div className="mx-auto max-w-2xl w-full bg-gradient-to-r from-purple-700 to-purple-500 rounded-xl p-8 text-center text-white shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold">Join the Community</h3>
          <p className="mt-3 text-sm md:text-base max-w-xl mx-auto">Become part of the HQ on Discord. Chat with other fans, get stream notifications, and participate in community events.</p>

          <div className="mt-6">
            <a href="https://discord.com/invite/6TGV75sDjW" className="inline-block bg-white text-purple-700 font-semibold px-6 py-3 rounded-md">Join Discord</a>
          </div>
        </div>
      </div>
    </section>
  );
}
