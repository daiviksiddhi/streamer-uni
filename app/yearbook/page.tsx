import type { Metadata } from "next";
import Link from "next/link";
import YearbookBook from "./yearbook-book";
import styles from "./yearbook.module.css";

export const metadata: Metadata = {
  title: "Streamer University Yearbook 2026",
  description: "The official fan-made digital yearbook for the Streamer University class of 2026."
};

export default function YearbookPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Streamer University home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/su-crest-2026-transparent.png" alt="" />
          <span>Streamer University</span>
        </Link>
        <span className={styles.edition}>Yearbook · 2026</span>
        <Link href="/wrapped" className={styles.headerLink}>
          View Wrapped
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <YearbookBook />

      <footer className={styles.footer}>
        <span>Class of 2026</span>
        <span aria-hidden="true">SU · VOL. I</span>
        <span>July 15–20, 2026</span>
      </footer>
    </main>
  );
}
