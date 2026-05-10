"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { burst } from "@/lib/confetti";
import { seeded } from "@/lib/format";

const POOL = [
  { name: 'Mini riso print „Mesto v noci" (A6)', icon: "🌃" },
  { name: "Set 3 art-pohľadníc z aktuálnych dropov", icon: "✉️" },
  { name: "Skica z ateliéru — ručne signovaná", icon: "✏️" },
  { name: 'Samolepkový set „Vernis Collector"', icon: "🌟" },
  { name: "Plagát A4 z limitovanej série", icon: "🖼️" },
  { name: "Záložka s mini-printom + odznak", icon: "🔖" },
];

export function MysteryReveal({ seed }: { seed: string }) {
  const { revealMystery } = useApp();
  const prize = POOL[Math.floor(seeded("mys" + seed) * POOL.length)];
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl2 border border-line bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-cream">
        <span>🎁</span> Darček k objednávke
      </div>
      <button
        onClick={() => {
          if (open) return;
          setOpen(true);
          revealMystery(prize.name);
          burst("small");
        }}
        className="group relative block w-full"
        aria-label="Odhaliť darček"
      >
        <div
          className={`relative h-40 w-full rounded-2xl transition-all duration-500 [transform-style:preserve-3d] ${open ? "[transform:rotateY(180deg)]" : "group-hover:-translate-y-1"}`}
        >
          {/* front */}
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-grape via-grape-2 to-ink-3 text-center ring-1 ring-white/15 [backface-visibility:hidden]">
            <div>
              <div className="text-4xl">🎁</div>
              <div className="mt-2 text-sm font-bold text-white">Klikni a odhaľ</div>
              <div className="text-[11px] text-white/70">Čaká ťa malé prekvapenie</div>
            </div>
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(rgba(255,255,255,0.25)_1px,transparent_1px)] [background-size:14px_14px] opacity-30" />
          </div>
          {/* back */}
          <div className="absolute inset-0 grid place-items-center rounded-2xl bg-gradient-to-br from-gold-2 to-coral text-center text-ink ring-1 ring-white/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="px-4">
              <div className="text-3xl">{prize.icon}</div>
              <div className="mt-2 text-sm font-extrabold">{prize.name}</div>
              <div className="text-[11px] font-semibold opacity-70">Pribalíme k zásielke zadarmo 💛</div>
            </div>
          </div>
        </div>
      </button>
      {open && <p className="mt-3 text-center text-xs text-mint">Pridané — nájdeš to v balíku aj v sekcii „Moja zbierka".</p>}
    </div>
  );
}
