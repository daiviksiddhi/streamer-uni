"use client";

import {
  AnimatePresence,
  motion,
  type Variants
} from "framer-motion";
import Image from "next/image";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState
} from "react";

type HoverCell = {
  id: number;
  x: number;
  y: number;
};

type SceneKey =
  | "sonar"
  | "viewfinder"
  | "global"
  | "files"
  | "creator-id"
  | "portal";

type SceneOption = {
  key: SceneKey;
  label: string;
  eyebrow: string;
};

const scenes: SceneOption[] = [
  { key: "sonar", label: "Sonar", eyebrow: "01" },
  { key: "viewfinder", label: "Camera", eyebrow: "02" },
  { key: "global", label: "Global", eyebrow: "03" },
  { key: "files", label: "Files", eyebrow: "04" },
  { key: "creator-id", label: "ID Card", eyebrow: "05" },
  { key: "portal", label: "Portal", eyebrow: "06" }
];

const radarRings = [74, 52, 30];
const scanDuration = 8;

const blips = [
  { x: 67, y: 31 },
  { x: 72, y: 65 },
  { x: 34, y: 72 },
  { x: 42, y: 26 },
  { x: 58, y: 78 }
];

const cityPings = [
  { city: "Los Angeles", x: 18, y: 43, delay: 0.2 },
  { city: "Lagos", x: 50.5, y: 58, delay: 1.15 },
  { city: "London", x: 48.5, y: 35.5, delay: 0.65 },
  { city: "Sao Paulo", x: 36.5, y: 75.5, delay: 1.75 }
];

const fileRows = [
  ["STUDENT", "PROFESSOR", "STUDENT", "STUDENT"],
  ["PROFESSOR", "STUDENT", "STUDENT", "PROFESSOR"],
  ["STUDENT", "STUDENT", "PROFESSOR", "STUDENT"],
  ["STUDENT", "PROFESSOR", "STUDENT", "STUDENT"]
];

const loadingLines = [
  "reviewing applications",
  "checking creator portfolios",
  "selecting the next class"
];

const idFields = [
  ["Name", "Incoming Student"],
  ["Class", "2026"],
  ["Major", "Content Creation"],
  ["Status", "Under Review"],
  ["Dorm", "Pending"]
];

const terminalLines = [
  "ACCESSING STREAMER UNIVERSITY DATABASE...",
  "SCANNING APPLICANT POOL...",
  "MATCHING PROFESSORS...",
  "OPENING ADMISSIONS PORTAL..."
];

const sceneMotion: Variants = {
  initial: { opacity: 0, scale: 1.015, filter: "blur(10px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.985,
    filter: "blur(10px)",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
  }
};

function isSceneKey(value: string): value is SceneKey {
  return scenes.some((scene) => scene.key === value);
}

function getSceneFromHash() {
  const hashScene = window.location.hash.replace("#", "");
  return isSceneKey(hashScene) ? hashScene : "sonar";
}

function getScanDelay(x: number, y: number) {
  const degrees = (Math.atan2(y - 50, x - 50) * 180) / Math.PI;
  return (((degrees + 360) % 360) / 360) * scanDuration;
}

function CrestImage({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/su-crest-2026-transparent.png"
      alt="Streamer University 2026"
      width={800}
      height={800}
      priority
      className={`h-auto w-full object-contain ${className}`}
    />
  );
}

function SceneFrame({
  activeScene,
  children,
  className,
  ariaLabel
}: {
  activeScene: SceneKey;
  children: ReactNode;
  className: string;
  ariaLabel: string;
}) {
  return (
    <motion.section
      key={activeScene}
      aria-label={ariaLabel}
      className={`fixed inset-0 z-50 min-h-svh overflow-hidden text-vellum ${className}`}
      variants={sceneMotion}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.section>
  );
}

function SceneSwitcher({
  activeScene,
  onSceneChange
}: {
  activeScene: SceneKey;
  onSceneChange: (scene: SceneKey) => void;
}) {
  return (
    <nav
      aria-label="Loading screen styles"
      className="scene-switcher fixed left-3 top-3 z-[80] flex flex-wrap gap-1.5 sm:left-5 sm:top-5"
    >
      {scenes.map((scene) => {
        const isActive = activeScene === scene.key;

        return (
          <button
            key={scene.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSceneChange(scene.key)}
            className={`group flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 text-[0.58rem] font-black uppercase tracking-[0.12em] backdrop-blur-xl transition duration-300 sm:h-10 sm:gap-2 sm:px-3.5 sm:text-[0.66rem] ${
              isActive
                ? "border-gold-soft bg-vellum text-wine shadow-[0_10px_32px_rgba(20,8,10,0.22)]"
                : "border-vellum/15 bg-wine/25 text-vellum/75 hover:border-gold-soft/70 hover:bg-vellum/10 hover:text-vellum"
            }`}
          >
            <span
              className={`font-display text-[0.72rem] font-bold ${
                isActive ? "text-burgundy" : "text-gold-soft/85"
              }`}
            >
              {scene.eyebrow}
            </span>
            <span>{scene.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export function SonarIntro() {
  const [activeScene, setActiveScene] = useState<SceneKey>("sonar");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const syncSceneFromHash = () => {
      setActiveScene(getSceneFromHash());
    };

    syncSceneFromHash();
    window.addEventListener("hashchange", syncSceneFromHash);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("hashchange", syncSceneFromHash);
    };
  }, []);

  function handleSceneChange(scene: SceneKey) {
    setActiveScene(scene);
    window.history.replaceState(null, "", `#${scene}`);
  }

  return (
    <>
      <SceneSwitcher activeScene={activeScene} onSceneChange={handleSceneChange} />
      <AnimatePresence mode="wait">
        {activeScene === "sonar" && <RadarScene activeScene={activeScene} />}
        {activeScene === "viewfinder" && (
          <ViewfinderScene activeScene={activeScene} />
        )}
        {activeScene === "global" && <GlobalPingScene activeScene={activeScene} />}
        {activeScene === "files" && <AdmissionsFilesScene activeScene={activeScene} />}
        {activeScene === "creator-id" && <CreatorIdScene activeScene={activeScene} />}
        {activeScene === "portal" && <AdmissionsPortalScene activeScene={activeScene} />}
      </AnimatePresence>
    </>
  );
}

function RadarScene({ activeScene }: { activeScene: SceneKey }) {
  const [hoverCells, setHoverCells] = useState<HoverCell[]>([]);
  const hoverCellId = useRef(0);
  const lastHoverCell = useRef("");
  const hoverTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const timeouts = hoverTimeouts.current;

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const gridSize = 56;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const cellX = Math.floor(x / gridSize) * gridSize;
    const cellY = Math.floor(y / gridSize) * gridSize;
    const cellKey = `${cellX}-${cellY}`;

    if (lastHoverCell.current === cellKey) {
      return;
    }

    lastHoverCell.current = cellKey;

    const id = hoverCellId.current;
    hoverCellId.current += 1;
    setHoverCells((cells) => [...cells.slice(-18), { id, x: cellX, y: cellY }]);

    const timeout = setTimeout(() => {
      setHoverCells((cells) => cells.filter((cell) => cell.id !== id));
    }, 820);
    hoverTimeouts.current.push(timeout);
  }

  function handlePointerLeave() {
    lastHoverCell.current = "";
  }

  return (
    <SceneFrame
      activeScene={activeScene}
      ariaLabel="Streamer University admissions radar"
      className="radar-scope grid place-items-center bg-[#5a2430] px-5"
    >
      <div className="absolute inset-0 bg-[#5a2430]" />
      <div className="absolute inset-0 opacity-55 radar-grid" />
      <div
        className="absolute inset-0"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />
      {hoverCells.map((cell) => (
        <span
          key={cell.id}
          className="radar-hover-cell absolute"
          style={{ left: cell.x, top: cell.y }}
        />
      ))}
      <div className="absolute inset-x-0 top-0 h-1 bg-gold-soft" />

      <div className="relative flex min-h-svh w-full max-w-5xl flex-col items-center justify-start gap-8 pt-[8svh] sm:gap-10 sm:pt-[7svh]">
        <div className="relative grid aspect-square w-[min(82vw,34rem)] place-items-center">
          <div className="absolute inset-[3%] rounded-full border border-gold-soft/30 bg-[#6e1325] shadow-[inset_0_0_80px_rgba(240,214,153,0.1),0_0_72px_rgba(78,15,27,0.32)]" />

          {radarRings.map((size) => (
            <div
              key={size}
              className="radar-ring absolute rounded-full border"
              style={{ width: `${size}%`, height: `${size}%` }}
            />
          ))}

          <div className="absolute h-px w-[90%] bg-gradient-to-r from-transparent via-gold-soft/35 to-transparent" />
          <div className="absolute h-[90%] w-px bg-gradient-to-b from-transparent via-gold-soft/35 to-transparent" />

          <motion.div
            className="absolute h-[92%] w-[92%]"
            animate={{ rotate: 360 }}
            transition={{ duration: scanDuration, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <div
              className="absolute inset-0 rounded-full opacity-100 blur-[5px]"
              style={{
                background:
                  "conic-gradient(from 90deg at 50% 50%, transparent 0deg, transparent 252deg, rgba(201,154,61,0.06) 292deg, rgba(240,214,153,0.22) 338deg, rgba(255,249,239,0.5) 360deg)"
              }}
            />
            <div className="absolute left-1/2 top-1/2 h-px w-[49%] origin-left bg-gradient-to-r from-vellum via-gold-soft to-transparent shadow-[0_0_28px_rgba(240,214,153,0.92)]" />
            <div className="absolute left-1/2 top-1/2 h-[3px] w-[49%] origin-left -translate-y-1/2 bg-gradient-to-r from-gold-soft/45 via-gold-soft/25 to-transparent blur-sm" />
          </motion.div>

          <motion.div
            className="absolute h-[34%] w-[34%] rounded-full bg-gold-soft/15 blur-2xl"
            animate={{ opacity: [0.34, 0.56, 0.34] }}
            transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
          />

          {blips.map((blip) => (
            <div
              key={`${blip.x}-${blip.y}`}
              className="radar-blip absolute"
              style={{
                left: `${blip.x}%`,
                top: `${blip.y}%`,
                animationDelay: `${getScanDelay(blip.x, blip.y)}s`,
                animationDuration: `${scanDuration}s`
              }}
            >
              <span className="radar-blip-ring absolute left-1/2 top-1/2 h-7 w-7 rounded-full border border-vellum/35" />
              <span className="block h-2.5 w-2.5 rounded-full bg-vellum shadow-[0_0_18px_rgba(240,214,153,0.72)] ring-2 ring-gold-soft/55" />
            </div>
          ))}

          <motion.div
            initial={{ opacity: 0, scale: 0.82, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-[min(45vw,13rem)]"
          >
            <motion.div
              className="rounded-full bg-gold-soft p-4 shadow-[0_0_44px_rgba(240,214,153,0.34)]"
              animate={{
                scale: [1, 1.035, 1],
                boxShadow: [
                  "0 0 36px rgba(240,214,153,0.28)",
                  "0 0 58px rgba(240,214,153,0.48)",
                  "0 0 36px rgba(240,214,153,0.28)"
                ]
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <CrestImage />
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.65 }}
          className="relative flex min-h-[3rem] flex-col items-center text-center"
        >
          <h1 className="typing-line text-xl font-black lowercase tracking-[0.18em] text-vellum sm:text-2xl">
            searching for new students
          </h1>
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function ViewfinderScene({ activeScene }: { activeScene: SceneKey }) {
  const apertureBlades = Array.from({ length: 10 }, (_, index) => index);
  const tickMarks = Array.from({ length: 44 }, (_, index) => index);

  return (
    <SceneFrame
      activeScene={activeScene}
      ariaLabel="Camera viewfinder talent scout loading screen"
      className="grid place-items-center bg-[#10090b] px-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_48%,rgba(110,19,37,0.72),rgba(16,9,11,0.92)_48%,#080506_100%)]" />
      <div className="viewfinder-grain absolute inset-0 opacity-45" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-soft to-transparent" />

      <div className="relative grid aspect-square w-[min(88vw,39rem)] place-items-center">
        <motion.div
          className="absolute inset-[3%] rounded-full border border-vellum/10 bg-black/45 shadow-[inset_0_0_100px_rgba(0,0,0,0.82),0_0_90px_rgba(201,154,61,0.12)]"
          animate={{ scale: [1.015, 1, 1.022, 1] }}
          transition={{ duration: 5.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute inset-[11%] rounded-full border border-gold-soft/25"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {tickMarks.map((tick) => (
            <span
              key={tick}
              className={`absolute left-1/2 top-0 h-3 w-px origin-[50%_14.8rem] bg-gold-soft/45 ${
                tick % 4 === 0 ? "h-5 bg-vellum/55" : ""
              }`}
              style={{ transform: `rotate(${tick * 8.18}deg)` }}
            />
          ))}
        </motion.div>
        <motion.div
          className="absolute inset-[17%] rounded-full border border-vellum/10"
          animate={{ rotate: -360 }}
          transition={{ duration: 23, repeat: Infinity, ease: "linear" }}
        />

        <div className="absolute inset-[24%] overflow-hidden rounded-full bg-[#120b0d] shadow-[inset_0_0_48px_rgba(240,214,153,0.12)]">
          <motion.div
            className="absolute inset-[-18%] rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            {apertureBlades.map((blade) => (
              <span
                key={blade}
                className="absolute left-1/2 top-1/2 h-[56%] w-[22%] origin-[50%_96%] rounded-t-full bg-gradient-to-b from-[#261015] via-[#080506] to-black/80 opacity-90"
                style={{
                  transform: `translate(-50%, -95%) rotate(${blade * 36}deg)`
                }}
              />
            ))}
          </motion.div>
          <motion.div
            className="absolute inset-[16%] rounded-full border border-gold-soft/35 bg-[radial-gradient(circle,rgba(255,249,239,0.2)_0%,rgba(201,154,61,0.09)_29%,rgba(0,0,0,0.64)_68%,rgba(0,0,0,0.94)_100%)]"
            animate={{ filter: ["blur(9px)", "blur(1px)", "blur(4px)", "blur(0px)"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="absolute grid aspect-square w-[min(37vw,13rem)] place-items-center rounded-full bg-vellum/95 p-4 shadow-[0_0_54px_rgba(240,214,153,0.28)]"
          animate={{
            scale: [0.98, 1.025, 0.995, 1],
            filter: ["blur(8px)", "blur(0px)", "blur(3px)", "blur(0px)"]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <CrestImage />
        </motion.div>

        <motion.div
          className="viewfinder-brackets absolute inset-[14%]"
          animate={{
            scale: [1.08, 0.93, 1.01, 0.96, 1],
            opacity: [0.45, 0.9, 0.58, 1, 0.82]
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="absolute left-0 top-0 h-20 w-20 border-l-2 border-t-2 border-gold-soft shadow-[0_0_20px_rgba(240,214,153,0.28)]" />
          <span className="absolute right-0 top-0 h-20 w-20 border-r-2 border-t-2 border-gold-soft shadow-[0_0_20px_rgba(240,214,153,0.28)]" />
          <span className="absolute bottom-0 left-0 h-20 w-20 border-b-2 border-l-2 border-gold-soft shadow-[0_0_20px_rgba(240,214,153,0.28)]" />
          <span className="absolute bottom-0 right-0 h-20 w-20 border-b-2 border-r-2 border-gold-soft shadow-[0_0_20px_rgba(240,214,153,0.28)]" />
        </motion.div>

        <div className="absolute h-px w-[78%] bg-gradient-to-r from-transparent via-vellum/35 to-transparent" />
        <div className="absolute h-[78%] w-px bg-gradient-to-b from-transparent via-vellum/35 to-transparent" />
        <motion.div
          className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-vellum/15 bg-black/40 px-4 py-2 text-[0.66rem] font-black uppercase tracking-[0.18em] text-vellum/80 backdrop-blur-md sm:text-xs"
          animate={{ opacity: [0.65, 1, 0.65] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="h-2 w-2 rounded-full bg-gold-soft shadow-[0_0_16px_rgba(240,214,153,0.72)]" />
          talent lock acquired
        </motion.div>
      </div>
    </SceneFrame>
  );
}

function GlobalPingScene({ activeScene }: { activeScene: SceneKey }) {
  return (
    <SceneFrame
      activeScene={activeScene}
      ariaLabel="Global ping map loading screen"
      className="grid place-items-center bg-[#090b10] px-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_54%,rgba(110,19,37,0.5),rgba(9,11,16,0.72)_42%,#050608_100%)]" />
      <div className="global-map-grid absolute inset-0 opacity-45" />
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#f0d699] to-transparent" />

      <div className="relative w-full max-w-6xl px-2 pt-12 sm:pt-6">
        <div className="relative mx-auto aspect-[1.72] w-full max-w-[62rem]">
          <svg
            className="absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 1000 580"
            role="img"
            aria-label="World map with creator pings"
          >
            <defs>
              <linearGradient id="mapFill" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#FFF9EF" stopOpacity="0.2" />
                <stop offset="0.56" stopColor="#C99A3D" stopOpacity="0.14" />
                <stop offset="1" stopColor="#6E1325" stopOpacity="0.18" />
              </linearGradient>
              <filter id="mapGlow">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g opacity="0.45" stroke="#F0D699" strokeWidth="0.6">
              {Array.from({ length: 7 }, (_, index) => (
                <path
                  key={`lat-${index}`}
                  d={`M60 ${110 + index * 58} C260 ${88 + index * 8} 740 ${
                    88 + index * 8
                  } 940 ${110 + index * 58}`}
                  fill="none"
                  opacity="0.22"
                />
              ))}
              {Array.from({ length: 9 }, (_, index) => (
                <path
                  key={`lng-${index}`}
                  d={`M${140 + index * 90} 58 C${95 + index * 96} 190 ${
                    95 + index * 96
                  } 390 ${140 + index * 90} 528`}
                  fill="none"
                  opacity="0.18"
                />
              ))}
            </g>
            <g filter="url(#mapGlow)" fill="url(#mapFill)" stroke="#F0D699" strokeOpacity="0.24">
              <path d="M165 182 C138 190 110 215 98 245 C83 283 111 305 147 294 C169 287 176 304 199 312 C227 322 251 304 244 275 C238 249 272 246 278 218 C284 189 249 170 223 181 C205 188 187 175 165 182Z" />
              <path d="M275 307 C250 331 245 375 275 406 C294 425 318 422 333 441 C348 460 371 445 366 417 C361 389 389 381 384 352 C378 317 340 301 313 314 C299 321 291 296 275 307Z" />
              <path d="M453 158 C420 161 389 186 385 217 C380 249 409 258 435 247 C457 238 459 270 488 273 C517 276 530 245 510 225 C490 205 514 185 493 170 C481 161 469 156 453 158Z" />
              <path d="M506 258 C476 279 462 320 477 361 C490 397 529 401 550 373 C566 352 595 356 603 325 C612 290 582 260 549 267 C530 271 522 247 506 258Z" />
              <path d="M603 179 C641 149 711 151 759 184 C791 206 792 244 762 260 C735 274 748 304 716 320 C679 338 651 304 619 316 C589 327 562 299 582 270 C599 246 563 226 587 198 C591 193 596 187 603 179Z" />
              <path d="M723 327 C753 315 787 333 799 363 C813 398 780 411 765 435 C749 461 719 457 711 429 C704 405 679 397 690 370 C696 354 707 336 723 327Z" />
            </g>

            <motion.path
              d="M180 248 C340 150 430 152 485 206 C548 263 523 305 505 337"
              fill="none"
              stroke="#F0D699"
              strokeLinecap="round"
              strokeWidth="1.4"
              strokeDasharray="5 10"
              animate={{ pathLength: [0.18, 1, 0.18], opacity: [0.2, 0.72, 0.2] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M486 206 C570 156 682 165 739 242 C792 315 710 362 504 337"
              fill="none"
              stroke="#FFF9EF"
              strokeLinecap="round"
              strokeWidth="1"
              strokeDasharray="4 12"
              animate={{ pathLength: [0.12, 1, 0.12], opacity: [0.16, 0.56, 0.16] }}
              transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.path
              d="M505 337 C410 360 330 396 365 438"
              fill="none"
              stroke="#C99A3D"
              strokeLinecap="round"
              strokeWidth="1.25"
              strokeDasharray="5 12"
              animate={{ pathLength: [0.08, 1, 0.08], opacity: [0.2, 0.68, 0.2] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </svg>

          {cityPings.map((ping) => (
            <div
              key={ping.city}
              className="global-ping absolute"
              style={
                {
                  left: `${ping.x}%`,
                  top: `${ping.y}%`,
                  "--ping-delay": `${ping.delay}s`
                } as CSSProperties
              }
            >
              <span className="global-ping-ring" />
              <span className="global-ping-core" />
              <span className="global-ping-label">{ping.city}</span>
            </div>
          ))}

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-vellum/15 bg-[#06070a]/65 px-4 py-2 text-[0.67rem] font-black uppercase tracking-[0.18em] text-vellum/80 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-md sm:text-xs">
            <span className="h-2 w-2 rounded-full bg-gold-soft shadow-[0_0_18px_rgba(240,214,153,0.7)]" />
            global scout network
          </div>
        </div>
      </div>
    </SceneFrame>
  );
}

function AdmissionsFilesScene({ activeScene }: { activeScene: SceneKey }) {
  return (
    <SceneFrame
      activeScene={activeScene}
      ariaLabel="Admissions file scanner loading screen"
      className="grid place-items-center bg-[#4d1521] px-4"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_8%,rgba(240,214,153,0.16),transparent_30%),linear-gradient(145deg,#681b2c_0%,#3d0a16_48%,#14080d_100%)]" />
      <div className="file-scanner-grid absolute inset-0 opacity-35" />
      <motion.div
        className="absolute left-0 right-0 top-[24%] h-28 bg-gradient-to-b from-transparent via-gold-soft/15 to-transparent"
        animate={{ y: ["-24vh", "55vh", "-24vh"] }}
        transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex w-full max-w-5xl flex-col items-center gap-6 pt-16 sm:pt-8">
        <div className="relative w-full overflow-hidden rounded-[0.55rem] border border-gold-soft/20 bg-vellum/[0.045] p-3 shadow-[0_32px_90px_rgba(19,5,10,0.34)] backdrop-blur-sm sm:p-5">
          <div className="mb-3 flex items-center justify-between border-b border-vellum/10 pb-3 text-[0.62rem] font-black uppercase tracking-[0.18em] text-vellum/60 sm:text-xs">
            <span>admissions intake</span>
            <span className="text-gold-soft">class of 2026</span>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
            {fileRows.flat().map((kind, index) => (
              <div
                key={`${kind}-${index}`}
                className="admissions-file relative min-h-[7.2rem] overflow-hidden rounded-[0.45rem] border border-vellum/15 bg-[#fff9ef] p-3 text-wine shadow-[0_18px_34px_rgba(16,5,10,0.2)] sm:min-h-[8.5rem] sm:p-4"
                style={{ animationDelay: `${index * 0.14}s` }}
              >
                <span className="absolute right-0 top-0 h-8 w-12 rounded-bl-[1rem] bg-gold-soft/55" />
                <span className="mb-5 block h-1.5 w-14 rounded-full bg-burgundy/20" />
                <span className="mb-2 block h-2 w-[86%] rounded-full bg-wine/10" />
                <span className="mb-2 block h-2 w-[64%] rounded-full bg-wine/10" />
                <span className="mb-4 block h-2 w-[72%] rounded-full bg-wine/10" />
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-[0.58rem] font-black uppercase tracking-[0.14em] ${
                    kind === "PROFESSOR"
                      ? "bg-wine text-vellum"
                      : "bg-gold-soft text-wine"
                  }`}
                >
                  {kind}
                </span>
              </div>
            ))}
          </div>

          <motion.div
            className="admissions-stamp absolute left-1/2 top-1/2 grid h-36 w-36 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[0.45rem] border-gold-soft bg-[#fff9ef]/90 text-center text-wine shadow-[0_22px_52px_rgba(23,6,12,0.32)] sm:h-44 sm:w-44"
            initial={{ opacity: 0, y: -180, rotate: -12, scale: 1.4 }}
            animate={{
              opacity: [0, 0, 1, 1, 0],
              y: [-180, -180, 0, 0, 24],
              rotate: [-12, -12, -5, -5, -5],
              scale: [1.4, 1.4, 1, 1, 0.98]
            }}
            transition={{
              duration: 6.2,
              repeat: Infinity,
              times: [0, 0.58, 0.68, 0.9, 1],
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span className="absolute inset-3 rounded-full border border-wine/20" />
            <span className="block w-12">
              <CrestImage />
            </span>
            <span className="max-w-[7.5rem] text-[0.7rem] font-black uppercase leading-tight tracking-[0.18em] sm:text-[0.82rem]">
              applications under review
            </span>
          </motion.div>
        </div>

        <div className="relative flex min-h-[2.6rem] items-center justify-center text-center">
          {loadingLines.map((line, index) => (
            <span
              key={line}
              className="file-loading-line absolute whitespace-nowrap text-lg font-black lowercase tracking-[0.13em] text-vellum sm:text-2xl"
              style={{ animationDelay: `${index * 2}s` }}
            >
              {line}
            </span>
          ))}
        </div>
      </div>
    </SceneFrame>
  );
}

function CreatorIdScene({ activeScene }: { activeScene: SceneKey }) {
  return (
    <SceneFrame
      activeScene={activeScene}
      ariaLabel="Creator ID card generator loading screen"
      className="grid place-items-center bg-[#efe6d2] px-4 text-wine"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(201,154,61,0.28),transparent_25%),radial-gradient(circle_at_78%_72%,rgba(110,19,37,0.18),transparent_30%),linear-gradient(135deg,#fff9ef_0%,#e9dcc1_54%,#f7f0df_100%)]" />
      <div className="id-generator-lines absolute inset-0 opacity-55" />

      <div className="relative flex w-full max-w-5xl flex-col items-center gap-8 pt-14 sm:pt-6">
        <div className="creator-id-stage relative grid aspect-[0.96] w-[min(90vw,35rem)] place-items-center sm:aspect-[1.08]">
          <motion.div
            className="absolute left-[8%] top-[10%] h-[18%] w-[76%] rounded-[0.45rem] border border-gold/20 bg-vellum/70 shadow-[0_16px_34px_rgba(61,10,22,0.12)]"
            animate={{ x: [-54, 0, 0], opacity: [0, 1, 1] }}
            transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.18, 1] }}
          />
          <motion.div
            className="absolute bottom-[10%] right-[6%] h-[17%] w-[58%] rounded-[0.45rem] border border-burgundy/15 bg-[#6e1325]/10"
            animate={{ x: [48, 0, 0], opacity: [0, 1, 1] }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              times: [0, 0.24, 1],
              delay: 0.18
            }}
          />

          <motion.div
            className="creator-id-card relative h-full w-full rounded-[0.75rem] shadow-[0_30px_90px_rgba(61,10,22,0.24)]"
            animate={{ rotateY: [0, 0, 180, 180, 0] }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.48, 0.62, 0.88, 1],
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <div className="creator-id-face creator-id-front absolute inset-0 overflow-hidden rounded-[0.75rem] border border-gold/35 bg-[#fff9ef] p-5 sm:p-7">
              <div className="absolute right-[-10%] top-[-18%] h-56 w-56 rounded-full border border-gold/20" />
              <div className="absolute bottom-[-22%] left-[-8%] h-60 w-60 rounded-full bg-burgundy/10" />
              <div className="relative flex h-full flex-col">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 block text-[0.62rem] font-black uppercase tracking-[0.2em] text-burgundy/55">
                      Streamer University
                    </span>
                <h1 className="font-display text-3xl font-bold uppercase leading-none text-wine sm:text-5xl">
                      Creator ID
                    </h1>
                  </div>
                  <div className="w-16 rounded-full bg-gold-soft p-2 shadow-[0_12px_28px_rgba(201,154,61,0.26)] sm:w-20">
                    <CrestImage />
                  </div>
                </div>

                <div className="grid flex-1 grid-cols-[6.5rem_1fr] gap-4 sm:grid-cols-[8rem_1fr]">
                  <motion.div
                    className="relative overflow-hidden rounded-[0.55rem] border border-burgundy/15 bg-gradient-to-br from-burgundy via-wine to-[#17080d]"
                    animate={{ opacity: [0, 1, 1], y: [20, 0, 0] }}
                    transition={{ duration: 4.8, repeat: Infinity, times: [0, 0.16, 1] }}
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(240,214,153,0.36),transparent_30%)]" />
                    <div className="absolute left-1/2 top-[24%] h-9 w-9 -translate-x-1/2 rounded-full border border-gold-soft/65 bg-vellum/15 sm:h-12 sm:w-12" />
                    <div className="absolute bottom-[16%] left-1/2 h-20 w-20 -translate-x-1/2 rounded-t-full border border-gold-soft/50 bg-vellum/10 sm:h-24 sm:w-24" />
                  </motion.div>

                  <div className="grid content-start gap-1.5 sm:gap-3">
                    {idFields.map(([label, value], index) => (
                      <motion.div
                        key={label}
                        className="overflow-hidden rounded-[0.38rem] border border-wine/10 bg-wine/[0.035] px-3 py-1.5 sm:py-2.5"
                        animate={{ opacity: [0, 1, 1], x: [28, 0, 0] }}
                        transition={{
                          duration: 4.8,
                          repeat: Infinity,
                          times: [0, 0.14 + index * 0.055, 1],
                          delay: 0.12 + index * 0.06
                        }}
                      >
                        <span className="block text-[0.56rem] font-black uppercase tracking-[0.16em] text-burgundy/50">
                          {label}
                        </span>
                        <span className="block truncate text-sm font-black text-wine sm:text-lg">
                          {value}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="creator-id-face creator-id-back absolute inset-0 grid place-items-center overflow-hidden rounded-[0.75rem] border border-gold/40 bg-[#3d0a16] p-5 text-vellum sm:p-7">
              <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(240,214,153,0.16),transparent_34%,rgba(255,249,239,0.08)_70%,transparent)]" />
              <div className="absolute inset-x-6 top-8 h-px bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" />
              <div className="absolute inset-x-6 bottom-8 h-px bg-gradient-to-r from-transparent via-gold-soft/60 to-transparent" />
              <div className="relative grid place-items-center gap-4 text-center">
                <div className="w-28 rounded-full bg-vellum p-3 shadow-[0_0_54px_rgba(240,214,153,0.24)] sm:w-36">
                  <CrestImage />
                </div>
                <div className="relative rounded-full border-[0.38rem] border-gold-soft px-7 py-4 text-[0.82rem] font-black uppercase tracking-[0.18em] text-gold-soft shadow-[0_0_34px_rgba(240,214,153,0.22)] sm:text-lg">
                  admissions open
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 top-[49%] z-20 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[0.32rem] border-gold bg-vellum/90 text-center text-[0.62rem] font-black uppercase leading-tight tracking-[0.16em] text-wine shadow-[0_18px_46px_rgba(61,10,22,0.24)] sm:h-32 sm:w-32 sm:text-[0.78rem]"
            animate={{
              opacity: [0, 0, 1, 1, 0],
              y: [-160, -160, 0, 0, 14],
              rotate: [-10, -10, -4, -4, -4],
              scale: [1.25, 1.25, 1, 1, 0.96]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              times: [0, 0.56, 0.66, 0.86, 1],
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            <span className="w-8 sm:w-10">
              <CrestImage />
            </span>
            <span>admissions open</span>
          </motion.div>
        </div>

        <div className="text-center text-[0.68rem] font-black uppercase tracking-[0.2em] text-burgundy/70 sm:text-xs">
          credential generator active
        </div>
      </div>
    </SceneFrame>
  );
}

function AdmissionsPortalScene({ activeScene }: { activeScene: SceneKey }) {
  return (
    <SceneFrame
      activeScene={activeScene}
      ariaLabel="Luxury admissions portal terminal loading screen"
      className="grid place-items-center bg-[#fff9ef] px-4 text-wine"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(201,154,61,0.24),transparent_24%),radial-gradient(circle_at_84%_80%,rgba(110,19,37,0.16),transparent_28%),linear-gradient(140deg,#fff9ef_0%,#efe1c4_52%,#fff7e9_100%)]" />
      <div className="portal-paper-grid absolute inset-0 opacity-55" />

      <div className="relative grid w-full min-w-0 max-w-4xl place-items-center pt-14 sm:pt-4">
        <motion.div
          className="portal-shell relative min-w-0 overflow-hidden rounded-[0.7rem] border border-gold/35 bg-[#3d0a16] shadow-[0_30px_90px_rgba(61,10,22,0.22)]"
          animate={{
            boxShadow: [
              "0 30px 90px rgba(61,10,22,0.22)",
              "0 36px 110px rgba(201,154,61,0.24)",
              "0 30px 90px rgba(61,10,22,0.22)"
            ]
          }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="flex min-w-0 items-center justify-between border-b border-gold-soft/15 bg-[#4d1120] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d75d5d]" />
              <span className="h-2.5 w-2.5 rounded-full bg-gold" />
              <span className="h-2.5 w-2.5 rounded-full bg-vellum/75" />
            </div>
            <span className="max-w-[10rem] truncate text-right text-[0.58rem] font-black uppercase tracking-[0.18em] text-gold-soft/75 sm:max-w-none sm:text-[0.68rem]">
              su admissions terminal
            </span>
          </div>

          <div className="grid min-h-[26rem] content-between gap-8 p-5 sm:p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <span className="mb-3 block text-[0.62rem] font-black uppercase tracking-[0.22em] text-gold-soft/65">
                  authenticated session
                </span>
                <h1 className="font-display text-[2rem] font-bold uppercase leading-none text-vellum sm:text-6xl">
                  <span className="block sm:inline">Admissions</span>
                  <span className="block sm:ml-3 sm:inline">Portal</span>
                </h1>
              </div>
              <div className="hidden w-20 rounded-full bg-vellum p-2.5 shadow-[0_0_44px_rgba(240,214,153,0.22)] sm:block">
                <CrestImage />
              </div>
            </div>

            <div className="grid min-w-0 gap-4 rounded-[0.5rem] border border-gold-soft/15 bg-black/20 p-4 font-mono text-[0.72rem] uppercase tracking-[0.06em] text-vellum sm:p-5 sm:text-sm">
              {terminalLines.map((line, index) => (
                <div key={line} className="flex min-w-0 items-start gap-3 overflow-hidden">
                  <span className="text-gold-soft/70">{String(index + 1).padStart(2, "0")}</span>
                  <span
                    className="portal-terminal-line min-w-0"
                    style={
                      {
                        "--terminal-chars": line.length,
                        "--terminal-delay": `${index * 1.45}s`
                      } as CSSProperties
                    }
                  >
                    {line}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-4 border-t border-gold-soft/15 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-gold-soft/75">
                <span className="portal-status-dot h-2.5 w-2.5 rounded-full bg-gold-soft" />
                portal opening
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-vellum/10 sm:w-64">
                <span className="portal-progress block h-full rounded-full bg-gradient-to-r from-gold via-gold-soft to-vellum" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SceneFrame>
  );
}
