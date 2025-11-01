export default function RecentActivity() {
  const activities = [
    { id: 1, user: "Wraith", action: "Joined voice channel", time: "2m ago" },
    { id: 2, user: "Cyberpunk", action: "Pinned a message in #announcements", time: "10m ago" },
    { id: 3, user: "Glitch", action: "Uploaded a clip", time: "1h ago" },
    { id: 4, user: "Rogue", action: "Reacted to a message", time: "3h ago" },
  ];

  return (
    <aside className="space-y-4">
      <div className="bg-zinc-900 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-white mb-3">Recent Activity</h4>
        <ul className="space-y-3">
          {activities.map((a) => (
            <li key={a.id} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center text-white">{a.user.charAt(0)}</div>
              <div>
                <div className="text-sm text-white"><span className="font-medium">{a.user}</span> {a.action}</div>
                <div className="text-xs text-purple-300">{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
