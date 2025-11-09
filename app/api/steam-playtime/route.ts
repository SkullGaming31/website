import { NextResponse } from "next/server";

type SteamGame = {
  appid: number;
  name?: string;
  playtime_forever?: number;
  playtime_2weeks?: number;
};

function minutesToHours(mins?: number | null) {
  if (typeof mins !== "number") return null;
  return +(mins / 60).toFixed(1);
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const steamid = url.searchParams.get("steamid");
    const key = process.env.STEAM_API_KEY;

    if (!key) {
      return NextResponse.json({ error: "Server missing STEAM_API_KEY environment variable" }, { status: 500 });
    }
    if (!steamid) {
      return NextResponse.json({ error: "steamid query parameter is required" }, { status: 400 });
    }

    const api = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${encodeURIComponent(
      key
    )}&steamid=${encodeURIComponent(steamid)}&include_appinfo=1&include_played_free_games=1`;

    const r = await fetch(api);
    if (!r.ok) {
      return NextResponse.json({ error: "Steam API returned an error" }, { status: 502 });
    }

    const json = await r.json();
    const games: SteamGame[] = json?.response?.games || [];
    const byApp = new Map<number, SteamGame>(games.map((g) => [g.appid, g]));

    const se = byApp.get(244850) || null; // Space Engineers
    const wf = byApp.get(230410) || null; // Warframe

    return NextResponse.json(
      {
        spaceEngineers: se
          ? {
              appid: se.appid,
              name: se.name,
              minutes: se.playtime_forever ?? null,
              hours: minutesToHours(se.playtime_forever ?? null),
              minutes_2weeks: se.playtime_2weeks ?? null,
              hours_2weeks: minutesToHours(se.playtime_2weeks ?? null),
            }
          : null,
        warframe: wf
          ? {
              appid: wf.appid,
              name: wf.name,
              minutes: wf.playtime_forever ?? null,
              hours: minutesToHours(wf.playtime_forever ?? null),
              minutes_2weeks: wf.playtime_2weeks ?? null,
              hours_2weeks: minutesToHours(wf.playtime_2weeks ?? null),
            }
          : null,
      },
      { status: 200 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || "unknown error" }, { status: 500 });
  }
}
