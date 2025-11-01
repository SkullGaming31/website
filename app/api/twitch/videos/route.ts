import { NextResponse } from "next/server";

type TwitchVideo = {
  id: string;
  user_id?: string;
  user_login?: string;
  user_name?: string;
  title?: string;
  description?: string;
  created_at?: string;
  published_at?: string;
  url?: string;
  thumbnail_url?: string;
  view_count?: number;
  language?: string;
  type?: string; // 'upload' | 'archive' | 'highlight'
  duration?: string;
  [key: string]: unknown;
};

type VideosPayload = {
  videos: TwitchVideo[];
  fetchedAt: string;
};

let tokenCache: { token?: string; expiresAt?: number } = {};
let videosCache: { data?: VideosPayload; fetchedAt?: number } = {};

const CHANNEL = "skullgaminghq";
const TOKEN_TTL_BUFFER = 30;
const VIDEOS_TTL = 45; // seconds

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
    return NextResponse.json({ error: "no_twitch_credentials", videos: [] });
  }

  const urlObj = new URL(request.url);
  const limitParam = urlObj.searchParams.get("limit") || "12";
  const limit = Math.min(50, parseInt(limitParam, 10) || 12);

  const now = Date.now();
  if (videosCache.data && videosCache.fetchedAt && now - videosCache.fetchedAt < VIDEOS_TTL * 1000) {
    return NextResponse.json(videosCache.data);
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
    if (!user) return NextResponse.json({ error: "user_not_found", videos: [] }, { status: 404 });
    const broadcaster_id = user.id;

    const vidsRes = await fetch(
      `https://api.twitch.tv/helix/videos?user_id=${encodeURIComponent(broadcaster_id)}&first=${encodeURIComponent(
        String(limit)
      )}`,
      { headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId } }
    );

    if (!vidsRes.ok) {
      const t = await vidsRes.text();
      return NextResponse.json({ error: `helix_videos_${vidsRes.status}`, detail: t }, { status: 502 });
    }

    const vj: unknown = await vidsRes.json();
    const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;
    let videosArray: TwitchVideo[] = [];
    if (isRecord(vj)) {
      const maybeData = vj["data"];
      if (Array.isArray(maybeData)) {
        videosArray = maybeData as unknown as TwitchVideo[];
      }
    }

    const payload: VideosPayload = { videos: videosArray, fetchedAt: new Date().toISOString() };
    videosCache = { data: payload, fetchedAt: Date.now() };
    return NextResponse.json(payload);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message, videos: [] }, { status: 500 });
    }
    return NextResponse.json({ error: String(err), videos: [] }, { status: 500 });
  }
}
