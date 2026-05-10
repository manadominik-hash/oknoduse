"use client";

import { BADGES } from "@/lib/badges";
import { useApp } from "@/lib/store";

function progressFor(id: string, p: { owned: number; artists: number; spent: number; streak: number }): number | null {
  if (id === "collector-5") return Math.min(1, p.owned / 5);
  if (id === "patron-3") return Math.min(1, p.artists / 3);
  if (id === "big-spender") return Math.min(1, p.spent / 1000);
  if (id === "streak-3") return Math.min(1, p.streak / 3);
  return null;
}

export function BadgeGrid() {
  const { state, spent, artistsSupported } = useApp();
  const unlocked = new Set(state.badges);
  const p = { owned: state.ownedIds.length, artists: artistsSupported, spent, streak: state.streak };
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <h3 className="font-display text-xl font-semibold">Odznaky</h3>
        <span className="text-sm text-mute">{unlocked.size} / {BADGES.length} odomknutých</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {BADGES.map((b) => {
          const got = unlocked.has(b.id);
          const prog = got ? null : progressFor(b.id, p);
          return (
            <div
              key={b.id}
              className={`relative overflow-hidden rounded-2xl border p-4 text-center transition ${
                got ? "border-white/15 bg-gradient-to-br from-white/[0.06] to-transparent" : "border-line bg-ink-2/40"
              }`}
            >
              <div className={`mx-auto grid h-12 w-12 place-items-center rounded-xl text-2xl ${got ? "" : "grayscale opacity-40"}`} style={got ? { background: `${b.color}26`, boxShadow: `0 0 24px -6px ${b.color}` } : {}}>
                {b.icon}
              </div>
              <div className={`mt-2 text-xs font-bold ${got ? "text-cream" : "text-mute"}`}>{b.name}</div>
              <div className="mt-1 text-[10px] leading-snug text-mute">{got ? b.desc : b.hint}</div>
              {prog !== null && (
                <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/70">
                  <div className="h-full rounded-full bg-grape" style={{ width: `${Math.max(4, prog * 100)}%` }} />
                </div>
              )}
              {got && <div className="absolute right-2 top-2 text-mint">✓</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
