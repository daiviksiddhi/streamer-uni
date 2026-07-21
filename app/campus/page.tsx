import type { Metadata } from "next";
import { StreamerApp } from "../campus-experience";

export const metadata: Metadata = {
  title: "Streamer University Campus",
  description: "Browse Streamer University faculty, alumni, students, streams, clips, and lecture halls."
};

export default function CampusPage() {
  return <StreamerApp />;
}
