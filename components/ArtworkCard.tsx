import Link from "next/link";
import { Artwork, getArtist } from "@/lib/data";
import { eur } from "@/lib/format";
import { ArtImage } from "./ArtImage";

export function ArtworkCard({ art }: { art: Artwork; priority?: boolean }) {
  const artist = getArtist(art.artistId)!;
  return (
    <Link
      href={`/artwork/${art.slug}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
        <ArtImage
          src={art.image}
          alt={art.title}
          palette={art.palette}
          className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-[0.18em] text-mute">{artist.name}</div>
          <h3 className="mt-1 font-display text-lg italic leading-snug text-cream">{art.title}</h3>
          <div className="mt-1 text-xs text-mute">{art.year} · {art.medium}</div>
        </div>
        <div className="shrink-0 pt-1 font-display text-base tabular-nums text-cream">
          {eur(art.price)}
        </div>
      </div>
    </Link>
  );
}
