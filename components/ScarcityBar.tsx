import { Artwork } from "@/lib/data";

export function ScarcityBar({ art, viewers }: { art: Artwork; viewers?: number }) {
  if (art.kind === "original") {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="inline-flex items-center gap-1 rounded-full bg-grape/15 px-2.5 py-1 font-semibold text-grape ring-1 ring-grape/40">
          1 / 1 · originál
        </span>
        {typeof viewers === "number" && <span className="text-mute">👀 {viewers} pozerá</span>}
      </div>
    );
  }
  const left = art.editionTotal - art.editionSold;
  const pct = Math.round((art.editionSold / art.editionTotal) * 100);
  const hot = left <= Math.max(3, Math.ceil(art.editionTotal * 0.15));
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className={`font-semibold ${hot ? "text-coral" : "text-cream"}`}>
          {hot ? "🔥 Posledné kusy — " : ""}
          {art.editionSold} / {art.editionTotal} predaných
        </span>
        {typeof viewers === "number" && <span className="text-mute">👀 {viewers} pozerá</span>}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line/70 ring-1 ring-line/40">
        <div
          className={`h-full rounded-full transition-[width] duration-700 ${hot ? "bg-gradient-to-r from-coral to-gold" : "bg-gradient-to-r from-grape to-gold-2"}`}
          style={{ width: `${Math.max(6, pct)}%` }}
        />
      </div>
      <div className="text-[11px] text-mute">{left > 0 ? `Ostáva ${left} ks` : "Vypredané"}</div>
    </div>
  );
}
