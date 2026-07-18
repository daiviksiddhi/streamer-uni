import { NextResponse } from "next/server";
import { getAppAccessToken, noStoreHeaders } from "../_twitch";

type TwitchStream = {
  id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
};

type TwitchGame = {
  id: string;
  name: string;
  box_art_url: string;
};

type TwitchGamesResponse = {
  data?: TwitchGame[];
};

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
  offline_image_url: string;
  broadcaster_type: string;
};

type TwitchStreamsResponse = {
  data?: TwitchStream[];
  error?: string;
  message?: string;
};

type TwitchUsersResponse = {
  data?: TwitchUser[];
  error?: string;
  message?: string;
};

const successCacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=120",
  "Vercel-CDN-Cache-Control": "s-maxage=30, stale-while-revalidate=120"
};

const degradedCacheHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=60",
  "Vercel-CDN-Cache-Control": "s-maxage=30, stale-while-revalidate=60"
};

function jsonResponse(payload: unknown, init?: ResponseInit) {
  return NextResponse.json(payload, {
    ...init,
    headers: {
      ...successCacheHeaders,
      ...init?.headers
    }
  });
}

const chunkItems = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const users = Array.from(
    new Set(
      (searchParams.get("users") ?? "")
        .split(",")
        .map((user) => user.trim().toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, 250);

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!users.length) {
    return jsonResponse({ configured: Boolean(clientId && clientSecret), streams: [], users: [] });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { configured: false, streams: [], users: [] },
      { headers: noStoreHeaders }
    );
  }

  try {
    const accessToken = await getAppAccessToken(clientId, clientSecret);

    const channelPayloads = await Promise.all(
      chunkItems(users, 100).map(async (usersChunk) => {
        const streamParams = new URLSearchParams();
        usersChunk.forEach((user) => streamParams.append("user_login", user));
        streamParams.set("first", "100");
        const userParams = new URLSearchParams();
        usersChunk.forEach((user) => userParams.append("login", user));

        const [streamsResponse, usersResponse] = await Promise.all([
          fetch(`https://api.twitch.tv/helix/streams?${streamParams.toString()}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId
            },
            next: {
              revalidate: 60
            }
          }),
          fetch(`https://api.twitch.tv/helix/users?${userParams.toString()}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Client-Id": clientId
            },
            next: {
              revalidate: 3600
            }
          })
        ]);

        if (!streamsResponse.ok || !usersResponse.ok) return null;

        const [streamsPayload, usersPayload] = await Promise.all([
          streamsResponse.json() as Promise<TwitchStreamsResponse>,
          usersResponse.json() as Promise<TwitchUsersResponse>
        ]);

        return {
          streams: streamsPayload.data ?? [],
          users: usersPayload.data ?? []
        };
      })
    );

    if (channelPayloads.some((payload) => !payload)) {
      return NextResponse.json(
        { configured: true, streams: [], users: [], degraded: true, error: "Twitch channel request failed." },
        { headers: degradedCacheHeaders }
      );
    }

    const streams = channelPayloads.flatMap((payload) => payload?.streams ?? []);
    const twitchUsers = channelPayloads.flatMap((payload) => payload?.users ?? []);

    // Resolve box art for whatever categories are live right now
    const gameIds = [
      ...new Set(streams.map((stream) => stream.game_id).filter(Boolean))
    ].slice(0, 100);
    let games: TwitchGame[] = [];

    if (gameIds.length) {
      const gameParams = new URLSearchParams();
      gameIds.forEach((id) => gameParams.append("id", id));
      const gamesResponse = await fetch(`https://api.twitch.tv/helix/games?${gameParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Client-Id": clientId
        },
        next: {
          revalidate: 3600
        }
      });

      if (gamesResponse.ok) {
        const gamesPayload = (await gamesResponse.json()) as TwitchGamesResponse;
        games = gamesPayload.data ?? [];
      }
    }

    return jsonResponse({
      configured: true,
      streams,
      users: twitchUsers,
      games
    });
  } catch {
    return NextResponse.json(
      { configured: true, streams: [], users: [], degraded: true, error: "Unable to reach Twitch right now." },
      { headers: degradedCacheHeaders }
    );
  }
}
