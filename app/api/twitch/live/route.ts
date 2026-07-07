import { NextResponse } from "next/server";

type TwitchTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
};

type TwitchStream = {
  id: string;
  user_login: string;
  user_name: string;
  game_name: string;
  title: string;
  viewer_count: number;
  thumbnail_url: string;
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const users = (searchParams.get("users") ?? "")
    .split(",")
    .map((user) => user.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 100);

  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;

  if (!users.length) {
    return NextResponse.json({ configured: Boolean(clientId && clientSecret), streams: [], users: [] });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json({ configured: false, streams: [], users: [] });
  }

  try {
    const tokenResponse = await fetch("https://id.twitch.tv/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials"
      }),
      cache: "no-store"
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { configured: true, streams: [], error: "Twitch token request failed." },
        { status: 502 }
      );
    }

    const tokenPayload = (await tokenResponse.json()) as TwitchTokenResponse;
    if (!tokenPayload.access_token) {
      return NextResponse.json(
        { configured: true, streams: [], error: "Twitch token response did not include an access token." },
        { status: 502 }
      );
    }

    const streamParams = new URLSearchParams();
    users.forEach((user) => streamParams.append("user_login", user));
    const userParams = new URLSearchParams();
    users.forEach((user) => userParams.append("login", user));

    const [streamsResponse, usersResponse] = await Promise.all([
      fetch(`https://api.twitch.tv/helix/streams?${streamParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${tokenPayload.access_token}`,
          "Client-Id": clientId
        },
        next: {
          revalidate: 60
        }
      }),
      fetch(`https://api.twitch.tv/helix/users?${userParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${tokenPayload.access_token}`,
          "Client-Id": clientId
        },
        next: {
          revalidate: 3600
        }
      })
    ]);

    if (!streamsResponse.ok || !usersResponse.ok) {
      return NextResponse.json(
        { configured: true, streams: [], users: [], error: "Twitch channel request failed." },
        { status: 502 }
      );
    }

    const [streamsPayload, usersPayload] = await Promise.all([
      streamsResponse.json() as Promise<TwitchStreamsResponse>,
      usersResponse.json() as Promise<TwitchUsersResponse>
    ]);

    return NextResponse.json({
      configured: true,
      streams: streamsPayload.data ?? [],
      users: usersPayload.data ?? []
    });
  } catch {
    return NextResponse.json(
      { configured: true, streams: [], users: [], error: "Unable to reach Twitch right now." },
      { status: 502 }
    );
  }
}
