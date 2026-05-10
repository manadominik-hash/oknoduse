"use client";

import { useEffect, useState } from "react";
import { timeLeft } from "@/lib/format";

function Box({ v, l }: { v: number; l: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="grid min-w-[2.6rem] place-items-center rounded-lg bg-line/60 px-2 py-1.5 font-display text-lg font-semibold tabular-nums ring-1 ring-line/80">
        {String(v).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] uppercase tracking-widest text-mute">{l}</span>
    </div>
  );
}

export function Countdown({ to, compact = false }: { to: string; compact?: boolean }) {
  const [t, setT] = useState(() => timeLeft(to));
  useEffect(() => {
    const i = setInterval(() => setT(timeLeft(to)), 1000);
    return () => clearInterval(i);
  }, [to]);

  if (t.done) {
    return <span className="rounded-full bg-line/60 px-3 py-1 text-xs font-semibold text-mute">Drop sa skončil</span>;
  }
  const urgent = t.total < 1000 * 60 * 60; // < 1h
  if (compact) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
          urgent ? "animate-pulse-glow bg-coral/20 text-coral ring-1 ring-coral/50" : "bg-grape/12 text-grape ring-1 ring-grape/35"
        }`}
      >
        ⏳ {t.d > 0 ? `${t.d}d ` : ""}
        {String(t.h).padStart(2, "0")}:{String(t.m).padStart(2, "0")}:{String(t.s).padStart(2, "0")}
      </span>
    );
  }
  return (
    <div className={`flex items-end gap-2 ${urgent ? "drop-shadow-[0_0_18px_rgba(255,93,125,0.45)]" : ""}`}>
      {t.d > 0 && <><Box v={t.d} l="dni" /><span className="pb-5 text-lg text-mute">:</span></>}
      <Box v={t.h} l="hod" />
      <span className="pb-5 text-lg text-mute">:</span>
      <Box v={t.m} l="min" />
      <span className="pb-5 text-lg text-mute">:</span>
      <Box v={t.s} l="sek" />
    </div>
  );
}
