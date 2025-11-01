import { NextResponse } from "next/server";

// Small in-memory cache
let tokenCache: { token?: string; expiresAt?: number } = {};
let scheduleCache: { data?: any; fetchedAt?: number } = {};

// Broadcaster numeric ID (recommended by user). This ID can be used for Helix endpoints directly.
const CHANNEL = "skullgaminghq";
const BROADCASTER_ID = "1155035316";
const TOKEN_TTL_BUFFER = 30; // seconds
const SCHEDULE_TTL = 30; // seconds

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

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "no_twitch_credentials", vacation: null, segments: [] });
  }

  const now = Date.now();
  if (scheduleCache.data && scheduleCache.fetchedAt && now - scheduleCache.fetchedAt < SCHEDULE_TTL * 1000) {
    return NextResponse.json(scheduleCache.data);
  }

  try {
    const token = await getAppAccessToken(clientId, clientSecret);

    // Use the known numeric broadcaster id directly (avoids extra users lookup)
    const broadcaster_id = BROADCASTER_ID;

    const sres = await fetch(`https://api.twitch.tv/helix/schedule?broadcaster_id=${encodeURIComponent(broadcaster_id)}`, {
      headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId },
    });

    if (!sres.ok) {
      const t = await sres.text();
      return NextResponse.json({ error: `helix_schedule_${sres.status}`, detail: t }, { status: 502 });
    }

    const sj = await sres.json();

    // sj contains "vacation" (possibly null) and "segments" array
    const payload = {
      vacation: sj.vacation ?? null,
      segments: sj.data?.segments ?? sj.segments ?? sj.data ?? sj, // best-effort
      fetchedAt: new Date().toISOString(),
    };

    scheduleCache = { data: payload, fetchedAt: Date.now() };
    return NextResponse.json(payload);
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || String(err), vacation: null, segments: [] }, { status: 500 });
  }
}
