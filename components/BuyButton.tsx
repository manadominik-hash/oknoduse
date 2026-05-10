"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Artwork } from "@/lib/data";
import { useApp } from "@/lib/store";

export function BuyButton({ art, size = "lg" }: { art: Artwork; size?: "lg" | "md" }) {
  const router = useRouter();
  const { setPendingCheckout, state } = useApp();
  const [busy, setBusy] = useState(false);
  const owned = state.ownedIds.includes(art.id);

  if (owned) {
    return (
      <div className="border-t border-line/70 pt-4 text-xs uppercase tracking-[0.22em] text-mute">
        Toto dielo už máš v zbierke ·{" "}
        <button
          onClick={() => router.push("/collection")}
          className="text-cream underline-offset-4 transition hover:text-grape hover:underline"
        >
          pozri zbierku →
        </button>
      </div>
    );
  }

  return (
    <button
      disabled={busy}
      onClick={() => {
        setBusy(true);
        setPendingCheckout(art.id);
        setTimeout(() => router.push("/checkout"), 120);
      }}
      className={`group inline-flex w-full items-center justify-between gap-3 rounded-sm bg-cream font-display tracking-tight text-ink transition hover:bg-grape hover:text-white disabled:opacity-60 ${
        size === "lg" ? "px-7 py-5 text-base" : "px-5 py-3.5 text-sm"
      }`}
    >
      <span>{busy ? "Pripravujem objednávku…" : "Kúpiť dielo"}</span>
      {!busy && <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>}
    </button>
  );
}

export function WishlistButton({ artworkId }: { artworkId: string; label?: boolean }) {
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
      className={`text-xs uppercase tracking-[0.22em] transition ${
        active ? "text-grape" : "text-mute hover:text-cream"
      }`}
    >
      {active ? "✓ Uložené" : "Uložiť"}
    </button>
  );
}
