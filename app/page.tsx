"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useMemo, useState } from "react";
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

const categories = [
  { name: "Faculty", count: `${facultySeeds.length} channels`, filter: "Faculty" as const },
  { name: "Students", count: `${studentHandles.length} channels`, filter: "Students" as const }
];

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

const getWatchUrl = (login: string, parent: string) =>
  `https://player.twitch.tv/?channel=${encodeURIComponent(login)}&parent=${encodeURIComponent(parent)}&autoplay=true`;

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
  const [liveOverrides, setLiveOverrides] = useState<Record<string, Partial<Channel>>>({});

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
          response.json() as Promise<{ configured?: boolean; streams?: TwitchStream[]; users?: TwitchUser[] }>
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
            live: true,
            viewers: stream.viewer_count ?? 0,
            category: stream.game_name || undefined,
            title: stream.title || undefined,
            thumbnail: stream.thumbnail_url?.replace("{width}", "1100").replace("{height}", "620")
          };
        });

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
      channels.map((channel) => ({
        ...channel,
        ...liveOverrides[channel.login]
      })),
    [liveOverrides]
  );

  const openChannel = (login: string) => {
    setActiveLogin(login);
    setWatchLogin(login);
    router.push(`/${login}`);
  };

  const browseHome = () => {
    setWatchLogin(null);
    router.push("/");
  };

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
      <header className="fixed inset-x-0 top-0 z-40 flex h-[50px] items-center gap-3 border-b border-[#2f2f35] bg-[#18181b] px-3 shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
        <button className="flex h-8 w-8 items-center justify-center rounded-[4px] bg-[#9147ff] text-[13px] font-black text-white shadow-[3px_3px_0_#5f21bd]" aria-label="Streamer University home">
          SU
        </button>
        <button className="hidden h-full px-3 text-[15px] font-semibold text-white hover:text-[#bf94ff] sm:block">
          Following
        </button>
        <button className="hidden h-full px-3 text-[15px] font-semibold text-white hover:text-[#bf94ff] sm:block">
          Browse
        </button>
        <button className="hidden h-8 w-8 items-center justify-center rounded-[4px] text-2xl leading-none hover:bg-[#2f2f35] md:flex" aria-label="More">
          ...
        </button>
        <label className="mx-auto flex h-9 w-full max-w-[520px] overflow-hidden rounded-[6px] border border-[#67676b] bg-[#0e0e10] focus-within:border-[#a970ff]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-w-0 flex-1 bg-transparent px-4 text-[15px] text-white outline-none placeholder:text-[#adadb8]"
            placeholder="Search Streamer University"
            type="search"
          />
          <span className="flex w-12 items-center justify-center bg-[#2f2f35] text-[#dedee3]" aria-hidden="true">
            <span className="search-glyph" />
          </span>
        </label>
        <div className="hidden items-center gap-1 lg:flex">
          {["Inbox", "Drops", "Chat"].map((item, index) => (
            <button key={item} className="relative h-8 rounded-[4px] px-2 text-sm hover:bg-[#2f2f35]">
              {index === 0 && (
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-[#eb0400] px-1 text-[11px] font-bold text-white">
                  12
                </span>
              )}
              {item}
            </button>
          ))}
        </div>
        <button className="hidden h-8 rounded-[999px] bg-[#2f2f35] px-4 text-sm font-bold hover:bg-[#3b3b44] md:block">
          Try Ad-Free
        </button>
        <button className="h-8 w-8 rounded-full bg-[#9147ff] text-sm font-black text-white">DU</button>
      </header>

      <div className="flex pt-[50px]">
        <aside
          className={`fixed bottom-0 left-0 top-[50px] z-30 border-r border-[#2f2f35] bg-[#1f1f23] transition-all duration-200 ${
            sideOpen ? "w-[240px]" : "w-[58px]"
          }`}
        >
          <div className="flex h-full flex-col overflow-hidden">
            <div className="flex h-12 items-center justify-between px-3">
              {sideOpen && <h2 className="text-[15px] font-bold">For Streamer U</h2>}
              <button
                className="h-8 w-8 rounded-[4px] text-lg hover:bg-[#34343b]"
                onClick={() => setSideOpen((current) => !current)}
                aria-label="Toggle sidebar"
              >
                {sideOpen ? "<" : ">"}
              </button>
            </div>
            {sideOpen && (
              <div className="mx-2 mb-2 grid grid-cols-3 rounded-[4px] bg-[#111114] p-1 text-[12px] font-bold">
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
            </div>
            {sideOpen && (
              <div className="border-t border-[#2f2f35] p-3">
                <p className="text-[12px] font-bold uppercase text-[#adadb8]">Roster live</p>
                <p className="mt-1 text-[12px] leading-snug text-[#c8c8d0]">
                  Click any campus channel to open the Twitch player and chat.
                </p>
              </div>
            )}
          </div>
        </aside>

        <section className={`min-w-0 flex-1 transition-[margin] duration-200 ${sideOpen ? "ml-[240px]" : "ml-[58px]"}`}>
          <div className="mx-auto max-w-[1680px] px-4 py-5 sm:px-6">
            {watchChannel ? (
              <WatchStage
                channel={watchChannel}
                parent={embedParent}
                onClose={browseHome}
              />
            ) : (
            <section className="relative mb-8 min-h-[292px] overflow-hidden">
              <button
                onClick={() => moveFeatured(-1)}
                className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 rounded-[4px] text-4xl hover:bg-[#2f2f35] lg:block"
                aria-label="Previous featured channel"
              >
                {"<"}
              </button>
              <button
                onClick={() => moveFeatured(1)}
                className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 rounded-[4px] text-4xl hover:bg-[#2f2f35] lg:block"
                aria-label="Next featured channel"
              >
                {">"}
              </button>
              <div className="mx-auto grid max-w-[980px] grid-cols-1 bg-[#18181b] shadow-[0_12px_35px_rgba(0,0,0,0.45)] lg:grid-cols-[minmax(0,1fr)_292px]">
                <button
                  onClick={() => openChannel(activeChannel.login)}
                  className="group relative aspect-video min-h-[220px] overflow-hidden bg-black text-left"
                >
                  <StreamThumbnail channel={activeChannel} className="transition duration-300 group-hover:scale-[1.02]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/25" />
                  {activeChannel.live && <span className="absolute left-3 top-3 rounded-[3px] bg-[#eb0400] px-2 py-1 text-[13px] font-black">LIVE</span>}
                  <span className="absolute right-3 top-3 rounded-[3px] bg-black/65 px-2 py-1 font-mono text-[22px] font-bold">
                    00:{String((activeChannel.viewers % 45) + 12).padStart(2, "0")}
                  </span>
                  <div className="absolute bottom-3 left-3 rounded-[3px] bg-black/65 px-2 py-1 text-[15px] font-semibold">
                    {formatViewers(activeChannel.viewers)} viewers
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
                      <p className="text-[14px] text-[#dedee3]">{formatViewers(activeChannel.viewers)} viewers</p>
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
            )}

            <ChannelShelf
              title="Live channels"
              accent="we think you will like"
              channels={liveChannels}
              activeLogin={activeLogin}
              onSelect={openChannel}
            />

            <div className="my-7 grid gap-4 lg:grid-cols-[1fr_395px]">
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setFilter(category.filter)}
                    className="group text-left"
                  >
                    <div className="grid aspect-[16/7] overflow-hidden rounded-[4px] bg-[#1f1f23] p-5 ring-1 ring-[#2f2f35] transition group-hover:ring-[#9147ff]">
                      <div
                        className="flex h-full items-end justify-between rounded-[3px] p-5"
                        style={{
                          background:
                            category.name === "Faculty"
                              ? "linear-gradient(135deg, rgba(145,71,255,0.65), rgba(0,200,175,0.34))"
                              : "linear-gradient(135deg, rgba(255,117,230,0.55), rgba(255,176,0,0.3))"
                        }}
                      >
                        <span className="text-[30px] font-black text-white">{category.name}</span>
                        <span className="rounded-full bg-black/40 px-3 py-1 text-[13px] font-bold text-white">
                          {category.count}
                        </span>
                      </div>
                    </div>
                    <p className="mt-2 truncate text-[15px] font-bold text-white group-hover:text-[#bf94ff]">{category.name}</p>
                    <p className="text-[13px] text-[#adadb8]">{category.count}</p>
                  </button>
                ))}
              </div>
              <aside className="hidden min-h-[210px] bg-black lg:block">
                <div className="flex h-full flex-col justify-between p-4 text-right">
                  <span className="text-[14px] text-[#dedee3]">Ad 0:24 i</span>
                  <button className="ml-auto h-10 rounded-full bg-[#2f2f35] px-8 text-[15px] font-bold hover:bg-[#3b3b44]">
                    Learn More
                  </button>
                </div>
              </aside>
            </div>

            <ChannelShelf
              title="Streamer University"
              accent="campus directory"
              channels={visibleChannels}
              activeLogin={activeLogin}
              onSelect={openChannel}
            />

            {offlineChannels.length > 0 && (
              <ChannelShelf
                title="Offline"
                accent="recent campus streams"
                channels={offlineChannels}
                activeLogin={activeLogin}
                onSelect={openChannel}
              />
            )}
          </div>
        </section>
      </div>
    </main>
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
  return (
    <div className="mb-2">
      {!collapsed && <p className="px-3 py-2 text-[13px] font-bold uppercase text-[#adadb8]">{title}</p>}
      <div className="space-y-0.5">
        {channels.map((channel) => (
          <button
            key={channel.login}
            onClick={() => onSelect(channel.login)}
            className={`flex h-[50px] w-full items-center gap-3 px-2 text-left hover:bg-[#26262c] ${
              activeLogin === channel.login ? "bg-[#2f2f35]" : ""
            }`}
          >
            <Avatar channel={channel} size="sm" />
            {!collapsed && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-bold text-white">{channel.name}</span>
                  <span className="block truncate text-[13px] text-[#adadb8]">{channel.category}</span>
                </span>
                <span className="flex items-center gap-1 text-[13px] text-[#dedee3]">
                  {channel.live && <span className="h-2 w-2 rounded-full bg-[#eb0400]" />}
                  {formatViewers(channel.viewers)}
                </span>
              </>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function Avatar({ channel, size }: { channel: Channel; size: "sm" | "md" | "lg" }) {
  const sizeClass = {
    sm: "h-9 w-9 text-[12px]",
    md: "h-10 w-10 text-[13px]",
    lg: "h-14 w-14 text-[16px]"
  }[size];

  if (channel.avatar) {
    return (
      <img
        src={channel.avatar}
        alt=""
        className={`${sizeClass} shrink-0 rounded-full object-cover ring-2 ring-white/80`}
      />
    );
  }

  return (
    <span
      className={`${sizeClass} grid shrink-0 place-items-center rounded-full bg-[#34343b] font-black text-white ring-2 ring-white/50`}
      style={{ boxShadow: `inset 0 0 0 2px ${channel.accent}` }}
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
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#2f2f35] text-xl font-black text-white ring-2 ring-white/30">
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
  onClose
}: {
  channel: Channel;
  parent: string;
  onClose: () => void;
}) {
  return (
    <section className="mb-8 bg-[#0e0e10]">
      <div className="grid min-h-[520px] overflow-hidden border border-[#2f2f35] bg-black xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="flex min-w-0 flex-col">
          <div className="relative aspect-video bg-black">
            {parent ? (
              <iframe
                src={getWatchUrl(channel.login, parent)}
                title={`${channel.name} Twitch stream`}
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <StreamThumbnail channel={channel} />
            )}
          </div>
          <div className="flex flex-col gap-4 border-t border-[#2f2f35] bg-[#0e0e10] p-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-3">
              <Avatar channel={channel} size="lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-[22px] font-bold text-white">{channel.name}</h1>
                  {channel.live && <span className="rounded-[3px] bg-[#eb0400] px-2 py-1 text-[12px] font-black text-white">LIVE</span>}
                </div>
                <p className="mt-1 line-clamp-3 text-[16px] font-bold text-white">{channel.title}</p>
                <p className="mt-1 text-[15px] text-[#bf94ff]">{channel.category}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {channel.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#2f2f35] px-2 py-1 text-[12px] font-bold text-[#dedee3]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <a
                href={`https://www.twitch.tv/${channel.login}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 place-items-center rounded-[4px] bg-[#2f2f35] px-3 text-[14px] font-bold text-white hover:bg-[#3b3b44]"
              >
                Open Twitch
              </a>
              <button
                onClick={onClose}
                className="h-9 rounded-[4px] bg-[#2f2f35] px-3 text-[14px] font-bold text-white hover:bg-[#3b3b44]"
              >
                Browse
              </button>
            </div>
          </div>
        </div>
        <aside className="min-h-[420px] border-l border-[#2f2f35] bg-[#18181b]">
          <div className="flex h-12 items-center justify-center border-b border-[#2f2f35] text-[15px] font-bold">
            Stream Chat
          </div>
          {parent ? (
            <iframe
              src={getChatUrl(channel.login, parent)}
              title={`${channel.name} Twitch chat`}
              className="h-[calc(100%-48px)] min-h-[372px] w-full border-0"
            />
          ) : (
            <div className="grid h-[calc(100%-48px)] place-items-center text-[#adadb8]">
              Chat loading
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

function ChannelShelf({
  title,
  accent,
  channels: shelfChannels,
  activeLogin,
  onSelect
}: {
  title: string;
  accent: string;
  channels: Channel[];
  activeLogin: string;
  onSelect: (login: string) => void;
}) {
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
        {shelfChannels.map((channel) => (
          <button key={channel.login} onClick={() => onSelect(channel.login)} className="group min-w-0 text-left">
            <div
              className={`relative aspect-video overflow-hidden bg-[#18181b] ${
                activeLogin === channel.login ? "outline outline-2 outline-[#9147ff]" : ""
              }`}
            >
              <StreamThumbnail channel={channel} className="transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
              {channel.live && <span className="absolute left-3 top-3 rounded-[3px] bg-[#eb0400] px-2 py-1 text-[13px] font-black">LIVE</span>}
              <span className="absolute bottom-2 left-2 rounded-[3px] bg-black/70 px-2 py-1 text-[14px] font-semibold">
                {formatViewers(channel.viewers)}{channel.live ? " viewers" : ""}
              </span>
            </div>
            <div className="mt-3 flex gap-3">
              <Avatar channel={channel} size="md" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[15px] font-bold text-white group-hover:text-[#bf94ff]">
                  {channel.title}
                </p>
                <p className="truncate text-[14px] text-[#adadb8]">{channel.name}</p>
                <p className="truncate text-[14px] text-[#adadb8]">{channel.category}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {channel.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="rounded-full bg-[#2f2f35] px-2 py-1 text-[12px] font-bold text-[#dedee3]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-xl leading-none text-[#adadb8]">...</span>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-5 text-center">
        <span className="h-px bg-[#2f2f35]" />
        <button className="rounded-[4px] px-3 py-1.5 text-[14px] font-bold text-[#bf94ff] hover:bg-[#26262c]">
          Show more v
        </button>
        <span className="h-px bg-[#2f2f35]" />
      </div>
    </section>
  );
}
