/** Class of 2026 portraits, used as the faded wall behind the landing page. */
export const portraits: string[] = Array.from(
  { length: 140 },
  (_, index) => `/portraits/p-${String(index + 1).padStart(3, "0")}.jpg`
);
