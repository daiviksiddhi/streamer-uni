import { NextResponse } from "next/server";
import { getAppAccessToken, noStoreHeaders } from "../_twitch";

type TwitchUser = {
  id: string;
  login: string;
};

type TwitchClip = {
  id: string;
  url: string;
  broadcaster_login?: string;
  broadcaster_name: string;
  game_name?: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
};

type TwitchUsersResponse = {
  data?: TwitchUser[];
};

type TwitchClipsResponse = {
  data?: TwitchClip[];
};

const clipCacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
  "Vercel-CDN-Cache-Control": "s-maxage=600, stale-while-revalidate=3600"
};

const chunkItems = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

async function mapWithConcurrency<T, Result>(
  items: T[],
  limit: number,
  mapper: (item: T) => Promise<Result>
) {
  const results: Result[] = [];
  let nextIndex = 0;

  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (nextIndex < items.length) {
      const item = items[nextIndex++];
      results.push(await mapper(item));
    }
  });

  await Promise.all(workers);
  return results;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const logins = (searchParams.get("users") ?? "")
    .split(",")
    .map((user) => user.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 200);
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!logins.length) {
    return NextResponse.json({ configured: Boolean(clientId && clientSecret), clips: [] }, { headers: clipCacheHeaders });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json({ configured: false, clips: [] }, { headers: noStoreHeaders });
  }

  try {
    const accessToken = await getAppAccessToken(clientId, clientSecret);
    const userPayloads = await Promise.all(
      chunkItems(logins, 100).map(async (loginsChunk) => {
        const params = new URLSearchParams();
        loginsChunk.forEach((login) => params.append("login", login));
        const response = await fetch(`https://api.twitch.tv/helix/users?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": clientId
          },
          next: { revalidate: 3600 }
        });

        if (!response.ok) return [] as TwitchUser[];
        const payload = (await response.json()) as TwitchUsersResponse;
        return payload.data ?? [];
      })
    );
    const startedAt = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const users = userPayloads.flat();
    const clipGroups = await mapWithConcurrency(users, 12, async (user) => {
      const params = new URLSearchParams({
        broadcaster_id: user.id,
        started_at: startedAt,
        first: "8"
      });
      const response = await fetch(`https://api.twitch.tv/helix/clips?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId
        },
        next: { revalidate: 600 }
      });

      if (!response.ok) return { login: user.login, clips: [] as TwitchClip[] };
      const payload = (await response.json()) as TwitchClipsResponse;
      return { login: user.login, clips: payload.data ?? [] };
    });

    const campusLogins = new Set(logins);
    const clips = clipGroups
      .flatMap(({ login, clips }) =>
        clips.map((clip) => ({
          ...clip,
          broadcaster_login: clip.broadcaster_login?.toLowerCase() || login
        }))
      )
      .filter((clip) => campusLogins.has(clip.broadcaster_login))
      .sort(
        (a, b) =>
          b.view_count - a.view_count ||
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 12);

    return NextResponse.json({ configured: true, clips }, { headers: clipCacheHeaders });
  } catch {
    return NextResponse.json(
      { configured: true, clips: [], error: "Unable to load campus clips right now." },
      { status: 502, headers: noStoreHeaders }
    );
  }
}
