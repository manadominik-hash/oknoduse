"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useApp } from "@/lib/store";
import { artworks, getArtwork, getArtist } from "@/lib/data";
import { eur, num } from "@/lib/format";
import { LevelRing } from "@/components/LevelRing";
import { ArtworkCard } from "@/components/ArtworkCard";
import { ArtImage } from "@/components/ArtImage";
import { BadgeGrid } from "@/components/BadgeGrid";
import { DailyReward } from "@/components/DailyReward";
import { WheelOfFortune } from "@/components/WheelOfFortune";
import { LEVELS } from "@/lib/badges";

const FAKE_COLLECTORS = [
  { handle: "art_kvocka", points: 18420, works: 14 },
  { handle: "modra_stena", points: 12990, works: 9 },
  { handle: "olejomania", points: 9850, works: 8 },
  { handle: "printlover_ke", points: 7340, works: 11 },
  { handle: "tichá_galéria", points: 5210, works: 5 },
  { handle: "stena_v_obyvačke", points: 3120, works: 4 },
  { handle: "začínam_zbierať", points: 980, works: 2 },
];

export default function CollectionPage() {
  const { state, hydrated, level, spent, artistsSupported, resetAll } = useApp();

  const owned = useMemo(() => state.ownedIds.map((id) => getArtwork(id)).filter(Boolean) as NonNullable<ReturnType<typeof getArtwork>>[], [state.ownedIds]);
  const leaderboard = useMemo(() => {
    const me = { handle: "Ty", points: state.points, works: state.ownedIds.length, me: true };
    return [...FAKE_COLLECTORS.map((c) => ({ ...c, me: false })), me].sort((a, b) => b.points - a.points);
  }, [state.points, state.ownedIds.length]);
  const myRank = leaderboard.findIndex((r) => r.me) + 1;

  if (!hydrated) return <div className="container-x py-20 text-center text-mute">Načítavam tvoj profil…</div>;

  const nextLevel = level.next;
  const xpToNext = nextLevel ? nextLevel.minXp - state.xp : 0;

  return (
    <div className="container-x py-8">
      {/* PROFILE HEADER */}
      <div className="relative overflow-hidden rounded-xl2 border border-line bg-gradient-to-br from-grape/15 via-card to-gold/10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="relative">
            <span className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-gold-2 to-grape font-display text-3xl font-bold text-ink ring-2 ring-white/20">TY</span>
            <span className="absolute -bottom-2 -right-2"><LevelRing levelN={level.current.n} progress={level.progress} size={40} stroke={4} /></span>
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-semibold">Tvoja zbierka</h1>
              <span className="rounded-full bg-grape/20 px-2.5 py-0.5 text-xs font-bold text-[#cdbcff] ring-1 ring-grape/40">Level {level.current.n} · {level.current.name}</span>
            </div>
            <p className="mt-1 text-sm text-mute">{level.current.perk}</p>
            {/* xp bar */}
            <div className="mt-3 max-w-md">
              <div className="flex items-center justify-between text-[11px] text-mute">
                <span>{num(state.xp)} XP</span>
                <span>{nextLevel ? `${num(xpToNext)} XP do „${nextLevel.name}"` : "Maximálny level — legenda 👑"}</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-ink/70 ring-1 ring-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-gold-2 to-grape transition-[width] duration-700" style={{ width: `${Math.max(4, level.progress * 100)}%` }} />
              </div>
            </div>
          </div>
          <button onClick={resetAll} className="self-start rounded-full border border-line bg-ink/40 px-3 py-1.5 text-xs text-mute transition hover:text-coral" title="Vynulovať demo profil">↺ Vynulovať demo</button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <Stat v={num(state.points)} l="bodov" icon="✦" />
          <Stat v={eur(spent)} l="investované do umenia" icon="💛" />
          <Stat v={String(owned.length)} l={owned.length === 1 ? "dielo v zbierke" : "diel v zbierke"} icon="🖼️" />
          <Stat v={String(artistsSupported)} l="podporených umelcov" icon="🤝" />
          <Stat v={`${Math.max(1, state.streak)} 🔥`} l="dňová séria" icon="📆" />
        </div>
      </div>

      {/* DAILY + WHEEL */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DailyReward />
        <WheelOfFortune />
      </div>

      {/* MY COLLECTION */}
      <section className="mt-10">
        <h2 className="font-display text-2xl font-semibold">Moja zbierka</h2>
        {owned.length === 0 ? (
          <div className="mt-4 rounded-xl2 border border-dashed border-line bg-card p-8 text-center">
            <div className="text-4xl">🪴</div>
            <h3 className="mt-3 font-display text-xl font-semibold">Stena je zatiaľ prázdna</h3>
            <p className="mt-1 text-mute">Prvý nákup ti hodí <span className="text-gold-2 font-semibold">odznak</span>, kopu bodov a spin kolesa. Tu sú tipy na začiatok:</p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[...artworks].sort((a, b) => a.price - b.price).slice(0, 3).map((a) => <ArtworkCard key={a.id} art={a} />)}
            </div>
            <Link href="/#galeria" className="mt-6 inline-block rounded-2xl bg-cream px-6 py-3 font-bold text-ink">Prezri celú galériu</Link>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {owned.map((a) => <ArtworkCard key={a.id} art={a} />)}
          </div>
        )}
      </section>

      {/* mystery prints */}
      {state.mysteryPrints.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-semibold">Bonusy & mystery printy</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.mysteryPrints.map((m, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl border border-line bg-gradient-to-br from-gold-2/15 to-coral/10 p-4 ring-1 ring-gold/25">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-ink/60 text-xl">🎁</span>
                <div className="text-sm font-semibold text-cream">{m}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* badges */}
      <section className="mt-10">
        <BadgeGrid />
      </section>

      {/* leaderboard */}
      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-xl2 border border-line bg-card p-5">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-xl font-semibold">Rebríček zberateľov</h2>
            <span className="text-sm text-mute">Si na {myRank}. mieste</span>
          </div>
          <ol className="mt-4 space-y-1.5">
            {leaderboard.slice(0, 8).map((r, i) => (
              <li key={r.handle} className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${r.me ? "bg-grape/15 ring-1 ring-grape/40" : i % 2 ? "bg-ink-2/30" : ""}`}>
                <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${i === 0 ? "bg-gold-2 text-ink" : i === 1 ? "bg-[#cdd6e0] text-ink" : i === 2 ? "bg-[#d9a066] text-ink" : "bg-ink/60 text-mute"}`}>{i + 1}</span>
                <span className={`flex-1 font-medium ${r.me ? "text-cream" : "text-mute"}`}>{r.me ? "Ty" : `@${r.handle}`}</span>
                <span className="text-xs text-mute">{r.works} diel</span>
                <span className="w-20 text-right font-semibold tabular-nums text-gold-2">{num(r.points)} ✦</span>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-mute">Ostatní zberatelia sú simulovaní pre ukážku. Tvoje skóre je skutočné (uložené v prehliadači).</p>
        </div>

        {/* order history */}
        <div className="rounded-xl2 border border-line bg-card p-5">
          <h2 className="font-display text-xl font-semibold">História objednávok</h2>
          {state.orders.length === 0 ? (
            <p className="mt-3 text-sm text-mute">Zatiaľ žiadne objednávky.</p>
          ) : (
            <ul className="mt-4 divide-y divide-line/50">
              {state.orders.map((o) => {
                const a = getArtwork(o.artworkId);
                return (
                  <li key={o.id} className="flex items-center gap-3 py-3">
                    <div className="h-12 w-10 shrink-0 overflow-hidden rounded-lg border border-line">{a && <ArtImage src={a.image} alt={a.title} palette={a.palette} className="h-full w-full" />}</div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold">{o.title}</div>
                      <div className="text-[11px] text-mute">{o.id} · {new Date(o.date).toLocaleDateString("sk-SK")} · {getArtist(o.artistId)?.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{eur(o.price)}</div>
                      <div className="text-[11px] text-gold-2">+{o.pointsEarned} ✦</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          <Link href="/#galeria" className="mt-4 inline-block text-sm text-grape underline">Pridať ďalšie dielo →</Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ v, l, icon }: { v: string; l: string; icon: string }) {
  return (
    <div className="rounded-2xl border border-line bg-ink/40 p-3">
      <div className="flex items-center gap-1.5 text-xs text-mute"><span>{icon}</span>{l}</div>
      <div className="mt-1 font-display text-xl font-semibold">{v}</div>
    </div>
  );
}
