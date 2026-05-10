"use client";

import { useState } from "react";
import { useApp } from "@/lib/store";
import { getArtist } from "@/lib/data";

const KEY = "okno_follows";

export function FollowButton({ artistId }: { artistId: string }) {
  const { pushToast } = useApp();
  const [following, setFollowing] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return (JSON.parse(localStorage.getItem(KEY) || "[]") as string[]).includes(artistId);
    } catch {
      return false;
    }
  });

  function toggle() {
    setFollowing((cur) => {
      const next = !cur;
      try {
        const arr = new Set<string>(JSON.parse(localStorage.getItem(KEY) || "[]"));
        if (next) arr.add(artistId);
        else arr.delete(artistId);
        localStorage.setItem(KEY, JSON.stringify([...arr]));
      } catch {}
      if (next) pushToast({ kind: "info", title: `Sleduješ ${getArtist(artistId)?.name ?? "umelca"}`, sub: "Dáme ti vedieť o novom drope ako prvému.", icon: "🔔" });
      return next;
    });
  }

  return (
    <button
      onClick={toggle}
      className={`inline-flex items-center gap-2 border-b pb-0.5 text-xs uppercase tracking-[0.22em] transition ${
        following
          ? "border-grape/40 text-grape hover:border-grape"
          : "border-cream/40 text-cream hover:border-grape hover:text-grape"
      }`}
    >
      {following ? "✓ Sleduješ" : "Sledovať umelca"}
    </button>
  );
}
