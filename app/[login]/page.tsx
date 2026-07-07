import { StreamerApp } from "../page";

export default async function ChannelPage({
  params
}: {
  params: Promise<{ login: string }>;
}) {
  const { login } = await params;

  return <StreamerApp initialWatchLogin={decodeURIComponent(login)} />;
}
