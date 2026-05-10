import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { artworks, getArtwork, getArtist, artworksByArtist } from "@/lib/data";
import { eur, pointsForPrice } from "@/lib/format";
import { ArtImage } from "@/components/ArtImage";
import { Countdown } from "@/components/Countdown";
import { ScarcityBar } from "@/components/ScarcityBar";
import { BuyButton, WishlistButton } from "@/components/BuyButton";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ArtistAvatar } from "@/components/ArtistAvatar";
import { LiveViewers } from "@/components/LiveViewers";

export function generateStaticParams() {
  return artworks.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) return { title: "Dielo nenájdené — Vernis" };
  return { title: `${art.title} — ${getArtist(art.artistId)?.name} · Vernis` };
}

export default async function ArtworkPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const art = getArtwork(slug);
  if (!art) notFound();
  const artist = getArtist(art.artistId)!;
  const more = artworksByArtist(artist.id).filter((a) => a.id !== art.id);
  const related = artworks.filter((a) => a.id !== art.id && a.artistId !== art.id).filter((a) => a.category === art.category || a.tags.some((t) => art.tags.includes(t))).slice(0, 4);
  const fill = related.length < 4 ? artworks.filter((a) => a.id !== art.id && !related.includes(a)).slice(0, 4 - related.length) : [];
  const recos = [...related, ...fill];
  const pts = pointsForPrice(art.price);

  return (
    <div className="container-x py-8">
      <Link href="/#galeria" className="text-sm text-mute hover:text-cream">← Späť do galérie</Link>

      <div className="mt-4 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        {/* Image */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="relative overflow-hidden rounded-xl2 border border-line bg-card">
            <ArtImage src={art.image} alt={art.title} palette={art.palette} className="aspect-[4/5] w-full" />
            <div className="absolute left-4 top-4 flex gap-1.5">
              <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${art.kind === "original" ? "bg-grape/80 text-white" : "bg-ink/70 text-gold-2 ring-1 ring-gold/40"}`}>
                {art.kind === "original" ? "Originál · 1/1" : `Limitka · ${art.editionTotal} ks`}
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-mute">
            <span>Foto sú ilustračné · v deme. Skutočné diela posiela umelec poistené.</span>
            <span>{art.year}</span>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-3">
            <Link href={`/artists/${artist.slug}`} className="flex items-center gap-2.5 rounded-full border border-line bg-ink-2/60 py-1 pl-1 pr-3.5 transition hover:border-grape/40">
              <ArtistAvatar artist={artist} size={28} ring={false} />
              <span className="text-sm font-semibold">{artist.name}</span>
            </Link>
            <span className="text-sm text-mute">{artist.city}</span>
          </div>

          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight">{art.title}</h1>
          <p className="mt-2 text-mute">{art.medium} · {art.size} · {art.category}</p>

          <div className="mt-4">
            <LiveViewers base={art.baseViewers} k={art.id} />
          </div>

          {art.dropEndsAt && (
            <div className="mt-5 rounded-xl2 border border-coral/30 bg-coral/10 p-4">
              <div className="text-xs font-bold uppercase tracking-widest text-coral">Drop sa končí o</div>
              <div className="mt-2"><Countdown to={art.dropEndsAt} /></div>
            </div>
          )}

          <div className="mt-5 rounded-xl2 border border-line bg-card p-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="text-xs text-mute">{art.kind === "limited" ? "Cena za jeden kus" : "Cena (vrátane DPH)"}</div>
                <div className="font-display text-3xl font-semibold">{eur(art.price)}</div>
              </div>
              <WishlistButton artworkId={art.id} label />
            </div>
            <div className="mt-4"><ScarcityBar art={art} /></div>
            <div className="mt-5"><BuyButton art={art} /></div>
          </div>

          {/* what you get */}
          <div className="mt-5 rounded-xl2 border border-line bg-gradient-to-br from-grape/10 to-transparent p-5">
            <div className="text-sm font-bold text-cream">Čo k tomu dostaneš</div>
            <ul className="mt-3 space-y-2 text-sm text-mute">
              <li>✦ <span className="font-semibold text-gold-2">+{pts} bodov</span> do tvojho zberateľského konta</li>
              <li>🎡 +1 spin kolesa odmien (body, zľavy, mini printy)</li>
              <li>🎁 Mystery print zdarma pribalený k zásielke</li>
              <li>📜 {art.kind === "original" ? "Certifikát pravosti, podpísaný umelcom" : "Ručne číslovaná edícia s certifikátom"}</li>
              <li>🚚 Doprava po SK zdarma nad 150 € (inak 6 €), 14 dní na vrátenie</li>
            </ul>
          </div>

          {/* story */}
          <div className="mt-6">
            <h2 className="font-display text-xl font-semibold">Príbeh diela</h2>
            <p className="mt-2 leading-relaxed text-mute">{art.story}</p>
            <Link href={`/artists/${artist.slug}`} className="mt-3 inline-block text-sm text-grape underline">Viac o {artist.name} →</Link>
          </div>
        </div>
      </div>

      {/* more from artist */}
      {more.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-semibold">Ďalšie od {artist.name}</h2>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {more.slice(0, 4).map((a) => <ArtworkCard key={a.id} art={a} />)}
          </div>
        </section>
      )}

      {/* recos */}
      <section className="mt-14">
        <h2 className="font-display text-2xl font-semibold">Mohlo by sa ti páčiť</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recos.map((a) => <ArtworkCard key={a.id} art={a} />)}
        </div>
      </section>
    </div>
  );
}
