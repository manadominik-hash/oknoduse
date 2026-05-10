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
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs uppercase tracking-[0.18em] transition ${
                cat === c ? "text-cream" : "text-mute hover:text-cream"
              }`}
            >
              {c}
              {cat === c && <span aria-hidden className="ml-1 text-grape">·</span>}
            </button>
          ))}
        </div>

        <span className="hidden h-3 w-px bg-line sm:block" />

        <select
          value={band}
          onChange={(e) => setBand(Number(e.target.value))}
          className="bg-transparent text-xs uppercase tracking-[0.18em] text-mute outline-none transition hover:text-cream"
        >
          {priceBands.map((b, i) => (
            <option key={b.label} value={i} className="bg-ink">
              {b.label}
            </option>
          ))}
        </select>

        <button
          onClick={() => setOnlyDrops((v) => !v)}
          className={`text-xs uppercase tracking-[0.18em] transition ${
            onlyDrops ? "text-cream" : "text-mute hover:text-cream"
          }`}
        >
          Len dropy
          {onlyDrops && <span aria-hidden className="ml-1 text-grape">·</span>}
        </button>

        <span className="ml-auto" />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="bg-transparent text-xs uppercase tracking-[0.18em] text-mute outline-none transition hover:text-cream"
        >
          {(["Najnovšie", "Najžiadanejšie", "Najlacnejšie", "Najdrahšie"] as Sort[]).map((s) => (
            <option key={s} className="bg-ink">{s}</option>
          ))}
        </select>
      </div>

      <div className="mt-6 text-xs uppercase tracking-[0.2em] text-mute">
        {list.length} {list.length === 1 ? "dielo" : list.length < 5 ? "diela" : "diel"}
      </div>

      {list.length === 0 ? (
        <div className="mt-12 border-t border-line/60 pt-12 text-center text-sm text-mute">
          Nič nesedí na tieto filtre. Skús ich uvoľniť.
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((a) => (
            <ArtworkCard key={a.id} art={a} />
          ))}
        </div>
      )}
    </div>
  );
}
