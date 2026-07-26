import type { CSSProperties } from "react";
import { CornerFleuron, Flourish, LaurelWreath } from "./yearbook-ornaments";
import styles from "./yearbook.module.css";

/**
 * One cover, rendered over a configurable material. Everything above the
 * photograph blends with it, so each finish keeps real hide grain.
 */
export type CoverStyle = {
  id: string;
  label: string;
  note: string;
  /** Draw our own gilt frame, fleurons and laurel wreath. */
  tooling: boolean;
  /** Draw the gilt lettering. Off where the artwork is already busy. */
  lettering: boolean;
  vars: CSSProperties;
  /** Size of the debossed crest, as a share of the medallion. */
  crestWidth?: string;
};

/** The finish the bound yearbook uses: the gold-bordered board, crest struck
    into its open centre. Every material value is a CSS variable. */
export const bookCoverStyle: CoverStyle = {
  id: "artnouveau",
  label: "Art nouveau",
  note: "Gold-bordered board · crest struck in the open centre",
  tooling: false,
  lettering: false,
  crestWidth: "78%",
  vars: {
    "--mat-image": "url('/yearbook/binding-artnouveau.jpg')",
    // The file carries its own spine down the left, which pushed the gilt
    // frame off-centre (12.5% left vs 3% right). Show only the rightmost
    // 90.5% — the board itself — so the frame sits even on both sides.
    "--mat-size": "110.5% 100%",
    "--mat-pos": "right center",
    "--mat-filter": "brightness(0.98) saturate(1.04) contrast(1.05)",
    "--mat-tone": "linear-gradient(158deg, #6c1226 0%, #3f0813 100%)",
    "--mat-tone-opacity": "0.1",
    // Keep the vignette light so its gold border stays legible.
    "--edge-shade": "inset 0 0 18px rgba(22, 2, 8, 0.28), inset 0 0 2px rgba(0, 0, 0, 0.5)",
    "--emboss-face": "rgba(20, 3, 8, 0.42)",
    "--emboss-shade": "#100104",
    "--emboss-shade-opacity": "0.8",
    "--emboss-glint": "rgba(255, 232, 190, 0.9)"
  } as CSSProperties
};

export function CoverFace({ style }: { style: CoverStyle }) {
  return (
    <div className={styles.coverFace} style={style.vars}>
      {/* Photographed material is the actual surface; everything above it
          blends with this layer so the real grain reads through. */}
      <div className={styles.leather} aria-hidden="true" />
      <div className={styles.leatherTone} aria-hidden="true" />
      <div className={styles.joint} aria-hidden="true" />

      {style.tooling && (
        <>
          <div className={styles.frameRule} aria-hidden="true" />
          <div className={styles.frameBeads} aria-hidden="true" />
          <div className={styles.frameInner} aria-hidden="true" />
          <div className={styles.corners} aria-hidden="true">
            <CornerFleuron className={`${styles.fleuron} ${styles.fleuronTL}`} />
            <CornerFleuron className={`${styles.fleuron} ${styles.fleuronTR}`} />
            <CornerFleuron className={`${styles.fleuron} ${styles.fleuronBR}`} />
            <CornerFleuron className={`${styles.fleuron} ${styles.fleuronBL}`} />
          </div>
        </>
      )}

      <div className={styles.coverInk}>
        <header className={styles.coverTop}>
          {style.lettering && (
            <>
              <span className={styles.coverUniversity}>Streamer University</span>
              <Flourish className={styles.coverFlourish} />
            </>
          )}
        </header>

        <div className={styles.medallion}>
          {style.tooling && <LaurelWreath className={styles.wreath} />}
          {/* The crest is struck into the surface: a dark wall above, a gilt
              catch-light below, and a multiply layer that darkens the real
              material rather than repainting it. */}
          <div
            className={styles.crestDeboss}
            style={style.crestWidth ? { width: style.crestWidth } : undefined}
          >
            <span className={`${styles.crestLayer} ${styles.crestShade}`} />
            <span className={`${styles.crestLayer} ${styles.crestGlint}`} />
            <span className={`${styles.crestLayer} ${styles.crestFace}`} />
          </div>
        </div>

        <footer className={styles.coverBottom}>
          {style.lettering && (
            <>
              <span className={styles.coverClass}>Class of 2026</span>
              <span className={styles.coverVolume}>Yearbook · Vol. I</span>
            </>
          )}
        </footer>
      </div>

      {/* One light source over every layer, then film grain, then the
          shading where the boards curve away. */}
      <div className={styles.lightRig} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.edgeShade} aria-hidden="true" />
    </div>
  );
}
