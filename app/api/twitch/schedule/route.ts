import { NextResponse } from "next/server";

// Types for Twitch schedule response
type TwitchCategory = { id?: string; name?: string;[key: string]: unknown };
type TwitchSegment = {
  id: string;
  start_time?: string;
  end_time?: string;
  title?: string;
  canceled_until?: string | null;
  category?: TwitchCategory;
  is_recurring?: boolean;
  [key: string]: unknown;
};

type SchedulePayload = {
  vacation: unknown | null;
  segments: TwitchSegment[];
  fetchedAt: string;
};

// Small in-memory cache
let tokenCache: { token?: string; expiresAt?: number } = {};
let scheduleCache: { data?: SchedulePayload; fetchedAt?: number } = {};

// Broadcaster numeric ID (recommended by user). This ID can be used for Helix endpoints directly.
const BROADCASTER_ID = "31124455"; // canadiendragon's Twitch numeric ID
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
      // If Twitch returns 404 "segments were not found", treat this as an empty schedule
      // instead of surfacing a 502 to callers. This lets the frontend show a friendly
      // "No scheduled stream" message while keeping other errors as failures.
      if (sres.status === 404) {
        const emptyPayload = { vacation: null, segments: [], fetchedAt: new Date().toISOString() };
        scheduleCache = { data: emptyPayload, fetchedAt: Date.now() };
        return NextResponse.json(emptyPayload);
      }
      return NextResponse.json({ error: `helix_schedule_${sres.status}`, detail: t }, { status: 502 });
    }

    const sj: unknown = await sres.json();

    // sj contains "vacation" (possibly null) and "segments" array
    const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

    let vacation: unknown | null = null;
    let segments: TwitchSegment[] = [];

    if (isRecord(sj)) {
      // Try sj.data structure first
      const dataCandidate = sj["data"] ?? sj;
      if (isRecord(dataCandidate)) {
        vacation = dataCandidate["vacation"] ?? null;
        const segs = dataCandidate["segments"] ?? dataCandidate["data"] ?? dataCandidate;
        if (Array.isArray(segs)) {
          segments = segs as unknown as TwitchSegment[];
        }
      } else if (Array.isArray(dataCandidate)) {
        // sj is an array of segments
        segments = dataCandidate as unknown as TwitchSegment[];
      }
    }

    const payload: SchedulePayload = { vacation, segments, fetchedAt: new Date().toISOString() };

    scheduleCache = { data: payload, fetchedAt: Date.now() };
    return NextResponse.json(payload);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message, vacation: null, segments: [] }, { status: 500 });
    }
    return NextResponse.json({ error: String(err), vacation: null, segments: [] }, { status: 500 });
  }
}
