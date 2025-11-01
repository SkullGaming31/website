"use client";

import { useMemo, useState, useEffect } from "react";

export default function VodsSection({ limit }: { limit?: number }) {
  // sample schedule-derived games (mirrors ScheduleSection overview games)
  const games = [
    "Valorant",
    "Apex Legends",
    "Call of Duty",
    "Cyberpunk 2077",
    "Fortnite",
    "Minecraft",
    "Overwatch 2",
    "League of Legends",
    "Dota 2",
    "Street Fighter 6",
    "GTA V",
    "Elden Ring",
    "Among Us",
    "Rocket League",
    "Rust",
  ];

  const sampleVods = [
    { id: 1, title: "Epic Valorant Clutch", url: "#", game: "Valorant", type: "highlights" },
    { id: 2, title: "Apex Ranked Sweat", url: "#", game: "Apex Legends", type: "vods" },
    { id: 3, title: "Call of Duty Snipes", url: "#", game: "Call of Duty", type: "clips" },
    { id: 4, title: "Cyberpunk Highlights", url: "#", game: "Cyberpunk 2077", type: "highlights" },
    { id: 5, title: "Fortnite Build Battle", url: "#", game: "Fortnite", type: "vods" },
    { id: 6, title: "Minecraft Speedrun", url: "#", game: "Minecraft", type: "highlights" },
    { id: 7, title: "Overwatch 2 Play of the Match", url: "#", game: "Overwatch 2", type: "clips" },
    { id: 8, title: "League Pentakill", url: "#", game: "League of Legends", type: "highlights" },
    { id: 9, title: "Dota 2 Comeback", url: "#", game: "Dota 2", type: "vods" },
    { id: 10, title: "Street Fighter 6 Combo", url: "#", game: "Street Fighter 6", type: "clips" },
    { id: 11, title: "GTA V Heist Moments", url: "#", game: "GTA V", type: "vods" },
    { id: 12, title: "Elden Ring Boss Fight", url: "#", game: "Elden Ring", type: "highlights" },
    { id: 13, title: "Among Us Sus Moments", url: "#", game: "Among Us", type: "clips" },
    { id: 14, title: "Rocket League Aerials", url: "#", game: "Rocket League", type: "highlights" },
    { id: 15, title: "Rust Base Raid", url: "#", game: "Rust", type: "vods" },
  ];

  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [clips, setClips] = useState<any[] | null>(null);

  // simple debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 250);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // fetch clips from server route
  useEffect(() => {
    let mounted = true;
    async function fetchClips() {
      try {
        const res = await fetch(`/api/twitch/clips?limit=${limit ?? 12}`);
        if (!res.ok) throw new Error("clips fetch failed");
        const j = await res.json();
        if (!mounted) return;
        setClips(j.clips ?? []);
      } catch (e) {
        if (!mounted) return;
        setClips([]); // fallback to sample later
      }
    }
    fetchClips();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const sourceItems = clips && clips.length > 0 ? clips.map((c) => ({
    id: c.id,
    title: c.title,
    url: c.url || c.thumbnail_url,
    game: c.game_id || "Clip",
    type: "clips",
  })) : sampleVods;

  const filtered = useMemo(() => {
    return sourceItems.filter((v) => {
      if (selectedGame !== "all" && v.game !== selectedGame) return false;
      if (selectedType !== "all" && v.type !== selectedType) return false;
      if (debouncedSearch && !v.title.toLowerCase().includes(debouncedSearch)) return false;
      return true;
    });
  }, [sourceItems, selectedGame, selectedType, debouncedSearch]);

  const toShow = limit ? filtered.slice(0, limit) : filtered;

  return (
    <section id="vods" className="mt-24">

      {/* Filters */}
      <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search videos..."
            className="bg-zinc-900 text-white px-3 py-2 rounded-md w-full md:w-64"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-purple-200">Game</label>
          <select value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)} className="bg-zinc-900 text-white px-3 py-2 rounded-md">
            <option value="all">All games</option>
            {games.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-purple-200">Type</label>
            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="bg-zinc-900 text-white px-3 py-2 rounded-md">
              <option value="all">All types</option>
              <option value="highlights">Highlights</option>
              <option value="vods">VODs</option>
              <option value="clips">Clips</option>
            </select>
          </div>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {toShow.map((v) => (
          <a key={v.id} href={v.url} className="block bg-zinc-900 rounded-md p-4">
            <div className="h-40 bg-zinc-800 rounded-md mb-3" />
            <div className="text-white font-medium">{v.title}</div>
            <div className="text-sm text-purple-200">{v.game} • {v.type}</div>
          </a>
        ))}

        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-purple-200">No videos match the selected filters.</div>
        ) : null}
      </div>
    </section>
  );
}
