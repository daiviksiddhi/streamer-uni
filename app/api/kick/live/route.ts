import { NextResponse } from "next/server";

type KickTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type KickApiChannel = {
  slug?: string;
  stream_title?: string;
  banner_picture?: string;
  stream?: {
    is_live?: boolean;
    viewer_count?: number;
    thumbnail?: string;
  };
  category?: {
    name?: string;
  };
};

type KickChannelsResponse = {
  data?: KickApiChannel[];
};

let tokenCache: { token: string; expiresAt: number } | null = null;
let dataCache: { key: string; payload: unknown; at: number } | null = null;
const DATA_TTL_MS = 60_000;

async function getAppToken(clientId: string, clientSecret: string) {
  if (tokenCache && Date.now() < tokenCache.expiresAt - 60_000) {
    return tokenCache.token;
  }

  const response = await fetch("https://id.kick.com/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret
    }),
    cache: "no-store"
  });

  if (!response.ok) return null;

  const payload = (await response.json()) as KickTokenResponse;
  if (!payload.access_token) return null;

  tokenCache = {
    token: payload.access_token,
    expiresAt: Date.now() + (payload.expires_in ?? 3600) * 1000
  };
  return tokenCache.token;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slugs = (searchParams.get("slugs") ?? "")
    .split(",")
    .map((slug) => slug.trim())
    .filter(Boolean)
    .slice(0, 50);

  const clientId = process.env.KICK_CLIENT_ID;
  const clientSecret = process.env.KICK_CLIENT_SECRET;

  if (!slugs.length) {
    return NextResponse.json({ configured: Boolean(clientId && clientSecret), channels: [] });
  }

  if (!clientId || !clientSecret) {
    return NextResponse.json({ configured: false, channels: [] });
  }

  const cacheKey = slugs.join(",").toLowerCase();
  if (dataCache && dataCache.key === cacheKey && Date.now() - dataCache.at < DATA_TTL_MS) {
    return NextResponse.json(dataCache.payload);
  }

  try {
    const token = await getAppToken(clientId, clientSecret);
    if (!token) {
      return NextResponse.json(
        { configured: true, channels: [], error: "Kick token request failed." },
        { status: 502 }
      );
    }

    const params = new URLSearchParams();
    slugs.forEach((slug) => params.append("slug", slug.toLowerCase()));

    const response = await fetch(`https://api.kick.com/public/v1/channels?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store"
    });

    if (!response.ok) {
      return NextResponse.json(
        { configured: true, channels: [], error: `Kick channels request failed (${response.status}).` },
        { status: 502 }
      );
    }

    const payload = (await response.json()) as KickChannelsResponse;
    const channels = (payload.data ?? []).map((channel) => ({
      slug: channel.slug ?? "",
      isLive: Boolean(channel.stream?.is_live),
      viewers: channel.stream?.viewer_count ?? 0,
      title: channel.stream_title || "",
      category: channel.category?.name || "",
      thumbnail: channel.stream?.thumbnail || channel.banner_picture || ""
    }));

    const result = { configured: true, channels };
    dataCache = { key: cacheKey, payload: result, at: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { configured: true, channels: [], error: "Unable to reach Kick right now." },
      { status: 502 }
    );
  }
}
