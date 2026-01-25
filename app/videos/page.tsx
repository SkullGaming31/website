import VodsSection from "../components/VodsSection";

export default function VideosPage() {
  return (
    <div className="min-h-screen">
      <main className="w-full max-w-6xl mx-auto py-20 px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white">Video Library</h1>
          <p className="mt-2 text-purple-200 max-w-2xl mx-auto">Watch the best highlights, VODs, and clips from canadiendragon streams</p>
        </div>

        <VodsSection />
      </main>
    </div>
  );
}
