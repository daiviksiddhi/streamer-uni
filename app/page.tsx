/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Streamer University 2026",
  description: "Streamer University 2026 has concluded. Relive the week in Wrapped or return to the campus directory."
};

export default function ConcludedPage() {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden bg-[#0e0e10] px-6 py-12 text-[#efeff1]">
      <img
        src="/su-crest-2026-transparent.png"
        alt=""
        className="pointer-events-none absolute left-1/2 top-1/2 h-auto w-[min(72vw,560px)] -translate-x-1/2 -translate-y-1/2 object-contain opacity-[0.08]"
      />
      <section className="relative z-10 w-full max-w-[680px] text-center">
        <p className="m-0 text-[20px] font-normal leading-normal text-[#efeff1] max-sm:text-[18px]">
          <span className="block">Streamer University 2026 has concluded.</span>
          <span className="mt-1 block">Thanks for watching and tune back in next year.</span>
        </p>
        <div className="mt-6 flex items-center justify-center gap-2.5 max-sm:flex-col max-sm:items-stretch">
          <Link
            href="/wrapped"
            className="su-primary inline-flex min-h-10 items-center justify-center rounded-[4px] px-4 text-[14px] font-bold text-white no-underline"
          >
            See 2026 Wrapped
          </Link>
          <Link
            href="/campus"
            className="inline-flex min-h-10 items-center justify-center rounded-[4px] bg-[#2f2f35] px-4 text-[14px] font-bold text-white no-underline hover:bg-[#3b3b44]"
          >
            Go back to campus
          </Link>
        </div>
      </section>

      <footer className="absolute inset-x-0 bottom-0 z-10 flex min-h-16 items-center justify-center border-t border-[#34343b] bg-[#18181b] px-5 py-3">
        <a
          href="https://x.com/daiviksiddhi"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2.5 rounded-[4px] px-2 py-1 text-[13px] font-medium text-[#dedee3] no-underline hover:bg-[#26262c] hover:text-white"
        >
          <img
            src="/daivik-siddhi-x-avatar.jpg"
            alt="Daivik Siddhi"
            className="h-9 w-9 rounded-full border border-[#51515a] object-cover"
          />
          <span>
            Follow <strong className="font-bold text-[#ffc21a]">@daiviksiddhi</strong> for more
          </span>
        </a>
      </footer>
    </main>
  );
}
