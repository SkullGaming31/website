"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

// Normalize Twitch thumbnail templates (they often include a {width}x{height}
// placeholder that may be URL-encoded). Decode and replace with a concrete
// size so `next/image` and the CDN receive a valid URL.
function normalizeThumbnail(url?: string, size = "640x360") {
  if (!url) return undefined;
  try {
    let s = String(url);

    // aggressively decode up to 6 times to collapse double/triple encodings
    for (let i = 0; i < 6; i++) {
      try {
        const d = decodeURIComponent(s);
        if (d === s) break;
        s = d;
      } catch {
        break;
      }
    }

    // Replace a variety of placeholder encodings observed in Twitch URLs.
    // Examples to handle:
    //  - {width}x{height}
    //  - %7Bwidth%7Dx%7Bheight%7D
    //  - %%7Bwidth%%7Dx%%7Bheight%%7D
    //  - thumb0-%%7Bwidth%7Dx%%7Bheight%7D.jpg (mixed percent patterns)
    s = s.replace(/\{width\}x\{height\}/gi, size);
    s = s.replace(/%+7B\s*width\s*%+7D\s*x\s*%+7B\s*height\s*%+7D/gi, size);
    s = s.replace(/%%7Bwidth%%7Dx%%7Bheight%%7D/gi, size);
    s = s.replace(/%7Bwidth%7Dx%7Bheight%7D/gi, size);
    s = s.replace(/%7Bwidth%7Dx%25%7Bheight%7D/gi, size);
    // handle literal %{width}x%{height} patterns present in some VOD thumbnails
    s = s.replace(/%\{width\}x%\{height\}/gi, size);
    s = s.replace(/-?%\{width\}x%\{height\}/gi, size);
    // final fallback: any occurrence of encoded braces pattern
    s = s.replace(/%+7Bwidth%+7Dx%+7Bheight%+7D/gi, size);

    return s;
  } catch {
    return url;
  }
}

// Simple heuristic to infer a game name from a title or description when
// the API doesn't provide `game_name`. Extend this list with common games
// you stream; include 'Arc Raiders' so the dropdown picks it up.
const GAME_KEYWORDS = [
  "Arc Raiders",
  "Rust",
  "Minecraft",
  "Grand Thieft Auto V",
  "Warframe",
  "Fortnite",
  "Apex Legends",
  "Among Us"
];

function inferGameFromText(text?: string): string | undefined {
  if (!text) return undefined;
  const t = text.toLowerCase();
  for (const k of GAME_KEYWORDS) {
    if (t.includes(k.toLowerCase())) return k;
    // also match short forms
    const short = k.split(" ")[0];
    if (short && t.includes(short.toLowerCase())) return k;
  }
  return undefined;
}

function formatViews(n?: number): string | undefined {
  if (n == null) return undefined;
  try {
    return n.toLocaleString("en-US") + " views";
  } catch {
    return String(n) + " views";
  }
}

// Clip type (frontend subset of server's TwitchClip)
type TwitchClip = {
  id: string;
  title?: string;
  url?: string;
  thumbnail_url?: string;
  game_id?: string;
  creator_name?: string;
  broadcaster_name?: string;
  view_count?: number;
  [key: string]: unknown;
};

// Video type (subset of Helix /videos)
type TwitchVideo = {
  id: string;
  user_id?: string;
  user_login?: string;
  user_name?: string;
  title?: string;
  url?: string;
  thumbnail_url?: string;
  view_count?: number;
  type?: string; // 'upload' | 'archive' | 'highlight'
  duration?: string;
  [key: string]: unknown;
};
export default function VodsSection({ limit, debounceMs = 250 }: { limit?: number, debounceMs?: number }) {
  // (games list derived from fetched items below)

  const sampleVods = [
    { id: '1', title: "Epic Valorant Clutch", url: "#", game: "Valorant", type: "highlights", creator: "CanadienDragon", view: 1345 },
    { id: '2', title: "Apex Ranked Sweat", url: "#", game: "Apex Legends", type: "vods", creator: "CanadienDragon", view: 842 },
    { id: '3', title: "Call of Duty Snipes", url: "#", game: "Call of Duty", type: "clips", creator: "GuestClipper", view: 210 },
    { id: '4', title: "Cyberpunk Highlights", url: "#", game: "Cyberpunk 2077", type: "highlights", creator: "NightRider", view: 412 },
    { id: '5', title: "Fortnite Build Battle", url: "#", game: "Fortnite", type: "vods", creator: "BuilderBob", view: 98 },
    { id: '6', title: "Minecraft Speedrun", url: "#", game: "Minecraft", type: "highlights", creator: "Speedy", view: 2300 },
    { id: '7', title: "Overwatch 2 Play of the Match", url: "#", game: "Overwatch 2", type: "clips", creator: "ProPlayer", view: 540 },
    { id: '8', title: "League Pentakill", url: "#", game: "League of Legends", type: "highlights", creator: "LoLMaster", view: 760 },
    { id: '9', title: "Dota 2 Comeback", url: "#", game: "Dota 2", type: "vods", creator: "CarryMain", view: 120 },
    { id: '10', title: "Street Fighter 6 Combo", url: "#", game: "Street Fighter 6", type: "clips", creator: "ComboKing", view: 45 },
    { id: '11', title: "GTA V Heist Moments", url: "#", game: "GTA V", type: "vods", creator: "Heister", view: 980 },
    { id: '12', title: "Elden Ring Boss Fight", url: "#", game: "Elden Ring", type: "highlights", creator: "Tank", view: 670 },
    { id: '13', title: "Among Us Sus Moments", url: "#", game: "Among Us", type: "clips", creator: "Imposter", view: 77 },
    { id: '14', title: "Rocket League Aerials", url: "#", game: "Rocket League", type: "highlights", creator: "AerialAce", view: 151 },
    { id: '15', title: "Rust Base Raid", url: "#", game: "Rust", type: "vods", creator: "Raider", view: 312 },
  ];

  // Display item used by the UI (uniform shape for sample data and fetched clips)
  type DisplayItem = {
    id: string;
    title: string;
    url: string;
    game: string;
    creator: string;
    uploader?: string;
    view: number;
    type: string;
    thumbnail?: string;
  };

  const [selectedGame, setSelectedGame] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [clips, setClips] = useState<TwitchClip[] | null>(null);
  const [videos, setVideos] = useState<TwitchVideo[] | null>(null);

  // simple debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), debounceMs);
    return () => clearTimeout(t);
  }, [searchTerm, debounceMs]);

  // fetch clips from server route
  useEffect(() => {
    let mounted = true;
    async function fetchClips() {
      try {
        const res = await fetch(`/api/twitch/clips?limit=${limit ?? 12}`);
        if (!res.ok) throw new Error("clips fetch failed");
        const j = await res.json();
        // debug: show raw API response in DevTools for troubleshooting
        console.debug('/api/twitch/clips response', j);
        if (!mounted) return;
        setClips(j.clips ?? []);
      } catch {
        if (!mounted) return;
        setClips([]); // fallback to sample later
      }
    }
    fetchClips();
    return () => {
      mounted = false;
    };
  }, [limit]);

  // fetch videos (VODs / highlights)
  useEffect(() => {
    let mounted = true;
    async function fetchVideos() {
      try {
        const res = await fetch(`/api/twitch/videos?limit=${limit ?? 12}`);
        if (!res.ok) throw new Error("videos fetch failed");
        const j = await res.json();
        // debug: show raw API response in DevTools for troubleshooting
        console.debug('/api/twitch/videos response', j);
        if (!mounted) return;
        setVideos(j.videos ?? []);
      } catch {
        if (!mounted) return;
        setVideos([]);
      }
    }
    fetchVideos();
    return () => {
      mounted = false;
    };
  }, [limit]);

  const clipItems: DisplayItem[] = (clips && clips.length > 0) ? clips.map((c: TwitchClip) => ({
    id: c.id,
    title: (c.title as string) || "Untitled",
    url: (c.url as string) || "#",
    // If view_count present for clips, show formatted views in the 'game' position
    game: (c.view_count ? (formatViews(c.view_count as number) ?? "Unknown") : (((c).game_name as string) || inferGameFromText((c.title as string) || "") || ((c.game_id as string) || "Unknown"))),
    // Note: only clips payloads include `creator_name` in Twitch's API — use it when present
    creator: (c.creator_name as string) || "Unknown",
    uploader: (c.broadcaster_name as string) || (c.creator_name as string) || "Unknown",
    view: (c.view_count as number) || 0,
    type: "clips",
    thumbnail: normalizeThumbnail(c.thumbnail_url as string) || undefined,
  })) : [];

  const videoItems: DisplayItem[] = (videos && videos.length > 0) ? videos.map((v: TwitchVideo) => {
    const helixType = (v.type as string) || "upload";
    const normalized = helixType === "highlight" ? "highlights" : "vods";
    return {
      id: v.id,
      title: (v.title as string) || "Untitled",
      url: (v.url as string) || "#",
      // Prefer `game_name` when available; if view_count is present show formatted views,
      // otherwise if view_count is missing use the video's duration in the 'game' position.
      game: (v.view_count ? (formatViews(v.view_count as number) ?? "Unknown") : (((v).game_name as string) || inferGameFromText((v.title as string) || "") || (v.duration as string) || "Unknown")),
      // Videos from Helix do not include `creator_name`; use the uploader fields instead
      creator: (v.user_name as string) || (v.user_login as string) || "Unknown",
      uploader: (v.user_name as string) || (v.user_login as string) || "Unknown",
      view: (v.view_count as number) || 0,
      type: normalized,
      thumbnail: normalizeThumbnail(v.thumbnail_url as string) || undefined,
    } as DisplayItem;
  }) : [];

  let sourceItems: DisplayItem[] = clipItems.concat(videoItems);
  if (sourceItems.length === 0) {
    sourceItems = sampleVods as unknown as DisplayItem[];
  }

  // derive the list of games from the fetched/sample items so the filter matches real data
  const games = useMemo(() => {
    const s = new Set<string>();
    sourceItems.forEach((it) => {
      if (!it.game) return;
      const g = it.game;
      // exclude ephemeral values used for views/duration (these shouldn't be in the game filter)
      const isViews = /^\d{1,3}(,\d{3})* views$/i.test(g);
      const isDuration = /^\d{1,2}:\d{2}(?::\d{2})?$/.test(g);
      if (!isViews && !isDuration) s.add(g);
    });
    return Array.from(s).sort();
  }, [sourceItems]);

  // client-side debug: show resolved items and available games
  if (typeof window !== "undefined") {

    console.debug("VodsSection sourceItems:", sourceItems);
    console.debug("VodsSection derived games:", games);
  }

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
        {toShow.map((v: DisplayItem, idx: number) => (
          <a key={v.id} href={v.url} className="block bg-zinc-900 rounded-md p-4">
            {v.thumbnail ? (
              <div className="w-full h-40 relative rounded-md mb-3 overflow-hidden">
                <Image
                  src={v.thumbnail}
                  alt={v.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                  loading={idx < 3 ? "eager" : "lazy"}
                />
              </div>
            ) : (
              <div className="h-40 bg-zinc-800 rounded-md mb-3" />
            )}
            <div className="text-sm text-zinc-400">{v.uploader}</div>
            <div className="text-white font-medium">{v.title}</div>
            <div className="text-sm text-purple-200">{v.creator ? `${v.creator} • ` : ""}{v.game} • {v.type}</div>
          </a>
        ))}

        {filtered.length === 0 ? (
          <div className="col-span-full text-center text-purple-200">No videos match the selected filters.</div>
        ) : null}
      </div>
    </section>
  );
}
