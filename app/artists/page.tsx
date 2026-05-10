import Link from "next/link";
import type { Metadata } from "next";
import { artists, artworks } from "@/lib/data";
import { ArtImage } from "@/components/ArtImage";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Umelci — Okno duše" };

export default function ArtistsPage() {
  return (
    <div className="container-x py-24 lg:py-32">
      <Reveal>
        <span className="text-xs uppercase tracking-[0.28em] text-mute">Galéria</span>
        <h1 className="mt-6 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
          Umelci
        </h1>
        <p className="mt-8 max-w-md font-display text-lg leading-relaxed text-cream/80">
          Žiadne stocky. Reálni ľudia, reálne ateliéry, reálne plátna — a ty si od nich kupuješ priamo.
        </p>
      </Reveal>

      <div className="mt-24 space-y-32">
        {artists.map((ar, idx) => {
          const works = artworks.filter((a) => a.artistId === ar.id).slice(0, 4);
          return (
            <Reveal key={ar.id} delay={idx * 0.04}>
              <article>
                {/* Works first — they are the protagonist */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
                  {works.map((w) => (
                    <Link
                      key={w.id}
                      href={`/artwork/${w.slug}`}
                      className="group block overflow-hidden rounded-sm bg-card"
                    >
                      <ArtImage
                        src={w.image}
                        alt={w.title}
                        palette={w.palette}
                        className="aspect-[4/5] w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      />
                    </Link>
                  ))}
                </div>

                {/* Artist info — secondary, calm */}
                <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-start">
                  <div>
                    <span className="text-xs uppercase tracking-[0.22em] text-mute">{ar.city}</span>
                    <h2 className="mt-3 font-display text-3xl leading-tight">
                      <Link
                        href={`/artists/${ar.slug}`}
                        className="transition hover:text-grape"
                      >
                        {ar.name}
                      </Link>
                    </h2>
                    <div className="mt-2 text-sm italic text-mute">{ar.tagline}</div>
                  </div>
                  <div>
                    <p className="font-display text-base leading-relaxed text-cream/80">{ar.bio}</p>
                    <Link
                      href={`/artists/${ar.slug}`}
                      className="mt-6 inline-flex border-b border-cream/40 pb-0.5 text-xs uppercase tracking-[0.22em] text-cream transition hover:border-grape hover:text-grape"
                    >
                      Profil & všetky diela →
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
