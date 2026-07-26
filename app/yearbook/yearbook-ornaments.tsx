/**
 * Gilt tooling ornaments drawn in the tradition of 19th-century bindings:
 * a laurel medallion, corner fleurons, and a spine rosette.
 */

function GoldDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0%" stopColor="#f6e3ab" />
        <stop offset="34%" stopColor="#d8b263" />
        <stop offset="62%" stopColor="#a8792c" />
        <stop offset="100%" stopColor="#e7cf8e" />
      </linearGradient>
    </defs>
  );
}

const LEAF = "M0 -8.4C3.4-5.6 4-1.2 0 4.4-4-1.2-3.4-5.6 0-8.4Z";

/** Laurel ring: leaves mirror about the vertical axis like a real wreath. */
export function LaurelWreath({ className = "" }: { className?: string }) {
  const count = 40;
  const radius = 82;

  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden="true">
      <GoldDefs id="wreathGold" />
      <g fill="url(#wreathGold)">
        {Array.from({ length: count }, (_, index) => {
          const angle = (index * 360) / count;
          // Leaves sweep away from the top on both sides, as laurel grows.
          const lean = angle < 180 ? -34 : 34;
          return (
            <g key={index} transform={`rotate(${angle}) translate(0 ${-radius}) rotate(${lean})`}>
              <path d={LEAF} />
            </g>
          );
        })}
      </g>
      <g fill="url(#wreathGold)" opacity="0.9">
        {Array.from({ length: 8 }, (_, index) => {
          const angle = 22.5 + (index * 360) / 8;
          return (
            <circle
              key={index}
              r="2.1"
              transform={`rotate(${angle}) translate(0 ${-radius + 11})`}
            />
          );
        })}
      </g>
      <circle
        r={radius - 20}
        fill="none"
        stroke="url(#wreathGold)"
        strokeWidth="1.1"
        opacity="0.75"
      />
    </svg>
  );
}

/** Corner spray, symmetric about the diagonal. Rotate for each corner. */
export function CornerFleuron({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <GoldDefs id="fleuronGold" />
      <g
        fill="none"
        stroke="url(#fleuronGold)"
        strokeWidth="1.6"
        strokeLinecap="round"
      >
        <path d="M8 8C8 40 26 62 62 70" />
        <path d="M8 8C40 8 62 26 70 62" />
        <path d="M10 30C24 32 33 41 36 55" />
        <path d="M30 10C32 24 41 33 55 36" />
      </g>
      <g fill="url(#fleuronGold)">
        <g transform="translate(62 70) rotate(64) scale(0.95)">
          <path d={LEAF} />
        </g>
        <g transform="translate(70 62) rotate(26) scale(0.95)">
          <path d={LEAF} />
        </g>
        <g transform="translate(36 55) rotate(78) scale(0.7)">
          <path d={LEAF} />
        </g>
        <g transform="translate(55 36) rotate(12) scale(0.7)">
          <path d={LEAF} />
        </g>
        <g transform="translate(24 24) rotate(45) scale(0.8)">
          <path d={LEAF} />
        </g>
        <circle cx="8" cy="8" r="2.6" />
        <circle cx="47" cy="47" r="1.8" />
      </g>
    </svg>
  );
}

/** Small centred flourish used between rules on the spine and title page. */
export function Flourish({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 20" className={className} aria-hidden="true">
      <GoldDefs id="flourishGold" />
      <g
        fill="none"
        stroke="url(#flourishGold)"
        strokeWidth="1.3"
        strokeLinecap="round"
      >
        <path d="M4 10h34" />
        <path d="M82 10h34" />
        <path d="M46 10c4-6 10-6 14 0 4 6 10 6 14 0" />
      </g>
      <g fill="url(#flourishGold)">
        <circle cx="60" cy="10" r="2.2" />
        <circle cx="41" cy="10" r="1.5" />
        <circle cx="79" cy="10" r="1.5" />
      </g>
    </svg>
  );
}
