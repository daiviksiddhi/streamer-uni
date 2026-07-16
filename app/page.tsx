"use client";

/* eslint-disable @next/next/no-img-element */
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Platform = "twitch" | "kick" | "youtube" | "tiktok";

type Channel = {
  login: string;
  name: string;
  role: "Faculty" | "Student";
  campusRole: string;
  category: string;
  title: string;
  viewers: number;
  live: boolean;
  verified?: boolean;
  tags: string[];
  avatar?: string;
  thumbnail?: string;
  offlineImage?: string;
  broadcasterType?: string;
  accent: string;
  platform: Platform;
  platformHandle?: string;
  youtubeVideoId?: string;
  multiviewOnly?: boolean;
};

type SeedChannel = {
  login: string;
  name: string;
  campusRole: string;
  category: string;
  title: string;
  viewers: number;
  live: boolean;
  verified?: boolean;
  tags: string[];
  accent: string;
};

type TwitchStream = {
  user_login: string;
  game_name?: string;
  title?: string;
  viewer_count?: number;
  thumbnail_url?: string;
};

type TwitchUser = {
  login: string;
  display_name?: string;
  profile_image_url?: string;
  offline_image_url?: string;
  broadcaster_type?: string;
};

type TwitchGame = {
  name?: string;
  box_art_url?: string;
};

type KickChannelStatus = {
  slug?: string;
  isLive?: boolean;
  viewers?: number;
  title?: string;
  category?: string;
  thumbnail?: string;
};

type YoutubeChannelStatus = {
  handle?: string;
  isLive?: boolean;
  videoId?: string;
  viewers?: number;
  title?: string;
  thumbnail?: string;
};

type TwitchClip = {
  id: string;
  url: string;
  broadcaster_login: string;
  broadcaster_name: string;
  game_name: string;
  title: string;
  view_count: number;
  created_at: string;
  thumbnail_url: string;
  duration: number;
};

const facultySeeds: SeedChannel[] = [
  {
    login: "kaicenat",
    name: "Kai Cenat",
    campusRole: "Dean",
    category: "Just Chatting",
    title: "Dean's office: Streamer University campus is open",
    viewers: 499000,
    live: true,
    verified: true,
    tags: ["Dean", "Streamer University"],
    accent: "#B20B32"
  },
  {
    login: "lizzobetwitchin",
    name: "LizzoBeTwitchin",
    campusRole: "Professor",
    category: "Streamer University",
    title: "Professor office hours: performance and stage presence",
    viewers: 18400,
    live: true,
    verified: true,
    tags: ["Professor", "Office Hours"],
    accent: "#00c8af"
  },
  {
    login: "ludwig",
    name: "Ludwig",
    campusRole: "Professor",
    category: "Just Chatting",
    title: "Class is in session: stream structure and show formats",
    viewers: 62300,
    live: true,
    verified: true,
    tags: ["Professor", "Strategy"],
    accent: "#ff75e6"
  },
  {
    login: "duke",
    name: "Duke",
    campusRole: "Professor",
    category: "Just Chatting",
    title: "Lecture hall: energy, timing, and keeping chat locked in",
    viewers: 39800,
    live: true,
    verified: true,
    tags: ["Professor", "Just Chatting"],
    accent: "#ff5f57"
  },
  {
    login: "agent00",
    name: "Agent00",
    campusRole: "Professor",
    category: "Gaming",
    title: "Gameplay lab: variety pacing and highlight moments",
    viewers: 31500,
    live: true,
    verified: true,
    tags: ["Professor", "Gaming"],
    accent: "#ffb000"
  },
  {
    login: "poudiistreams",
    name: "PoudiiStreams",
    campusRole: "Professor",
    category: "IRL",
    title: "Campus walk-through and creator feedback",
    viewers: 12600,
    live: true,
    verified: true,
    tags: ["Professor", "IRL"],
    accent: "#7bdcff"
  },
  {
    login: "thesushidragon",
    name: "TheSushiDragon",
    campusRole: "Professor",
    category: "Creative",
    title: "Production lab: making the stream feel impossible to ignore",
    viewers: 8700,
    live: true,
    verified: true,
    tags: ["Professor", "Production"],
    accent: "#e6d45a"
  },
  {
    login: "kaiyacenat1",
    name: "KaiyaCenat1",
    campusRole: "Professor",
    category: "Just Chatting",
    title: "Professor stream: campus stories and Q&A",
    viewers: 5400,
    live: true,
    tags: ["Professor", "Q&A"],
    accent: "#FFE08A"
  },
  {
    login: "cinna",
    name: "Cinna",
    campusRole: "Professor",
    category: "Just Chatting",
    title: "Chat lab: keeping the room moving",
    viewers: 28600,
    live: true,
    verified: true,
    tags: ["Professor", "Chat Lab"],
    accent: "#ff8fc7"
  },
  {
    login: "adapt",
    name: "Adapt",
    campusRole: "Professor",
    category: "Just Chatting",
    title: "Stream review: personality, clips, and momentum",
    viewers: 14300,
    live: true,
    verified: true,
    tags: ["Professor", "Reviews"],
    accent: "#93c5fd"
  },
  {
    login: "thelethalshooter",
    name: "TheLethalShooter",
    campusRole: "Club Director",
    category: "Sports",
    title: "Basketball club: shooting drills and creator discipline",
    viewers: 19100,
    live: true,
    verified: true,
    tags: ["Club Director", "Sports"],
    accent: "#f97316"
  },
  {
    login: "lifeofproto",
    name: "LifeOfProto",
    campusRole: "Club Director",
    category: "Streamer University",
    title: "Club orientation: finding your lane on campus",
    viewers: 7300,
    live: true,
    tags: ["Club Director", "Campus"],
    accent: "#38bdf8"
  },
  {
    login: "tpain",
    name: "T-Pain",
    campusRole: "Club Director",
    category: "Music",
    title: "Music club: live production and chat requests",
    viewers: 44800,
    live: true,
    verified: true,
    tags: ["Club Director", "Music"],
    accent: "#FFC21A"
  },
  {
    login: "yonnajay",
    name: "YonnaJay",
    campusRole: "Club Director",
    category: "Just Chatting",
    title: "Campus club hangout and stream planning",
    viewers: 9100,
    live: true,
    tags: ["Club Director", "Hangout"],
    accent: "#f9a8d4"
  },
  {
    login: "markusking",
    name: "MarkusKing",
    campusRole: "Club Director",
    category: "Gaming",
    title: "Gaming club scrims and creator notes",
    viewers: 6800,
    live: true,
    tags: ["Club Director", "Gaming"],
    accent: "#34d399"
  },
  {
    login: "markellwashington1",
    name: "MarkellWashington1",
    campusRole: "Club Director",
    category: "IRL",
    title: "IRL club: hallway interviews and campus bits",
    viewers: 11200,
    live: true,
    tags: ["Club Director", "IRL"],
    accent: "#fde047"
  },
  {
    login: "nicknayersina",
    name: "NickNayersina",
    campusRole: "Club Director",
    category: "Just Chatting",
    title: "Content club: filming ideas that actually land",
    viewers: 16600,
    live: true,
    verified: true,
    tags: ["Club Director", "Content"],
    accent: "#60a5fa"
  },
  {
    login: "walton",
    name: "Walton",
    campusRole: "Campus Police",
    category: "Just Chatting",
    title: "Campus watch: keeping chat in line",
    viewers: 0,
    live: false,
    tags: ["Campus Police", "Offline"],
    accent: "#adadb8"
  },
  {
    login: "fanum",
    name: "Fanum",
    campusRole: "Campus Police",
    category: "Just Chatting",
    title: "Campus patrol: debriefing the day",
    viewers: 36600,
    live: true,
    verified: true,
    tags: ["Campus Police", "Just Chatting"],
    accent: "#FFE08A"
  },
  {
    login: "kelo",
    name: "Kelo",
    campusRole: "Janitor",
    category: "Streamer University",
    title: "Late shift: cleaning up the timeline",
    viewers: 0,
    live: false,
    tags: ["Janitor", "Offline"],
    accent: "#adadb8"
  },
  {
    login: "devontecenat",
    name: "DevonteCenat",
    campusRole: "Janitor",
    category: "Just Chatting",
    title: "After hours campus cleanup and chat",
    viewers: 0,
    live: false,
    tags: ["Janitor", "Offline"],
    accent: "#adadb8"
  },
  {
    login: "chrisnxtdoor",
    name: "ChrisNxtDoor",
    campusRole: "Janitor",
    category: "Just Chatting",
    title: "Campus cleanup crew: stories from the halls",
    viewers: 24100,
    live: true,
    verified: true,
    tags: ["Janitor", "Campus"],
    accent: "#f59e0b"
  },
  {
    login: "ijustlovepuzzles",
    name: "IJustLovePuzzles",
    campusRole: "Librarian",
    category: "Puzzles",
    title: "Quiet floor puzzle hour",
    viewers: 0,
    live: false,
    tags: ["Librarian", "Offline"],
    accent: "#adadb8"
  },
  {
    login: "yourragegaming",
    name: "YourRAGEGaming",
    campusRole: "Guidance Counselor",
    category: "Just Chatting",
    title: "Guidance office: stream advice and life check-ins",
    viewers: 57100,
    live: true,
    verified: true,
    tags: ["Guidance Counselor", "Advice"],
    accent: "#adadb8"
  }
];

const studentHandles = [
  "Suburbbaby",
  "wabewrld",
  "Paybae",
  "Yaboyywill",
  "OnlyLarryKing",
  "dopeboyoli",
  "ChakraShooter",
  "noemi",
  "Jaidabunni",
  "blazian",
  "KANELJOSEPH",
  "sierrasprague",
  "aozami",
  "s0pink",
  "madaichakell",
  "braeden",
  "FindJeremiah",
  "andrewuhrik",
  "Ezee",
  "itsshonyx",
  "Reemknocks",
  "ysabellagrace",
  "Bonita",
  "itsregtoofunny",
  "e11ysa",
  "rulaempire",
  "Sarahfarrugia",
  "jshock9nine",
  "Lacy",
  "lanializa",
  "MandooMillions",
  "Dreamdoll",
  "Therealnialovee",
  "cutegunz",
  "king68thegreat",
  "seleolu",
  "Yugi2x",
  "Malek_04",
  "crystalizaguirre",
  "madi2hottyy",
  "ynlgeo",
  "blasianbeautyalexis",
  "jasontheween",
  "kiiingjojo",
  "a2guapo",
  "ChrisGoneCrazyLive",
  "Carterefe",
  "flako",
  "coolitshawty",
  "sarasaffari",
  "wrldkailee",
  "fumibean",
  "Wardrobewinter",
  "pudgie16",
  "Plaqueboymax",
  "rizpyyt",
  "DCTHADESIGNER",
  "catrnado",
  "notquitelikedub",
  "Luhliv1",
  "raphaelsololive",
  "rawdogmoon",
  "Stableronaldo",
  "kierapleaze",
  "NotBilzo",
  "SUHMMIEE",
  "Jaymommy0",
  "shazdelicious",
  "Jadamalaytv",
  "iwantacinnamonroll",
  "theycallmeleii",
  "marlon",
  "Tatumbittick",
  "bonnie",
  "ftgioo",
  "LailasimoneTV",
  "2xceeej",
  "andrejmihelson",
  "aishahsofeyy",
  "Clarence_NYC",
  "Edwardkso",
  "AmberrTyson",
  "Davis",
  "Marlea",
  "stanleyymeng",
  "elinameng",
  "yusuf7n",
  "xscapeverse",
  "silky",
  "real_bigant26",
  "taylorjasminee",
  "AngelCrackedU",
  "damiilive",
  "Jordynlucas",
  "themightyba",
  "avazura",
  "ilikehaskell",
  "runiktvlive",
  "pittbully__",
  "myanicolelive",
  "Thesketchreal",
  "benjychavez_",
  "sukiimellow",
  "skaijackson",
  "mookie",
  "therealtianamusarra",
  "Flippenjosh",
  "KiCosmic",
  "queennaija",
  "therealmiyalive",
  "juicyjacob",
  "meesterkeem",
  "officedrummer",
  "iwastori",
  "Thatsdaveontv",
  "coolbutterflyyyy",
  "straight2thbank__",
  "Smokecertified",
  "Aikooofficial",
  "Mcqueen"
];

const studentCategories = [
  "Just Chatting",
  "Streamer University",
  "IRL",
  "Gaming",
  "Music",
  "Creative"
];

const studentAccents = [
  "#B20B32",
  "#00c8af",
  "#ff75e6",
  "#ffb000",
  "#7bdcff",
  "#fb7185"
];

// Campus members who stream somewhere other than Twitch, keyed by login
const studentPlatforms: Record<string, { platform: Platform; handle: string }> = {
  crystalizaguirre: { platform: "kick", handle: "crystalizaguirre" },
  flippenjosh: { platform: "kick", handle: "Flippenjosh" },
  blasianbeautyalexis: { platform: "tiktok", handle: "Blasianbeautyalexis" },
  jaidabunni: { platform: "youtube", handle: "@Jaidabunni" }
};

const channels: Channel[] = [
  ...facultySeeds.map((channel, index) => ({
    ...channel,
    role: "Faculty" as const,
    live: false,
    viewers: 0,
    accent: channel.accent ?? studentAccents[index % studentAccents.length],
    platform: "twitch" as const
  })),
  ...studentHandles.map((handle, index) => {
    const category = studentCategories[index % studentCategories.length];
    const platformInfo = studentPlatforms[handle.toLowerCase()];

    return {
      login: handle.toLowerCase(),
      name: handle,
      role: "Student" as const,
      campusRole: "Student",
      category,
      title: `${handle}'s Streamer University channel`,
      viewers: 0,
      live: false,
      tags: ["Student", category],
      accent: studentAccents[index % studentAccents.length],
      platform: platformInfo?.platform ?? ("twitch" as const),
      platformHandle: platformInfo?.handle
    };
  }),
  {
    login: "feelssunnyman",
    name: "FeelsSunnyMan",
    role: "Faculty",
    campusRole: "Moderator",
    category: "Just Chatting",
    title: "Campus stream commentary",
    viewers: 0,
    live: false,
    tags: ["Moderator", "Commentary"],
    accent: "#B20B32",
    platform: "twitch",
    multiviewOnly: true
  }
];

const publicChannels = channels.filter((channel) => !channel.multiviewOnly);

// Twitch's public box art CDN — stable category ids, no auth needed
const categoryBoxArt: Record<string, string> = {
  "Just Chatting": "https://static-cdn.jtvnw.net/ttv-boxart/509658-285x380.jpg",
  IRL: "https://static-cdn.jtvnw.net/ttv-boxart/509672-285x380.jpg",
  Music: "https://static-cdn.jtvnw.net/ttv-boxart/26936-285x380.jpg",
  Creative: "https://static-cdn.jtvnw.net/ttv-boxart/509660-285x380.jpg",
  Gaming: "/gaming-category-cover.png"
};

const excludedCategories = new Set(["Animals, Aquariums, and Zoos", "Sports", "Puzzles"]);

const formatViewers = (value: number) => {
  if (value === 0) return "Offline";
  if (value >= 1000) {
    const rounded = value / 1000;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}K`;
  }
  return String(value);
};

const getSpotlightChannels = (directory: Channel[]) => {
  const liveChannels = [...directory]
    .filter((channel) => channel.live)
    .sort((a, b) => b.viewers - a.viewers);
  const selected: Channel[] = [];
  const add = (channel?: Channel) => {
    if (channel && !selected.some((current) => current.login === channel.login)) {
      selected.push(channel);
    }
  };

  add(liveChannels.find((channel) => channel.role === "Faculty"));
  add(liveChannels.find((channel) => channel.role === "Student"));
  add(liveChannels.find((channel) => !selected.some((current) => current.campusRole === channel.campusRole)));

  // Give a currently live, mid-sized campus channel a place beside the biggest streams.
  add(liveChannels.slice(Math.floor(liveChannels.length / 2)).find(Boolean));

  liveChannels.forEach(add);
  return selected.slice(0, 5);
};

const campusSections = [
  "Dean",
  "Professor",
  "Club Director",
  "Campus Police",
  "Janitor",
  "Librarian",
  "Guidance Counselor",
  "Student"
];

const getSectionTitle = (section: string) => {
  if (section === "Dean") return "Dean";
  if (section === "Professor") return "Professors";
  if (section === "Campus Police") return "Campus Police";
  if (section === "Guidance Counselor") return "Guidance Counselor";
  if (section === "Student") return "Students";
  return `${section}s`;
};

const mergeChannelData = (channel: Channel, override?: Partial<Channel>): Channel => {
  const merged = { ...channel, ...override };

  return {
    ...merged,
    name: merged.name || channel.name,
    category: merged.category || channel.category,
    title: merged.title || channel.title,
    tags: merged.tags || channel.tags,
    avatar: merged.avatar || channel.avatar,
    thumbnail: merged.thumbnail || channel.thumbnail,
    offlineImage: merged.offlineImage || channel.offlineImage,
    broadcasterType: merged.broadcasterType || channel.broadcasterType
  };
};

const getInitials = (name: string) =>
  name
    .replace(/[_-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || name.slice(0, 2).toUpperCase();

// Browsers block autoplay with sound, so start muted — this lets the player
// begin immediately without the manual play click; viewers can unmute in-player.
const getWatchUrl = (login: string, parent: string, muted = true) =>
  `https://player.twitch.tv/?channel=${encodeURIComponent(login)}&parent=${encodeURIComponent(parent)}&autoplay=true&muted=${muted}`;

const getChatUrl = (login: string, parent: string) =>
  `https://www.twitch.tv/embed/${encodeURIComponent(login)}/chat?parent=${encodeURIComponent(parent)}&darkpopout`;

const platformLabels: Record<Platform, string> = {
  twitch: "Twitch",
  kick: "Kick",
  youtube: "YouTube",
  tiktok: "TikTok"
};

const getChannelPageUrl = (channel: Channel) => {
  if (channel.platform === "kick") return `https://kick.com/${channel.platformHandle}`;
  if (channel.platform === "youtube") return `https://www.youtube.com/${channel.platformHandle}`;
  if (channel.platform === "tiktok") return `https://www.tiktok.com/@${channel.platformHandle}`;
  return `https://www.twitch.tv/${channel.login}`;
};

const getChannelPageLabel = (channel: Channel) => {
  if (channel.platform === "kick") return `kick.com/${channel.platformHandle}`;
  if (channel.platform === "youtube") return `youtube.com/${channel.platformHandle}`;
  if (channel.platform === "tiktok") return `tiktok.com/@${channel.platformHandle}`;
  return `twitch.tv/${channel.login}`;
};

const getPlayerUrl = (channel: Channel, parent: string, muted = true) => {
  if (channel.platform === "kick") {
    return `https://player.kick.com/${channel.platformHandle}?autoplay=true&muted=${muted}`;
  }
  if (channel.platform === "youtube") {
    return channel.youtubeVideoId
      ? `https://www.youtube.com/embed/${channel.youtubeVideoId}?autoplay=1&mute=${muted ? 1 : 0}`
      : null;
  }
  if (channel.platform === "tiktok") return null;
  return getWatchUrl(channel.login, parent, muted);
};

const getChatEmbedUrl = (channel: Channel, parent: string) => {
  if (channel.platform === "kick") return `https://kick.com/popout/${channel.platformHandle}/chat`;
  if (channel.platform === "youtube") {
    return channel.youtubeVideoId
      ? `https://www.youtube.com/live_chat?v=${channel.youtubeVideoId}&embed_domain=${encodeURIComponent(parent)}`
      : null;
  }
  if (channel.platform === "tiktok") return null;
  return getChatUrl(channel.login, parent);
};

export function StreamerApp({ initialWatchLogin }: { initialWatchLogin?: string }) {
  const router = useRouter();
  const initialLogin = initialWatchLogin?.toLowerCase();
  const [activeLogin, setActiveLogin] = useState(initialLogin ?? publicChannels[0].login);
  const [watchLogin, setWatchLogin] = useState<string | null>(initialLogin ?? null);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileDirectoryOpen, setMobileDirectoryOpen] = useState(false);
  const [sideOpen, setSideOpen] = useState(true);
  const [embedParent, setEmbedParent] = useState("");
  const [filter, setFilter] = useState<"All" | "Faculty" | "Students">("All");
  const [isRosterFilterOpen, setIsRosterFilterOpen] = useState(false);
  const [liveOnly, setLiveOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [liveOverrides, setLiveOverrides] = useState<Record<string, Partial<Channel>>>({});
  const [gameArt, setGameArt] = useState<Record<string, string>>({});
  const [isDirectoryLoading, setIsDirectoryLoading] = useState(true);
  const [popularClips, setPopularClips] = useState<TwitchClip[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEmbedParent(window.location.hostname);
    }, 0);
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const syncSidebar = () => setSideOpen(!mobileQuery.matches);

    syncSidebar();
    mobileQuery.addEventListener("change", syncSidebar);

    return () => {
      window.clearTimeout(timer);
      mobileQuery.removeEventListener("change", syncSidebar);
    };
  }, []);

  useEffect(() => {
    if (isDirectoryLoading) return;

    let ignore = false;
    const users = publicChannels
      .filter((channel) => channel.platform === "twitch")
      .map((channel) => channel.login);

    fetch(`/api/twitch/clips?ranking=top-24h-live40-4h&users=${encodeURIComponent(users.join(","))}`)
      .then((response) =>
        response.json() as Promise<{
          clips?: TwitchClip[];
        }>
      )
      .then((payload) => {
        if (!ignore) {
          const rankedClips = [...(payload.clips ?? [])].sort(
            (a, b) =>
              b.view_count - a.view_count ||
              new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
          setPopularClips(rankedClips);
        }
      })
      .catch(() => {
        if (!ignore) setPopularClips([]);
      });

    return () => {
      ignore = true;
    };
  }, [isDirectoryLoading]);

  useEffect(() => {
    const twitchUsers = publicChannels
      .filter((channel) => channel.platform === "twitch")
      .map((channel) => channel.login);
    const kickSlugs = publicChannels
      .filter((channel) => channel.platform === "kick" && channel.platformHandle)
      .map((channel) => channel.platformHandle as string);
    const youtubeHandles = publicChannels
      .filter((channel) => channel.platform === "youtube" && channel.platformHandle)
      .map((channel) => channel.platformHandle as string);
    let ignore = false;

    const twitchRequest = fetch(
      `/api/twitch/live?users=${encodeURIComponent(twitchUsers.join(","))}`
    ).then(
      (response) =>
        response.json() as Promise<{
          configured?: boolean;
          streams?: TwitchStream[];
          users?: TwitchUser[];
          games?: TwitchGame[];
          error?: string;
        }>
    );
    const kickRequest: Promise<{ channels?: KickChannelStatus[] } | null> = kickSlugs.length
      ? fetch(`/api/kick/live?slugs=${encodeURIComponent(kickSlugs.join(","))}`)
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null)
      : Promise.resolve(null);
    const youtubeRequest: Promise<{ channels?: YoutubeChannelStatus[] } | null> = youtubeHandles.length
      ? fetch(`/api/youtube/live?handles=${encodeURIComponent(youtubeHandles.join(","))}`)
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null)
      : Promise.resolve(null);

    Promise.all([twitchRequest, kickRequest, youtubeRequest])
      .then(([twitchPayload, kickPayload, youtubePayload]) => {
        if (ignore || !twitchPayload.configured || twitchPayload.error) return;
        const nextOverrides = publicChannels.reduce<Record<string, Partial<Channel>>>((acc, channel) => {
          acc[channel.login] = {
            live: false,
            viewers: 0
          };
          return acc;
        }, {});

        (twitchPayload.users ?? []).forEach((user) => {
          const login = user.login?.toLowerCase();
          if (!login) return;
          nextOverrides[login] = {
            ...nextOverrides[login],
            name: user.display_name || undefined,
            avatar: user.profile_image_url || undefined,
            thumbnail: user.offline_image_url || undefined,
            offlineImage: user.offline_image_url || undefined,
            broadcasterType: user.broadcaster_type || undefined,
            verified: user.broadcaster_type === "partner"
          };
        });

        (twitchPayload.streams ?? []).forEach((stream) => {
          const login = stream.user_login?.toLowerCase();
          if (!login) return;
          nextOverrides[login] = {
            ...nextOverrides[login],
            live: true,
            viewers: stream.viewer_count ?? 0,
            category: stream.game_name || undefined,
            title: stream.title || undefined,
            thumbnail: stream.thumbnail_url?.replace("{width}", "1100").replace("{height}", "620")
          };
        });

        const nextArt: Record<string, string> = {};
        (twitchPayload.games ?? []).forEach((game) => {
          if (game.name && game.box_art_url) {
            nextArt[game.name] = game.box_art_url
              .replace("{width}", "285")
              .replace("{height}", "380");
          }
        });

        (kickPayload?.channels ?? []).forEach((kickChannel) => {
          const channel = publicChannels.find(
            (candidate) =>
              candidate.platform === "kick" &&
              candidate.platformHandle?.toLowerCase() === kickChannel.slug?.toLowerCase()
          );
          if (!channel) return;
          nextOverrides[channel.login] = {
            ...nextOverrides[channel.login],
            live: Boolean(kickChannel.isLive),
            viewers: kickChannel.viewers ?? 0,
            title: kickChannel.title || undefined,
            category: kickChannel.category || undefined,
            thumbnail: kickChannel.thumbnail || undefined
          };
        });

        (youtubePayload?.channels ?? []).forEach((youtubeChannel) => {
          const channel = publicChannels.find(
            (candidate) =>
              candidate.platform === "youtube" &&
              candidate.platformHandle?.toLowerCase() === youtubeChannel.handle?.toLowerCase()
          );
          if (!channel) return;
          nextOverrides[channel.login] = {
            ...nextOverrides[channel.login],
            live: Boolean(youtubeChannel.isLive),
            viewers: youtubeChannel.viewers ?? 0,
            title: youtubeChannel.title || undefined,
            thumbnail: youtubeChannel.thumbnail || undefined,
            youtubeVideoId: youtubeChannel.videoId || undefined
          };
        });

        setGameArt(nextArt);
        setLiveOverrides(nextOverrides);
      })
      .catch(() => {
        setLiveOverrides({});
      })
      .finally(() => {
        if (!ignore) setIsDirectoryLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const twitchUsers = publicChannels
      .filter((channel) => channel.platform === "twitch")
      .map((channel) => channel.login);
    const liveUrl = `/api/twitch/live?users=${encodeURIComponent(twitchUsers.join(","))}`;
    let ignore = false;
    let lastRefresh = Date.now();

    const refreshTwitchCounts = async () => {
      if (document.visibilityState !== "visible" || Date.now() - lastRefresh < 60_000) return;
      lastRefresh = Date.now();

      try {
        const response = await fetch(liveUrl);
        if (!response.ok) return;

        const payload = (await response.json()) as {
          configured?: boolean;
          streams?: TwitchStream[];
          error?: string;
        };
        if (ignore || !payload.configured || payload.error) return;

        const streams = new Map(
          (payload.streams ?? []).map((stream) => [stream.user_login.toLowerCase(), stream])
        );

        setLiveOverrides((current) => {
          const next = { ...current };

          twitchUsers.forEach((login) => {
            const stream = streams.get(login);
            next[login] = {
              ...current[login],
              live: Boolean(stream),
              viewers: stream?.viewer_count ?? 0,
              category: stream?.game_name || current[login]?.category,
              title: stream?.title || current[login]?.title,
              thumbnail:
                stream?.thumbnail_url?.replace("{width}", "1100").replace("{height}", "620") ||
                current[login]?.thumbnail
            };
          });

          return next;
        });
      } catch {
        // Keep the last known values if a background refresh fails.
      }
    };

    const timer = window.setInterval(refreshTwitchCounts, 60_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshTwitchCounts();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      ignore = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const mergedChannels = useMemo(
    () =>
      publicChannels.map((channel) => {
        const merged = mergeChannelData(channel, liveOverrides[channel.login]);

        return {
          ...merged,
          tags: merged.live ? merged.tags.filter((tag) => tag !== "Offline") : merged.tags
        };
      }),
    [liveOverrides]
  );

  const openChannel = (login: string) => {
    // TikTok has no embeddable live player — send viewers straight to the profile
    const channel = mergedChannels.find((candidate) => candidate.login === login);
    if (channel?.platform === "tiktok") {
      window.open(getChannelPageUrl(channel), "_blank", "noopener");
      return;
    }
    setMobileDirectoryOpen(false);
    setActiveLogin(login);
    setWatchLogin(login);
    router.push(`/${login}`);
  };

  const browseHome = () => {
    setMobileDirectoryOpen(false);
    setWatchLogin(null);
    setCategoryFilter(null);
    router.push("/");
  };

  const openCategory = (name: string) => {
    setCategoryFilter(name);
    setWatchLogin(null);
    router.push("/");
    window.scrollTo({ top: 0 });
  };

  const categoryStats = useMemo(() => {
    const stats = new Map<string, { viewers: number; liveCount: number; total: number }>();

    mergedChannels.forEach((channel) => {
      if (!channel.category) return;
      const current = stats.get(channel.category) ?? { viewers: 0, liveCount: 0, total: 0 };
      current.total += 1;
      if (channel.live) {
        current.viewers += channel.viewers;
        current.liveCount += 1;
      }
      stats.set(channel.category, current);
    });

    return [...stats.entries()]
      .map(([name, stat]) => ({ name, ...stat }))
      .sort((a, b) => b.viewers - a.viewers || b.total - a.total);
  }, [mergedChannels]);

  // Search suggests channels in a dropdown instead of filtering the page
  const visibleChannels = mergedChannels;

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return mergedChannels
      .filter(
        (channel) =>
          [channel.login, channel.name, channel.campusRole, channel.category, channel.title].some(
            (value) => Boolean(value?.toLowerCase().includes(normalized))
          )
      )
      .sort((a, b) => Number(b.live) - Number(a.live) || b.viewers - a.viewers)
      .slice(0, 8);
  }, [mergedChannels, query]);

  const sidebarChannels = useMemo(
    () =>
      mergedChannels.filter((channel) => {
        const roleMatch =
          filter === "All" ||
          (filter === "Faculty" && channel.role === "Faculty") ||
          (filter === "Students" && channel.role === "Student");
        return roleMatch && (!liveOnly || channel.live);
      }),
    [filter, liveOnly, mergedChannels]
  );

  const sidebarSections = useMemo(() => {
    const roleSections =
      filter === "All"
        ? campusSections
        : filter === "Faculty"
          ? campusSections.filter((section) => section !== "Student")
          : ["Student"];
    return roleSections.filter((section) => sidebarChannels.some((channel) => channel.campusRole === section));
  }, [filter, sidebarChannels]);

  // Only surface categories someone on campus is actually streaming right now
  const displayCategories = categoryStats.filter(
    (category) => !excludedCategories.has(category.name) && category.liveCount > 0
  );

  const activeChannel =
    mergedChannels.find((channel) => channel.login === activeLogin) ?? mergedChannels[0];
  const watchChannel =
    mergedChannels.find((channel) => channel.login === watchLogin) ?? null;
  const liveChannels = visibleChannels.filter((channel) => channel.live);
  const campusLiveCount = mergedChannels.filter((channel) => channel.live).length;
  const campusViewers = mergedChannels.reduce(
    (sum, channel) => sum + (channel.live ? channel.viewers : 0),
    0
  );
  const spotlightChannels = useMemo(() => getSpotlightChannels(mergedChannels), [mergedChannels]);
  const currentSpotlightIndex =
    spotlightChannels.length > 0 ? featuredIndex % spotlightChannels.length : 0;
  const featuredChannel = spotlightChannels[currentSpotlightIndex] ?? activeChannel;
  const previousSpotlight =
    spotlightChannels.length > 1
      ? spotlightChannels[
          (currentSpotlightIndex - 1 + spotlightChannels.length) % spotlightChannels.length
        ]
      : null;
  const nextSpotlight =
    spotlightChannels.length > 1
      ? spotlightChannels[(currentSpotlightIndex + 1) % spotlightChannels.length]
      : null;

  useEffect(() => {
    if (initialLogin || spotlightChannels.length < 2) return;

    const timer = window.setInterval(() => {
      setFeaturedIndex((current) => (current + 1) % spotlightChannels.length);
    }, 25_000);

    return () => window.clearInterval(timer);
  }, [initialLogin, spotlightChannels.length]);

  const selectDirectoryFilter = (nextFilter: "All" | "Faculty" | "Students") => {
    setFilter(nextFilter);
    setIsRosterFilterOpen(false);
    setCategoryFilter(null);
    setWatchLogin(null);
    router.push("/");

    window.requestAnimationFrame(() => {
      if (nextFilter === "All") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      document
        .getElementById(nextFilter === "Faculty" ? "faculty-directory" : "student-directory")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const moveFeatured = (direction: number) => {
    if (spotlightChannels.length < 2) return;
    const nextIndex =
      (currentSpotlightIndex + direction + spotlightChannels.length) % spotlightChannels.length;
    setFeaturedIndex(nextIndex);
    setActiveLogin(spotlightChannels[nextIndex].login);
  };

  if (isDirectoryLoading) {
    return <DirectoryLoading />;
  }

  return (
    <main className="min-h-screen bg-[#0e0e10] text-[#efeff1]">
      <header className={`fixed inset-x-0 top-0 z-40 h-[50px] items-center gap-1 border-b border-[#2f2f35] bg-[#18181b] pl-2 pr-3 shadow-[0_1px_2px_rgba(0,0,0,0.6)] ${watchChannel ? "hidden md:flex" : "flex"}`}>
        <button
          onClick={browseHome}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] hover:bg-[#26262c]"
          aria-label="Streamer University home"
        >
          <img src="/su-crest-2026-transparent.png" alt="" className="h-8 w-8 object-contain" />
        </button>
        <button onClick={browseHome} className="hidden h-full px-4 text-[15px] font-semibold text-white hover:text-gold sm:block">
          Following
        </button>
        <button onClick={browseHome} className="hidden h-full px-4 text-[15px] font-semibold text-white hover:text-gold sm:block">
          Browse
        </button>
        <button className="hidden h-8 w-8 items-center justify-center rounded-[4px] hover:bg-[#2f2f35] md:flex" aria-label="More">
          <KebabIcon />
        </button>
        <div className="relative mx-auto w-[62vw] max-w-[300px] md:w-full md:max-w-[540px]">
          <label className="flex h-9 w-full overflow-hidden rounded-[6px] border border-[#67676b] bg-[#18181b] focus-within:border-burgundy focus-within:bg-[#0e0e10]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && searchResults.length) {
                  openChannel(searchResults[0].login);
                  setQuery("");
                  event.currentTarget.blur();
                } else if (event.key === "Escape") {
                  event.currentTarget.blur();
                }
              }}
              className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-[#adadb8]"
              placeholder="Search"
              type="search"
            />
            <span className="flex w-10 items-center justify-center rounded-r-[6px] bg-[#2f2f35] text-[#dedee3] md:w-11" aria-hidden="true">
              <SearchIcon className="h-5 w-5" />
            </span>
          </label>
          {searchFocused && query.trim().length > 0 && (
            <div className="absolute inset-x-0 top-full z-50 mt-1.5 overflow-hidden rounded-[6px] bg-[#1f1f23] shadow-[0_8px_24px_rgba(0,0,0,0.6)]">
              {searchResults.length ? (
                searchResults.map((channel) => (
                  <button
                    key={channel.login}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      openChannel(channel.login);
                      setQuery("");
                      setSearchFocused(false);
                    }}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left hover:bg-[#26262c]"
                  >
                    <Avatar channel={channel} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold text-white">{channel.name}</span>
                      <span className="block truncate text-[12px] text-[#adadb8]">
                        {channel.campusRole} · {channel.category}
                      </span>
                    </span>
                    {channel.live ? (
                      <span className="flex shrink-0 items-center gap-1.5 text-[13px] text-[#dedee3]">
                        <span className="h-2 w-2 rounded-full bg-[#eb0400]" />
                        {formatViewers(channel.viewers)}
                      </span>
                    ) : (
                      <span className="shrink-0 text-[13px] text-[#adadb8]">Offline</span>
                    )}
                  </button>
                ))
              ) : (
                <p className="px-3 py-3 text-[13px] text-[#adadb8]">No campus channels found</p>
              )}
            </div>
          )}
        </div>
        <div className="hidden items-center gap-1.5 lg:flex">
          <button className="relative grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#2f2f35]" aria-label="Activity feed">
            <TrayIcon />
            <span className="absolute -top-1 left-4 rounded-full bg-burgundy px-1 text-[11px] font-bold leading-4 text-white">
              67
            </span>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#2f2f35]" aria-label="Whispers">
            <BubbleIcon />
          </button>
          <button className="relative grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#2f2f35]" aria-label="Notifications">
            <BellIcon />
            <span className="absolute right-1 top-0.5 h-2 w-2 rounded-full bg-gold" />
          </button>
        </div>
        <Link
          href="/multiview"
          className="su-primary hidden h-8 items-center gap-2 rounded-[4px] px-3.5 text-[13px] font-bold text-white lg:ml-2 lg:flex"
        >
          <MultiviewIcon className="h-4 w-4" />
          Enter a Lecture Hall
        </Link>
        <a
          href="https://shop.streameruniversity.com"
          target="_blank"
          rel="noreferrer"
          className="mx-1 hidden h-8 items-center gap-2 rounded-[999px] bg-[#2f2f35] px-4 text-[13px] font-bold hover:bg-[#3b3b44] md:flex"
        >
          Buy Merch
        </a>
        <a
          href="https://x.com/daiviksiddhi"
          target="_blank"
          rel="noreferrer"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-burgundy text-white hover:bg-wine"
          aria-label="X profile"
        >
          <PersonIcon className="h-5 w-5" />
        </a>
      </header>

      <div className={`flex ${watchChannel ? "md:pt-[50px]" : "pt-[50px]"}`}>
        <aside
          className={`fixed bottom-0 left-0 top-[50px] z-30 hidden border-r border-[#2f2f35] bg-[#1f1f23] transition-all duration-200 md:block ${
            sideOpen ? (watchChannel ? "w-[240px]" : "w-[286px]") : "w-[58px]"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex h-12 items-center justify-between px-3">
              {sideOpen && <h2 className="text-[17px] font-bold">For You</h2>}
              <button
                className="grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#34343b]"
                onClick={() => setSideOpen((current) => !current)}
                aria-label="Toggle sidebar"
              >
                <CollapseIcon flipped={!sideOpen} />
              </button>
            </div>
            {sideOpen && (
              <div className="relative mx-2 mb-2 flex gap-1.5 text-[14px] font-bold">
                <div className="relative min-w-0 flex-1">
                  <button
                    onClick={() => setIsRosterFilterOpen((current) => !current)}
                    className={`flex h-9 w-full items-center justify-between rounded-[4px] border border-burgundy bg-[#2a171d] px-3 text-white transition hover:bg-[#321a22] ${
                      isRosterFilterOpen ? "text-white" : ""
                    }`}
                    aria-label="Choose roster group"
                    aria-expanded={isRosterFilterOpen}
                  >
                    <span>{filter}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform ${isRosterFilterOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isRosterFilterOpen && (
                    <div className="absolute inset-x-0 top-[calc(100%+4px)] z-20 overflow-hidden rounded-[4px] border border-[#34343b] bg-[#18181b] shadow-[0_8px_18px_rgba(0,0,0,0.45)]">
                      {(["All", "Faculty", "Students"] as const).map((item) => (
                        <button
                          key={item}
                          onClick={() => selectDirectoryFilter(item)}
                          className={`flex h-9 w-full items-center px-3 text-left transition hover:bg-[#2f2f35] ${
                            filter === item ? "bg-burgundy text-white" : "text-[#dedee3]"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setLiveOnly((current) => !current)}
                  className={`h-9 shrink-0 rounded-[4px] px-3 transition ${
                    liveOnly ? "su-primary text-white" : "bg-[#111114] text-[#dedee3] hover:bg-[#18181b]"
                  }`}
                  aria-pressed={liveOnly}
                >
                  Live Now
                </button>
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto pb-2">
              {sidebarSections.map((section) => (
                <SidebarSection
                  key={section}
                  collapsed={!sideOpen}
                  title={getSectionTitle(section)}
                  channels={sidebarChannels.filter((channel) => channel.campusRole === section)}
                  activeLogin={activeLogin}
                  onSelect={openChannel}
                />
              ))}
              {sideOpen && sidebarSections.length === 0 && (
                <p className="px-3 py-6 text-center text-[13px] text-[#adadb8]">No campus channels are live right now.</p>
              )}
              {sideOpen && filter === "All" && !liveOnly && (
                <SidebarCategories
                  categories={displayCategories.filter((category) => category.liveCount > 0).slice(0, 6)}
                  art={gameArt}
                  onSelect={openCategory}
                />
              )}
            </div>
          </div>
        </aside>

        <section className={`ml-0 min-w-0 flex-1 transition-[margin] duration-200 ${!watchChannel ? "pb-[58px] md:pb-0" : ""} ${sideOpen ? (watchChannel ? "md:ml-[240px]" : "md:ml-[286px]") : "md:ml-[58px]"}`}>
          {watchChannel ? (
            <WatchStage channel={watchChannel} parent={embedParent} onCategory={openCategory} onBack={browseHome} />
          ) : (
          <div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-6">
            {categoryFilter ? (
              <CategoryView
                name={categoryFilter}
                art={gameArt[categoryFilter]}
                channels={mergedChannels.filter((channel) => channel.category === categoryFilter)}
                activeLogin={activeLogin}
                onSelect={openChannel}
                onClear={browseHome}
              />
            ) : (
            <>
            {campusLiveCount > 0 && (
              <div className="mb-5 flex items-center justify-center gap-2 text-[13px] text-[#adadb8]">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-live" />
                </span>
                <span>
                  <span className="font-semibold text-white">{campusLiveCount}</span> live on campus
                </span>
                <span className="text-[#3b3b44]">·</span>
                <span>
                  <span className="font-semibold text-white">
                    {campusViewers > 0 ? formatViewers(campusViewers) : "0"}
                  </span>{" "}
                  watching right now
                </span>
              </div>
            )}
            <section className="relative mb-8 hidden min-h-[292px] overflow-hidden md:block xl:min-h-[390px]">
              <button
                onClick={() => moveFeatured(-1)}
                className="absolute left-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-[4px] hover:bg-[#2f2f35] lg:grid"
                aria-label="Previous featured channel"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => moveFeatured(1)}
                className="absolute right-0 top-1/2 z-30 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-[4px] hover:bg-[#2f2f35] lg:grid"
                aria-label="Next featured channel"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
              <div className="relative mx-auto max-w-[1260px] xl:h-[390px]">
                {previousSpotlight && (
                  <button
                    onClick={() => moveFeatured(-1)}
                    className="absolute left-0 top-1/2 z-0 hidden h-[278px] w-[360px] -translate-y-1/2 overflow-hidden bg-black text-left opacity-55 shadow-[0_8px_22px_rgba(0,0,0,0.5)] transition hover:opacity-80 xl:block"
                    aria-label={`Show ${previousSpotlight.name}`}
                  >
                    <StreamThumbnail channel={previousSpotlight} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/35" />
                  </button>
                )}
                {nextSpotlight && (
                  <button
                    onClick={() => moveFeatured(1)}
                    className="absolute right-0 top-1/2 z-0 hidden h-[278px] w-[360px] -translate-y-1/2 overflow-hidden bg-black text-left opacity-55 shadow-[0_8px_22px_rgba(0,0,0,0.5)] transition hover:opacity-80 xl:block"
                    aria-label={`Show ${nextSpotlight.name}`}
                  >
                    <StreamThumbnail channel={nextSpotlight} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/35" />
                  </button>
                )}
                <div className="relative z-10 mx-auto grid max-w-[980px] grid-cols-1 bg-[#18181b] shadow-[0_12px_35px_rgba(0,0,0,0.45)] xl:w-[calc(100%-128px)] lg:grid-cols-[minmax(0,1fr)_292px]">
                  <button
                    onClick={() => openChannel(featuredChannel.login)}
                    className="group relative aspect-video min-h-[220px] overflow-hidden bg-black text-left"
                  >
                    <StreamThumbnail channel={featuredChannel} className="transition duration-300 group-hover:scale-[1.02]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />
                    {featuredChannel.live && <span className="absolute left-3 top-3 rounded-[3px] bg-live px-2 py-1 text-[13px] font-black">LIVE</span>}
                    <div className="absolute bottom-3 left-3 rounded-[3px] bg-black/65 px-2 py-1 text-[15px] font-semibold">
                      {featuredChannel.live ? `${formatViewers(featuredChannel.viewers)} viewers` : "Offline"}
                    </div>
                  </button>
                  <div className="flex min-h-[220px] flex-col p-4">
                    <div className="flex gap-3">
                      <Avatar channel={featuredChannel} size="lg" />
                      <div className="min-w-0">
                        <button className="truncate text-left text-[18px] font-bold text-white hover:text-gold hover:underline">
                          {featuredChannel.name}
                        </button>
                        <p className="truncate text-[15px] text-white">{featuredChannel.category}</p>
                        <p className="truncate text-[14px] text-gold-soft">{featuredChannel.campusRole}</p>
                        <p className="text-[14px] text-[#dedee3]">
                          {featuredChannel.live ? `${formatViewers(featuredChannel.viewers)} viewers` : "Offline"}
                        </p>
                      </div>
                    </div>
                    <p className="mt-4 line-clamp-3 text-[14px] leading-snug text-[#efeff1]">{featuredChannel.title}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {featuredChannel.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-[#2f2f35] px-2 py-1 text-[12px] font-bold text-[#dedee3]">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-auto flex gap-2 pt-5">
                      <button
                        onClick={() => openChannel(featuredChannel.login)}
                        className="su-primary h-9 flex-1 rounded-[4px] px-3 text-[14px] font-bold text-white"
                      >
                        Watch
                      </button>
                      <button className="h-9 rounded-[4px] bg-[#2f2f35] px-3 text-[14px] font-bold hover:bg-[#3b3b44]">
                        Follow
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <ChannelShelf
              className="md:hidden"
              title="Popular on campus"
              accent="the hottest streams right now"
              channels={[...liveChannels].sort((a, b) => b.viewers - a.viewers).slice(0, 24)}
              activeLogin={activeLogin}
              onSelect={openChannel}
              initialCount={6}
              emptyMessage="No channels are live right now. Check back at 3 PM ET when Streamer University starts."
            />

            <ChannelShelf
              className="hidden md:block"
              title="Popular on campus"
              accent="the hottest streams right now"
              channels={[
                ...(liveChannels.length > 1
                  ? liveChannels.filter((channel) => channel.login !== featuredChannel.login)
                  : liveChannels)
              ]
                .sort((a, b) => b.viewers - a.viewers)
                .slice(0, 24)}
              activeLogin={activeLogin}
              onSelect={openChannel}
              initialCount={6}
              emptyMessage="No channels are live right now. Check back at 3 PM ET when Streamer University starts."
            />

            <CatchUpShelf clips={popularClips} channels={mergedChannels} />

            <CategoryShelf categories={displayCategories} art={gameArt} onSelect={openCategory} />

            <ChannelShelf
              title="Rising on campus"
              accent="freshmen who deserve some love"
              channels={[...liveChannels]
                .filter((channel) => channel.viewers > 0)
                .sort((a, b) => a.viewers - b.viewers)
                .slice(0, 24)}
              activeLogin={activeLogin}
              onSelect={openChannel}
              initialCount={6}
              emptyMessage="No channels are live right now. Check back at 3 PM ET when Streamer University starts."
            />

            <ChannelShelf
              id="faculty-directory"
              title="Faculty"
              accent="deans, professors & campus staff"
              channels={[...visibleChannels]
                .filter((channel) => channel.role === "Faculty")
                .sort((a, b) => Number(b.live) - Number(a.live) || b.viewers - a.viewers)}
              activeLogin={activeLogin}
              onSelect={openChannel}
              initialCount={12}
            />

            <ChannelShelf
              id="student-directory"
              title="Student body"
              accent="the class of 2026"
              channels={[...visibleChannels]
                .filter((channel) => channel.role === "Student")
                .sort((a, b) => Number(b.live) - Number(a.live) || b.viewers - a.viewers)}
              activeLogin={activeLogin}
              onSelect={openChannel}
              initialCount={12}
            />
            </>
            )}
          </div>
          )}
          <div className={watchChannel ? "hidden md:block" : ""}>
            <Footer />
          </div>
        </section>
      </div>

      {!watchChannel && (
        <>
          <MobileDirectory
            open={mobileDirectoryOpen}
            filter={filter}
            liveOnly={liveOnly}
            sections={sidebarSections}
            channels={sidebarChannels}
            categories={categoryStats.filter((category) => !excludedCategories.has(category.name))}
            art={gameArt}
            activeLogin={activeLogin}
            onFilter={setFilter}
            onLiveOnly={() => setLiveOnly((current) => !current)}
            onSelectChannel={openChannel}
            onSelectCategory={(name) => {
              setMobileDirectoryOpen(false);
              openCategory(name);
            }}
          />
          <MobileBottomNav
            directoryOpen={mobileDirectoryOpen}
            onHome={browseHome}
            onDirectory={() => setMobileDirectoryOpen((current) => !current)}
          />
        </>
      )}
    </main>
  );
}

function DirectoryLoading() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#0e0e10] px-6 text-[#efeff1]">
      <div className="flex flex-col items-center">
        <img
          src="/su-crest-2026-transparent.png"
          alt="Streamer University"
          className="h-16 w-16 object-contain"
        />
        <span
          className="mt-5 h-7 w-7 animate-spin rounded-full border-[3px] border-[#3b3b44] border-t-gold"
          aria-hidden="true"
        />
        <p className="mt-4 text-[15px] font-semibold text-[#dedee3]">Loading campus streams</p>
      </div>
    </main>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#2f2f35] px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[1680px]">
        <div className="flex items-center gap-2">
          <img src="/su-crest-2026-transparent.png" alt="" className="h-6 w-6 object-contain" />
          <span className="text-[13px] font-bold text-white">Streamer University Portal</span>
          <span className="rounded-full bg-[#2f2f35] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-[#adadb8]">
            Unofficial · Fan-made
          </span>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#adadb8]">
          This is an unofficial, fan-made directory. It is not affiliated with, endorsed by, or
          operated by Streamer University, Kai Cenat, Amazon, or Twitch. All streams, chat, avatars,
          and category art are served directly from Twitch through their official public API and
          embed players — this site is only a shortcut to find campus channels in one place.
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-[#adadb8]">
          <span className="font-semibold text-[#dedee3]">Your privacy:</span> we do not run accounts,
          collect personal information, set our own tracking cookies, or store any data about you.
          Following, subscribing, and chatting all happen on Twitch under Twitch&apos;s own{" "}
          <a
            href="https://www.twitch.tv/p/legal/privacy-notice/"
            target="_blank"
            rel="noreferrer"
            className="text-[#adadb8] hover:text-white hover:underline"
          >
            Privacy Notice
          </a>
          . Anonymous, aggregate page-view counts are collected via Vercel Analytics to gauge
          traffic; these contain no personally identifiable information.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-[#adadb8]">
          <a
            href="https://dev.twitch.tv/docs/api/"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white hover:underline"
          >
            Powered by the Twitch API
          </a>
          <a
            href="https://shop.streameruniversity.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white hover:underline"
          >
            Buy Merch
          </a>
          <span>© {new Date().getFullYear()} — a fan project</span>
        </div>
      </div>
    </footer>
  );
}

function MobileBottomNav({
  directoryOpen,
  onHome,
  onDirectory
}: {
  directoryOpen: boolean;
  onHome: () => void;
  onDirectory: () => void;
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 grid h-[58px] grid-cols-2 border-t border-[#34343b] bg-[#18181b] md:hidden" aria-label="Mobile navigation">
      <button
        onClick={onHome}
        className={`flex flex-col items-center justify-center gap-0.5 border-t-2 text-[11px] font-semibold ${
          !directoryOpen ? "border-burgundy text-white" : "border-transparent text-[#adadb8]"
        }`}
        aria-current={!directoryOpen ? "page" : undefined}
      >
        <HomeIcon className="h-5 w-5" />
        Home
      </button>
      <button
        onClick={onDirectory}
        className={`flex flex-col items-center justify-center gap-0.5 border-t-2 text-[11px] font-semibold ${
          directoryOpen ? "border-burgundy text-white" : "border-transparent text-[#adadb8]"
        }`}
        aria-expanded={directoryOpen}
      >
        <DirectoryIcon className="h-5 w-5" />
        Directory
      </button>
    </nav>
  );
}

function MobileDirectory({
  open,
  filter,
  liveOnly,
  sections,
  channels: directoryChannels,
  categories,
  art,
  activeLogin,
  onFilter,
  onLiveOnly,
  onSelectChannel,
  onSelectCategory
}: {
  open: boolean;
  filter: "All" | "Faculty" | "Students";
  liveOnly: boolean;
  sections: string[];
  channels: Channel[];
  categories: CategoryStat[];
  art: Record<string, string>;
  activeLogin: string;
  onFilter: (filter: "All" | "Faculty" | "Students") => void;
  onLiveOnly: () => void;
  onSelectChannel: (login: string) => void;
  onSelectCategory: (name: string) => void;
}) {
  if (!open) return null;

  return (
    <section className="fixed inset-x-0 bottom-[58px] top-[50px] z-40 overflow-y-auto bg-[#1f1f23] md:hidden" aria-label="Campus directory">
      <div className="sticky top-0 z-10 border-b border-[#34343b] bg-[#1f1f23] px-3 pb-3 pt-3">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-bold text-white">Campus directory</h1>
          <span className="text-[12px] text-[#adadb8]">{directoryChannels.length} channels</span>
        </div>
        <div className="mt-3 grid grid-cols-[1fr_auto] gap-2">
          <div className="grid grid-cols-3 overflow-hidden rounded-[4px] bg-[#111114] p-1">
            {(["All", "Faculty", "Students"] as const).map((item) => (
              <button
                key={item}
                onClick={() => onFilter(item)}
                className={`h-8 rounded-[3px] text-[12px] font-semibold ${
                  filter === item ? "bg-burgundy text-white" : "text-[#adadb8] hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={onLiveOnly}
            className={`h-10 rounded-[4px] px-3 text-[12px] font-semibold ${
              liveOnly ? "su-primary text-white" : "bg-[#111114] text-[#dedee3]"
            }`}
            aria-pressed={liveOnly}
          >
            Live now
          </button>
        </div>
      </div>

      {filter === "All" && !liveOnly && categories.length > 0 && (
        <div className="border-b border-[#34343b] py-3">
          <h2 className="px-3 pb-2 text-[13px] font-bold uppercase text-[#adadb8]">Categories</h2>
          <div className="flex gap-2 overflow-x-auto px-3 pb-1 [scrollbar-width:none]">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => onSelectCategory(category.name)}
                className="flex w-[118px] shrink-0 items-center gap-2 rounded-[4px] bg-[#18181b] p-2 text-left hover:bg-[#26262c]"
              >
                <span className="h-12 w-9 shrink-0 overflow-hidden rounded-[2px]">
                  <CategoryArt name={category.name} src={art[category.name]} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold text-white">{category.name}</span>
                  <span className="block text-[11px] text-[#adadb8]">
                    {category.liveCount > 0 ? `${category.liveCount} live` : `${category.total} channels`}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="py-2">
        {sections.map((section) => (
          <SidebarSection
            key={section}
            collapsed={false}
            title={getSectionTitle(section)}
            channels={directoryChannels.filter((channel) => channel.campusRole === section)}
            activeLogin={activeLogin}
            onSelect={onSelectChannel}
          />
        ))}
        {sections.length === 0 && (
          <p className="px-4 py-12 text-center text-[13px] text-[#adadb8]">No campus channels match these filters.</p>
        )}
      </div>
    </section>
  );
}

export default function Home() {
  return <StreamerApp />;
}

type MultiviewLayout = "Focus" | "Grid" | "Wide";
const maxMultiviewChannels = 6;

export function MultiviewApp({ initialLogins = [] }: { initialLogins?: string[] }) {
  const router = useRouter();
  const [liveOverrides, setLiveOverrides] = useState<Record<string, Partial<Channel>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [embedParent, setEmbedParent] = useState("");
  const [layout, setLayout] = useState<MultiviewLayout>("Focus");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedLogins, setSelectedLogins] = useState(() =>
    Array.from(new Set(initialLogins.map((login) => login.toLowerCase())))
      .filter((login) =>
        channels.some((channel) => channel.login === login && channel.platform === "twitch")
      )
      .slice(0, maxMultiviewChannels)
  );
  const [activeChatLogin, setActiveChatLogin] = useState(() => initialLogins[0]?.toLowerCase() ?? "");
  const [audioLogin, setAudioLogin] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setEmbedParent(window.location.hostname), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const twitchUsers = channels
      .filter((channel) => channel.platform === "twitch")
      .map((channel) => channel.login);
    let ignore = false;

    fetch(`/api/twitch/live?users=${encodeURIComponent(twitchUsers.join(","))}`)
      .then(
        (response) =>
          response.json() as Promise<{
            configured?: boolean;
            streams?: TwitchStream[];
            users?: TwitchUser[];
          }>
      )
      .then((payload) => {
        if (ignore || !payload.configured) return;
        const nextOverrides = channels.reduce<Record<string, Partial<Channel>>>((acc, channel) => {
          acc[channel.login] = { live: false, viewers: 0 };
          return acc;
        }, {});

        (payload.users ?? []).forEach((user) => {
          const login = user.login?.toLowerCase();
          if (!login) return;
          nextOverrides[login] = {
            ...nextOverrides[login],
            name: user.display_name || undefined,
            avatar: user.profile_image_url || undefined,
            broadcasterType: user.broadcaster_type || undefined,
            verified: user.broadcaster_type === "partner"
          };
        });

        (payload.streams ?? []).forEach((stream) => {
          const login = stream.user_login?.toLowerCase();
          if (!login) return;
          nextOverrides[login] = {
            ...nextOverrides[login],
            live: true,
            viewers: stream.viewer_count ?? 0,
            category: stream.game_name || undefined,
            title: stream.title || undefined
          };
        });

        if (!ignore) setLiveOverrides(nextOverrides);
      })
      .catch(() => {
        if (!ignore) setLiveOverrides({});
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    const twitchUsers = channels
      .filter((channel) => channel.platform === "twitch")
      .map((channel) => channel.login);
    const liveUrl = `/api/twitch/live?users=${encodeURIComponent(twitchUsers.join(","))}`;
    let ignore = false;
    let lastRefresh = Date.now();

    const refreshLiveChannels = async () => {
      if (document.visibilityState !== "visible" || Date.now() - lastRefresh < 60_000) return;
      lastRefresh = Date.now();

      try {
        const response = await fetch(liveUrl);
        if (!response.ok) return;

        const payload = (await response.json()) as {
          configured?: boolean;
          streams?: TwitchStream[];
        };
        if (ignore || !payload.configured) return;

        const streams = new Map(
          (payload.streams ?? []).map((stream) => [stream.user_login.toLowerCase(), stream])
        );

        setLiveOverrides((current) => {
          const next = { ...current };

          twitchUsers.forEach((login) => {
            const stream = streams.get(login);
            next[login] = {
              ...current[login],
              live: Boolean(stream),
              viewers: stream?.viewer_count ?? 0,
              category: stream?.game_name || current[login]?.category,
              title: stream?.title || current[login]?.title
            };
          });

          return next;
        });
      } catch {
        // Keep the last known roster if a background refresh fails.
      }
    };

    const timer = window.setInterval(refreshLiveChannels, 60_000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") void refreshLiveChannels();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      ignore = true;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const directory = useMemo(
    () => channels.map((channel) => mergeChannelData(channel, liveOverrides[channel.login])),
    [liveOverrides]
  );
  const liveChannels = useMemo(
    () =>
      directory
        .filter((channel) => channel.live)
        .sort((a, b) => b.viewers - a.viewers),
    [directory]
  );
  const selectedChannels = selectedLogins
    .map((login) => directory.find((channel) => channel.login === login))
    .filter((channel): channel is Channel => Boolean(channel?.live));
  const activeChatChannel =
    selectedChannels.find((channel) => channel.login === activeChatLogin) ?? selectedChannels[0] ?? null;
  const channelCount = selectedChannels.length;
  const usesSharedChat =
    (layout === "Focus" && channelCount !== 5) || (layout === "Grid" && channelCount === 4);
  const usesInlineChats = layout === "Grid" && selectedChannels.length <= 2;
  const usesGridChatTile =
    (layout === "Grid" && channelCount === 3) || (channelCount === 5 && layout !== "Wide");
  const availableLayouts: MultiviewLayout[] =
    channelCount === 6 ? ["Focus", "Wide"] : ["Focus", "Grid", "Wide"];

  const updateSelection = (nextLogins: string[]) => {
    setSelectedLogins(nextLogins);
    if (!nextLogins.includes(activeChatLogin)) setActiveChatLogin(nextLogins[0] ?? "");
    if (audioLogin && !nextLogins.includes(audioLogin)) setAudioLogin(null);
    const query = nextLogins.length ? `?channels=${encodeURIComponent(nextLogins.join(","))}` : "";
    router.replace(`/multiview${query}`, { scroll: false });
  };

  const toggleChannel = (login: string) => {
    if (selectedLogins.includes(login)) {
      updateSelection(selectedLogins.filter((current) => current !== login));
      return;
    }
    if (selectedLogins.length >= maxMultiviewChannels) return;
    if (selectedLogins.length === maxMultiviewChannels - 1 && layout === "Grid") {
      setLayout("Focus");
    }
    updateSelection([...selectedLogins, login]);
  };

  return (
    <main className="min-h-screen bg-[#0e0e10] text-[#efeff1]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-[50px] items-center gap-2 border-b border-[#2f2f35] bg-[#18181b] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        <Link href="/" className="grid h-9 w-9 place-items-center rounded-[4px] hover:bg-[#26262c]" aria-label="Streamer University home">
          <img src="/su-crest-2026-transparent.png" alt="" className="h-7 w-7 object-contain" />
        </Link>
        <Link href="/" className="hidden px-2 text-[15px] font-semibold text-white hover:text-gold sm:block">
          Browse
        </Link>
        <div className="flex h-full items-center gap-2 border-b-2 border-burgundy border-l border-l-[#34343b] pl-3">
          <MultiviewIcon className="h-4 w-4 text-gold" />
          <span className="text-[15px] font-semibold text-white">Lecture Hall</span>
          <span className="rounded-full bg-[#2f2f35] px-2 py-0.5 text-[12px] font-semibold text-[#dedee3]">
            {selectedChannels.length}/{maxMultiviewChannels}
          </span>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsPickerOpen((current) => !current)}
            className={`flex h-8 items-center gap-2 rounded-[4px] px-2.5 text-[13px] font-semibold transition hover:bg-[#2f2f35] ${
              isPickerOpen ? "bg-[#2f2f35] text-white" : "text-[#dedee3]"
            }`}
            aria-label={isPickerOpen ? "Collapse live channel picker" : "Expand live channel picker"}
            aria-expanded={isPickerOpen}
          >
            <span className="hidden sm:inline">Live on campus</span>
            <span className="text-live-soft">{liveChannels.length}</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isPickerOpen ? "rotate-180" : ""}`} />
          </button>
          {isPickerOpen && (
            <>
              <div className="absolute right-full top-[calc(100%+8px)] z-50 flex w-[68px] flex-col gap-1 border border-r-0 border-[#34343b] bg-[#18181b] p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                {availableLayouts.map((option) => (
                  <button
                    key={option}
                    onClick={() => setLayout(option)}
                    className={`grid h-[58px] w-[54px] place-items-center rounded-[3px] p-1 transition ${
                      layout === option ? "bg-[#26262c]" : "hover:bg-[#26262c]"
                    }`}
                    aria-label={`${option} layout`}
                    title={`${option} layout`}
                  >
                    <MultiviewLayoutPreview layout={option} channelCount={selectedChannels.length} active={layout === option} />
                  </button>
                ))}
              </div>
              <div className="absolute left-0 top-[calc(100%+8px)] z-50 flex h-[calc(50vh-32px)] w-[min(350px,calc(100vw-24px))] flex-col overflow-hidden rounded-r-[4px] border border-[#34343b] bg-[#1f1f23] shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                <div className="flex h-11 shrink-0 items-center justify-between border-b border-[#34343b] px-3">
                  <span className="text-[14px] font-bold text-white">Live on campus</span>
                  <span className="text-[13px] font-semibold text-live-soft">{liveChannels.length}</span>
                </div>
                <div className="min-h-0 overflow-y-auto py-1">
                  {isLoading ? (
                    <div className="px-3 py-6 text-center text-[13px] text-[#adadb8]">Loading live channels</div>
                  ) : (
                    liveChannels.map((channel) => {
                      const isSelected = selectedLogins.includes(channel.login);
                      const atLimit = selectedLogins.length >= maxMultiviewChannels && !isSelected;
                      const selectionIndex = selectedLogins.indexOf(channel.login);

                      return (
                        <button
                          key={channel.login}
                          onClick={() => toggleChannel(channel.login)}
                          disabled={atLimit}
                          className={`flex h-[52px] w-full items-center gap-2.5 px-3 text-left transition hover:bg-[#26262c] disabled:cursor-not-allowed disabled:opacity-45 ${
                            isSelected ? "bg-[#2f2f35]" : ""
                          }`}
                        >
                          <Avatar channel={channel} size="sm" />
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[14px] font-semibold text-white">{channel.name}</span>
                            <span className="block truncate text-[12px] text-[#adadb8]">{channel.category}</span>
                          </span>
                          {isSelected ? (
                            <span className="grid h-5 w-5 place-items-center rounded-[3px] bg-burgundy text-[12px] font-bold text-white">
                              {selectionIndex + 1}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[12px] text-[#dedee3]">
                              <span className="h-2 w-2 rounded-full bg-live" />
                              {formatViewers(channel.viewers)}
                            </span>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="ml-auto" />
        <a
          href="https://shop.streameruniversity.com"
          target="_blank"
          rel="noreferrer"
          className="hidden h-8 items-center rounded-[999px] bg-[#2f2f35] px-4 text-[13px] font-bold hover:bg-[#3b3b44] md:flex"
        >
          Buy Merch
        </a>
      </header>

      <div className={`grid min-h-screen pt-[50px] xl:h-screen xl:min-h-0 ${usesSharedChat ? "xl:grid-cols-[minmax(0,1fr)_350px]" : "xl:grid-cols-1"}`}>
        <section className="flex min-w-0 flex-col bg-[#0e0e10] p-3 sm:p-4 xl:min-h-0">
          {isLoading ? (
            <div className="grid min-h-[440px] place-items-center text-[14px] text-[#adadb8] xl:min-h-0 xl:flex-1">Loading multiview</div>
          ) : selectedChannels.length ? (
            usesInlineChats ? (
              <div className="grid min-h-[660px] gap-2 xl:h-full xl:min-h-0 xl:grid-rows-[minmax(0,3fr)_minmax(0,2fr)]">
                <MultiPlayerGrid
                  channels={selectedChannels}
                  layout={layout}
                  parent={embedParent}
                  activeChatLogin={activeChatChannel?.login ?? ""}
                  audioLogin={audioLogin}
                  onSelectChat={setActiveChatLogin}
                  onSelectAudio={setAudioLogin}
                  onRemove={(login) => updateSelection(selectedLogins.filter((current) => current !== login))}
                />
                <MultiStreamChatGrid channels={selectedChannels} parent={embedParent} />
              </div>
            ) : usesGridChatTile ? (
              <div className="min-h-[440px] xl:min-h-0 xl:flex-1">
                <MultiPlayerGrid
                  channels={selectedChannels}
                  layout={layout}
                  parent={embedParent}
                  activeChatLogin={activeChatChannel?.login ?? ""}
                  audioLogin={audioLogin}
                  onSelectChat={setActiveChatLogin}
                  onSelectAudio={setAudioLogin}
                  onRemove={(login) => updateSelection(selectedLogins.filter((current) => current !== login))}
                  chatTile={<SharedChatTile channel={activeChatChannel} parent={embedParent} />}
                />
              </div>
            ) : (
              <div className="min-h-[440px] xl:min-h-0 xl:flex-1">
                <MultiPlayerGrid
                  channels={selectedChannels}
                  layout={layout}
                  parent={embedParent}
                  activeChatLogin={activeChatChannel?.login ?? ""}
                  audioLogin={audioLogin}
                  onSelectChat={setActiveChatLogin}
                  onSelectAudio={setAudioLogin}
                  onRemove={(login) => updateSelection(selectedLogins.filter((current) => current !== login))}
                />
              </div>
            )
          ) : (
            <div className="grid min-h-[440px] place-items-center border border-dashed border-[#3b3b44] bg-[#18181b] text-[15px] font-semibold text-[#adadb8] xl:min-h-0 xl:flex-1">
              No live channels selected
            </div>
          )}
        </section>

        {usesSharedChat && <aside className="flex min-h-[440px] flex-col border-t border-[#2f2f35] bg-[#18181b] xl:sticky xl:top-[50px] xl:h-[calc(100vh-50px)] xl:border-l xl:border-t-0">
          <div className="flex h-12 items-center border-b border-[#2f2f35] px-3">
            <h2 className="flex-1 text-center text-[16px] font-bold text-white">Stream Chat</h2>
          </div>
          {selectedChannels.length > 0 && (
            <div className="flex gap-1 overflow-x-auto border-b border-[#2f2f35] px-2 py-2">
              {selectedChannels.map((channel) => (
                <button
                  key={channel.login}
                  onClick={() => setActiveChatLogin(channel.login)}
                  className={`flex h-8 shrink-0 items-center gap-1.5 rounded-[4px] px-1.5 ${
                    activeChatChannel?.login === channel.login ? "bg-[#2f2f35]" : "hover:bg-[#26262c]"
                  }`}
                  aria-label={`Show ${channel.name}'s chat`}
                >
                  <Avatar channel={channel} size="sm" />
                  <span className="max-w-[92px] truncate text-[12px] font-semibold text-[#dedee3]">{channel.name}</span>
                </button>
              ))}
            </div>
          )}
          {activeChatChannel && embedParent ? (
            <iframe
              src={getChatUrl(activeChatChannel.login, embedParent)}
              title={`${activeChatChannel.name} Twitch chat`}
              className="min-h-0 w-full flex-1 border-0"
            />
          ) : (
            <div className="grid flex-1 place-items-center text-[14px] text-[#adadb8]">No chat selected</div>
          )}
        </aside>}
      </div>
    </main>
  );
}

function MultiPlayerGrid({
  channels,
  layout,
  parent,
  activeChatLogin,
  audioLogin,
  onSelectChat,
  onSelectAudio,
  onRemove,
  chatTile
}: {
  channels: Channel[];
  layout: MultiviewLayout;
  parent: string;
  activeChatLogin: string;
  audioLogin: string | null;
  onSelectChat: (login: string) => void;
  onSelectAudio: (login: string | null) => void;
  onRemove: (login: string) => void;
  chatTile?: ReactNode;
}) {
  const channelCount = channels.length;
  const gridClass =
    channelCount === 6
      ? layout === "Focus"
        ? "grid-cols-1 lg:grid-cols-2 lg:grid-rows-3"
        : "grid-cols-1 lg:grid-cols-3 lg:grid-rows-2"
      : channelCount === 5
        ? layout === "Wide"
          ? "grid-cols-1 lg:grid-cols-6 lg:grid-rows-2"
          : "grid-cols-1 lg:grid-cols-3 lg:grid-rows-2"
        : layout === "Grid"
          ? "grid-cols-1 sm:grid-cols-2"
          : layout === "Wide"
            ? channelCount <= 2
              ? "grid-cols-1"
              : channelCount === 3
                ? "grid-cols-1 lg:grid-cols-2 lg:grid-rows-2"
                : "grid-cols-1 sm:grid-cols-2"
            : channelCount <= 2
              ? "grid-cols-1"
              : channelCount === 4
                ? "grid-cols-1 lg:grid-cols-3 lg:grid-rows-2"
                : "grid-cols-1 lg:grid-cols-2 lg:grid-rows-2";

  const fiveChannelFocusPositions = [
    "lg:col-start-1 lg:row-start-1",
    "lg:col-start-2 lg:row-start-1",
    "lg:col-start-1 lg:row-start-2",
    "lg:col-start-2 lg:row-start-2",
    "lg:col-start-3 lg:row-start-2"
  ];
  const fiveChannelGridPositions = [
    "lg:col-start-1 lg:row-start-1",
    "lg:col-start-2 lg:row-start-1",
    "lg:col-start-3 lg:row-start-1",
    "lg:col-start-1 lg:row-start-2",
    "lg:col-start-3 lg:row-start-2"
  ];
  const chatTileClass =
    channelCount === 5
      ? layout === "Focus"
        ? "lg:col-start-3 lg:row-start-1"
        : "lg:col-start-2 lg:row-start-2"
      : "";

  return (
    <div className={`grid min-h-[440px] gap-2 xl:h-full xl:min-h-0 ${gridClass}`}>
      {channels.map((channel, index) => {
        const tileClass =
          channelCount === 5
            ? layout === "Wide"
              ? index < 2
                ? "lg:col-span-3"
                : "lg:col-span-2"
              : layout === "Focus"
                ? fiveChannelFocusPositions[index]
                : fiveChannelGridPositions[index]
            : (layout === "Focus" || layout === "Wide") && channelCount === 3 && index === 0
              ? "lg:col-span-2"
              : layout === "Focus" && channelCount === 4 && index === 0
                ? "lg:col-span-3"
                : "";
        const isActiveChat = activeChatLogin === channel.login;
        const isActiveAudio = audioLogin === channel.login;

        return (
          <div key={channel.login} className={`relative min-h-[300px] overflow-hidden bg-black xl:min-h-0 ${tileClass}`}>
            {parent ? (
              <iframe
                src={getWatchUrl(channel.login, parent, !isActiveAudio)}
                title={`${channel.name} Twitch stream`}
                allowFullScreen
                allow="autoplay; fullscreen; picture-in-picture"
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <StreamThumbnail channel={channel} />
            )}
            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-2 bg-gradient-to-b from-black/70 to-transparent p-2">
              <button
                onClick={() => onSelectChat(channel.login)}
                className={`pointer-events-auto flex min-w-0 items-center gap-1.5 rounded-[4px] px-1.5 py-1 text-left text-[12px] font-semibold text-white ${
                  isActiveChat ? "bg-burgundy" : "bg-black/60 hover:bg-[#2f2f35]"
                }`}
              >
                <Avatar channel={channel} size="sm" />
                <span className="max-w-[120px] truncate">{channel.name}</span>
              </button>
              <span className="pointer-events-auto flex items-center gap-1">
                <button
                  onClick={() => onSelectAudio(isActiveAudio ? null : channel.login)}
                  className={`grid h-7 w-7 place-items-center rounded-[4px] ${
                    isActiveAudio ? "bg-burgundy text-white" : "bg-black/60 text-[#dedee3] hover:bg-[#2f2f35]"
                  }`}
                  aria-label={isActiveAudio ? `Mute ${channel.name}` : `Listen to ${channel.name}`}
                >
                  <VolumeIcon muted={!isActiveAudio} />
                </button>
                <button
                  onClick={() => onRemove(channel.login)}
                  className="grid h-7 w-7 place-items-center rounded-[4px] bg-black/60 text-[#dedee3] hover:bg-[#2f2f35]"
                  aria-label={`Remove ${channel.name}`}
                >
                  <CloseIcon />
                </button>
              </span>
            </div>
          </div>
        );
      })}
      {chatTile && (
        <div className={`relative min-h-[300px] overflow-hidden bg-[#18181b] xl:min-h-0 ${chatTileClass}`}>
          {chatTile}
        </div>
      )}
    </div>
  );
}

function SharedChatTile({ channel, parent }: { channel: Channel | null; parent: string }) {
  if (!channel || !parent) {
    return <div className="grid h-full place-items-center text-[13px] text-[#adadb8]">Loading chat</div>;
  }

  return (
    <iframe
      src={getChatUrl(channel.login, parent)}
      title={`${channel.name} Twitch chat`}
      className="h-full w-full border-0"
    />
  );
}

function MultiStreamChatGrid({ channels, parent }: { channels: Channel[]; parent: string }) {
  return (
    <div className="grid min-h-[220px] grid-cols-1 gap-2 border-t border-[#2f2f35] pt-2 sm:grid-cols-2 xl:min-h-0 xl:h-full">
      {channels.map((channel) => (
        <div key={channel.login} className="relative min-h-[220px] overflow-hidden border border-[#2f2f35] bg-[#18181b] xl:min-h-0">
          {parent ? (
            <iframe
              src={getChatUrl(channel.login, parent)}
              title={`${channel.name} Twitch chat`}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="grid h-full place-items-center text-[13px] text-[#adadb8]">Loading chat</div>
          )}
        </div>
      ))}
    </div>
  );
}

function SidebarSection({
  collapsed,
  title,
  channels,
  activeLogin,
  onSelect
}: {
  collapsed: boolean;
  title: string;
  channels: Channel[];
  activeLogin: string;
  onSelect: (login: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...channels].sort(
    (a, b) => Number(b.live) - Number(a.live) || b.viewers - a.viewers
  );
  const limit = collapsed ? 10 : 7;
  const visible = expanded && !collapsed ? sorted : sorted.slice(0, limit);

  return (
    <div className="mb-2">
      {!collapsed && <p className="px-3 py-2.5 text-[14px] font-bold uppercase text-[#adadb8]">{title}</p>}
      <div className="space-y-0.5">
        {visible.map((channel) => (
          <button
            key={channel.login}
            onClick={() => onSelect(channel.login)}
            className={`flex h-[46px] w-full items-center gap-3 border-l-2 text-left hover:bg-[#26262c] ${
              activeLogin === channel.login
                ? "border-burgundy bg-[#2a2024] pl-[10px] pr-3"
                : "border-transparent px-3"
            }`}
          >
            <Avatar channel={channel} size="sm" />
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[15px] font-semibold leading-tight text-white">{channel.name}</span>
                  <span className="block truncate text-[14px] leading-tight text-[#adadb8]">{channel.category}</span>
                </span>
                {channel.live ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-[14px] text-[#dedee3]">
                    <span className="h-2 w-2 rounded-full bg-live" />
                    {formatViewers(channel.viewers)}
                  </span>
                ) : (
                  <span className="shrink-0 text-[14px] text-[#adadb8]">Offline</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>
      {!collapsed && sorted.length > limit && (
        <button
          onClick={() => setExpanded((current) => !current)}
          className="px-3 py-2 text-[14px] font-semibold text-[#dedee3] hover:text-white hover:underline"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
}

function Avatar({ channel, size }: { channel: Channel; size: "sm" | "md" | "lg" }) {
  const sizeClass = {
    sm: "h-[34px] w-[34px] text-[12px]",
    md: "h-10 w-10 text-[13px]",
    lg: "h-[70px] w-[70px] text-[20px]"
  }[size];
  const offlineClass = channel.live ? "" : "grayscale opacity-60";

  if (channel.avatar) {
    return (
      <img
        src={channel.avatar}
        alt=""
        className={`${sizeClass} ${offlineClass} shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} ${offlineClass} grid shrink-0 place-items-center rounded-full font-bold text-white`}
      style={{ background: channel.live ? channel.accent : "#34343b" }}
      aria-hidden="true"
    >
      {getInitials(channel.name)}
    </span>
  );
}

function StreamThumbnail({ channel, className = "" }: { channel: Channel; className?: string }) {
  const image = channel.thumbnail || channel.offlineImage;

  if (image) {
    return <img src={image} alt="" className={`h-full w-full object-cover ${className}`} />;
  }

  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden bg-[#111114] ${className}`}>
      <div className="absolute inset-0 opacity-70" style={{
        background:
          `linear-gradient(135deg, ${channel.accent}33, transparent 42%), radial-gradient(circle at 75% 25%, ${channel.accent}44, transparent 30%)`
      }} />
      <div className="relative text-center">
        <div
          className="mx-auto grid h-16 w-16 place-items-center rounded-full text-xl font-black text-white"
          style={{ background: channel.accent }}
        >
          {getInitials(channel.name)}
        </div>
        <p className="mt-3 max-w-[18rem] truncate px-4 text-[15px] font-bold text-white">{channel.name}</p>
      </div>
    </div>
  );
}

function WatchStage({
  channel,
  parent,
  onCategory,
  onBack
}: {
  channel: Channel;
  parent: string;
  onCategory: (name: string) => void;
  onBack: () => void;
}) {
  const playerUrl = parent ? getPlayerUrl(channel, parent) : null;
  const chatUrl = parent ? getChatEmbedUrl(channel, parent) : null;

  return (
    <>
      <div className="flex h-svh min-h-[520px] flex-col bg-[#18181b] md:hidden">
        <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[#2f2f35] px-2.5">
          <button
            onClick={onBack}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] text-white hover:bg-[#2f2f35]"
            aria-label="Back to Streamer University home"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <Avatar channel={channel} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h1 className="truncate text-[16px] font-semibold text-white">{channel.name}</h1>
              {channel.verified && <VerifiedIcon className="h-4 w-4 shrink-0 text-gold" />}
              <PlatformBadge platform={channel.platform} />
            </div>
            <div className="flex items-center gap-2 text-[12px] text-[#adadb8]">
              {channel.live ? (
                <>
                  <span className="flex items-center gap-1">
                    <PeopleIcon className="h-3.5 w-3.5" />
                    {formatViewers(channel.viewers)}
                  </span>
                  <span className="h-2 w-2 rounded-full bg-live" />
                  <span className="truncate">Live</span>
                </>
              ) : (
                <span>Offline</span>
              )}
            </div>
          </div>
          <a
            href={getChannelPageUrl(channel)}
            target="_blank"
            rel="noreferrer"
            className="su-primary flex h-8 shrink-0 items-center rounded-[4px] px-3 text-[12px] font-semibold text-white"
          >
            Follow
          </a>
        </div>

        <div className="relative aspect-video w-full shrink-0 bg-black">
          {playerUrl ? (
            <iframe
              src={playerUrl}
              title={`${channel.name} ${platformLabels[channel.platform]} stream`}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <StreamThumbnail channel={channel} />
          )}
        </div>

        <section className="flex min-h-0 flex-1 flex-col border-t border-[#2f2f35] bg-[#18181b]">
          {chatUrl ? (
            <iframe
              src={chatUrl}
              title={`${channel.name} ${platformLabels[channel.platform]} chat`}
              className="min-h-0 w-full flex-1 border-0"
            />
          ) : parent ? (
            <div className="grid flex-1 place-items-center px-6 text-center">
              <div>
                <p className="text-[13px] text-[#adadb8]">
                  Chat for this channel lives on {platformLabels[channel.platform]}.
                </p>
                <a
                  href={getChannelPageUrl(channel)}
                  target="_blank"
                  rel="noreferrer"
                  className="su-primary mt-3 inline-flex h-8 items-center rounded-[4px] px-3 text-[13px] font-semibold text-white"
                >
                  Open chat
                </a>
              </div>
            </div>
          ) : (
            <div className="grid flex-1 place-items-center text-[13px] text-[#adadb8]">Chat loading</div>
          )}
        </section>
      </div>

    <div className="hidden flex-col md:flex xl:flex-row">
      <div className="min-w-0 flex-1">
        <div className="relative aspect-video max-h-[calc(100svh-170px)] w-full bg-black">
          {playerUrl ? (
            <iframe
              src={playerUrl}
              title={`${channel.name} ${platformLabels[channel.platform]} stream`}
              allowFullScreen
              allow="autoplay; fullscreen; picture-in-picture"
              className="absolute inset-0 h-full w-full border-0"
            />
          ) : (
            <StreamThumbnail channel={channel} />
          )}
        </div>

        <div className="px-4 pb-8 pt-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex min-w-0 gap-4">
              <div className="relative shrink-0">
                <span className={`grid place-items-center rounded-full p-[3px] ${channel.live ? "bg-live" : "bg-transparent"}`}>
                  <span className="grid place-items-center rounded-full bg-[#0e0e10] p-[3px]">
                    <Avatar channel={channel} size="lg" />
                  </span>
                </span>
                {channel.live && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[4px] border-2 border-[#0e0e10] bg-live px-1 text-[12px] font-bold uppercase text-white">
                    Live
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="truncate text-[20px] font-semibold text-white">{channel.name}</h1>
                  {channel.verified && <VerifiedIcon className="h-4 w-4 shrink-0 text-gold" />}
                  <PlatformBadge platform={channel.platform} />
                </div>
                <p className="mt-0.5 line-clamp-2 text-[14px] font-semibold text-white">{channel.title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <button
                    onClick={() => onCategory(channel.category)}
                    className="text-[14px] font-semibold text-[#adadb8] hover:text-white hover:underline"
                  >
                    {channel.category}
                  </button>
                  <div className="flex flex-wrap gap-1.5">
                    {channel.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="rounded-full bg-[#2f2f35] px-2 py-0.5 text-[12px] font-semibold text-[#dedee3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col items-start gap-2 lg:items-end">
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <a
                  href={getChannelPageUrl(channel)}
                  target="_blank"
                  rel="noreferrer"
                  className="su-primary flex h-8 items-center gap-1.5 rounded-[4px] px-3 text-[13px] font-semibold text-white"
                >
                  <HeartIcon className="h-4 w-4" />
                  Follow
                </a>
                {channel.platform === "twitch" && (
                  <a
                    href={`https://www.twitch.tv/subs/${channel.login}?gift=true`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 items-center gap-1.5 rounded-[4px] bg-[#2f2f35] px-3 text-[13px] font-semibold text-white hover:bg-[#3b3b44]"
                  >
                    <GiftIcon className="h-4 w-4" />
                    Gift a Sub
                  </a>
                )}
                <a
                  href={
                    channel.platform === "twitch"
                      ? `https://www.twitch.tv/subs/${channel.login}`
                      : getChannelPageUrl(channel)
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 items-center gap-1.5 rounded-[4px] bg-[#2f2f35] px-3 text-[13px] font-semibold text-white hover:bg-[#3b3b44]"
                >
                  <StarIcon className="h-4 w-4" />
                  Subscribe
                  <ChevronDownIcon className="h-3.5 w-3.5" />
                </a>
              </div>
              <div className="flex items-center gap-3 text-[14px]">
                {channel.live ? (
                  <span className="flex items-center gap-1 font-semibold text-[#ff8280]">
                    <PeopleIcon className="h-4 w-4" />
                    {formatViewers(channel.viewers)}
                  </span>
                ) : (
                  <span className="font-semibold text-[#adadb8]">Offline</span>
                )}
                <button className="grid h-7 w-7 place-items-center rounded-[4px] text-[#efeff1] hover:bg-[#2f2f35]" aria-label="Share">
                  <ShareIcon className="h-4 w-4" />
                </button>
                <button className="grid h-7 w-7 place-items-center rounded-[4px] text-[#efeff1] hover:bg-[#2f2f35]" aria-label="More options">
                  <KebabIcon />
                </button>
              </div>
            </div>
          </div>

          <section className="mt-6 rounded-[4px] bg-[#1f1f23] p-5">
            <div className="flex items-center gap-1.5">
              <h2 className="text-[18px] font-semibold text-white">About {channel.name}</h2>
              {channel.verified && <VerifiedIcon className="h-4 w-4 text-gold" />}
            </div>
            <p className="mt-2 text-[14px] text-[#dedee3]">
              {channel.campusRole} at Streamer University · Streams {channel.category}.
            </p>
            <a
              href={getChannelPageUrl(channel)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[14px] font-semibold text-[#adadb8] hover:text-white hover:underline"
            >
              {getChannelPageLabel(channel)}
            </a>
          </section>
        </div>
      </div>

      <aside className="flex h-[480px] w-full shrink-0 flex-col border-t border-[#2f2f35] bg-[#18181b] xl:sticky xl:top-[50px] xl:h-[calc(100vh-50px)] xl:w-[340px] xl:border-l xl:border-t-0">
        {chatUrl ? (
          <iframe
            src={chatUrl}
            title={`${channel.name} ${platformLabels[channel.platform]} chat`}
            className="min-h-0 w-full flex-1 border-0"
          />
        ) : parent ? (
          <div className="grid flex-1 place-items-center px-6 text-center">
            <div>
              <p className="text-[14px] text-[#adadb8]">
                {channel.platform === "youtube" && !channel.live
                  ? "Chat opens here when the stream goes live."
                  : `Chat for this channel lives on ${platformLabels[channel.platform]}.`}
              </p>
              <a
                href={getChannelPageUrl(channel)}
                target="_blank"
                rel="noreferrer"
                className="su-primary mt-3 inline-flex h-8 items-center rounded-[4px] px-3 text-[13px] font-semibold text-white"
              >
                Open on {platformLabels[channel.platform]}
              </a>
            </div>
          </div>
        ) : (
          <div className="grid flex-1 place-items-center text-[#adadb8]">Chat loading</div>
        )}
      </aside>
    </div>
    </>
  );
}

function SectionHeading({ title, accent, className = "" }: { title: string; accent: string; className?: string }) {
  return (
    <h2 className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[18px] font-bold leading-tight sm:gap-x-2 sm:text-[20px] ${className}`}>
      <span className="h-4 w-[3px] shrink-0 rounded-full bg-gold" aria-hidden="true" />
      <span className="text-white">{title}</span>
      <span className="text-[#dedee3]">{accent}</span>
    </h2>
  );
}

function ChannelShelf({
  id,
  title,
  accent,
  channels: shelfChannels,
  activeLogin,
  onSelect,
  initialCount,
  emptyMessage = "No channels match this search.",
  className = ""
}: {
  id?: string;
  title: string;
  accent: string;
  channels: Channel[];
  activeLogin: string;
  onSelect: (login: string) => void;
  initialCount?: number;
  emptyMessage?: string;
  className?: string;
}) {
  // Untruncated shelves must not freeze a count at mount time — channel lists
  // start empty and fill in once the Twitch data loads.
  const [visibleCount, setVisibleCount] = useState(initialCount ?? Number.POSITIVE_INFINITY);
  const shelfRowRef = useRef<HTMLDivElement>(null);
  const pendingScrollLeft = useRef<number | null>(null);
  const pendingPageScrollTop = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pendingScrollLeft.current !== null && shelfRowRef.current) {
      shelfRowRef.current.scrollLeft = pendingScrollLeft.current;
      pendingScrollLeft.current = null;
    }

    if (pendingPageScrollTop.current !== null) {
      window.scrollTo(0, pendingPageScrollTop.current);
      pendingPageScrollTop.current = null;
    }
  }, [visibleCount]);

  const revealMoreMobile = (event: MouseEvent<HTMLButtonElement>) => {
    pendingScrollLeft.current = shelfRowRef.current?.scrollLeft ?? null;
    event.currentTarget.blur();
    setVisibleCount((current) => Math.min(current + (initialCount ?? 0), shelfChannels.length));
  };

  const revealMoreDesktop = (event: MouseEvent<HTMLButtonElement>) => {
    pendingPageScrollTop.current = window.scrollY;
    event.currentTarget.blur();
    setVisibleCount((current) => Math.min(current + (initialCount ?? 0), shelfChannels.length));
  };

  if (!shelfChannels.length) {
    return (
      <section id={id} className={`mb-8 scroll-mt-[70px] border-t border-[#2f2f35] pt-6 ${className}`}>
        <SectionHeading title={title} accent={accent} />
        <div className="mt-4 bg-[#18181b] px-4 py-8 text-center text-[#adadb8]">{emptyMessage}</div>
      </section>
    );
  }

  return (
    <section id={id} className={`mb-8 scroll-mt-[70px] ${className}`}>
      <SectionHeading title={title} accent={accent} className="mb-4" />
      <div ref={shelfRowRef} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [overflow-anchor:none] [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:snap-none md:gap-x-3 md:gap-y-7 md:overflow-visible md:px-0 md:pb-0 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {shelfChannels.slice(0, visibleCount).map((channel) => (
          <button key={channel.login} onClick={() => onSelect(channel.login)} className="group w-[78vw] max-w-[340px] shrink-0 snap-start text-left md:w-auto md:max-w-none md:min-w-0">
            <div className="relative">
              <div className="absolute inset-0 bg-burgundy" aria-hidden="true" />
              <div
                className={`relative aspect-video overflow-hidden bg-[#18181b] transition-transform duration-100 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1.5 ${
                  activeLogin === channel.login ? "outline outline-2 outline-burgundy" : ""
                }`}
              >
                <StreamThumbnail channel={channel} />
                {channel.live ? (
                  <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-live px-1.5 py-0.5 text-[13px] font-semibold uppercase">
                    LIVE
                  </span>
                ) : (
                  <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-black/70 px-1.5 py-0.5 text-[13px] font-semibold uppercase text-[#dedee3]">
                    Offline
                  </span>
                )}
                {channel.live && (
                  <span className="absolute bottom-2 left-2 rounded-[4px] bg-black/70 px-1.5 py-0.5 text-[13px] font-medium">
                    {formatViewers(channel.viewers)} viewers
                  </span>
                )}
              </div>
            </div>
            <div className="mt-2.5 flex gap-2.5">
              <Avatar channel={channel} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-white group-hover:text-gold">
                  {channel.title}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[13px] text-[#adadb8]">
                  {channel.name}
                  <PlatformBadge platform={channel.platform} />
                </p>
                <p className="truncate text-[13px] text-[#adadb8]">{channel.category}</p>
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  {channel.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#2f2f35] px-2 py-0.5 text-[12px] font-semibold text-[#dedee3]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[4px] text-[#adadb8] opacity-0 transition-opacity hover:bg-[#2f2f35] group-hover:opacity-100">
                <KebabIcon />
              </span>
            </div>
          </button>
        ))}
        {initialCount !== undefined && visibleCount < shelfChannels.length && (
          <button
            onClick={revealMoreMobile}
            className="flex min-h-[220px] w-[42vw] max-w-[170px] shrink-0 snap-start flex-col items-center justify-center gap-2 rounded-[4px] border border-[#34343b] bg-[#18181b] px-4 text-center hover:border-burgundy hover:bg-[#26262c] md:hidden"
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-burgundy text-white">
              <ChevronRightIcon className="h-5 w-5" />
            </span>
            <span className="text-[13px] font-semibold text-white">Show more</span>
            <span className="text-[11px] text-[#adadb8]">{shelfChannels.length - visibleCount} remaining</span>
          </button>
        )}
      </div>
      {initialCount !== undefined && shelfChannels.length > initialCount && (
        <div className="mt-5 hidden grid-cols-[1fr_auto_1fr] items-center gap-4 text-center md:grid">
          <span className="h-px bg-[#2f2f35]" />
          {visibleCount < shelfChannels.length ? (
            <button
              onClick={revealMoreDesktop}
              className="flex items-center gap-1 rounded-[4px] px-3 py-1.5 text-[13px] font-semibold text-[#dedee3] hover:bg-[#26262c] hover:text-white"
            >
              Show more
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(initialCount)}
              className="flex items-center gap-1 rounded-[4px] px-3 py-1.5 text-[13px] font-semibold text-[#dedee3] hover:bg-[#26262c] hover:text-white"
            >
              Show less
              <ChevronDownIcon className="h-4 w-4 rotate-180" />
            </button>
          )}
          <span className="h-px bg-[#2f2f35]" />
        </div>
      )}
    </section>
  );
}

function formatClipAge(createdAt: string) {
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 1000));
  const hours = Math.floor(elapsedSeconds / 3600);
  const days = Math.floor(hours / 24);

  if (days > 0) return days === 1 ? "Yesterday" : `${days} days ago`;
  if (hours > 0) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const minutes = Math.max(1, Math.floor(elapsedSeconds / 60));
  return `${minutes} min ago`;
}

function CatchUpShelf({ clips, channels }: { clips: TwitchClip[]; channels: Channel[] }) {
  const clipsRowRef = useRef<HTMLDivElement>(null);

  if (!clips.length) return null;

  const channelsByLogin = new Map(channels.map((channel) => [channel.login, channel]));
  const moveClips = (direction: number) => {
    const row = clipsRowRef.current;
    if (!row) return;

    row.scrollBy({ left: direction * row.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-3">
        <SectionHeading title="Trending" accent="in the dorms" />
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <button
            onClick={() => moveClips(-1)}
            className="grid h-8 w-8 place-items-center rounded-[4px] bg-[#26262c] text-[#dedee3] hover:bg-[#34343b] hover:text-white"
            aria-label="Previous trending clips"
            title="Previous clips"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => moveClips(1)}
            className="grid h-8 w-8 place-items-center rounded-[4px] bg-[#26262c] text-[#dedee3] hover:bg-[#34343b] hover:text-white"
            aria-label="Next trending clips"
            title="Next clips"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div ref={clipsRowRef} className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:px-0">
        {clips.slice(0, 10).map((clip) => {
          const channel = channelsByLogin.get(clip.broadcaster_login.toLowerCase());
          const name = channel?.name || clip.broadcaster_name;
          const category = clip.game_name || channel?.category || "Streamer University";

          return (
            <article key={clip.id} className="w-[62vw] max-w-[270px] shrink-0 snap-start md:w-[calc(50%-6px)] md:max-w-none xl:w-[calc(25%-9px)]">
              <a
                href={clip.url}
                target="_blank"
                rel="noreferrer"
                className="group relative block aspect-[9/13] overflow-hidden bg-[#18181b]"
                aria-label={`Watch ${clip.title} from ${name}`}
              >
                <img
                  src={clip.thumbnail_url}
                  alt=""
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/60" />
                <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-3">
                  <span className="flex min-w-0 items-center gap-2 text-[14px] font-bold text-white">
                    {channel ? <Avatar channel={channel} size="sm" /> : null}
                    <span className="truncate">{name}</span>
                  </span>
                  <span className="shrink-0 rounded-[4px] bg-black/55 px-3 py-1.5 text-[13px] font-semibold text-white">
                    Watch clip
                  </span>
                </div>
                <span className="absolute bottom-3 left-3 rounded-[4px] bg-black/70 px-2 py-1 text-[13px] font-medium text-white">
                  {formatClipAge(clip.created_at)}
                </span>
                <span className="absolute bottom-3 right-3 rounded-[4px] bg-black/70 px-2 py-1 text-[13px] font-medium text-white">
                  {formatViewers(clip.view_count)} views
                </span>
              </a>
              <p className="mt-2 truncate text-[15px] font-semibold text-white">{clip.title}</p>
              <p className="mt-0.5 truncate text-[13px] text-[#adadb8]">{category}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

type CategoryStat = { name: string; viewers: number; liveCount: number; total: number };

function CategoryArt({ name, src }: { name: string; src?: string }) {
  const [broken, setBroken] = useState(false);
  const art = src ?? categoryBoxArt[name];

  if (art && !broken) {
    return <img src={art} alt="" className="h-full w-full object-cover" onError={() => setBroken(true)} />;
  }

  if (name === "Streamer University") {
    return (
      <div className="grid h-full w-full place-items-center bg-[#18181b] p-2">
        <img src="/su-crest-2026-transparent.png" alt="" className="w-3/4 object-contain" />
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center border border-[#34343b] bg-[#26262c] p-2">
      <span className="text-center text-[14px] font-bold leading-tight text-white">{name}</span>
    </div>
  );
}

function CategoryShelf({
  categories,
  art,
  onSelect
}: {
  categories: CategoryStat[];
  art: Record<string, string>;
  onSelect: (name: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <section className="mb-8">
      <SectionHeading title="Course catalog" accent="what campus is streaming" className="mb-4" />
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:-mx-6 sm:px-6 md:mx-0 md:grid md:snap-none md:grid-cols-4 md:gap-x-3 md:gap-y-6 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-6 2xl:grid-cols-8">
        {categories.map((category) => (
          <button key={category.name} onClick={() => onSelect(category.name)} className="group w-[34vw] max-w-[150px] shrink-0 snap-start text-left md:w-auto md:max-w-none md:min-w-0">
            <div className="relative">
              <div className="absolute inset-0 bg-burgundy" aria-hidden="true" />
              <div className="relative aspect-[285/380] overflow-hidden bg-[#26262c] transition-transform duration-100 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1.5">
                <CategoryArt name={category.name} src={art[category.name]} />
              </div>
            </div>
            <p className="mt-1.5 truncate text-[14px] font-semibold text-white group-hover:text-gold">
              {category.name}
            </p>
            <p className="truncate text-[13px] text-[#adadb8]">
              {category.viewers > 0
                ? `${formatViewers(category.viewers)} viewers`
                : `${category.total} channel${category.total === 1 ? "" : "s"}`}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}

function SidebarCategories({
  categories,
  art,
  onSelect
}: {
  categories: CategoryStat[];
  art: Record<string, string>;
  onSelect: (name: string) => void;
}) {
  if (!categories.length) return null;

  return (
    <div className="mt-2">
      <p className="px-3 py-2.5 text-[14px] font-bold uppercase text-[#adadb8]">Recommended Categories</p>
      <div className="space-y-0.5">
        {categories.map((category) => (
          <button
            key={category.name}
            onClick={() => onSelect(category.name)}
            className="flex h-[46px] w-full items-center gap-3 px-3 text-left hover:bg-[#26262c]"
          >
            <span className="h-[42px] w-[32px] shrink-0 overflow-hidden rounded-[2px]">
              <CategoryArt name={category.name} src={art[category.name]} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-semibold leading-tight text-white">{category.name}</span>
              <span className="block truncate text-[14px] leading-tight text-[#adadb8]">
                {category.liveCount} live channel{category.liveCount === 1 ? "" : "s"}
              </span>
            </span>
            {category.viewers > 0 && (
              <span className="flex shrink-0 items-center gap-1.5 text-[14px] text-[#dedee3]">
                <span className="h-2 w-2 rounded-full bg-live" />
                {formatViewers(category.viewers)}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function CategoryView({
  name,
  art,
  channels: categoryChannels,
  activeLogin,
  onSelect,
  onClear
}: {
  name: string;
  art?: string;
  channels: Channel[];
  activeLogin: string;
  onSelect: (login: string) => void;
  onClear: () => void;
}) {
  const live = categoryChannels
    .filter((channel) => channel.live)
    .sort((a, b) => b.viewers - a.viewers);
  const offline = categoryChannels.filter((channel) => !channel.live);
  const totalViewers = live.reduce((sum, channel) => sum + channel.viewers, 0);

  return (
    <div>
      <button
        onClick={onClear}
        className="mb-4 flex items-center gap-1 rounded-[4px] py-1 pl-1 pr-2 text-[13px] font-semibold text-[#dedee3] hover:bg-[#26262c] hover:text-white"
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Browse
      </button>
      <div className="mb-7 flex items-center gap-5">
        <div className="h-[124px] w-[93px] shrink-0 overflow-hidden rounded-[4px] bg-[#26262c]">
          <CategoryArt name={name} src={art} />
        </div>
        <div className="min-w-0">
          <h1 className="truncate text-[32px] font-bold text-white sm:text-[42px]">{name}</h1>
          <p className="mt-1 text-[14px] text-[#dedee3]">
            {totalViewers > 0 && (
              <>
                <span className="font-semibold text-white">{formatViewers(totalViewers)}</span> viewers ·{" "}
              </>
            )}
            {live.length} live channel{live.length === 1 ? "" : "s"} on campus
          </p>
        </div>
      </div>
      {live.length > 0 && (
        <ChannelShelf title={name} accent="live now" channels={live} activeLogin={activeLogin} onSelect={onSelect} />
      )}
      {offline.length > 0 && (
        <ChannelShelf
          title="Offline"
          accent={`${name.toLowerCase()} channels`}
          channels={offline}
          activeLogin={activeLogin}
          onSelect={onSelect}
        />
      )}
      {!live.length && !offline.length && (
        <div className="bg-[#18181b] px-4 py-8 text-center text-[#adadb8]">No campus channels in this category.</div>
      )}
    </div>
  );
}

function IconBase({ className = "h-5 w-5", children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12.5 4 6.5 10l6 6" />
    </IconBase>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="m7.5 4 6 6-6 6" />
    </IconBase>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="m5 7.5 5 5 5-5" />
    </IconBase>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="8.5" cy="8.5" r="5" />
      <path d="m12.25 12.25 4 4" />
    </IconBase>
  );
}

function HomeIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M2.5 9.5 10 3l7.5 6.5" />
      <path d="M4.5 8.3V17h11V8.3" />
      <path d="M8 17v-5h4v5" />
    </IconBase>
  );
}

function DirectoryIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="5" height="5" rx="0.5" />
      <rect x="12" y="3" width="5" height="5" rx="0.5" />
      <rect x="3" y="12" width="5" height="5" rx="0.5" />
      <rect x="12" y="12" width="5" height="5" rx="0.5" />
    </IconBase>
  );
}

function CollapseIcon({ flipped }: { flipped?: boolean }) {
  return (
    <IconBase className={`h-5 w-5 ${flipped ? "rotate-180" : ""}`}>
      <path d="M4.5 3.5v13" />
      <path d="M13.5 6.5 10 10l3.5 3.5" />
    </IconBase>
  );
}

function TrayIcon() {
  return (
    <IconBase>
      <path d="M3 4.5h14v11H3z" />
      <path d="M3 11h4.5l1 2h3l1-2H17" />
    </IconBase>
  );
}

function BubbleIcon() {
  return (
    <IconBase>
      <path d="M3.5 4h13v9.5H9.5L6 16.5v-3H3.5z" />
    </IconBase>
  );
}

function BellIcon() {
  return (
    <IconBase>
      <path d="M10 3.5a4.5 4.5 0 0 1 4.5 4.5v3l1.5 2.5h-12L5.5 11V8A4.5 4.5 0 0 1 10 3.5z" />
      <path d="M8.5 16.5a1.5 1.5 0 0 0 3 0" />
    </IconBase>
  );
}

function PeopleIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M10 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
      <path d="M4 16.5c.9-2.8 3.1-4.3 6-4.3s5.1 1.5 6 4.3" />
    </IconBase>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M10 12.5V3" />
      <path d="M6.5 6 10 2.5 13.5 6" />
      <path d="M4 10.5V17h12v-6.5" />
    </IconBase>
  );
}

function PlatformBadge({ platform, className = "" }: { platform: Platform; className?: string }) {
  if (platform === "twitch") return null;

  const styles: Record<Platform, string> = {
    twitch: "",
    kick: "bg-[#53fc18] text-black",
    youtube: "bg-[#ff0000] text-white",
    tiktok: "bg-white text-black"
  };

  return (
    <span
      className={`shrink-0 rounded-[3px] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles[platform]} ${className}`}
    >
      {platformLabels[platform]}
    </span>
  );
}

function PersonIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 9.8a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8zM3.5 17a6.5 6.5 0 0 1 13 0v.3h-13V17z" />
    </svg>
  );
}

function MultiviewIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="3" width="5.5" height="5.5" />
      <rect x="11.5" y="3" width="5.5" height="5.5" />
      <rect x="3" y="11.5" width="5.5" height="5.5" />
      <rect x="11.5" y="11.5" width="5.5" height="5.5" />
    </IconBase>
  );
}

function MultiviewLayoutPreview({
  layout,
  channelCount,
  active
}: {
  layout: MultiviewLayout;
  channelCount: number;
  active: boolean;
}) {
  const count = Math.max(1, Math.min(channelCount, maxMultiviewChannels));
  const playerClass = active ? "bg-burgundy text-white" : "bg-wine text-gold-soft";
  const chatClass = active ? "bg-gold text-[#21150a]" : "bg-[#5A431E] text-gold-soft";
  const player = (number: number, className = "") => (
    <span className={`grid min-h-0 place-items-center text-[12px] font-bold ${playerClass} ${className}`}>{number}</span>
  );
  const chat = (className = "") => (
    <span className={`grid min-h-0 place-items-center text-[12px] font-bold ${chatClass} ${className}`}>C</span>
  );

  if (layout === "Focus") {
    if (count === 6) {
      return (
        <div className="grid h-full w-full grid-cols-[1fr_10px] gap-[2px]">
          <span className="grid min-h-0 grid-cols-2 grid-rows-3 gap-[2px]">
            {player(1)}
            {player(2)}
            {player(3)}
            {player(4)}
            {player(5)}
            {player(6)}
          </span>
          {chat()}
        </div>
      );
    }

    if (count === 5) {
      return (
        <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-[2px]">
          {player(1)}
          {player(2)}
          {chat()}
          {player(3)}
          {player(4)}
          {player(5)}
        </div>
      );
    }

    if (count === 4) {
      return (
        <div className="grid h-full w-full grid-cols-[1fr_1fr_1fr_10px] grid-rows-2 gap-[2px]">
          {player(1, "col-span-3")}
          {player(2)}
          {player(3)}
          {player(4)}
          {chat("col-start-4 row-span-2 row-start-1")}
        </div>
      );
    }

    return (
      <div className="grid h-full w-full grid-cols-[1fr_1fr_10px] grid-rows-2 gap-[2px]">
        {player(1, count === 1 ? "col-span-2 row-span-2" : "col-span-2")}
        {count >= 2 && player(2, count === 2 ? "col-span-2" : "")}
        {count >= 3 && player(3)}
        {chat("col-start-3 row-span-2 row-start-1")}
      </div>
    );
  }

  if (layout === "Grid") {
    if (count === 1) {
      return (
        <div className="grid h-full w-full grid-cols-[1fr_10px] gap-[2px]">
          {player(1)}
          {chat()}
        </div>
      );
    }

    if (count === 2) {
      return (
        <div className="grid h-full w-full grid-cols-2 grid-rows-[1fr_10px] gap-[2px]">
          {player(1)}
          {player(2)}
          {chat()}
          {chat()}
        </div>
      );
    }

    if (count === 3) {
      return (
        <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
          {player(1)}
          {player(2)}
          {player(3)}
          {chat()}
        </div>
      );
    }

    if (count === 5) {
      return (
        <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-[2px]">
          {player(1)}
          {player(2)}
          {player(3)}
          {player(4)}
          {chat()}
          {player(5)}
        </div>
      );
    }

    return (
      <div className="grid h-full w-full grid-cols-[1fr_1fr_10px] grid-rows-2 gap-[2px]">
        {player(1)}
        {player(2)}
        {player(3)}
        {player(4)}
        {chat("col-start-3 row-span-2 row-start-1")}
      </div>
    );
  }

  if (count === 1) {
    return (
      <div className="grid h-full w-full">
        {player(1)}
      </div>
    );
  }

  if (count === 2) {
    return (
      <div className="grid h-full w-full grid-rows-2 gap-[2px]">
        {player(1)}
        {player(2)}
      </div>
    );
  }

  if (count === 6) {
    return (
      <div className="grid h-full w-full grid-cols-3 grid-rows-2 gap-[2px]">
        {player(1)}
        {player(2)}
        {player(3)}
        {player(4)}
        {player(5)}
        {player(6)}
      </div>
    );
  }

  if (count === 5) {
    return (
      <div className="grid h-full w-full grid-cols-6 grid-rows-2 gap-[2px]">
        {player(1, "col-span-3")}
        {player(2, "col-span-3")}
        {player(3, "col-span-2")}
        {player(4, "col-span-2")}
        {player(5, "col-span-2")}
      </div>
    );
  }

  if (count === 4) {
    return (
      <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
        {player(1)}
        {player(2)}
        {player(3)}
        {player(4)}
      </div>
    );
  }

  return (
    <div className="grid h-full w-full grid-cols-2 grid-rows-2 gap-[2px]">
      {player(1, "col-span-2")}
      {player(2)}
      {player(3)}
    </div>
  );
}

function VolumeIcon({ muted }: { muted: boolean }) {
  return (
    <IconBase className="h-4 w-4">
      <path d="M4 8h3l3-3v10l-3-3H4z" />
      {muted ? <path d="m13 8 3 3m0-3-3 3" /> : <path d="M13 8a3 3 0 0 1 0 4" />}
    </IconBase>
  );
}

function CloseIcon() {
  return (
    <IconBase className="h-4 w-4">
      <path d="m5.5 5.5 9 9m0-9-9 9" />
    </IconBase>
  );
}

function KebabIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <circle cx="10" cy="4.5" r="1.5" />
      <circle cx="10" cy="10" r="1.5" />
      <circle cx="10" cy="15.5" r="1.5" />
    </svg>
  );
}

function HeartIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="M10 17.2 3.2 10.4a4 4 0 0 1 0-5.6 3.9 3.9 0 0 1 5.6 0L10 6l1.2-1.2a3.9 3.9 0 0 1 5.6 0 4 4 0 0 1 0 5.6L10 17.2z" />
    </svg>
  );
}

function StarIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path d="m10 1.8 2.5 5.1 5.7.8-4.1 4 1 5.6-5.1-2.7-5.1 2.7 1-5.6-4.1-4 5.7-.8L10 1.8z" />
    </svg>
  );
}

function GiftIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <rect x="3" y="8" width="18" height="4" rx="1" />
      <path d="M5 12v8h14v-8M12 8v12M12 8H8.5a2.5 2.5 0 1 1 2.5-2.5ZM12 8h3.5A2.5 2.5 0 1 0 13 5.5Z" />
    </svg>
  );
}

function VerifiedIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 1.5 12.6 3l3-.2.9 2.9 2.4 1.8-1 2.5 1 2.5-2.4 1.8-.9 2.9-3-.2L10 18.5 7.4 17l-3 .2-.9-2.9-2.4-1.8 1-2.5-1-2.5 2.4-1.8.9-2.9 3 .2L10 1.5zm-1.2 11.7 5.6-5.6-1.4-1.4-4.2 4.2-1.8-1.8-1.4 1.4 3.2 3.2z"
      />
    </svg>
  );
}
