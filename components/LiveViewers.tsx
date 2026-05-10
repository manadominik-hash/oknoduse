"use client";

import { useLiveViewers } from "@/lib/store";

export function LiveViewers({ base, k }: { base: number; k: string }) {
  const n = useLiveViewers(base, k);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-2/70 px-3 py-1 text-xs text-mute ring-1 ring-line">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-mint" />
      </span>
      <span className="tabular-nums font-semibold text-cream">{n}</span> ľudí si toto práve pozerá
    </span>
  );
}
