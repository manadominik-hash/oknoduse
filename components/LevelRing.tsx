"use client";

export function LevelRing({ levelN, progress, size = 34, stroke = 3 }: { levelN: number; progress: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0.04, Math.min(1, progress)));
  return (
    <span className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#lvlg)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.2,0.7,0.2,1)" }}
        />
        <defs>
          <linearGradient id="lvlg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd25f" />
            <stop offset="100%" stopColor="#7c4dff" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[11px] font-extrabold tabular-nums">{levelN}</span>
    </span>
  );
}
