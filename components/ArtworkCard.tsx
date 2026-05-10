import Link from "next/link";
import { Artwork, getArtist } from "@/lib/data";
import { eur } from "@/lib/format";
import { ArtImage } from "./ArtImage";
import { Countdown } from "./Countdown";
import { ScarcityBar } from "./ScarcityBar";
import { WishlistButton } from "./BuyButton";
import { ArtistAvatar } from "./ArtistAvatar";

export function ArtworkCard({ art, priority = false }: { art: Artwork; priority?: boolean }) {
  const artist = getArtist(art.artistId)!;
  const left = art.editionTotal - art.editionSold;
  const hot = art.kind === "limited" && left <= Math.max(3, Math.ceil(art.editionTotal * 0.15));
  return (
    <Link
      href={`/artwork/${art.slug}`}
      className="card-tilt group relative flex flex-col overflow-hidden rounded-xl2 border border-line bg-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <ArtImage src={art.image} alt={art.title} palette={art.palette} className="h-full w-full transition-transform duration-700 group-hover:scale-[1.06]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent opacity-70" />

        {/* top-left badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide backdrop-blur ${
              art.kind === "original" ? "bg-grape/80 text-white" : "bg-ink/70 text-gold-2 ring-1 ring-gold/40"
            }`}
          >
            {art.kind === "original" ? "Originál · 1/1" : `Limitka · ${art.editionTotal} ks`}
          </span>
          {hot && <span className="rounded-full bg-coral px-2.5 py-1 text-[11px] font-bold uppercase text-white">Posledné kusy</span>}
        </div>

        {/* wishlist */}
        <div className="absolute right-3 top-3">
          <WishlistButton artworkId={art.id} />
        </div>

        {/* drop countdown */}
        {art.dropEndsAt && (
          <div className="absolute bottom-3 left-3">
            <Countdown to={art.dropEndsAt} compact />
          </div>
        )}
        <div className="absolute bottom-3 right-3 rounded-full bg-ink/65 px-2 py-1 text-[11px] text-mute backdrop-blur">
          👀 {art.baseViewers}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <ArtistAvatar artist={artist} size={24} ring={false} />
          <span className="text-xs text-mute">{artist.name}</span>
          <span className="ml-auto text-[11px] text-mute">{art.category}</span>
        </div>
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">{art.title}</h3>
          <p className="mt-0.5 text-xs text-mute">{art.medium} · {art.size}</p>
        </div>
        <div className="mt-auto space-y-2.5">
          <ScarcityBar art={art} />
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] text-mute">{art.kind === "limited" ? "Cena za kus" : "Cena"}</div>
              <div className="font-display text-xl font-semibold">{eur(art.price)}</div>
            </div>
            <span className="rounded-full bg-cream px-3.5 py-2 text-sm font-bold text-ink transition group-hover:bg-white group-hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.4)]">
              Kúpiť →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
