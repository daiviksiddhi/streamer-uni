"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    accent: "#9147ff"
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
    accent: "#c281ff"
  },
  {
    login: "maya",
    name: "Maya",
    campusRole: "Professor",
    category: "Animals, Aquariums, and Zoos",
    title: "Community class: turning causes into compelling streams",
    viewers: 22200,
    live: true,
    verified: true,
    tags: ["Professor", "Community"],
    accent: "#67e8a2"
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
    login: "pokimane",
    name: "Pokimane",
    campusRole: "Professor",
    category: "Just Chatting",
    title: "Creator class: brand, community, and longevity",
    viewers: 51700,
    live: true,
    verified: true,
    tags: ["Professor", "Creator Class"],
    accent: "#fb7185"
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
    accent: "#a78bfa"
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
    accent: "#ef4444"
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
  "blazian_",
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
  "ysabella_grace",
  "Bonita",
  "itsregtoofunny",
  "e11ysa",
  "rulaempire",
  "Sarahfarrugia",
  "jshock9nine",
  "Lacy",
  "lanializa",
  "MandoMillions",
  "Realdreamdoll",
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
  "Chris_Gone_Crazy00",
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
  "realbigant",
  "taylorjasminee",
  "AngelCrackedU",
  "damiilive",
  "Jordynlucas",
  "themightyba",
  "avazura",
  "ilikehaskell",
  "runiktvlive",
  "rizzy_streamz",
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
  "#9147ff",
  "#00c8af",
  "#ff75e6",
  "#ffb000",
  "#7bdcff",
  "#fb7185"
];

const channels: Channel[] = [
  ...facultySeeds.map((channel, index) => ({
    ...channel,
    role: "Faculty" as const,
    live: false,
    viewers: 0,
    accent: channel.accent ?? studentAccents[index % studentAccents.length]
  })),
  ...studentHandles.map((handle, index) => {
    const category = studentCategories[index % studentCategories.length];

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
      accent: studentAccents[index % studentAccents.length]
    };
  })
];

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

const chunkItems = <T,>(items: T[], size: number) => {
  const chunks: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
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

export function StreamerApp({ initialWatchLogin }: { initialWatchLogin?: string }) {
  const router = useRouter();
  const initialLogin = initialWatchLogin?.toLowerCase();
  const [activeLogin, setActiveLogin] = useState(initialLogin ?? channels[0].login);
  const [watchLogin, setWatchLogin] = useState<string | null>(initialLogin ?? null);
  const [query, setQuery] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [embedParent, setEmbedParent] = useState("");
  const [filter, setFilter] = useState<"All" | "Faculty" | "Students">("All");
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
    const users = channels.map((channel) => channel.login);

    fetch(`/api/twitch/clips?users=${encodeURIComponent(users.join(","))}`)
      .then((response) =>
        response.json() as Promise<{
          clips?: TwitchClip[];
        }>
      )
      .then((payload) => {
        if (!ignore) setPopularClips(payload.clips ?? []);
      })
      .catch(() => {
        if (!ignore) setPopularClips([]);
      });

    return () => {
      ignore = true;
    };
  }, [isDirectoryLoading]);

  useEffect(() => {
    const userChunks = chunkItems(
      channels.map((channel) => channel.login),
      100
    );
    let ignore = false;

    Promise.all(
      userChunks.map((users) =>
        fetch(`/api/twitch/live?users=${encodeURIComponent(users.join(","))}`).then((response) =>
          response.json() as Promise<{
            configured?: boolean;
            streams?: TwitchStream[];
            users?: TwitchUser[];
            games?: TwitchGame[];
          }>
        )
      )
    )
      .then((payloads) => {
        if (ignore || payloads.some((payload) => !payload.configured)) return;
        const nextOverrides = channels.reduce<Record<string, Partial<Channel>>>((acc, channel) => {
          acc[channel.login] = {
            live: false,
            viewers: 0
          };
          return acc;
        }, {});

        payloads.flatMap((payload) => payload.users ?? []).forEach((user) => {
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

        payloads.flatMap((payload) => payload.streams ?? []).forEach((stream) => {
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
        payloads.flatMap((payload) => payload.games ?? []).forEach((game) => {
          if (game.name && game.box_art_url) {
            nextArt[game.name] = game.box_art_url
              .replace("{width}", "285")
              .replace("{height}", "380");
          }
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

  const mergedChannels = useMemo(
    () =>
      channels.map((channel) => {
        const merged = { ...channel, ...liveOverrides[channel.login] };

        return {
          ...merged,
          tags: merged.live ? merged.tags.filter((tag) => tag !== "Offline") : merged.tags
        };
      }),
    [liveOverrides]
  );

  const openChannel = (login: string) => {
    setActiveLogin(login);
    setWatchLogin(login);
    router.push(`/${login}`);
  };

  const browseHome = () => {
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

  const visibleChannels = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return mergedChannels.filter((channel) => {
      const queryMatch =
        !normalized ||
        channel.login.toLowerCase().includes(normalized) ||
        channel.name.toLowerCase().includes(normalized) ||
        channel.campusRole.toLowerCase().includes(normalized) ||
        channel.category.toLowerCase().includes(normalized) ||
        channel.title.toLowerCase().includes(normalized);
      return queryMatch;
    });
  }, [mergedChannels, query]);

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
      <header className="fixed inset-x-0 top-0 z-40 flex h-[50px] items-center gap-1 border-b border-[#2f2f35] bg-[#18181b] pl-2 pr-3 shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        <button
          onClick={browseHome}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-[4px] hover:bg-[#26262c]"
          aria-label="Streamer University home"
        >
          <img src="/su-crest-2026-transparent.png" alt="" className="h-8 w-8 object-contain" />
        </button>
        <button onClick={browseHome} className="hidden h-full px-4 text-[15px] font-semibold text-white hover:text-[#bf94ff] sm:block">
          Following
        </button>
        <button onClick={browseHome} className="hidden h-full px-4 text-[15px] font-semibold text-white hover:text-[#bf94ff] sm:block">
          Browse
        </button>
        <button className="hidden h-8 w-8 items-center justify-center rounded-[4px] hover:bg-[#2f2f35] md:flex" aria-label="More">
          <KebabIcon />
        </button>
        <label className="mx-auto flex h-9 w-full max-w-[540px] overflow-hidden rounded-[6px] border border-[#67676b] bg-[#18181b] focus-within:border-[#a970ff] focus-within:bg-[#0e0e10]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-[#adadb8]"
            placeholder="Search"
            type="search"
          />
          <span className="flex w-11 items-center justify-center rounded-r-[6px] bg-[#2f2f35] text-[#dedee3]" aria-hidden="true">
            <span className="search-glyph" />
          </span>
        </label>
        <div className="hidden items-center gap-1.5 lg:flex">
          <button className="relative grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#2f2f35]" aria-label="Activity feed">
            <TrayIcon />
            <span className="absolute -top-1 left-4 rounded-full bg-[#eb0400] px-1 text-[11px] font-bold leading-4 text-white">
              67
            </span>
          </button>
          <button className="grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#2f2f35]" aria-label="Whispers">
            <BubbleIcon />
          </button>
          <button className="relative grid h-8 w-8 place-items-center rounded-[4px] hover:bg-[#2f2f35]" aria-label="Notifications">
            <BellIcon />
            <span className="absolute right-1 top-0.5 h-2 w-2 rounded-full bg-[#bf94ff]" />
          </button>
        </div>
        <Link
          href="/multiview"
          className="hidden h-8 items-center gap-2 rounded-[4px] bg-[#9147ff] px-3.5 text-[13px] font-bold text-white shadow-[0_0_14px_rgba(145,71,255,0.35)] hover:bg-[#772ce8] lg:flex"
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
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#9147ff] text-white hover:bg-[#772ce8]"
          aria-label="X profile"
        >
          <PersonIcon className="h-5 w-5" />
        </a>
      </header>

      <div className="flex pt-[50px]">
        <aside
          className={`fixed bottom-0 left-0 top-[50px] z-30 border-r border-[#2f2f35] bg-[#1f1f23] transition-all duration-200 ${
            sideOpen ? "w-[286px]" : "w-[58px]"
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
              <div className="mx-2 mb-2 grid grid-cols-3 rounded-[4px] bg-[#111114] p-1 text-[14px] font-bold">
                {(["All", "Faculty", "Students"] as const).map((item) => (
                  <button
                    key={item}
                    onClick={() => selectDirectoryFilter(item)}
                    className={`rounded-[3px] px-2 py-1.5 ${
                      filter === item ? "bg-[#9147ff] text-white" : "text-[#adadb8] hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
            <div className="min-h-0 flex-1 overflow-y-auto pb-2">
              {campusSections.map((section) => (
                <SidebarSection
                  key={section}
                  collapsed={!sideOpen}
                  title={getSectionTitle(section)}
                  channels={mergedChannels.filter((channel) => channel.campusRole === section)}
                  activeLogin={activeLogin}
                  onSelect={openChannel}
                />
              ))}
              {sideOpen && (
                <SidebarCategories
                  categories={displayCategories.filter((category) => category.liveCount > 0).slice(0, 6)}
                  art={gameArt}
                  onSelect={openCategory}
                />
              )}
            </div>
          </div>
        </aside>

        <section className={`min-w-0 flex-1 transition-[margin] duration-200 ${sideOpen ? "ml-[286px]" : "ml-[58px]"}`}>
          {watchChannel ? (
            <WatchStage channel={watchChannel} parent={embedParent} onCategory={openCategory} />
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
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#eb0400] opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[#eb0400]" />
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
            <section className="relative mb-8 min-h-[292px] overflow-hidden xl:min-h-[390px]">
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
                    {featuredChannel.live && <span className="absolute left-3 top-3 rounded-[3px] bg-[#eb0400] px-2 py-1 text-[13px] font-black">LIVE</span>}
                    <div className="absolute bottom-3 left-3 rounded-[3px] bg-black/65 px-2 py-1 text-[15px] font-semibold">
                      {featuredChannel.live ? `${formatViewers(featuredChannel.viewers)} viewers` : "Offline"}
                    </div>
                  </button>
                  <div className="flex min-h-[220px] flex-col p-4">
                    <div className="flex gap-3">
                      <Avatar channel={featuredChannel} size="lg" />
                      <div className="min-w-0">
                        <button className="truncate text-left text-[18px] font-bold text-[#bf94ff] hover:underline">
                          {featuredChannel.name}
                        </button>
                        <p className="truncate text-[15px] text-white">{featuredChannel.category}</p>
                        <p className="truncate text-[14px] text-[#adadb8]">{featuredChannel.campusRole}</p>
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
                        className="h-9 flex-1 rounded-[4px] bg-[#9147ff] px-3 text-[14px] font-bold text-white hover:bg-[#772ce8]"
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
              title="Live on campus"
              accent="who's streaming right now"
              channels={[
                ...(liveChannels.length > 1
                  ? liveChannels.filter((channel) => channel.login !== featuredChannel.login)
                  : liveChannels)
              ]
                .sort((a, b) => b.viewers - a.viewers)
                .slice(0, 8)}
              activeLogin={activeLogin}
              onSelect={openChannel}
            />

            <CatchUpShelf clips={popularClips} channels={mergedChannels} />

            <CategoryShelf categories={displayCategories} art={gameArt} onSelect={openCategory} />

            <ChannelShelf
              title="Rising on campus"
              accent="freshmen who deserve some love"
              channels={[...liveChannels]
                .filter((channel) => channel.viewers > 0)
                .sort((a, b) => a.viewers - b.viewers)
                .slice(0, 8)}
              activeLogin={activeLogin}
              onSelect={openChannel}
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
          <Footer />
        </section>
      </div>
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
          className="mt-5 h-7 w-7 animate-spin rounded-full border-[3px] border-[#3b3b44] border-t-[#9147ff]"
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
            className="text-[#bf94ff] hover:underline"
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

export default function Home() {
  return <StreamerApp />;
}

type MultiviewLayout = "Focus" | "Grid" | "Wide";

export function MultiviewApp({ initialLogins = [] }: { initialLogins?: string[] }) {
  const router = useRouter();
  const [liveOverrides, setLiveOverrides] = useState<Record<string, Partial<Channel>>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [embedParent, setEmbedParent] = useState("");
  const [layout, setLayout] = useState<MultiviewLayout>("Focus");
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedLogins, setSelectedLogins] = useState(() =>
    Array.from(new Set(initialLogins.map((login) => login.toLowerCase())))
      .filter((login) => channels.some((channel) => channel.login === login))
      .slice(0, 4)
  );
  const [activeChatLogin, setActiveChatLogin] = useState(() => initialLogins[0]?.toLowerCase() ?? "");
  const [audioLogin, setAudioLogin] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setEmbedParent(window.location.hostname), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userChunks = chunkItems(
      channels.map((channel) => channel.login),
      100
    );
    let ignore = false;

    Promise.all(
      userChunks.map((users) =>
        fetch(`/api/twitch/live?users=${encodeURIComponent(users.join(","))}`).then((response) =>
          response.json() as Promise<{
            configured?: boolean;
            streams?: TwitchStream[];
            users?: TwitchUser[];
          }>
        )
      )
    )
      .then((payloads) => {
        if (ignore || payloads.some((payload) => !payload.configured)) return;
        const nextOverrides = channels.reduce<Record<string, Partial<Channel>>>((acc, channel) => {
          acc[channel.login] = { live: false, viewers: 0 };
          return acc;
        }, {});

        payloads.flatMap((payload) => payload.users ?? []).forEach((user) => {
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

        payloads.flatMap((payload) => payload.streams ?? []).forEach((stream) => {
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

  const directory = useMemo(
    () => channels.map((channel) => ({ ...channel, ...liveOverrides[channel.login] })),
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
  const usesSharedChat = layout === "Focus" || (layout === "Grid" && selectedChannels.length === 4);
  const usesInlineChats = layout === "Grid" && selectedChannels.length <= 2;
  const usesGridChatTile = layout === "Grid" && selectedChannels.length === 3;

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
    if (selectedLogins.length >= 4) return;
    updateSelection([...selectedLogins, login]);
  };

  return (
    <main className="min-h-screen bg-[#0e0e10] text-[#efeff1]">
      <header className="fixed inset-x-0 top-0 z-40 flex h-[50px] items-center gap-2 border-b border-[#2f2f35] bg-[#18181b] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        <Link href="/" className="grid h-9 w-9 place-items-center rounded-[4px] hover:bg-[#26262c]" aria-label="Streamer University home">
          <img src="/su-crest-2026-transparent.png" alt="" className="h-7 w-7 object-contain" />
        </Link>
        <Link href="/" className="hidden px-2 text-[15px] font-semibold text-white hover:text-[#bf94ff] sm:block">
          Browse
        </Link>
        <div className="flex items-center gap-2 border-l border-[#34343b] pl-3">
          <MultiviewIcon className="h-4 w-4 text-[#bf94ff]" />
          <span className="text-[15px] font-semibold text-white">Lecture Hall</span>
          <span className="rounded-full bg-[#2f2f35] px-2 py-0.5 text-[12px] font-semibold text-[#dedee3]">
            {selectedChannels.length}/4
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
            <span className="text-[#bf94ff]">{liveChannels.length}</span>
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${isPickerOpen ? "rotate-180" : ""}`} />
          </button>
          {isPickerOpen && (
            <>
              <div className="absolute right-full top-[calc(100%+8px)] z-50 flex w-[68px] flex-col gap-1 border border-r-0 border-[#34343b] bg-[#18181b] p-1.5 shadow-[0_10px_24px_rgba(0,0,0,0.55)]">
                {(["Focus", "Grid", "Wide"] as const).map((option) => (
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
                  <span className="text-[13px] font-semibold text-[#bf94ff]">{liveChannels.length}</span>
                </div>
                <div className="min-h-0 overflow-y-auto py-1">
                  {isLoading ? (
                    <div className="px-3 py-6 text-center text-[13px] text-[#adadb8]">Loading live channels</div>
                  ) : (
                    liveChannels.map((channel) => {
                      const isSelected = selectedLogins.includes(channel.login);
                      const atLimit = selectedLogins.length >= 4 && !isSelected;
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
                            <span className="grid h-5 w-5 place-items-center rounded-[3px] bg-[#9147ff] text-[12px] font-bold text-white">
                              {selectionIndex + 1}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[12px] text-[#dedee3]">
                              <span className="h-2 w-2 rounded-full bg-[#eb0400]" />
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
  const gridClass =
    layout === "Grid"
      ? "grid-cols-1 sm:grid-cols-2"
      : layout === "Wide"
        ? channels.length <= 2
          ? "grid-cols-1"
          : channels.length === 3
            ? "grid-cols-1 lg:grid-cols-2 lg:grid-rows-2"
            : "grid-cols-1 sm:grid-cols-2"
          : channels.length <= 2
          ? "grid-cols-1"
          : channels.length === 4
            ? "grid-cols-1 lg:grid-cols-3 lg:grid-rows-2"
            : "grid-cols-1 lg:grid-cols-2 lg:grid-rows-2";

  return (
    <div className={`grid min-h-[440px] gap-2 xl:h-full xl:min-h-0 ${gridClass}`}>
      {channels.map((channel, index) => {
        const tileClass =
          (layout === "Focus" || layout === "Wide") && channels.length === 3 && index === 0
            ? "lg:col-span-2"
            : layout === "Focus" && channels.length === 4 && index === 0
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
                  isActiveChat ? "bg-[#9147ff]" : "bg-black/60 hover:bg-[#2f2f35]"
                }`}
              >
                <Avatar channel={channel} size="sm" />
                <span className="max-w-[120px] truncate">{channel.name}</span>
              </button>
              <span className="pointer-events-auto flex items-center gap-1">
                <button
                  onClick={() => onSelectAudio(isActiveAudio ? null : channel.login)}
                  className={`grid h-7 w-7 place-items-center rounded-[4px] ${
                    isActiveAudio ? "bg-[#9147ff] text-white" : "bg-black/60 text-[#dedee3] hover:bg-[#2f2f35]"
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
      {chatTile && <div className="relative min-h-[300px] overflow-hidden bg-[#18181b] xl:min-h-0">{chatTile}</div>}
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
            className={`flex h-[46px] w-full items-center gap-3 px-3 text-left hover:bg-[#26262c] ${
              activeLogin === channel.login ? "bg-[#2f2f35]" : ""
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
                    <span className="h-2 w-2 rounded-full bg-[#eb0400]" />
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
          className="px-3 py-2 text-[14px] font-semibold text-[#bf94ff] hover:underline"
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
  onCategory
}: {
  channel: Channel;
  parent: string;
  onCategory: (name: string) => void;
}) {
  return (
    <div className="flex flex-col xl:flex-row">
      <div className="min-w-0 flex-1">
        <div className="relative aspect-video max-h-[calc(100svh-170px)] w-full bg-black">
          {parent ? (
            <iframe
              src={getWatchUrl(channel.login, parent)}
              title={`${channel.name} Twitch stream`}
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
                <span className={`grid place-items-center rounded-full p-[3px] ${channel.live ? "bg-[#eb0400]" : "bg-transparent"}`}>
                  <span className="grid place-items-center rounded-full bg-[#0e0e10] p-[3px]">
                    <Avatar channel={channel} size="lg" />
                  </span>
                </span>
                {channel.live && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-[4px] border-2 border-[#0e0e10] bg-[#eb0400] px-1 text-[12px] font-bold uppercase text-white">
                    Live
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="truncate text-[20px] font-semibold text-white">{channel.name}</h1>
                  {channel.verified && <VerifiedIcon className="h-4 w-4 shrink-0 text-[#bf94ff]" />}
                </div>
                <p className="mt-0.5 line-clamp-2 text-[14px] font-semibold text-white">{channel.title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <button
                    onClick={() => onCategory(channel.category)}
                    className="text-[14px] font-semibold text-[#bf94ff] hover:underline"
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
              <div className="flex gap-2">
                <a
                  href={`https://www.twitch.tv/${channel.login}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-8 items-center gap-1.5 rounded-[4px] bg-[#9147ff] px-3 text-[13px] font-semibold text-white hover:bg-[#772ce8]"
                >
                  <HeartIcon className="h-4 w-4" />
                  Follow
                </a>
                <a
                  href={`https://www.twitch.tv/subs/${channel.login}`}
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
              {channel.verified && <VerifiedIcon className="h-4 w-4 text-[#bf94ff]" />}
            </div>
            <p className="mt-2 text-[14px] text-[#dedee3]">
              {channel.campusRole} at Streamer University · Streams {channel.category}.
            </p>
            <a
              href={`https://www.twitch.tv/${channel.login}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[14px] font-semibold text-[#bf94ff] hover:underline"
            >
              twitch.tv/{channel.login}
            </a>
          </section>
        </div>
      </div>

      <aside className="flex h-[480px] w-full shrink-0 flex-col border-t border-[#2f2f35] bg-[#18181b] xl:sticky xl:top-[50px] xl:h-[calc(100vh-50px)] xl:w-[376px] xl:border-l xl:border-t-0">
        {parent ? (
          <iframe
            src={getChatUrl(channel.login, parent)}
            title={`${channel.name} Twitch chat`}
            className="min-h-0 w-full flex-1 border-0"
          />
        ) : (
          <div className="grid flex-1 place-items-center text-[#adadb8]">Chat loading</div>
        )}
      </aside>
    </div>
  );
}

function ChannelShelf({
  id,
  title,
  accent,
  channels: shelfChannels,
  activeLogin,
  onSelect,
  initialCount
}: {
  id?: string;
  title: string;
  accent: string;
  channels: Channel[];
  activeLogin: string;
  onSelect: (login: string) => void;
  initialCount?: number;
}) {
  // Untruncated shelves must not freeze a count at mount time — channel lists
  // start empty and fill in once the Twitch data loads.
  const [visibleCount, setVisibleCount] = useState(initialCount ?? Number.POSITIVE_INFINITY);

  if (!shelfChannels.length) {
    return (
      <section id={id} className="mb-8 scroll-mt-[70px] border-t border-[#2f2f35] pt-6">
        <h2 className="text-[20px] font-bold">
          <span className="text-[#bf94ff]">{title}</span> {accent}
        </h2>
        <div className="mt-4 bg-[#18181b] px-4 py-8 text-center text-[#adadb8]">No channels match this search.</div>
      </section>
    );
  }

  return (
    <section id={id} className="mb-8 scroll-mt-[70px]">
      <h2 className="mb-4 text-[20px] font-bold">
        <span className="text-[#bf94ff]">{title}</span> {accent}
      </h2>
      <div className="grid gap-x-3 gap-y-7 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {shelfChannels.slice(0, visibleCount).map((channel) => (
          <button key={channel.login} onClick={() => onSelect(channel.login)} className="group min-w-0 text-left">
            <div className="relative">
              <div className="absolute inset-0 bg-[#9147ff]" aria-hidden="true" />
              <div
                className={`relative aspect-video overflow-hidden bg-[#18181b] transition-transform duration-100 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1.5 ${
                  activeLogin === channel.login ? "outline outline-2 outline-[#9147ff]" : ""
                }`}
              >
                <StreamThumbnail channel={channel} />
                {channel.live ? (
                  <span className="absolute left-2.5 top-2.5 rounded-[4px] bg-[#eb0400] px-1.5 py-0.5 text-[13px] font-semibold uppercase">
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
                <p className="truncate text-[14px] font-semibold text-white group-hover:text-[#bf94ff]">
                  {channel.title}
                </p>
                <p className="mt-0.5 truncate text-[13px] text-[#adadb8]">{channel.name}</p>
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
      </div>
      {initialCount !== undefined && shelfChannels.length > initialCount && (
        <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
          <span className="h-px bg-[#2f2f35]" />
          {visibleCount < shelfChannels.length ? (
            <button
              onClick={() =>
                setVisibleCount((current) => Math.min(current + initialCount, shelfChannels.length))
              }
              className="flex items-center gap-1 rounded-[4px] px-3 py-1.5 text-[13px] font-semibold text-[#bf94ff] hover:bg-[#26262c]"
            >
              Show more
              <ChevronDownIcon className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(initialCount)}
              className="flex items-center gap-1 rounded-[4px] px-3 py-1.5 text-[13px] font-semibold text-[#bf94ff] hover:bg-[#26262c]"
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
  if (!clips.length) return null;

  const channelsByLogin = new Map(channels.map((channel) => [channel.login, channel]));

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-[20px] font-bold">
        <span className="text-[#bf94ff]">Trending</span> in the dorms
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {clips.slice(0, 4).map((clip) => {
          const channel = channelsByLogin.get(clip.broadcaster_login.toLowerCase());
          const name = channel?.name || clip.broadcaster_name;
          const category = clip.game_name || channel?.category || "Streamer University";

          return (
            <article key={clip.id} className="min-w-0">
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
      <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#6E1325] to-[#3D0A16] p-2">
        <img src="/su-crest-2026-transparent.png" alt="" className="w-3/4 object-contain" />
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-[#9147ff] to-[#2b1852] p-2">
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
      <h2 className="mb-4 text-[20px] font-bold">
        <span className="text-[#bf94ff]">Course catalog</span>{" "}what campus is streaming
      </h2>
      <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:grid-cols-4 lg:grid-cols-6 2xl:grid-cols-8">
        {categories.map((category) => (
          <button key={category.name} onClick={() => onSelect(category.name)} className="group min-w-0 text-left">
            <div className="relative">
              <div className="absolute inset-0 bg-[#9147ff]" aria-hidden="true" />
              <div className="relative aspect-[285/380] overflow-hidden bg-[#26262c] transition-transform duration-100 ease-out group-hover:-translate-y-1.5 group-hover:translate-x-1.5">
                <CategoryArt name={category.name} src={art[category.name]} />
              </div>
            </div>
            <p className="mt-1.5 truncate text-[14px] font-semibold text-white group-hover:text-[#bf94ff]">
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
                <span className="h-2 w-2 rounded-full bg-[#eb0400]" />
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
        className="mb-4 flex items-center gap-1 rounded-[4px] py-1 pl-1 pr-2 text-[13px] font-semibold text-[#bf94ff] hover:bg-[#26262c]"
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
  const count = Math.max(1, Math.min(channelCount, 4));
  const playerClass = active ? "bg-[#0074d9] text-white" : "bg-[#06345c] text-[#9c9ca6]";
  const chatClass = active ? "bg-[#bda8dc] text-white" : "bg-[#5c5365] text-[#a9a3af]";
  const player = (number: number, className = "") => (
    <span className={`grid min-h-0 place-items-center text-[12px] font-bold ${playerClass} ${className}`}>{number}</span>
  );
  const chat = (className = "") => (
    <span className={`grid min-h-0 place-items-center text-[12px] font-bold ${chatClass} ${className}`}>C</span>
  );

  if (layout === "Focus") {
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
