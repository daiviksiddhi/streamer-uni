"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode
} from "react";
import { CoverFace, bookCoverStyle } from "./cover-face";
import { Flourish } from "./yearbook-ornaments";
import styles from "./yearbook.module.css";

const CREST = "/su-crest-2026-transparent.png";

/**
 * Portraits from the class of 2026. `photo` is left undefined until the
 * shoot is dropped into /public/yearbook/portraits — the plate falls back
 * to a monogram frame so the spread is complete either way.
 */
type Portrait = {
  name: string;
  role: string;
  photo?: string;
};

const portraitsLeft: Portrait[] = [
  { name: "PlaqueBoyMax", role: "Student" },
  { name: "Stableronaldo", role: "Student" },
  { name: "jasontheween", role: "Student" },
  { name: "Marlon", role: "Student" },
  { name: "Lacy", role: "Student" },
  { name: "AmberrTyson", role: "Student" }
];

const portraitsRight: Portrait[] = [
  { name: "Bonnie", role: "Student" },
  { name: "Silky", role: "Student" },
  { name: "Carterefe", role: "Student" },
  { name: "NotBilzo", role: "Student" },
  { name: "Skaijackson", role: "Student" },
  { name: "Mookie", role: "Student" }
];

function initials(name: string) {
  return (
    name
      .replace(/[_\-.]+/g, " ")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("") || name.slice(0, 2).toUpperCase()
  );
}

/* ---------------------------------------------------------------- pages -- */

function Endpaper({ side }: { side: "left" | "right" }) {
  return (
    <div className={`${styles.endpaper}`}>
      <div className={styles.marble} aria-hidden="true" />
      <div className={side === "left" ? styles.gutterRight : styles.gutterLeft} aria-hidden="true" />
    </div>
  );
}

function TitlePage() {
  return (
    <div className={`${styles.paper}`}>
      <div className={styles.gutterLeft} aria-hidden="true" />
      <div className={styles.pageInner}>
        <div className={styles.titleBlock}>
          <p className={styles.titleKicker}>Streamer University</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={CREST} alt="" className={styles.titleCrest} />
          <h2 className={styles.titleMain}>
            The Yearbook
            <span>Class of 2026</span>
          </h2>
          <Flourish className={styles.titleFlourish} />
          <p className={styles.titleImprint}>
            Volume I · Printed for the campus
            <br />
            July 2026
          </p>
        </div>
      </div>
    </div>
  );
}

function DedicationPage() {
  return (
    <div className={`${styles.paper}`}>
      <div className={styles.gutterRight} aria-hidden="true" />
      <div className={styles.pageInner}>
        <p className={styles.pageEyebrow}>Foreword</p>
        <h3 className={styles.pageHeading}>To the first class</h3>
        <p className={styles.prose}>
          A campus was built out of nothing but bandwidth and nerve. For one week the
          dorms never went dark, the lecture halls ran until sunrise, and every hallway
          had a camera in it.
        </p>
        <p className={styles.prose}>
          What follows is the record of that week — the faces, the superlatives, and the
          numbers nobody will believe next year.
        </p>
        <p className={styles.signature}>The Office of Admissions</p>
        <span className={styles.folio}>i</span>
      </div>
    </div>
  );
}

function PortraitPlate({ portrait }: { portrait: Portrait }) {
  return (
    <figure className={styles.plate}>
      <div className={styles.plateFrame}>
        {portrait.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={portrait.photo} alt={portrait.name} className={styles.platePhoto} />
        ) : (
          <span className={styles.plateMonogram}>{initials(portrait.name)}</span>
        )}
      </div>
      <figcaption className={styles.plateCaption}>
        <span className={styles.plateName}>{portrait.name}</span>
        <span className={styles.plateRole}>{portrait.role}</span>
      </figcaption>
    </figure>
  );
}

function PortraitsPage({
  portraits,
  side,
  folio
}: {
  portraits: Portrait[];
  side: "left" | "right";
  folio: string;
}) {
  return (
    <div className={`${styles.paper}`}>
      <div className={side === "left" ? styles.gutterRight : styles.gutterLeft} aria-hidden="true" />
      <div className={styles.pageInner}>
        <p className={styles.pageEyebrow}>Portraits</p>
        <div className={styles.plateGrid}>
          {portraits.map((portrait) => (
            <PortraitPlate key={portrait.name} portrait={portrait} />
          ))}
        </div>
        <span className={styles.folio}>{folio}</span>
      </div>
    </div>
  );
}

function ClosingPage() {
  return (
    <div className={`${styles.paper}`}>
      <div className={styles.gutterLeft} aria-hidden="true" />
      <div className={styles.pageInner}>
        <p className={styles.pageEyebrow}>Colophon</p>
        <h3 className={styles.pageHeading}>Class of 2026</h3>
        <p className={styles.prose}>
          Set in Cormorant Garamond and bound in oxblood. An unofficial, fan-made
          volume — not affiliated with Streamer University or any streaming platform.
        </p>
        <Flourish className={styles.titleFlourish} />
        <span className={styles.folio}>iv</span>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- book -- */

type Sheet = { front: ReactNode; back: ReactNode };

/** front = recto (lands on the right), back = verso (revealed on the left). */
const sheets: Sheet[] = [
  { front: <TitlePage />, back: <DedicationPage /> },
  {
    front: <PortraitsPage portraits={portraitsLeft} side="right" folio="ii" />,
    back: <PortraitsPage portraits={portraitsRight} side="left" folio="iii" />
  },
  { front: <ClosingPage />, back: <Endpaper side="left" /> }
];

/** Resting angles: turned on its corner when shut, square-on when open. */
const CLOSED_VIEW = { x: 7, y: -22 };
const OPEN_VIEW = { x: 4, y: 0 };

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export default function YearbookBook() {
  const [isOpen, setIsOpen] = useState(false);
  const [flipped, setFlipped] = useState(0);
  const [view, setView] = useState(CLOSED_VIEW);
  const [isDragging, setIsDragging] = useState(false);
  const drag = useRef<{ px: number; py: number; vx: number; vy: number } | null>(null);

  const open = useCallback(() => {
    setIsOpen(true);
    setView(OPEN_VIEW);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setFlipped(0);
    setView(CLOSED_VIEW);
  }, []);

  const next = useCallback(() => {
    if (!isOpen) {
      open();
      return;
    }
    setFlipped((current) => Math.min(current + 1, sheets.length));
  }, [isOpen, open]);

  const previous = useCallback(() => {
    if (!isOpen) return;
    setFlipped((current) => {
      if (current === 0) {
        close();
        return 0;
      }
      return current - 1;
    });
  }, [isOpen, close]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, previous]);

  /* ------------------------------------------------------- drag to orbit -- */

  function startDrag(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = { px: event.clientX, py: event.clientY, vx: view.x, vy: view.y };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function onDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const start = drag.current;
    if (!start) return;
    setView({
      // Pull down to tip the top toward you; keep it off its back.
      x: clamp(start.vx - (event.clientY - start.py) * 0.24, -32, 52),
      y: start.vy + (event.clientX - start.px) * 0.36
    });
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current) return;
    drag.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  }

  const restingView = isOpen ? OPEN_VIEW : CLOSED_VIEW;
  const isTurned =
    Math.abs(view.x - restingView.x) > 1 || Math.abs(view.y - restingView.y) > 1;

  const atEnd = isOpen && flipped === sheets.length;
  const primaryLabel = !isOpen
    ? "Open the book"
    : atEnd
      ? "Close the book"
      : "Turn the page";

  return (
    <section className={styles.bookSection} aria-labelledby="yearbook-title">
      <h1 id="yearbook-title" className={styles.srOnly}>
        Streamer University Yearbook, Class of 2026
      </h1>

      <div
        className={`${styles.stage} ${isOpen ? styles.stageOpen : ""} ${
          isDragging ? styles.stageDragging : ""
        }`}
        onPointerDown={startDrag}
        onPointerMove={onDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div
          className={styles.book}
          style={{
            transform: `rotateX(${view.x}deg) rotateY(${view.y}deg) translateX(${
              isOpen ? "50%" : "0%"
            })`
          }}
        >
          <div className={styles.shadow} aria-hidden="true" />

          {/* Left board — the open back cover the flipped leaves land on */}
          <div className={styles.leftBoard} aria-hidden="true">
            <div className={styles.boardLining} />
          </div>

          {/* Right board — sits under the page block */}
          <div className={styles.rightBoard} aria-hidden="true">
            <div className={styles.boardLining} />
          </div>

          <div className={styles.spine} aria-hidden="true">
            <span />
            <span />
            <span />
          </div>

          {sheets.map((sheet, index) => {
            const isFlipped = index < flipped;
            const depth = sheets.length - index;
            return (
              <div
                key={index}
                className={`${styles.sheet} ${isFlipped ? styles.sheetFlipped : ""}`}
                style={{
                  zIndex: isFlipped ? 20 + index : 20 + depth,
                  transitionDelay: `${(isFlipped ? index : depth) * 18}ms`
                }}
              >
                <div className={styles.sheetFront}>{sheet.front}</div>
                <div className={styles.sheetBack}>{sheet.back}</div>
              </div>
            );
          })}

          {/* Front cover flips like a leaf; its back is the pastedown */}
          <div className={`${styles.cover} ${isOpen ? styles.coverOpen : ""}`}>
            <div className={styles.coverOuter}>
              <CoverFace style={bookCoverStyle} />
            </div>
            <div className={styles.coverPastedown}>
              <Endpaper side="left" />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          onClick={previous}
          disabled={!isOpen}
          aria-label="Previous page"
        >
          &lsaquo;
        </button>
        <button
          type="button"
          className={styles.primary}
          onClick={!isOpen ? open : atEnd ? close : next}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          className={styles.control}
          onClick={next}
          disabled={atEnd}
          aria-label="Next page"
        >
          &rsaquo;
        </button>
      </div>

      <p className={styles.hintRow}>
        <span className={styles.hint}>
          {isOpen ? `Spread ${Math.min(flipped + 1, sheets.length)} of ${sheets.length}` : "Cover"}
          <span aria-hidden="true"> · </span>
          drag the book to turn it in space
        </span>
        {isTurned && (
          <button type="button" className={styles.ghost} onClick={() => setView(restingView)}>
            Reset view
          </button>
        )}
      </p>
    </section>
  );
}
