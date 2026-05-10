import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artists, getArtist, artworksByArtist } from "@/lib/data";
import { ArtistAvatar } from "@/components/ArtistAvatar";
import { ArtworkCard } from "@/components/ArtworkCard";
import { eur } from "@/lib/format";
import { FollowButton } from "@/components/FollowButton";

export function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ar = getArtist(slug);
  return { title: ar ? `${ar.name} — Vernis` : "Umelec nenájdený — Vernis" };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ar = getArtist(slug);
  if (!ar) notFound();
  const works = artworksByArtist(ar.id);
  const from = works.length ? Math.min(...works.map((w) => w.price)) : 0;
  const drops = works.filter((w) => w.dropEndsAt).length;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line/70" style={{ background: `linear-gradient(135deg, ${ar.accent}22, transparent 60%)` }}>
        <div className="container-x py-12">
          <Link href="/artists" className="text-sm text-mute hover:text-cream">← Všetci umelci</Link>
          <div className="mt-5 flex flex-col gap-6 sm:flex-row sm:items-center">
            <ArtistAvatar artist={ar} size={96} />
            <div className="flex-1">
              <h1 className="font-display text-4xl font-semibold sm:text-5xl">{ar.name}</h1>
              <p className="mt-1 text-mute">{ar.city} · {ar.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-mute">
                <span>🖼️ {works.length} diel</span>
                {drops > 0 && <span className="text-coral">⏳ {drops} v drope</span>}
                <span>💶 od {eur(from)}</span>
                <span>❤️ {ar.followers.toLocaleString("sk-SK")} sledujúcich</span>
              </div>
            </div>
            <FollowButton artistId={ar.id} />
          </div>
          <p className="mt-6 max-w-2xl leading-relaxed text-cream/90">{ar.bio}</p>
        </div>
      </section>

      <section className="container-x py-10">
        <h2 className="font-display text-2xl font-semibold">Diela od {ar.name}</h2>
        {works.length === 0 ? (
          <div className="mt-6 rounded-xl2 border border-dashed border-line p-12 text-center text-mute">Tento umelec zatiaľ nemá zverejnené diela.</div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {works.map((w) => <ArtworkCard key={w.id} art={w} />)}
          </div>
        )}
      </section>
    </div>
  );
}
