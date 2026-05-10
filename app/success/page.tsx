"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { getArtwork, getArtist, artworks } from "@/lib/data";
import { eur } from "@/lib/format";
import { ArtImage } from "@/components/ArtImage";
import { MysteryReveal } from "@/components/MysteryReveal";
import { WheelOfFortune } from "@/components/WheelOfFortune";
import { ArtworkCard } from "@/components/ArtworkCard";
import { burst, sideCannons } from "@/lib/confetti";
import { BADGE_MAP } from "@/lib/badges";

const PAY_LABEL: Record<string, string> = { card: "Karta (Stripe)", transfer: "Bankový prevod / rezervácia", cod: "Dobierka" };

export default function SuccessPage() {
  const { state, hydrated, level, pushToast } = useApp();
  const order = hydrated ? state.orders.find((o) => o.id === state.lastOrderId) ?? state.orders[0] : null;
  const fired = useRef(false);

  useEffect(() => {
    if (order && !fired.current) {
      fired.current = true;
      burst("huge");
      setTimeout(() => sideCannons(1500), 250);
    }
  }, [order]);

  if (!hydrated) return <div className="container-x py-20 text-center text-mute">Načítavam…</div>;

  if (!order) {
    return (
      <div className="container-x py-20 text-center">
        <div className="text-5xl">✨</div>
        <h1 className="mt-4 font-display text-3xl font-semibold">Zatiaľ žiadna objednávka</h1>
        <p className="mt-2 text-mute">Keď niečo kúpiš, pristaneš tu — s konfetami.</p>
        <Link href="/#galeria" className="mt-6 inline-block rounded-2xl bg-cream px-6 py-3 font-bold text-ink">Do galérie</Link>
      </div>
    );
  }

  const art = getArtwork(order.artworkId)!;
  const artist = getArtist(order.artistId);
  const recos = artworks.filter((a) => a.id !== art.id).slice(0, 4);

  function share() {
    const url = typeof window !== "undefined" ? window.location.origin + `/artwork/${art.slug}` : "";
    if (typeof navigator !== "undefined" && (navigator as Navigator).share) {
      (navigator as Navigator).share({ title: `Práve som si kúpil(a) „${art.title}" na Okno duše`, text: "Pozri sa na túto galériu nezávislých umelcov 👀", url }).catch(() => {});
    } else if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      pushToast({ kind: "info", title: "Odkaz skopírovaný", sub: "Pošli ho kamošom — nech vidia, čo zbieraš.", icon: "🔗" });
    }
  }

  return (
    <div className="container-x py-10">
      {/* hero */}
      <div className="relative overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-grape/20 via-card to-gold/10 p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-mint/20 px-3 py-1 text-xs font-bold text-mint ring-1 ring-mint/40">
              ● Objednávka prijatá · {order.id}
            </div>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">
              Hotovo! <span className="italic text-grape">„{art.title}"</span> je tvoj. 🎉
            </h1>
            <p className="mt-3 text-mute">
              {artist?.name} dostane oznámenie a pripraví dielo na odoslanie. Faktúru a sledovanie zásielky ti pošleme e-mailom.
              {order.payment === "transfer" && " Údaje na prevod nájdeš v maile — dielo držíme 48 h."}
            </p>

            {/* rewards summary */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Stat big={`+${order.pointsEarned}`} label="bodov pripísaných" icon="✦" />
              <Stat big={`Lvl ${level.current.n}`} label={level.current.name} icon="🏅" />
              <Stat big={`${state.spins}`} label="spinov k dispozícii" icon="🎡" />
              <Stat big={`${state.badges.length}`} label={`z ${Object.keys(BADGE_MAP).length} odznakov`} icon="🏆" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/collection" className="rounded-2xl bg-cream px-5 py-3 text-sm font-bold text-ink transition hover:bg-white">Moja zbierka & odznaky →</Link>
              <button onClick={share} className="rounded-2xl border border-line bg-ink-2/60 px-5 py-3 text-sm font-bold text-cream transition hover:border-grape/50">Pochváliť sa 🔗</button>
              <Link href="/#galeria" className="rounded-2xl border border-line bg-ink-2/60 px-5 py-3 text-sm font-bold text-mute transition hover:text-cream">Zbierať ďalej</Link>
            </div>

            {/* order details */}
            <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm sm:grid-cols-3">
              <Info k="Dielo" v={art.title} />
              <Info k="Umelec" v={artist?.name ?? "—"} />
              <Info k="Suma" v={eur(art.price)} />
              <Info k="Platba" v={PAY_LABEL[order.payment]} />
              <Info k="Stav" v={order.payment === "card" ? "Zaplatené" : order.payment === "transfer" ? "Čaká na prevod" : "Na dobierku"} />
              <Info k="Doručenie" v="3–5 prac. dní" />
            </dl>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl2 border border-line bg-card shadow-[0_30px_80px_-30px_rgba(124,77,255,0.5)]">
              <div className="relative aspect-[4/5]">
                <ArtImage src={art.image} alt={art.title} palette={art.palette} className="h-full w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-xs text-mute">Pridané do tvojej zbierky</div>
                  <div className="font-display text-2xl font-semibold">{art.title}</div>
                  <div className="text-sm text-mute">{art.medium} · {art.size}</div>
                </div>
                <div className="absolute right-4 top-4 animate-pop rounded-full bg-mint px-3 py-1 text-xs font-bold text-ink">✓ Tvoje</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* mystery + wheel */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <MysteryReveal seed={order.id} />
        <WheelOfFortune />
      </div>

      {/* recos */}
      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Ešte jedno? Tieto idú dobre k tomu, čo si práve kúpil(a)</h2>
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {recos.map((a) => <ArtworkCard key={a.id} art={a} />)}
        </div>
      </section>
    </div>
  );
}

function Stat({ big, label, icon }: { big: string; label: string; icon: string }) {
  return (
    <div className="animate-pop rounded-2xl border border-line bg-ink/40 p-3 text-center">
      <div className="text-lg">{icon}</div>
      <div className="font-display text-xl font-semibold leading-none">{big}</div>
      <div className="mt-1 text-[11px] text-mute">{label}</div>
    </div>
  );
}
function Info({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wide text-mute">{k}</dt>
      <dd className="font-medium text-cream">{v}</dd>
    </div>
  );
}
