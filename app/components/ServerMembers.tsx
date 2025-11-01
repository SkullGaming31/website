export default function ServerMembers() {
  const members = [
    { name: "Wraith", role: "Admin", joined: "2023-01-15", status: "Online" },
    { name: "Cyberpunk", role: "Moderator", joined: "2023-02-20", status: "Online" },
    { name: "Glitch", role: "VIP", joined: "2023-03-10", status: "Idle" },
    { name: "Phoenix", role: "Member", joined: "2023-05-01", status: "Offline" },
    { name: "Rogue", role: "Member", joined: "2023-06-18", status: "Online" },
  ];

  const statusColor = (s: string) => {
    switch (s) {
      case "Online":
        return "bg-green-400";
      case "Idle":
        return "bg-yellow-400";
      case "Offline":
      default:
        return "bg-zinc-600";
    }
  };

  return (
    <section className="my-8">
      <div className="bg-zinc-900 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Server Members</h3>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-purple-200 border-b border-zinc-800">
                <th className="py-3 pr-6">Member</th>
                <th className="py-3 pr-6">Role</th>
                <th className="py-3 pr-6">Joined</th>
                <th className="py-3 pr-6">Status</th>
                <th className="py-3 pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.name} className="border-b last:border-b-0 border-zinc-800">
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white">{m.name.charAt(0)}</div>
                      <div>
                        <div className="text-white font-medium">{m.name}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 pr-6 text-purple-200">{m.role}</td>
                  <td className="py-4 pr-6 text-purple-200">{m.joined}</td>
                  <td className="py-4 pr-6">
                    <div className="flex items-center gap-2">
                      <span className={`inline-block w-2 h-2 rounded-full ${statusColor(m.status)}`} />
                      <span className="text-purple-200 text-sm">{m.status}</span>
                    </div>
                  </td>

                  <td className="py-4 pr-6 text-right">
                    <button aria-label={`More actions for ${m.name}`} className="px-2 py-1 rounded hover:bg-zinc-800">
                      <span className="text-2xl leading-none">⋮</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
