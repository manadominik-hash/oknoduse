import Link from "next/link";
import type { Metadata } from "next";
import { artists, artworks } from "@/lib/data";
import { ArtistAvatar } from "@/components/ArtistAvatar";
import { ArtImage } from "@/components/ArtImage";
import { Reveal } from "@/components/Reveal";
import { eur } from "@/lib/format";

export const metadata: Metadata = { title: "Umelci — Vernis" };

export default function ArtistsPage() {
  return (
    <div className="container-x py-10">
      <Reveal>
        <h1 className="font-display text-4xl font-semibold">Umelci na Vernis</h1>
        <p className="mt-2 max-w-2xl text-mute">
          Žiadne stocky, žiadne AI plátna na bežiacom páse. Reálni ľudia, reálne ateliéry, reálne plátna —
          a ty si od nich kupuješ priamo. 88 % z ceny ide umelcovi.
        </p>
      </Reveal>

      <div className="mt-8 space-y-5">
        {artists.map((ar, idx) => {
          const works = artworks.filter((a) => a.artistId === ar.id);
          const from = works.length ? Math.min(...works.map((w) => w.price)) : 0;
          return (
            <Reveal key={ar.id} delay={idx * 0.05}>
              <div className="overflow-hidden rounded-xl2 border border-line bg-card">
                <div className="grid gap-0 lg:grid-cols-[1.1fr_1.4fr]">
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center gap-3">
                      <ArtistAvatar artist={ar} size={56} />
                      <div>
                        <Link href={`/artists/${ar.slug}`} className="font-display text-2xl font-semibold hover:underline">{ar.name}</Link>
                        <div className="text-sm text-mute">{ar.city} · {ar.tagline}</div>
                      </div>
                    </div>
                    <p className="mt-4 leading-relaxed text-mute">{ar.bio}</p>
                    <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-mute">
                      <span>🖼️ {works.length} diel v ponuke</span>
                      <span>💶 od {eur(from)}</span>
                      <span>❤️ {ar.followers.toLocaleString("sk-SK")} sledujúcich</span>
                    </div>
                    <Link href={`/artists/${ar.slug}`} className="mt-6 inline-block rounded-2xl bg-cream px-5 py-2.5 text-sm font-bold text-ink transition hover:bg-white">
                      Zobraziť profil & diela →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-px bg-line/40">
                    {works.slice(0, 3).map((w) => (
                      <Link key={w.id} href={`/artwork/${w.slug}`} className="group relative block bg-card">
                        <ArtImage src={w.image} alt={w.title} palette={w.palette} className="aspect-square w-full transition-transform duration-500 group-hover:scale-105" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-2.5">
                          <div className="truncate text-xs font-semibold">{w.title}</div>
                          <div className="text-[11px] text-mute">{eur(w.price)}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </div>
  );
}
