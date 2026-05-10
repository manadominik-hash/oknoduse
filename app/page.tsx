import Link from "next/link";
import { artworks, artists, getArtist } from "@/lib/data";
import { eur } from "@/lib/format";
import { ArtImage } from "@/components/ArtImage";
import { Countdown } from "@/components/Countdown";
import { ScarcityBar } from "@/components/ScarcityBar";
import { BuyButton, WishlistButton } from "@/components/BuyButton";
import { GalleryGrid } from "@/components/GalleryGrid";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ArtistAvatar } from "@/components/ArtistAvatar";
import { Reveal } from "@/components/Reveal";
import { LEVELS } from "@/lib/badges";

export default function Home() {
  const drops = artworks.filter((a) => a.dropEndsAt).sort((a, b) => new Date(a.dropEndsAt!).getTime() - new Date(b.dropEndsAt!).getTime());
  const featured = drops[0] ?? artworks[0];
  const featuredArtist = getArtist(featured.artistId)!;
  const secondary = artworks.find((a) => a.id !== featured.id && a.artistId !== featured.artistId) ?? artworks[1];

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-12 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-2/70 px-3 py-1.5 text-xs font-medium text-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" /> Galéria živá teraz · {artists.length} umelci · {artworks.length} diel
            </span>
            <h1 className="mt-5 font-display text-[2.7rem] font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              Kúp si <span className="italic text-grape">originál</span>.<br />
              Podpor <span className="shimmer-text">skutočného umelca</span>.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-mute">
              Okno duše je galéria, kde sa obraz stáva tvojím na dva kliky — bez aukčných domov a sprostredkovateľov.
              Každý nákup ti prináša body, levely a odmeny. Zbieranie umenia konečne vyzerá ako hra, ktorú chceš hrať.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="#galeria" className="rounded-2xl bg-cream px-6 py-3.5 font-bold text-ink transition hover:bg-white">
                Prezri galériu
              </Link>
              <Link href="#dropy" className="rounded-2xl border border-line bg-ink-2/60 px-6 py-3.5 font-bold text-cream transition hover:border-grape/50">
                Aktívne dropy ⏳
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-mute">
              <span>✓ Doprava po SK zdarma nad 150 €</span>
              <span>✓ 14 dní na vrátenie</span>
              <span>✓ 88 % z ceny ide umelcovi</span>
            </div>
          </div>

          {/* featured drop visual */}
          <div className="relative">
            <div className="absolute -right-6 top-10 hidden w-44 rotate-6 overflow-hidden rounded-2xl border border-line opacity-70 blur-[1px] lg:block">
              <ArtImage src={secondary.image} alt={secondary.title} palette={secondary.palette} className="aspect-[4/5] w-full" />
            </div>
            <Reveal>
              <div className="relative overflow-hidden rounded-xl2 border border-line bg-card shadow-[0_30px_80px_-30px_rgba(124,77,255,0.5)]">
                <div className="relative aspect-[5/4] overflow-hidden">
                  <ArtImage src={featured.image} alt={featured.title} palette={featured.palette} className="h-full w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-cream/85 via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 rounded-full bg-coral px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    ● Live drop
                  </span>
                  <div className="absolute right-4 top-4"><WishlistButton artworkId={featured.id} /></div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div>
                      <div className="text-xs text-ink/60">{featured.kind === "original" ? "Originál · jediný kus" : `Limitka · ${featured.editionTotal} ks`}</div>
                      <div className="font-display text-2xl font-semibold text-ink">{featured.title}</div>
                    </div>
                    {featured.dropEndsAt && <Countdown to={featured.dropEndsAt} compact />}
                  </div>
                </div>
                <div className="space-y-4 p-5">
                  <div className="flex items-center gap-2.5">
                    <ArtistAvatar artist={featuredArtist} size={32} />
                    <div className="text-sm">
                      <div className="font-semibold">{featuredArtist.name}</div>
                      <div className="text-xs text-mute">{featuredArtist.city} · {featured.medium}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xs text-mute">Cena</div>
                      <div className="font-display text-xl font-semibold">{eur(featured.price)}</div>
                    </div>
                  </div>
                  <ScarcityBar art={featured} viewers={featured.baseViewers} />
                  <BuyButton art={featured} size="md" />
                  <Link href={`/artwork/${featured.slug}`} className="block text-center text-xs text-mute underline hover:text-cream">
                    Zobraziť detail diela
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===== DROPS ===== */}
      <section id="dropy" className="container-x scroll-mt-20 py-12">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl font-semibold">Aktívne dropy</h2>
              <p className="mt-1 text-mute">Časovo limitované. Keď odpočet dobehne, dielo zmizne z dropu — alebo sa rovno vypredá.</p>
            </div>
          </div>
        </Reveal>
        <div className="no-scrollbar -mx-5 mt-6 flex snap-x gap-5 overflow-x-auto px-5 pb-2">
          {drops.map((a, i) => (
            <div key={a.id} className="w-[280px] shrink-0 snap-start sm:w-[320px]">
              <ArtworkCard art={a} priority={i < 3} />
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS / GAMIFICATION ===== */}
      <section id="ako" className="container-x scroll-mt-20 py-12">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold">Nákup na dva kliky — a potom začne zábava</h2>
          <p className="mt-1 max-w-2xl text-mute">Žiadne košíky na pol hodiny. Vyberieš, klikneš „Kúpiť", zaplatíš kartou alebo prevodom. A galéria si ťa odmení.</p>
        </Reveal>
        <div className="mt-7 grid gap-4 md:grid-cols-4">
          {[
            { n: "01", t: "Vyber dielo", d: "Originály, limitky aj printy od 38 €. Filtruj podľa štýlu, ceny či dropov.", i: "🖼️" },
            { n: "02", t: 'Klikni „Kúpiť teraz"', d: "Jedna obrazovka: kontakt + spôsob platby. Karta, bankový prevod alebo dobierka.", i: "⚡" },
            { n: "03", t: "Získaj body & spin", d: "Za každý nákup body, jeden spin kolesa odmien a mystery print zdarma.", i: "✨" },
            { n: "04", t: "Leveluj a zbieraj", d: "Odomykaj odznaky, rastú ti perky — skorý prístup k dropom, zľavy, pozvánky na vernisáže.", i: "🏆" },
          ].map((s, idx) => (
            <Reveal key={s.n} delay={idx * 0.06}>
              <div className="h-full rounded-xl2 border border-line bg-card p-5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{s.i}</span>
                  <span className="font-display text-sm text-mute">{s.n}</span>
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold">{s.t}</h3>
                <p className="mt-1.5 text-sm text-mute">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* level ladder */}
        <Reveal>
          <div className="mt-8 overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-grape/10 via-card to-gold/5">
            <div className="flex flex-wrap items-center gap-3 border-b border-line/60 px-5 py-4">
              <span className="text-sm font-bold text-cream">Rebríček zberateľa</span>
              <span className="text-xs text-mute">Body zbieraš nákupmi, dennými odmenami aj kolesom. Level rastie sám.</span>
              <Link href="/collection" className="ml-auto rounded-full bg-cream px-3.5 py-1.5 text-xs font-bold text-ink">Pozri svoj profil →</Link>
            </div>
            <div className="grid gap-px bg-line/40 sm:grid-cols-2 lg:grid-cols-4">
              {LEVELS.map((l) => (
                <div key={l.n} className="bg-card p-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-gold-2 to-grape text-xs font-extrabold text-ink">{l.n}</span>
                    <span className="font-semibold">{l.name}</span>
                  </div>
                  <div className="mt-2 text-[11px] text-mute">od {l.minXp.toLocaleString("sk-SK")} XP</div>
                  <div className="mt-1 text-xs text-cream/90">{l.perk}</div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="galeria" className="container-x scroll-mt-20 py-12">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold">Galéria</h2>
          <p className="mt-1 text-mute">Všetko, čo je práve na predaj. Klikni na dielo pre detail a nákup.</p>
        </Reveal>
        <div className="mt-6">
          <GalleryGrid artworks={artworks} />
        </div>
      </section>

      {/* ===== ARTISTS ===== */}
      <section className="container-x py-12">
        <Reveal>
          <h2 className="font-display text-3xl font-semibold">Umelci na Okno duše</h2>
          <p className="mt-1 text-mute">Skutoční ľudia so skutočnými ateliérmi. Klikni a spoznaj príbeh za plátnom.</p>
        </Reveal>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {artists.map((ar, i) => {
            const count = artworks.filter((a) => a.artistId === ar.id).length;
            return (
              <Reveal key={ar.id} delay={i * 0.05}>
                <Link href={`/artists/${ar.slug}`} className="card-tilt block h-full rounded-xl2 border border-line bg-card p-5">
                  <div className="flex items-center gap-3">
                    <ArtistAvatar artist={ar} size={48} />
                    <div>
                      <div className="font-display text-lg font-semibold">{ar.name}</div>
                      <div className="text-xs text-mute">{ar.city}</div>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-mute">{ar.tagline}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-mute">
                    <span>🖼️ {count} diel</span>
                    <span>❤️ {ar.followers.toLocaleString("sk-SK")} sledujúcich</span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ===== CTA for artists ===== */}
      <section className="container-x pb-4 pt-8">
        <div className="relative overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-grape/20 via-card to-gold/10 p-8 sm:p-12">
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl font-semibold sm:text-4xl">Maľuješ? Toto je tvoja stena.</h2>
            <p className="mt-3 text-mute">
              Nahraj diela, nastav cenu, vyber edíciu. My sa postaráme o platby, dopravu aj o to, aby si ťa zberatelia obľúbili.
              Provízia 12 % — zvyšok je tvoj. Výplaty každý týždeň.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/artists/ty-umelec" className="rounded-2xl bg-cream px-6 py-3.5 font-bold text-ink transition hover:bg-white">Pozri ukážkový profil</Link>
              <span className="rounded-2xl border border-line bg-ink/40 px-6 py-3.5 font-bold text-mute">Prihlásenie umelcov — čoskoro</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
