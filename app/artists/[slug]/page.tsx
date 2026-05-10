import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artists, getArtist, artworksByArtist } from "@/lib/data";
import { ArtworkCard } from "@/components/ArtworkCard";
import { FollowButton } from "@/components/FollowButton";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ar = getArtist(slug);
  return { title: ar ? `${ar.name} — Okno duše` : "Umelec nenájdený — Okno duše" };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ar = getArtist(slug);
  if (!ar) notFound();
  const works = artworksByArtist(ar.id);

  return (
    <div>
      {/* Quiet hero — no gradient, no metadata clutter */}
      <section className="container-x py-20 lg:py-28">
        <Link
          href="/artists"
          className="text-xs uppercase tracking-[0.22em] text-mute transition hover:text-grape"
        >
          ← Všetci umelci
        </Link>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <div>
            <span className="text-xs uppercase tracking-[0.22em] text-mute">{ar.city}</span>
            <h1 className="mt-3 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              {ar.name}
            </h1>
            <div className="mt-4 text-base italic text-mute">{ar.tagline}</div>
            <div className="mt-8">
              <FollowButton artistId={ar.id} />
            </div>
          </div>
          <div>
            <p className="font-display text-lg leading-[1.7] text-cream/85">{ar.bio}</p>
          </div>
        </div>
      </section>

      {/* Works — the reason you came */}
      <section className="container-x py-16 lg:py-24">
        <div className="border-t border-line/70 pb-8 pt-12">
          <div className="flex items-end justify-between gap-6">
            <h2 className="font-display text-2xl italic tracking-tight">Diela</h2>
            <span className="text-xs uppercase tracking-[0.22em] text-mute">
              {works.length} {works.length === 1 ? "dielo" : works.length < 5 ? "diela" : "diel"}
            </span>
          </div>
        </div>
        {works.length === 0 ? (
          <div className="mt-12 text-center text-sm text-mute">
            Tento umelec zatiaľ nemá zverejnené diela.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {works.map((w) => (
              <ArtworkCard key={w.id} art={w} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
