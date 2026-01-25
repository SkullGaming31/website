export default function DiscordDashboard() {
  return (
    <section id="dashboard" className="my-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="bg-zinc-900 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-2xl font-bold text-white">Discord Dashboard</h3>
              <p className="text-sm text-purple-200">Manage your canadiendragon Discord server.</p>
            </div>
            <div className="text-sm text-purple-300">Live</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-sm text-purple-200">Total Members</div>
              <div className="text-2xl font-bold text-white">12,849</div>
              <div className="text-xs text-green-400 mt-1">+3.2%</div>
            </div>

            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-sm text-purple-200">Online Users</div>
              <div className="text-2xl font-bold text-white">2,103</div>
              <div className="text-xs text-green-400 mt-1">Live</div>
            </div>

            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-sm text-purple-200">New Members (7d)</div>
              <div className="text-2xl font-bold text-white">412</div>
              <div className="text-xs text-green-400 mt-1">+15%</div>
            </div>

            <div className="bg-zinc-800 rounded-md p-4 text-center">
              <div className="text-sm text-purple-200">Total Bots</div>
              <div className="text-2xl font-bold text-white">8</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
