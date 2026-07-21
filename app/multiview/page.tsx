import { MultiviewApp } from "../campus-experience";

export default async function MultiviewPage({
  searchParams
}: {
  searchParams: Promise<{ channels?: string }>;
}) {
  const { channels } = await searchParams;
  const initialLogins = (channels ?? "")
    .split(",")
    .map((login) => login.trim())
    .filter(Boolean);

  return <MultiviewApp initialLogins={initialLogins} />;
}
