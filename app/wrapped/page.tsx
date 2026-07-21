/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import data from "./wrapped-data.json";
import styles from "./wrapped.module.css";

export const metadata: Metadata = {
  title: "Streamer University Wrapped 2026",
  description: "The streams, clips, growth, and award winners that defined Streamer University 2026."
};

type MetricKey = "hoursWatched" | "followersGained" | "averageViewers" | "peakViewers";
type RankedCreator = (typeof data.highlights)[MetricKey][number];
type Profile = { login: string; name: string; role: string; avatar: string | null };

const metricDetails: Array<{ key: MetricKey; label: string; kicker: string }> = [
  { key: "hoursWatched", label: "Hours watched", kicker: "Campus total" },
  { key: "followersGained", label: "Followers gained", kicker: "Campus total" },
  { key: "averageViewers", label: "Average viewers", kicker: "Campus total" },
  { key: "peakViewers", label: "Peak viewers", kicker: "Campus total" }
];

const formatter = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

function compactNumber(value: number) {
  if (value >= 1_000_000) return `${formatter.format(value / 1_000_000)}M`;
  if (value >= 1_000) return `${formatter.format(value / 1_000)}K`;
  return formatter.format(value);
}

function metricValue(key: MetricKey, value: number) {
  return key === "followersGained" ? `+${compactNumber(value)}` : compactNumber(value);
}

function totalMetricValue(value: number) {
  return `${compactNumber(value)}+`;
}

function Avatar({ profile, size = "regular" }: { profile: Pick<Profile, "name" | "avatar">; size?: "regular" | "large" }) {
  const className = size === "large" ? styles.avatarLarge : styles.avatar;

  if (profile.avatar) return <img src={profile.avatar} alt="" className={className} />;

  return (
    <span className={`${className} ${styles.avatarFallback}`} aria-hidden="true">
      {profile.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function Leaderboard({ detail }: { detail: (typeof metricDetails)[number] }) {
  const creators = data.highlights[detail.key] as RankedCreator[];

  return (
    <article className={styles.leaderboard}>
      <div className={styles.boardHeading}>
        <div>
          <p className={styles.eyebrow}>{detail.kicker}</p>
          <h3>{detail.label}</h3>
        </div>
        <span className={styles.leaderValue}>{totalMetricValue(data.totals[detail.key])}</span>
      </div>
      <ol className={styles.rankingList}>
        {creators.map((creator) => (
          <li key={creator.login}>
            <span className={styles.rank}>{creator.rank.toString().padStart(2, "0")}</span>
            <Avatar profile={creator} />
            <span className={styles.creatorIdentity}>
              <strong>{creator.name}</strong>
              <small>{creator.role}</small>
            </span>
            <span className={styles.rankValue}>{metricValue(detail.key, creator[detail.key])}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function AwardWinner({ award }: { award: (typeof data.awards)[number] }) {
  const profiles = award.profiles as Profile[];
  const names = award.winner.split(" & ");

  if (!profiles.length) return <>{award.winner}</>;

  if (profiles.length === names.length) {
    return (
      <>
        {names.map((name, index) => (
          <Fragment key={profiles[index].login}>
            {index > 0 ? " & " : null}
            <a
              href={`https://www.twitch.tv/${profiles[index].login}`}
              target="_blank"
              rel="noreferrer"
              className={styles.winnerLink}
            >
              {name}
            </a>
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <a
      href={`https://www.twitch.tv/${profiles[0].login}`}
      target="_blank"
      rel="noreferrer"
      className={styles.winnerLink}
    >
      {award.winner}
    </a>
  );
}

function FeaturedAward({ award }: { award: (typeof data.awards)[number] }) {
  const profiles = award.profiles as Profile[];

  return (
    <article className={styles.featuredAward}>
      <div className={styles.portraitStack}>
        {profiles.length ? (
          profiles.slice(0, 2).map((profile) => <Avatar key={profile.login} profile={profile} size="large" />)
        ) : (
          <img src="/su-crest-2026-transparent.png" alt="" className={styles.crestPortrait} />
        )}
      </div>
      <p>{award.title}</p>
      <h3><AwardWinner award={award} /></h3>
    </article>
  );
}

export default function WrappedPage() {
  const featuredAwards = data.awards.filter((award) => award.featured);
  const otherAwards = data.awards.filter((award) => !award.featured);
  const topHours = data.highlights.hoursWatched[0];
  const topFollowers = data.highlights.followersGained[0];
  const topPeak = data.highlights.peakViewers[0];
  const topClip = data.clips[0];

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href="/" className={styles.brand} aria-label="Streamer University home">
          <img src="/su-crest-2026-transparent.png" alt="" />
          <span>Streamer University</span>
        </Link>
        <span className={styles.headerEdition}>Wrapped 2026</span>
        <Link href="/campus" className={styles.liveLink}>
          Back to campus
          <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section className={styles.hero}>
        <img src="/su-crest-2026-transparent.png" alt="" className={styles.heroCrest} />
        <p className={styles.heroDate}>{data.event.displayDates}</p>
        <h1>
          Streamer University
          <span>Wrapped</span>
        </h1>
        <p className={styles.heroCopy}>
          The class, the campus, and the moments that turned five days of streaming into one unforgettable week.
        </p>
        <div className={styles.heroRule} aria-hidden="true" />
      </section>

      <section className={styles.statBand} aria-label="Event highlights">
        <div>
          <strong>{compactNumber(topHours.hoursWatched)}</strong>
          <span>hours watched</span>
          <small>{topHours.name}</small>
        </div>
        <div>
          <strong>+{compactNumber(topFollowers.followersGained)}</strong>
          <span>followers gained</span>
          <small>{topFollowers.name}</small>
        </div>
        <div>
          <strong>{compactNumber(topPeak.peakViewers)}</strong>
          <span>peak viewers</span>
          <small>{topPeak.name}</small>
        </div>
        <div>
          <strong>{compactNumber(topClip.views)}</strong>
          <span>views on the top clip</span>
          <small>{topClip.broadcaster}</small>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>The leaderboard</p>
            <h2>By the numbers</h2>
          </div>
          <p>Campus creators ranked across the historical snapshot.</p>
        </div>
        <div className={styles.leaderboardGrid}>
          {metricDetails.map((detail) => <Leaderboard key={detail.key} detail={detail} />)}
        </div>
      </section>

      <section className={`${styles.section} ${styles.awardSection}`}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>The ceremony</p>
            <h2>Campus honors</h2>
          </div>
          <p>{data.counts.awards} awards chosen by Streamer University.</p>
        </div>
        <div className={styles.featuredAwards}>
          {featuredAwards.map((award) => <FeaturedAward key={award.title} award={award} />)}
        </div>
        <div className={styles.awardsGrid}>
          {otherAwards.map((award) => {
            const profile = (award.profiles as Profile[])[0];
            return (
              <article key={award.title} className={styles.awardItem}>
                {profile ? <Avatar profile={profile} /> : <img src="/su-crest-2026-transparent.png" alt="" className={styles.miniCrest} />}
                <span>
                  <small>{award.title}</small>
                  <strong><AwardWinner award={award} /></strong>
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>The replay</p>
            <h2>Most viewed clips</h2>
          </div>
          <p>Top Twitch clips published during the official event window.</p>
        </div>
        <div className={styles.clipRail}>
          {data.clips.map((clip, index) => (
            <a key={clip.id} href={clip.url} target="_blank" rel="noreferrer" className={styles.clipCard}>
              <div className={styles.clipMedia}>
                <img src={clip.thumbnail} alt="" />
                <span className={styles.clipRank}>{(index + 1).toString().padStart(2, "0")}</span>
                <span className={styles.clipViews}>{compactNumber(clip.views)} views</span>
              </div>
              <div className={styles.clipMeta}>
                <Avatar profile={{ name: clip.broadcaster, avatar: clip.avatar }} />
                <span>
                  <strong>{clip.title}</strong>
                  <small>{clip.broadcaster}</small>
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className={styles.classRoll}>
        <p className={styles.eyebrow}>The full campus</p>
        <h2>{data.counts.roster} channels. One class.</h2>
        <div>
          <span><strong>{data.counts.faculty}</strong> faculty</span>
          <span><strong>{data.counts.students}</strong> students</span>
          <span><strong>{data.counts.alumni}</strong> alumni</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <img src="/su-crest-2026-transparent.png" alt="" />
          <span>
            <strong>Streamer University Wrapped 2026</strong>
            <small>Unofficial fan project · Made by <a href="https://x.com/daiviksiddhi" target="_blank" rel="noreferrer">Daivik Siddhi</a></small>
          </span>
        </div>
        <p>
          Metrics: {data.methodology.metricsSource}, {data.methodology.metricsWindow}; {data.methodology.metricsCoverage}. {data.methodology.note}
        </p>
      </footer>
    </main>
  );
}
