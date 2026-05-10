import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artworks, getArtwork, getArtist, artworksByArtist } from "@/lib/data";
import { eur } from "@/lib/format";
import { ArtImage } from "@/components/ArtImage";
import { Countdown } from "@/components/Countdown";
import { BuyButton, WishlistButton } from "@/components/BuyButton";
import { ArtworkCard } from "@/components/ArtworkCard";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) return { title: "Dielo nenájdené — Okno duše" };
  return { title: `${art.title} — ${getArtist(art.artistId)?.name} · Okno duše` };
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) notFound();
  const artist = getArtist(art.artistId)!;
  const more = artworksByArtist(artist.id).filter((a) => a.id !== art.id);
  const related = artworks
    .filter((a) => a.id !== art.id && a.artistId !== art.id)
    .filter((a) => a.category === art.category || a.tags.some((t) => art.tags.includes(t)))
    .slice(0, 4);
  const fill =
    related.length < 4
      ? artworks.filter((a) => a.id !== art.id && !related.includes(a)).slice(0, 4 - related.length)
      : [];
  const recos = [...related, ...fill];
  const left = art.editionTotal - art.editionSold;

  return (
    <div className="container-x py-10">
      <Link
        href="/#galeria"
        className="text-xs uppercase tracking-[0.22em] text-mute transition hover:text-grape"
      >
        ← Späť do galérie
      </Link>

      <div className="mt-10 grid gap-x-16 gap-y-12 lg:grid-cols-[1.2fr_1fr]">
        {/* Image — clean, no chrome */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-sm bg-card">
            <ArtImage src={art.image} alt={art.title} palette={art.palette} className="aspect-[4/5] w-full" />
          </div>
          <div className="mt-4 text-xs uppercase tracking-[0.2em] text-mute">
            {art.year} · {art.medium} · {art.size}
          </div>
        </div>

        {/* Info — story-first, commerce later */}
        <div>
          <Link
            href={`/artists/${artist.slug}`}
            className="text-xs uppercase tracking-[0.22em] text-mute transition hover:text-grape"
          >
            {artist.name} · {artist.city}
          </Link>

          <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight">
            <span className="italic">{art.title}</span>
          </h1>

          <div className="mt-3 text-xs uppercase tracking-[0.2em] text-mute">
            {art.kind === "original" ? "Originál · 1/1" : `Limitovaná edícia · ${art.editionSold}/${art.editionTotal}`}
            {art.kind === "limited" && left <= Math.max(3, Math.ceil(art.editionTotal * 0.15)) && left > 0 && (
              <span className="ml-2 text-grape">posledné kusy</span>
            )}
          </div>

          {/* Story comes BEFORE commerce */}
          <div className="mt-12 max-w-prose">
            <span className="text-xs uppercase tracking-[0.22em] text-mute">Príbeh</span>
            <p className="mt-4 font-display text-lg leading-[1.7] text-cream/85">{art.story}</p>
            <Link
              href={`/artists/${artist.slug}`}
              className="mt-6 inline-flex border-b border-cream/40 pb-0.5 text-xs uppercase tracking-[0.22em] text-cream transition hover:border-grape hover:text-grape"
            >
              Viac o {artist.name} →
            </Link>
          </div>

          {/* Drop countdown — quiet, inline */}
          {art.dropEndsAt && (
            <div className="mt-12 border-t border-line/70 pt-6">
              <div className="text-xs uppercase tracking-[0.22em] text-mute">Drop sa končí o</div>
              <div className="mt-3"><Countdown to={art.dropEndsAt} /></div>
            </div>
          )}

          {/* Commerce panel — minimal, no boxes */}
          <div className="mt-12 border-t border-line/70 pt-8">
            <div className="flex items-baseline justify-between gap-6">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-mute">Cena</div>
                <div className="mt-2 font-display text-4xl tabular-nums">{eur(art.price)}</div>
                <div className="mt-1 text-xs text-mute">vrátane DPH · doprava zdarma nad 150 €</div>
              </div>
              <WishlistButton artworkId={art.id} />
            </div>

            <div className="mt-8"><BuyButton art={art} /></div>

            <ul className="mt-8 space-y-2 text-xs uppercase tracking-[0.18em] text-mute">
              <li>{art.kind === "original" ? "Certifikát pravosti, podpísaný umelcom" : "Ručne číslovaná edícia s certifikátom"}</li>
              <li>14 dní na vrátenie</li>
              <li>88 % z ceny ide priamo umelcovi</li>
            </ul>
          </div>
        </div>
      </div>

      {/* more from artist */}
      {more.length > 0 && (
        <section className="mt-32 border-t border-line/70 pt-16">
          <div className="flex items-end justify-between gap-6 pb-8">
            <h2 className="font-display text-2xl italic tracking-tight">Ďalšie od {artist.name}</h2>
            <Link
              href={`/artists/${artist.slug}`}
              className="text-xs uppercase tracking-[0.22em] text-mute transition hover:text-grape"
            >
              Profil →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {more.slice(0, 4).map((a) => (
              <ArtworkCard key={a.id} art={a} />
            ))}
          </div>
        </section>
      )}

      {/* recos */}
      <section className="mt-24">
        <h2 className="border-t border-line/70 pb-8 pt-16 font-display text-2xl italic tracking-tight">
          Mohlo by sa ti páčiť
        </h2>
        <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {recos.map((a) => (
            <ArtworkCard key={a.id} art={a} />
          ))}
        </div>
      </section>
    </div>
  );
}
