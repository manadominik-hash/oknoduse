"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { LevelRing } from "./LevelRing";
import { num } from "@/lib/format";

function useCountUp(target: number, ms = 700) {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(a + (target - a) * e));
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return val;
}

export function PointsPill() {
  const { state, hydrated, level } = useApp();
  const shown = useCountUp(state.points);
  const [bump, setBump] = useState(false);
  const prev = useRef(state.points);
  useEffect(() => {
    if (state.points > prev.current) {
      setBump(true);
      const t = setTimeout(() => setBump(false), 600);
      prev.current = state.points;
      return () => clearTimeout(t);
    }
    prev.current = state.points;
  }, [state.points]);

  return (
    <Link
      href="/collection"
      className={`group flex items-center gap-2 rounded-full border border-line bg-ink-2/80 py-1 pl-1 pr-3.5 text-sm font-semibold transition hover:border-grape/70 hover:bg-ink-3 ${
        bump ? "animate-pop" : ""
      }`}
      title={`${level.current.name} · level ${level.current.n}`}
    >
      <LevelRing levelN={level.current.n} progress={level.progress} />
      <span className="flex items-center gap-1.5">
        <span className="text-gold-2 text-base leading-none">✦</span>
        <span className="tabular-nums">{hydrated ? num(shown) : "—"}</span>
      </span>
      {state.spins > 0 && (
        <span className="ml-0.5 flex items-center gap-1 rounded-full bg-grape/25 px-1.5 py-0.5 text-[11px] text-grape ring-1 ring-grape/40">
          🎡 {state.spins}
        </span>
      )}
    </Link>
  );
}
