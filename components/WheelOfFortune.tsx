"use client";

import { useState } from "react";
import { useApp, SpinPrize } from "@/lib/store";
import { burst, sideCannons } from "@/lib/confetti";

type Seg = { label: string; color: string; weight: number; prize: SpinPrize };

const SEGMENTS: Seg[] = [
  { label: "120 bodov", color: "#7c4dff", weight: 14, prize: { type: "points", amount: 120, label: "+120 bodov" } },
  { label: "skús zajtra", color: "#241d3d", weight: 16, prize: { type: "nothing", label: "Tentokrát nič — skús zajtra!" } },
  { label: "50 bodov", color: "#f0b429", weight: 20, prize: { type: "points", amount: 50, label: "+50 bodov" } },
  { label: "+1 spin", color: "#25e6b0", weight: 10, prize: { type: "spin", amount: 1, label: "+1 spin kolesa" } },
  { label: "10% zľava", color: "#ff5d7d", weight: 6, prize: { type: "discount", amount: 10, label: "Kód na 10% zľavu" } },
  { label: "10 bodov", color: "#38bdf8", weight: 18, prize: { type: "points", amount: 10, label: "+10 bodov" } },
  { label: "mini print", color: "#ffd25f", weight: 4, prize: { type: "print", label: "Mini print zadarmo k ďalšej objednávke" } },
  { label: "300 bodov", color: "#5b2ee5", weight: 6, prize: { type: "points", amount: 300, label: "+300 bodov 🤯" } },
];
const N = SEGMENTS.length;
const STEP = 360 / N;

function pickSegment(): number {
  const total = SEGMENTS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < N; i++) {
    r -= SEGMENTS[i].weight;
    if (r <= 0) return i;
  }
  return N - 1;
}

function wedgePath(i: number, R: number) {
  const a0 = (i * STEP - 90) * (Math.PI / 180);
  const a1 = ((i + 1) * STEP - 90) * (Math.PI / 180);
  const x0 = R + R * Math.cos(a0), y0 = R + R * Math.sin(a0);
  const x1 = R + R * Math.cos(a1), y1 = R + R * Math.sin(a1);
  return `M${R},${R} L${x0},${y0} A${R},${R} 0 0,1 ${x1},${y1} Z`;
}

export function WheelOfFortune() {
  const { state, consumeSpin, awardSpinPrize, unlockBadge } = useApp();
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Seg | null>(null);
  const R = 130;

  const canSpin = state.spins > 0 && !spinning;

  function spin() {
    if (!canSpin) return;
    if (!consumeSpin()) return;
    setResult(null);
    setSpinning(true);
    const idx = pickSegment();
    const jitter = (Math.random() - 0.5) * (STEP * 0.6);
    const base = Math.ceil(rot / 360) * 360;
    const target = base + 360 * 6 + (360 - (idx * STEP + STEP / 2)) - jitter;
    setRot(target);
    window.setTimeout(() => {
      setSpinning(false);
      const seg = SEGMENTS[idx];
      setResult(seg);
      awardSpinPrize(seg.prize);
      unlockBadge("spinner");
      if (seg.prize.type !== "nothing") {
        if ("amount" in seg.prize && seg.prize.type === "points" && seg.prize.amount >= 200) sideCannons(1800);
        else burst("small");
      }
    }, 4300);
  }

  return (
    <div className="rounded-xl2 border border-line bg-card p-6 text-center">
      <div className="flex items-center justify-center gap-2 text-sm font-semibold text-cream">
        🎡 Koleso odmien <span className="rounded-full bg-grape/20 px-2 py-0.5 text-[11px] text-[#cdbcff] ring-1 ring-grape/40">{state.spins} {state.spins === 1 ? "spin" : "spinov"}</span>
      </div>
      <div className="relative mx-auto mt-4 grid place-items-center" style={{ width: R * 2 + 24, height: R * 2 + 24 }}>
        {/* pointer */}
        <div className="absolute -top-1 z-10 h-0 w-0 border-x-[12px] border-t-[20px] border-x-transparent border-t-coral drop-shadow" />
        <svg
          width={R * 2}
          height={R * 2}
          viewBox={`0 0 ${R * 2} ${R * 2}`}
          style={{ transform: `rotate(${rot}deg)`, transition: spinning ? "transform 4.2s cubic-bezier(0.16,1,0.3,1)" : "none" }}
          className="rounded-full ring-4 ring-white/10"
        >
          {SEGMENTS.map((s, i) => (
            <g key={i}>
              <path d={wedgePath(i, R)} fill={s.color} stroke="#0b0913" strokeWidth="2" />
              <text
                x={R + (R * 0.62) * Math.cos((i * STEP + STEP / 2 - 90) * (Math.PI / 180))}
                y={R + (R * 0.62) * Math.sin((i * STEP + STEP / 2 - 90) * (Math.PI / 180))}
                fill={s.color === "#ffd25f" || s.color === "#f0b429" || s.color === "#25e6b0" || s.color === "#38bdf8" ? "#0b0913" : "#fff"}
                fontSize="11"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(${i * STEP + STEP / 2} ${R + (R * 0.62) * Math.cos((i * STEP + STEP / 2 - 90) * (Math.PI / 180))} ${R + (R * 0.62) * Math.sin((i * STEP + STEP / 2 - 90) * (Math.PI / 180))})`}
              >
                {s.label}
              </text>
            </g>
          ))}
          <circle cx={R} cy={R} r="14" fill="#0b0913" stroke="#fff" strokeOpacity="0.2" strokeWidth="2" />
        </svg>
      </div>

      <button
        onClick={spin}
        disabled={!canSpin}
        className="mt-5 w-full rounded-2xl bg-gradient-to-r from-grape to-coral px-6 py-3.5 font-bold text-white shadow-[0_14px_40px_-12px_rgba(124,77,255,0.7)] transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {spinning ? "Točí sa…" : state.spins > 0 ? "Roztočiť koleso" : "Žiadne spiny — kúp dielo a získaj 🎡"}
      </button>

      {result && (
        <div className={`mt-4 animate-pop rounded-2xl p-3 text-sm font-bold ${result.prize.type === "nothing" ? "bg-line/50 text-mute" : "bg-gradient-to-r from-gold-2/30 to-coral/20 text-cream ring-1 ring-gold/40"}`}>
          {result.prize.type === "nothing" ? "😅 " : "🎉 "}
          {result.prize.label}
        </div>
      )}
      <p className="mt-3 text-[11px] text-mute">Spiny získavaš za nákupy a za každý nový level. Bez nákupu sa nedá prehrať nič — len získať.</p>
    </div>
  );
}
