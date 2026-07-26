/* eslint-disable @next/next/no-img-element */
import { portraits } from "./portraits";
import styles from "./portrait-wall.module.css";

/** Four rows fill a typical viewport, so the whole class cycles into view. */
const ROWS = 4;

/** Long enough to read as a drift (~28px/s), varied so rows never lock step. */
const DURATIONS = [286, 324, 262, 302];

function splitRows(list: string[], rows: number) {
  const perRow = Math.ceil(list.length / rows);
  return Array.from({ length: rows }, (_, index) =>
    list.slice(index * perRow, (index + 1) * perRow)
  ).filter((row) => row.length > 0);
}

/**
 * The class of 2026 drifting behind the page — desaturated and dimmed so the
 * faces read as texture. Alternate rows travel opposite ways at a walking
 * pace; each row is rendered twice so its loop has no seam.
 */
export default function PortraitWall() {
  const rows = splitRows(portraits, ROWS);

  return (
    <div className={styles.wall} aria-hidden="true">
      <div className={styles.rows}>
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            <div
              className={`${styles.track} ${rowIndex % 2 ? styles.reverse : ""}`}
              style={{ animationDuration: `${DURATIONS[rowIndex % DURATIONS.length]}s` }}
            >
              {[...row, ...row].map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt=""
                  className={styles.tile}
                  loading={rowIndex < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.scrim} />
      <div className={styles.vignette} />
    </div>
  );
}
