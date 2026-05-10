"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { burst } from "@/lib/confetti";

export function DailyReward() {
  const { state, claimDaily } = useApp();
  const today = new Date().toISOString().slice(0, 10);
  const alreadyClaimed = Boolean((state as unknown as Record<string, unknown>)[`daily_${today}`]);
  const [done, setDone] = useState(alreadyClaimed);
  const streak = Math.max(1, state.streak);
  const days = Array.from({ length: 7 }, (_, i) => i + 1);

  return (
    <div className="rounded-xl2 border border-line bg-gradient-to-br from-coral/10 to-grape/10 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-cream">
          🔥 Denná séria
          <span className="rounded-full bg-coral/20 px-2 py-0.5 text-[11px] text-coral ring-1 ring-coral/40">{streak} {streak === 1 ? "deň" : streak < 5 ? "dni" : "dní"}</span>
        </div>
        <span className="text-[11px] text-mute">+{50 + Math.min(streak, 7) * 15} bodov dnes</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {days.map((d) => (
          <div
            key={d}
            className={`flex h-9 flex-1 items-center justify-center rounded-lg text-xs font-bold ${
              d <= streak ? "bg-gradient-to-br from-gold-2 to-coral text-ink" : "bg-ink/60 text-mute"
            }`}
            title={`Deň ${d}`}
          >
            {d === 7 ? "🎁" : d}
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          if (done) return;
          const r = claimDaily();
          if (r.ok) {
            setDone(true);
            burst("small");
          }
        }}
        disabled={done}
        className="mt-4 w-full rounded-xl bg-cream px-4 py-3 text-sm font-bold text-ink transition hover:bg-white disabled:cursor-default disabled:bg-ink-3 disabled:text-mute"
      >
        {done ? "✓ Dnes vyzdvihnuté — vráť sa zajtra" : "Vyzdvihnúť dnešnú odmenu"}
      </button>
    </div>
  );
}
