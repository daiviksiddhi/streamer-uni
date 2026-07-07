"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
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
  Sports: "https://static-cdn.jtvnw.net/ttv-boxart/518203-285x380.jpg",
  Creative: "https://static-cdn.jtvnw.net/ttv-boxart/509660-285x380.jpg"
};

const formatViewers = (value: number) => {
  if (value === 0) return "Offline";
  if (value >= 1000) {
    const rounded = value / 1000;
    return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)}K`;
  }
  return String(value);
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
const getWatchUrl = (login: string, parent: string) =>
  `https://player.twitch.tv/?channel=${encodeURIComponent(login)}&parent=${encodeURIComponent(parent)}&autoplay=true&muted=true`;

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

  // Once live data lands, feature the biggest live stream instead of an offline channel
  const didAutoFeature = useRef(false);
  useEffect(() => {
    if (didAutoFeature.current || initialLogin) return;
    const topLive = [...mergedChannels]
      .filter((channel) => channel.live)
      .sort((a, b) => b.viewers - a.viewers)[0];

    if (topLive) {
      didAutoFeature.current = true;
      const timer = window.setTimeout(() => {
        setActiveLogin(topLive.login);
      }, 0);

      return () => {
        window.clearTimeout(timer);
      };
    }
  }, [mergedChannels, initialLogin]);

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
      const roleMatch =
        filter === "All" ||
        (filter === "Faculty" && channel.role === "Faculty") ||
        (filter === "Students" && channel.role === "Student");
      const queryMatch =
        !normalized ||
        channel.login.toLowerCase().includes(normalized) ||
        channel.name.toLowerCase().includes(normalized) ||
        channel.campusRole.toLowerCase().includes(normalized) ||
        channel.category.toLowerCase().includes(normalized) ||
        channel.title.toLowerCase().includes(normalized);
      return roleMatch && queryMatch;
    });
  }, [filter, mergedChannels, query]);

  const activeChannel =
    mergedChannels.find((channel) => channel.login === activeLogin) ?? mergedChannels[0];
  const watchChannel =
    mergedChannels.find((channel) => channel.login === watchLogin) ?? null;
  const liveChannels = visibleChannels.filter((channel) => channel.live);
  const offlineChannels = visibleChannels.filter((channel) => !channel.live);

  const moveFeatured = (direction: number) => {
    const currentIndex = mergedChannels.findIndex((channel) => channel.login === activeChannel.login);
    const nextIndex = (currentIndex + direction + mergedChannels.length) % mergedChannels.length;
    setActiveLogin(mergedChannels[nextIndex].login);
  };

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
        <a
          href="https://shop.streameruniversity.com"
          target="_blank"
          rel="noreferrer"
          className="mx-1 hidden h-8 items-center gap-2 rounded-[999px] bg-[#2f2f35] px-4 text-[13px] font-bold hover:bg-[#3b3b44] md:flex"
        >
          Buy Merch
        </a>
        <button
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#9147ff] text-white"
          aria-label="Account"
        >
          <PersonIcon className="h-5 w-5" />
        </button>
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
                    onClick={() => setFilter(item)}
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
                  categories={categoryStats.filter((category) => category.liveCount > 0).slice(0, 6)}
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
            <section className="relative mb-8 min-h-[292px] overflow-hidden">
              <button
                onClick={() => moveFeatured(-1)}
                className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-[4px] hover:bg-[#2f2f35] lg:grid"
                aria-label="Previous featured channel"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                onClick={() => moveFeatured(1)}
                className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-[4px] hover:bg-[#2f2f35] lg:grid"
                aria-label="Next featured channel"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
              <div className="mx-auto grid max-w-[980px] grid-cols-1 bg-[#18181b] shadow-[0_12px_35px_rgba(0,0,0,0.45)] lg:grid-cols-[minmax(0,1fr)_292px]">
                <button
                  onClick={() => openChannel(activeChannel.login)}
                  className="group relative aspect-video min-h-[220px] overflow-hidden bg-black text-left"
                >
                  <StreamThumbnail channel={activeChannel} className="transition duration-300 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />
                  {activeChannel.live && <span className="absolute left-3 top-3 rounded-[3px] bg-[#eb0400] px-2 py-1 text-[13px] font-black">LIVE</span>}
                  <div className="absolute bottom-3 left-3 rounded-[3px] bg-black/65 px-2 py-1 text-[15px] font-semibold">
                    {activeChannel.live ? `${formatViewers(activeChannel.viewers)} viewers` : "Offline"}
                  </div>
                </button>
                <div className="flex min-h-[220px] flex-col p-4">
                  <div className="flex gap-3">
                    <Avatar channel={activeChannel} size="lg" />
                    <div className="min-w-0">
                      <button className="truncate text-left text-[18px] font-bold text-[#bf94ff] hover:underline">
                        {activeChannel.name}
                      </button>
                      <p className="truncate text-[15px] text-white">{activeChannel.category}</p>
                      <p className="truncate text-[14px] text-[#adadb8]">{activeChannel.campusRole}</p>
                      <p className="text-[14px] text-[#dedee3]">
                        {activeChannel.live ? `${formatViewers(activeChannel.viewers)} viewers` : "Offline"}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-3 text-[14px] leading-snug text-[#efeff1]">{activeChannel.title}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeChannel.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-[#2f2f35] px-2 py-1 text-[12px] font-bold text-[#dedee3]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex gap-2 pt-5">
                    <button
                      onClick={() => openChannel(activeChannel.login)}
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
            </section>

            <ChannelShelf
              title="Live channels"
              accent="we think you'll like"
              channels={[...liveChannels].sort((a, b) => b.viewers - a.viewers).slice(0, 8)}
              activeLogin={activeLogin}
              onSelect={openChannel}
            />

            <CategoryShelf categories={categoryStats} art={gameArt} onSelect={openCategory} />

            <ChannelShelf
              title="Rising on campus"
              accent="small streams that deserve some love"
              channels={[...liveChannels]
                .filter((channel) => channel.viewers > 0)
                .sort((a, b) => a.viewers - b.viewers)
                .slice(0, 8)}
              activeLogin={activeLogin}
              onSelect={openChannel}
            />

            <ChannelShelf
              title="Streamer University"
              accent="campus directory"
              channels={visibleChannels}
              activeLogin={activeLogin}
              onSelect={openChannel}
              initialCount={12}
            />

            {offlineChannels.length > 0 && (
              <ChannelShelf
                title="Offline"
                accent="recent campus streams"
                channels={offlineChannels}
                activeLogin={activeLogin}
                onSelect={openChannel}
                initialCount={8}
              />
            )}
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
  title,
  accent,
  channels: shelfChannels,
  activeLogin,
  onSelect,
  initialCount
}: {
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
      <section className="mb-8 border-t border-[#2f2f35] pt-6">
        <h2 className="text-[20px] font-bold">
          <span className="text-[#bf94ff]">{title}</span> {accent}
        </h2>
        <div className="mt-4 bg-[#18181b] px-4 py-8 text-center text-[#adadb8]">No channels match this search.</div>
      </section>
    );
  }

  return (
    <section className="mb-8">
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
        <span className="text-[#bf94ff]">Categories</span>{" "}we think you&apos;ll like
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
