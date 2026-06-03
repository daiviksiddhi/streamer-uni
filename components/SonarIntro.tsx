"use client";

import { type PointerEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

type HoverCell = {
  id: number;
  x: number;
  y: number;
};

const radarRings = [74, 52, 30];
const scanDuration = 8;

const blips = [
  { x: 67, y: 31 },
  { x: 72, y: 65 },
  { x: 34, y: 72 },
  { x: 42, y: 26 },
  { x: 58, y: 78 }
];

function getScanDelay(x: number, y: number) {
  const degrees = (Math.atan2(y - 50, x - 50) * 180) / Math.PI;
  return (((degrees + 360) % 360) / 360) * scanDuration;
}

export function SonarIntro() {
  const [hoverCells, setHoverCells] = useState<HoverCell[]>([]);
  const hoverCellId = useRef(0);
  const lastHoverCell = useRef("");
  const hoverTimeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const timeouts = hoverTimeouts.current;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
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
    <motion.section
      aria-label="Streamer University admissions radar"
      className="radar-scope fixed inset-0 z-50 grid min-h-svh place-items-center overflow-hidden bg-[#5a2430] px-5 text-vellum"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 bg-[#5a2430]" />
      <div className="absolute inset-0 opacity-55 radar-grid" />
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
              <Image
                src="/su-crest-2026-transparent.png"
                alt="Streamer University 2026"
                width={800}
                height={800}
                priority
                className="h-auto w-full object-contain"
              />
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
    </motion.section>
  );
}
