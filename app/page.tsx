import Link from "next/link";
import { artworks, artists, getArtist } from "@/lib/data";
import { ArtImage } from "@/components/ArtImage";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ArtistAvatar } from "@/components/ArtistAvatar";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  const drops = artworks
    .filter((a) => a.dropEndsAt)
    .sort((a, b) => new Date(a.dropEndsAt!).getTime() - new Date(b.dropEndsAt!).getTime());
  const featured = drops[0] ?? artworks[0];
  const featuredArtist = getArtist(featured.artistId)!;

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative">
        <div className="container-x grid items-center gap-16 py-24 lg:grid-cols-[1fr_1.1fr] lg:py-32">
          <div className="animate-rise">
            <span className="text-xs uppercase tracking-[0.28em] text-mute">
              Galéria · {artists.length} umelci · {artworks.length} diel
            </span>
            <h1 className="mt-6 font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl">
              Tvoj originál
              <br />
              <span className="italic text-grape">čaká.</span>
            </h1>
            <p className="mt-8 max-w-md font-display text-lg leading-relaxed text-cream/80">
              Kupuj priamo od ľudí, ktorí to maľujú. Bez aukčných domov a sprostredkovateľov.
              Každé dielo má príbeh — a teraz aj teba.
            </p>
            <div className="mt-10">
              <Link
                href="#galeria"
                className="inline-flex items-center gap-3 border-b border-cream pb-1 font-display text-base tracking-wide text-cream transition hover:border-grape hover:text-grape"
              >
                Vstúp do galérie
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* featured artwork — clean, no chrome */}
          <Reveal>
            <Link href={`/artwork/${featured.slug}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card">
                <ArtImage
                  src={featured.image}
                  alt={featured.title}
                  palette={featured.palette}
                  className="h-full w-full transition-transform duration-[1500ms] ease-out group-hover:scale-[1.02]"
                />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-mute">{featuredArtist.name}</div>
                  <div className="mt-1 font-display text-xl italic">{featured.title}</div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-mute">{featured.year}</div>
              </div>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="galeria" className="container-x scroll-mt-20 py-24 lg:py-32">
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-line/70 pb-6">
            <h2 className="font-display text-3xl italic tracking-tight">Galéria</h2>
            <span className="text-xs uppercase tracking-[0.22em] text-mute">
              Všetko, čo je práve na predaj
            </span>
          </div>
        </Reveal>
        <div className="mt-10">
          <GalleryGrid artworks={artworks} />
        </div>
      </section>

      {/* ===== ARTISTS ===== */}
      <section className="container-x py-24 lg:py-32">
        <Reveal>
          <div className="flex items-end justify-between gap-6 border-b border-line/70 pb-6">
            <h2 className="font-display text-3xl italic tracking-tight">Umelci</h2>
            <Link href="/artists" className="text-xs uppercase tracking-[0.22em] text-mute transition hover:text-grape">
              Všetci →
            </Link>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((ar, i) => {
            const count = artworks.filter((a) => a.artistId === ar.id).length;
            return (
              <Reveal key={ar.id} delay={i * 0.05}>
                <Link href={`/artists/${ar.slug}`} className="group block">
                  <div className="flex items-center gap-3">
                    <ArtistAvatar artist={ar} size={44} />
                    <div>
                      <div className="font-display text-lg">{ar.name}</div>
                      <div className="text-xs uppercase tracking-[0.18em] text-mute">{ar.city}</div>
                    </div>
                  </div>
                  <p className="mt-4 font-display text-sm leading-relaxed text-cream/75">
                    {ar.tagline}
                  </p>
                  <div className="mt-4 text-xs uppercase tracking-[0.2em] text-mute">
                    {count} {count === 1 ? "dielo" : count < 5 ? "diela" : "diel"}
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===== CTA for artists ===== */}
      <section className="container-x py-24 lg:py-32">
        <div className="border-t border-line/70 pt-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <span className="text-xs uppercase tracking-[0.28em] text-mute">Pre umelcov</span>
              <h2 className="mt-4 font-display text-4xl leading-[1.1] sm:text-5xl">
                Maľuješ?
                <br />
                <span className="italic text-grape">Toto je tvoja stena.</span>
              </h2>
              <p className="mt-6 max-w-md font-display text-base leading-relaxed text-cream/75">
                Nahraj diela, nastav cenu, vyber edíciu. My sa postaráme o platby, dopravu aj o to,
                aby si ťa zberatelia obľúbili. Provízia 12 % — zvyšok je tvoj.
              </p>
            </div>
            <div className="flex flex-wrap items-end gap-x-10 gap-y-4 text-sm text-mute lg:justify-end">
              <Link
                href="/artists/ty-umelec"
                className="border-b border-cream pb-1 font-display text-base text-cream transition hover:border-grape hover:text-grape"
              >
                Pozri ukážkový profil →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
