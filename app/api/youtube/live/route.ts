import { NextResponse } from "next/server";

type YoutubeChannelsResponse = {
  items?: { id?: string }[];
};

type YoutubeSearchResponse = {
  items?: {
    id?: { videoId?: string };
    snippet?: {
      title?: string;
      thumbnails?: { high?: { url?: string }; medium?: { url?: string } };
    };
  }[];
};

type YoutubeVideosResponse = {
  items?: {
    liveStreamingDetails?: { concurrentViewers?: string };
  }[];
};

// The live-search endpoint costs 100 quota units per channel per check against
// a 10,000/day default quota, so cache results for 20 minutes server-side.
const DATA_TTL_MS = 20 * 60_000;
const channelIdCache = new Map<string, string>();
let dataCache: { key: string; payload: unknown; at: number } | null = null;

async function resolveChannelId(handle: string, key: string) {
  const normalized = handle.toLowerCase();
  const cached = channelIdCache.get(normalized);
  if (cached) return cached;

  const params = new URLSearchParams({
    part: "id",
    forHandle: handle.startsWith("@") ? handle : `@${handle}`,
    key
  });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params.toString()}`);
  if (!response.ok) return null;

  const payload = (await response.json()) as YoutubeChannelsResponse;
  const id = payload.items?.[0]?.id;
  if (id) channelIdCache.set(normalized, id);
  return id ?? null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const handles = (searchParams.get("handles") ?? "")
    .split(",")
    .map((handle) => handle.trim())
    .filter(Boolean)
    .slice(0, 10);

  const key = process.env.YOUTUBE_API_KEY;

  if (!handles.length) {
    return NextResponse.json({ configured: Boolean(key), channels: [] });
  }

  if (!key) {
    return NextResponse.json({ configured: false, channels: [] });
  }

  const cacheKey = handles.join(",").toLowerCase();
  if (dataCache && dataCache.key === cacheKey && Date.now() - dataCache.at < DATA_TTL_MS) {
    return NextResponse.json(dataCache.payload);
  }

  try {
    const channels = await Promise.all(
      handles.map(async (handle) => {
        const offline = { handle, isLive: false, videoId: "", title: "", viewers: 0, thumbnail: "" };
        const channelId = await resolveChannelId(handle, key);
        if (!channelId) return offline;

        const searchParams = new URLSearchParams({
          part: "snippet",
          channelId,
          eventType: "live",
          type: "video",
          maxResults: "1",
          key
        });
        const searchResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/search?${searchParams.toString()}`
        );
        if (!searchResponse.ok) return offline;

        const searchPayload = (await searchResponse.json()) as YoutubeSearchResponse;
        const liveItem = searchPayload.items?.[0];
        const videoId = liveItem?.id?.videoId;
        if (!videoId) return offline;

        let viewers = 0;
        const videoParams = new URLSearchParams({ part: "liveStreamingDetails", id: videoId, key });
        const videoResponse = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?${videoParams.toString()}`
        );
        if (videoResponse.ok) {
          const videoPayload = (await videoResponse.json()) as YoutubeVideosResponse;
          viewers = Number(videoPayload.items?.[0]?.liveStreamingDetails?.concurrentViewers ?? 0);
        }

        return {
          handle,
          isLive: true,
          videoId,
          title: liveItem?.snippet?.title || "",
          viewers,
          thumbnail:
            liveItem?.snippet?.thumbnails?.high?.url ||
            liveItem?.snippet?.thumbnails?.medium?.url ||
            ""
        };
      })
    );

    const result = { configured: true, channels };
    dataCache = { key: cacheKey, payload: result, at: Date.now() };
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { configured: true, channels: [], error: "Unable to reach YouTube right now." },
      { status: 502 }
    );
  }
}
