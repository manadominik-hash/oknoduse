"use client";

import { useMemo, useState } from "react";
import { Artwork, categories, priceBands } from "@/lib/data";
import { ArtworkCard } from "./ArtworkCard";

type Sort = "Najnovšie" | "Najlacnejšie" | "Najdrahšie" | "Najžiadanejšie";

export function GalleryGrid({ artworks }: { artworks: Artwork[] }) {
  const [cat, setCat] = useState<(typeof categories)[number]>("Všetko");
  const [band, setBand] = useState(0);
  const [onlyDrops, setOnlyDrops] = useState(false);
  const [sort, setSort] = useState<Sort>("Najnovšie");

  const list = useMemo(() => {
    let l = artworks.filter((a) => {
      if (cat !== "Všetko" && a.category !== cat) return false;
      const b = priceBands[band];
      if (a.price < b.min || a.price >= b.max) return false;
      if (onlyDrops && !a.dropEndsAt) return false;
      return true;
    });
    l = [...l];
    if (sort === "Najlacnejšie") l.sort((a, b) => a.price - b.price);
    else if (sort === "Najdrahšie") l.sort((a, b) => b.price - a.price);
    else if (sort === "Najžiadanejšie") l.sort((a, b) => b.baseViewers - a.baseViewers);
    else l.sort((a, b) => b.year - a.year);
    return l;
  }, [artworks, cat, band, onlyDrops, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
              cat === c ? "bg-cream text-ink" : "border border-line bg-ink-2/60 text-mute hover:border-grape/40 hover:text-cream"
            }`}
          >
            {c}
          </button>
        ))}
        <span className="mx-1 h-5 w-px bg-line" />
        <select
          value={band}
          onChange={(e) => setBand(Number(e.target.value))}
          className="rounded-full border border-line bg-ink-2/60 px-3 py-1.5 text-sm text-cream outline-none focus:border-grape/50"
        >
          {priceBands.map((b, i) => (
            <option key={b.label} value={i} className="bg-ink">
              {b.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => setOnlyDrops((v) => !v)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
            onlyDrops ? "bg-coral text-white" : "border border-line bg-ink-2/60 text-mute hover:text-cream"
          }`}
        >
          ⏳ Len dropy
        </button>
        <span className="ml-auto" />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-full border border-line bg-ink-2/60 px-3 py-1.5 text-sm text-cream outline-none focus:border-grape/50"
        >
          {(["Najnovšie", "Najžiadanejšie", "Najlacnejšie", "Najdrahšie"] as Sort[]).map((s) => (
            <option key={s} className="bg-ink">{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-3 text-xs text-mute">{list.length} {list.length === 1 ? "dielo" : list.length < 5 ? "diela" : "diel"}</div>

      {list.length === 0 ? (
        <div className="mt-10 rounded-xl2 border border-dashed border-line p-12 text-center text-mute">
          Nič nesedí na tieto filtre. Skús ich uvoľniť 🙂
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((a, i) => (
            <ArtworkCard key={a.id} art={a} priority={i < 4} />
          ))}
        </div>
      )}
    </div>
  );
}
