"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Artwork } from "@/lib/data";
import { useApp } from "@/lib/store";
import { eur, pointsForPrice } from "@/lib/format";
import { BADGE_MAP } from "@/lib/badges";

function nextBadgeHint(art: Artwork, ownedIds: string[], badges: string[]): string | null {
  if (!badges.includes("first-buy") && ownedIds.length === 0) return BADGE_MAP["first-buy"].name;
  if (!badges.includes("original") && art.kind === "original") return BADGE_MAP["original"].name;
  if (!badges.includes("limited") && art.kind === "limited") return BADGE_MAP["limited"].name;
  if (!badges.includes("last-minute") && art.dropEndsAt) return BADGE_MAP["last-minute"].name;
  return null;
}

export function BuyButton({ art, size = "lg" }: { art: Artwork; size?: "lg" | "md" }) {
  const router = useRouter();
  const { setPendingCheckout, state } = useApp();
  const [busy, setBusy] = useState(false);
  const pts = pointsForPrice(art.price);
  const owned = state.ownedIds.includes(art.id);
  const hint = nextBadgeHint(art, state.ownedIds, state.badges);

  if (owned) {
    return (
      <div className="rounded-2xl bg-mint/15 px-5 py-4 text-center ring-1 ring-mint/40">
        <div className="text-sm font-bold text-mint">✓ Toto dielo už máš v zbierke</div>
        <button onClick={() => router.push("/collection")} className="mt-1 text-xs text-mute underline hover:text-cream">
          Pozri si zbierku
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <button
        disabled={busy}
        onClick={() => {
          setBusy(true);
          setPendingCheckout(art.id);
          setTimeout(() => router.push("/checkout"), 120);
        }}
        className={`group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-gold-2 via-gold to-coral font-bold text-ink shadow-[0_14px_40px_-12px_rgba(240,180,41,0.7)] transition active:scale-[0.99] disabled:opacity-70 ${
          size === "lg" ? "px-6 py-4 text-base" : "px-5 py-3 text-sm"
        }`}
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        <span className="relative flex items-center justify-center gap-2">
          {busy ? "Pripravujem objednávku…" : <>Kúpiť teraz · {eur(art.price)}</>}
          {!busy && <span aria-hidden>→</span>}
        </span>
      </button>
      <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center text-xs text-mute">
        <span className="font-semibold text-gold-2">+{pts} bodov</span>
        <span>·</span>
        <span>+1 spin kolesa 🎡</span>
        <span>·</span>
        <span>mystery print zdarma 🎁</span>
      </div>
      {hint && (
        <div className="rounded-xl bg-grape/12 px-3 py-2 text-center text-[11px] text-[#cdbcff] ring-1 ring-grape/30">
          Týmto nákupom odomkneš odznak <span className="font-semibold">„{hint}"</span>
        </div>
      )}
    </div>
  );
}

export function WishlistButton({ artworkId, label = false }: { artworkId: string; label?: boolean }) {
  const { isWished, toggleWishlist, hydrated } = useApp();
  const active = hydrated && isWished(artworkId);
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(artworkId);
      }}
      aria-label="Pridať do zoznamu želaní"
      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition ${
        active ? "border-coral/60 bg-coral/15 text-coral" : "border-line bg-ink-2/70 text-mute hover:border-coral/40 hover:text-cream"
      }`}
    >
      <span className={active ? "" : "grayscale"}>{active ? "❤️" : "🤍"}</span>
      {label && <span>{active ? "V zozname želaní" : "Pridať do želaní"}</span>}
    </button>
  );
}
