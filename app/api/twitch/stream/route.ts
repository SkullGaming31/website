import { NextResponse } from "next/server";

// Simple in-memory cache for token and last stream response
let tokenCache: { token?: string; expiresAt?: number } = {};
let streamCache: { data?: any; fetchedAt?: number } = {};

const CHANNEL = "skullgaminghq"; // change if needed
const TOKEN_TTL_BUFFER = 30; // seconds buffer
const STREAM_TTL = 30; // cache stream response for 30s

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

export async function GET() {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  // If credentials aren't configured, return safe offline response
  if (!clientId || !clientSecret) {
    return NextResponse.json({ live: false, error: "no_twitch_credentials" });
  }

  const now = Date.now();
  if (streamCache.data && streamCache.fetchedAt && now - streamCache.fetchedAt < STREAM_TTL * 1000) {
    return NextResponse.json(streamCache.data);
  }

  try {
    const token = await getAppAccessToken(clientId, clientSecret);
    const res = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${encodeURIComponent(CHANNEL)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Client-Id": clientId,
        },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ live: false, error: `helix_error_${res.status}`, detail: text }, { status: 502 });
    }

    const j = await res.json();
    const live = Array.isArray(j.data) && j.data.length > 0;
    const data = j.data && j.data[0];
    const payload = {
      live: !!live,
      channel: CHANNEL,
      ...(live
        ? {
            title: data.title,
            viewer_count: data.viewer_count,
            started_at: data.started_at,
            game_name: data.game_name,
          }
        : {}),
      cachedAt: new Date().toISOString(),
    };

    streamCache = { data: payload, fetchedAt: Date.now() };
    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json({ live: false, error: err?.message || String(err) }, { status: 500 });
  }
}
