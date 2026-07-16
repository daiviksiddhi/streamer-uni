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

type TwitchClipGroup = {
  login: string;
  clips: TwitchClip[];
  failed: boolean;
};

const clipCacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=14400, stale-while-revalidate=14400",
  "Vercel-CDN-Cache-Control": "s-maxage=14400, stale-while-revalidate=14400"
};

const degradedCacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=600",
  "Vercel-CDN-Cache-Control": "s-maxage=300, stale-while-revalidate=600"
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
    .filter((login, index, allLogins) => allLogins.indexOf(login) === index)
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
        const userParams = new URLSearchParams();
        loginsChunk.forEach((login) => userParams.append("login", login));
        const response = await fetch(`https://api.twitch.tv/helix/users?${userParams.toString()}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Client-Id": clientId
          },
          next: { revalidate: 14400 }
        });

        if (!response.ok) return null;
        const payload = (await response.json()) as TwitchUsersResponse;
        return payload.data ?? [];
      })
    );

    if (userPayloads.some((payload) => !payload)) {
      return NextResponse.json(
        { configured: true, clips: [], degraded: true, error: "Twitch directory request was rate limited." },
        { headers: degradedCacheHeaders }
      );
    }

    const users = userPayloads.flatMap((payload) => payload ?? []);
    const usersByLogin = new Map(users.map((user) => [user.login.toLowerCase(), user]));
    const clipCandidates = logins
      .map((login) => usersByLogin.get(login))
      .filter((user): user is TwitchUser => Boolean(user));

    // Keep the upstream URLs stable within the same cache window. A timestamp based
    // on the exact request time defeats Next's fetch cache on every regeneration.
    const fourHourBucket = Math.floor(Date.now() / (4 * 60 * 60 * 1000)) * 4 * 60 * 60 * 1000;
    const startedAt = new Date(fourHourBucket - 24 * 60 * 60 * 1000).toISOString();
    const endedAt = new Date(fourHourBucket).toISOString();
    const clipGroups = await mapWithConcurrency<TwitchUser, TwitchClipGroup>(clipCandidates, 4, async (user) => {
      const params = new URLSearchParams({
        broadcaster_id: user.id,
        started_at: startedAt,
        ended_at: endedAt,
        // Twitch returns broadcaster clips in descending view-count order. Keeping
        // ten per channel is enough to calculate an exact global top-ten shelf.
        first: "10"
      });
      const response = await fetch(`https://api.twitch.tv/helix/clips?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId
        },
        next: { revalidate: 14400 }
      });

      if (!response.ok) return { login: user.login, clips: [], failed: true };
      const payload = (await response.json()) as TwitchClipsResponse;
      return { login: user.login, clips: payload.data ?? [], failed: false };
    });

    // Never cache a partial roster response as a valid "trending" ranking. This was
    // why production could show only low-view clips when some Twitch calls failed.
    if (clipGroups.some((group) => group.failed)) {
      return NextResponse.json(
        { configured: true, clips: [], degraded: true, error: "Twitch clip requests were rate limited." },
        { headers: degradedCacheHeaders }
      );
    }

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
      .slice(0, 10);

    return NextResponse.json({ configured: true, clips }, { headers: clipCacheHeaders });
  } catch {
    return NextResponse.json(
      { configured: true, clips: [], degraded: true, error: "Unable to load campus clips right now." },
      { headers: degradedCacheHeaders }
    );
  }
}
