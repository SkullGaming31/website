import { NextResponse } from "next/server";

// Types
type TwitchClip = {
  id: string;
  url: string;
  embed_url?: string;
  broadcaster_id?: string;
  broadcaster_name?: string;
  creator_id?: string;
  creator_name?: string;
  video_id?: string;
  game_id?: string;
  language?: string;
  title?: string;
  view_count?: number;
  created_at?: string;
  thumbnail_url?: string;
  duration?: number;
  vod_offset?: number;
  [key: string]: unknown;
};

type ClipsPayload = {
  clips: TwitchClip[];
  fetchedAt: string;
};

// In-memory cache for token and clips
let tokenCache: { token?: string; expiresAt?: number } = {};
let clipsCache: { data?: ClipsPayload; fetchedAt?: number } = {};

const CHANNEL = "canadiendragon";
const TOKEN_TTL_BUFFER = 30; // seconds
const CLIPS_TTL = 30; // seconds

async function getAppAccessToken(clientId: string, clientSecret: string) {
  const now = Date.now() / 1000;
  if (tokenCache.token && tokenCache.expiresAt && tokenCache.expiresAt - TOKEN_TTL_BUFFER > now) {
    return tokenCache.token;
  }

  const url = `https://id.twitch.tv/oauth2/token?client_id=${encodeURIComponent(
    clientId
  )}&client_secret=${encodeURIComponent(clientSecret)}&grant_type=client_credentials`;

  const res = await fetch(url, { method: "POST" });
  if (!res.ok) throw new Error(`token fetch failed: ${res.status}`);
  const j = await res.json();
  const access_token = j.access_token;
  const expires_in = j.expires_in || 3600;
  tokenCache = { token: access_token, expiresAt: now + expires_in };
  return access_token;
}

export async function GET(request: Request) {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "no_twitch_credentials", clips: [] });
  }

  const urlObj = new URL(request.url);
  const limitParam = urlObj.searchParams.get("limit") || "12";
  const limit = Math.min(50, parseInt(limitParam, 10) || 12);

  const now = Date.now();
  if (clipsCache.data && clipsCache.fetchedAt && now - clipsCache.fetchedAt < CLIPS_TTL * 1000) {
    return NextResponse.json(clipsCache.data);
  }

  try {
    const token = await getAppAccessToken(clientId, clientSecret);

    // resolve broadcaster id
    const u = await fetch(`https://api.twitch.tv/helix/users?login=${encodeURIComponent(CHANNEL)}`, {
      headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId },
    });
    if (!u.ok) throw new Error(`users fetch failed: ${u.status}`);
    const uj = await u.json();
    const user = Array.isArray(uj.data) && uj.data.length > 0 ? uj.data[0] : null;
    if (!user) return NextResponse.json({ error: "user_not_found", clips: [] }, { status: 404 });
    const broadcaster_id = user.id;

    const clipsRes = await fetch(
      `https://api.twitch.tv/helix/clips?broadcaster_id=${encodeURIComponent(broadcaster_id)}&first=${encodeURIComponent(
        String(limit)
      )}`,
      { headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId } }
    );

    if (!clipsRes.ok) {
      const t = await clipsRes.text();
      return NextResponse.json({ error: `helix_clips_${clipsRes.status}`, detail: t }, { status: 502 });
    }

    const cj: unknown = await clipsRes.json();
    // try to safely extract 'data' array from the response
    const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
    let clipsArray: TwitchClip[] = [];
    if (isRecord(cj)) {
      const maybeData = cj["data"];
      if (Array.isArray(maybeData)) {
        // assert element type (we keep fields optional above so direct assertion is safe)
        clipsArray = maybeData as unknown as TwitchClip[];
      }
    }

    // If clips include game_id values, fetch game names and attach them to the clip objects
    try {
      const gameIds = Array.from(new Set(clipsArray.map((c) => (c.game_id ? String(c.game_id) : "")).filter(Boolean)));
      if (gameIds.length > 0) {
        // Twitch Helix: /helix/games?id=... (can pass multiple ids)
        const gamesRes = await fetch(`https://api.twitch.tv/helix/games?${gameIds.map((id) => `id=${encodeURIComponent(id)}`).join("&")}`, {
          headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId },
        });
        if (gamesRes.ok) {
          const gj: unknown = await gamesRes.json();
          if (isRecord(gj) && Array.isArray(gj.data)) {
            const mapping = new Map<string, string>();
            for (const g of gj.data as Array<Record<string, unknown>>) {
              if (g.id && g.name) mapping.set(String(g.id), String(g.name));
            }
            // attach game_name to clips when available
            clipsArray = clipsArray.map((c) => (c.game_id && mapping.has(String(c.game_id)) ? { ...c, game_name: mapping.get(String(c.game_id)) } : c));
          }
        }
      }
    } catch {
      // ignore game name resolution failures — clips still returned
    }

    const payload: ClipsPayload = { clips: clipsArray, fetchedAt: new Date().toISOString() };

    clipsCache = { data: payload, fetchedAt: Date.now() };
    return NextResponse.json(payload);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message, clips: [] }, { status: 500 });
    }
    return NextResponse.json({ error: String(err), clips: [] }, { status: 500 });
  }
}
