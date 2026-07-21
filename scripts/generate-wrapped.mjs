import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const sourcePath = path.join(root, "app/page.tsx");
const outputPath = path.join(root, "app/wrapped/wrapped-data.json");
const streamsChartsSnapshot = process.env.STREAMS_CHARTS_SOURCE || "/tmp/streamcharts-page-1.json";

const event = {
  name: "Streamer University 2026",
  start: "2026-07-15T04:00:00.000Z",
  end: "2026-07-21T04:00:00.000Z",
  displayDates: "July 15-20, 2026"
};

const awards = [
  { title: "Most Improved", winner: "McQueen", handles: ["mcqueennlive"] },
  { title: "Master of Mentorship", winner: "Agent00", handles: ["agent00"] },
  { title: "Biggest Flirt", winner: "SukiiMellow", handles: ["sukiimellow"] },
  { title: "Engagement Guru", winner: "Streamer University Police Department", handles: ["walton", "fanum"] },
  { title: "Most Honourable", winner: "Bella Grace", handles: ["ysabellagrace"] },
  { title: "Social Butterfly", winner: "Lani Aliza", handles: ["lanializa"] },
  { title: "Best Dressed", winner: "FlippenJosh", handles: [] },
  { title: "Best Group", winner: "CORE", handles: [] },
  { title: "Class Clown", winner: "ILikeHaskell", handles: ["ilikehaskell"] },
  { title: "Rising Star", winner: "Madi & Reem", handles: ["madi2hottyy", "reemknocks"] },
  { title: "Community Builder", winner: "Stable Ronaldo", handles: ["stableronaldo"] },
  { title: "Most Consistent Streamer", winner: "Juicy Jacob", handles: ["juicyjacob"] },
  { title: "Biggest Snitch", winner: "Big Ant", handles: ["real_bigant26"] },
  { title: "Hidden Gem", winner: "Blazian", handles: ["blazian"] },
  { title: "Class Duo", winner: "E11ysa & FindJeremiah", handles: ["e11ysa", "findjeremiah"] },
  { title: "Heart of the Community", winner: "IJustLovePuzzles", handles: ["ijustlovepuzzles"] },
  { title: "Steady Growth Award", winner: "Wardrobe Winter", handles: ["wardrobewinter"] },
  { title: "Worst Behaviour", winner: "Bilzo", handles: ["notbilzo"] },
  { title: "Campus Icon", winner: "YourRAGE", handles: ["yourragegaming"], featured: true },
  { title: "Best Roommates", winner: "Wardrobe Winter & Plaqueboymax", handles: ["wardrobewinter", "plaqueboymax"] },
  { title: "School Spirit", winner: "MyaNicole & TheRealMiyaLive", handles: ["myanicolelive", "therealmiyalive"] },
  { title: "Prankster", winner: "Kanel Joseph", handles: ["kaneljoseph"] },
  { title: "Best Professor", winner: "Ludwig", handles: ["ludwig"], featured: true },
  { title: "Best Club Director", winner: "Markell Washington", handles: ["markellwashington"] },
  { title: "Best In-Room Content", winner: "ChrisGoneCrazy & RealNiaLove", handles: ["chrisgonecrazylive", "therealnialovee"] },
  { title: "MVP", winner: "Suburb Baby", handles: ["suburbbaby"], featured: true },
  { title: "The Valedictorian", winner: "MeesterKeem", handles: ["meesterkeem"], featured: true }
];

function parseEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        let value = line.slice(separator + 1).trim();
        if ((value.startsWith("\"") && value.endsWith("\"")) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        return [key, value];
      })
  );
}

async function loadLocalEnv() {
  const names = [".env.local", ".env.streamscharts.local"];
  const merged = {};

  for (const name of names) {
    try {
      Object.assign(merged, parseEnv(await fs.readFile(path.join(root, name), "utf8")));
    } catch {
      // Optional local env files may not exist in every environment.
    }
  }

  return { ...merged, ...process.env };
}

function quotedValues(block) {
  return [...block.matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function parseRoster(source) {
  const facultyBlock = source.slice(source.indexOf("const facultySeeds"), source.indexOf("const studentHandles"));
  const studentBlock = source.slice(source.indexOf("const studentHandles = ["), source.indexOf("const alumniHandles"));
  const alumniBlock = source.slice(source.indexOf("const alumniHandles = ["), source.indexOf("const studentCategories"));
  const faculty = [...facultyBlock.matchAll(/login:\s*"([^"]+)"[\s\S]*?name:\s*"([^"]+)"/g)].map((match) => ({
    login: match[1].toLowerCase(),
    name: match[2],
    role: "Faculty"
  }));
  const students = quotedValues(studentBlock).map((name) => ({ login: name.toLowerCase(), name, role: "Student" }));
  const alumni = quotedValues(alumniBlock).map((name) => ({ login: name.toLowerCase(), name, role: "Alumni" }));

  return [...faculty, ...students, ...alumni];
}

function chunks(items, size) {
  const groups = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  return groups;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const index = cursor++;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function getTwitchToken(clientId, clientSecret) {
  const params = new URLSearchParams({ client_id: clientId, client_secret: clientSecret, grant_type: "client_credentials" });
  const response = await fetch(`https://id.twitch.tv/oauth2/token?${params}`, { method: "POST" });
  if (!response.ok) throw new Error(`Twitch token request failed (${response.status})`);
  return (await response.json()).access_token;
}

async function getTwitchUsers(logins, clientId, token) {
  const users = [];

  for (const group of chunks(logins, 100)) {
    const params = new URLSearchParams();
    group.forEach((login) => params.append("login", login));
    const response = await fetch(`https://api.twitch.tv/helix/users?${params}`, {
      headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId }
    });
    if (!response.ok) throw new Error(`Twitch users request failed (${response.status})`);
    users.push(...((await response.json()).data || []));
  }

  return users;
}

async function getEventClips(users, clientId, token) {
  const groups = await mapWithConcurrency(users, 5, async (user, index) => {
    if (index > 0 && index % 40 === 0) console.log(`Fetched clips for ${index}/${users.length} channels`);
    const params = new URLSearchParams({
      broadcaster_id: user.id,
      started_at: event.start,
      ended_at: event.end,
      first: "20"
    });
    const response = await fetch(`https://api.twitch.tv/helix/clips?${params}`, {
      headers: { Authorization: `Bearer ${token}`, "Client-Id": clientId }
    });
    if (!response.ok) throw new Error(`Twitch clips request failed for ${user.login} (${response.status})`);
    return (await response.json()).data || [];
  });

  return groups
    .flat()
    .sort((a, b) => b.view_count - a.view_count || Date.parse(b.created_at) - Date.parse(a.created_at))
    .slice(0, 12);
}

function leaderboard(metrics, key, count = 8) {
  return [...metrics]
    .filter((item) => Number(item[key]) > 0)
    .sort((a, b) => Number(b[key]) - Number(a[key]))
    .slice(0, count)
    .map((item, index) => ({ ...item, rank: index + 1 }));
}

async function main() {
  const env = await loadLocalEnv();
  const source = await fs.readFile(sourcePath, "utf8");
  const roster = parseRoster(source);
  const rosterByLogin = new Map(roster.map((member) => [member.login, member]));
  const twitchRoster = roster.filter((member) => !["crystalizaguirre", "flippenjosh", "jaidabunni", "thelethalshooter"].includes(member.login));

  const streamsPayload = JSON.parse(await fs.readFile(streamsChartsSnapshot, "utf8"));
  const metrics = (streamsPayload.data || [])
    .filter((item) => rosterByLogin.has(item.channel_name.toLowerCase()))
    .map((item) => {
      const member = rosterByLogin.get(item.channel_name.toLowerCase());
      return {
        login: item.channel_name.toLowerCase(),
        name: item.channel_display_name || member.name,
        role: member.role,
        avatar: item.avatar_url,
        hoursWatched: Number(item.hours_watched) || 0,
        peakViewers: Number(item.peak_viewers) || 0,
        averageViewers: Number(item.average_viewers) || 0,
        airtimeMinutes: Number(item.airtime_in_m) || 0,
        followersGained: Number(item.followers_gain) || 0,
        liveViews: Number(item.live_views) || 0
      };
    });

  let twitchUsers = [];
  let clips = [];
  if (env.TWITCH_CLIENT_ID && env.TWITCH_CLIENT_SECRET) {
    const token = await getTwitchToken(env.TWITCH_CLIENT_ID, env.TWITCH_CLIENT_SECRET);
    twitchUsers = await getTwitchUsers(twitchRoster.map((member) => member.login), env.TWITCH_CLIENT_ID, token);
    clips = await getEventClips(twitchUsers, env.TWITCH_CLIENT_ID, token);
  } else {
    console.warn("Twitch credentials are unavailable; clips and some award portraits will be omitted.");
  }

  const userByLogin = new Map(twitchUsers.map((user) => [user.login.toLowerCase(), user]));
  const metricByLogin = new Map(metrics.map((metric) => [metric.login, metric]));
  const publicProfiles = Object.fromEntries(
    roster.map((member) => {
      const twitchUser = userByLogin.get(member.login);
      const metric = metricByLogin.get(member.login);
      return [member.login, {
        login: member.login,
        name: twitchUser?.display_name || metric?.name || member.name,
        role: member.role,
        avatar: twitchUser?.profile_image_url || metric?.avatar || null
      }];
    })
  );

  const output = {
    generatedAt: new Date().toISOString(),
    event,
    methodology: {
      metricsSource: "Streams Charts",
      metricsWindow: streamsPayload.filters?.time || "Trailing seven days",
      metricsCoverage: `${metrics.length} campus channels present in the provider's worldwide top-100 snapshot`,
      clipsSource: "Twitch Helix",
      clipsWindow: event.displayDates,
      note: "Historical leaderboards use the available trailing-week provider snapshot, not an exact event-only export. Clip rankings use the exact event dates."
    },
    counts: {
      roster: roster.length,
      faculty: roster.filter((member) => member.role === "Faculty").length,
      students: roster.filter((member) => member.role === "Student").length,
      alumni: roster.filter((member) => member.role === "Alumni").length,
      ranked: metrics.length,
      awards: awards.length
    },
    totals: {
      hoursWatched: metrics.reduce((total, metric) => total + metric.hoursWatched, 0),
      followersGained: metrics.reduce((total, metric) => total + metric.followersGained, 0),
      averageViewers: metrics.reduce((total, metric) => total + metric.averageViewers, 0),
      peakViewers: metrics.reduce((total, metric) => total + metric.peakViewers, 0)
    },
    highlights: {
      hoursWatched: leaderboard(metrics, "hoursWatched"),
      followersGained: leaderboard(metrics, "followersGained"),
      averageViewers: leaderboard(metrics, "averageViewers"),
      peakViewers: leaderboard(metrics, "peakViewers")
    },
    clips: clips.map((clip) => {
      const login = (clip.broadcaster_name || "").toLowerCase();
      const broadcaster = twitchUsers.find((user) => user.id === clip.broadcaster_id);
      return {
        id: clip.id,
        title: clip.title,
        url: clip.url,
        thumbnail: clip.thumbnail_url,
        views: clip.view_count,
        createdAt: clip.created_at,
        duration: clip.duration,
        broadcaster: broadcaster?.display_name || clip.broadcaster_name,
        login: broadcaster?.login || login,
        avatar: broadcaster?.profile_image_url || null
      };
    }),
    awards: awards.map((award) => ({
      ...award,
      profiles: award.handles.map((handle) => publicProfiles[handle]).filter(Boolean)
    }))
  };

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`Wrote ${outputPath}`);
  console.log(`${metrics.length} ranked campus channels, ${clips.length} clips, ${awards.length} awards`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
