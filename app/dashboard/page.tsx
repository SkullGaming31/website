import DiscordDashboard from "../components/DiscordDashboard";
import ServerMembers from "../components/ServerMembers";
import RecentActivity from "../components/RecentActivity";

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <main className="w-full max-w-6xl mx-auto py-16 px-6">
  <DiscordDashboard />

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <ServerMembers />
    </div>

    <div className="lg:col-span-1">
      <RecentActivity />
    </div>
  </div>
      </main>
    </div>
  );
}
