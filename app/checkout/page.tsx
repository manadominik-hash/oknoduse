"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useApp } from "@/lib/store";
import { getArtwork, getArtist } from "@/lib/data";
import { eur, pointsForPrice } from "@/lib/format";
import { ArtImage } from "@/components/ArtImage";

type Pay = "card" | "transfer" | "cod";

const PAYMENTS: { id: Pay; title: string; desc: string; icon: string; note?: string }[] = [
  { id: "card", title: "Karta · Apple/Google Pay", desc: "Okamžitá platba cez Stripe Checkout. Najrýchlejšie.", icon: "💳", note: "v deme simulované" },
  { id: "transfer", title: "Bankový prevod / rezervácia", desc: "Dielo ti podržíme 48 h, doplatíš prevodom. Bez poplatku.", icon: "🏦" },
  { id: "cod", title: "Dobierka", desc: "Zaplatíš kuriérovi pri prevzatí. Poplatok 1,50 €.", icon: "📦" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { state, hydrated, completeOrder } = useApp();
  const art = hydrated && state.pendingCheckout ? getArtwork(state.pendingCheckout.artworkId) : null;
  const artist = art ? getArtist(art.artistId) : null;

  const [pay, setPay] = useState<Pay>("card");
  const [form, setForm] = useState({ name: "", email: "", street: "", city: "", zip: "" });
  const [discountApplied, setDiscountApplied] = useState<number>(0);
  const [code, setCode] = useState("");
  const [placing, setPlacing] = useState(false);

  const totals = useMemo(() => {
    if (!art) return null;
    const sub = art.price;
    const disc = discountApplied ? Math.round(sub * (discountApplied / 100)) : 0;
    const afterDisc = sub - disc;
    const shipping = afterDisc >= 150 ? 0 : 6;
    const codFee = pay === "cod" ? 1.5 : 0;
    return { sub, disc, shipping, codFee, total: afterDisc + shipping + codFee };
  }, [art, discountApplied, pay]);

  if (!hydrated) {
    return <div className="container-x py-20 text-center text-mute">Načítavam pokladňu…</div>;
  }
  if (!art || !artist || !totals) {
    return (
      <div className="container-x py-20 text-center">
        <div className="text-5xl">🛒</div>
        <h1 className="mt-4 font-display text-3xl font-semibold">Pokladňa je prázdna</h1>
        <p className="mt-2 text-mute">Vyber si dielo a klikni „Kúpiť teraz".</p>
        <Link href="/#galeria" className="mt-6 inline-block rounded-2xl bg-cream px-6 py-3 font-bold text-ink">Do galérie</Link>
      </div>
    );
  }

  const pts = pointsForPrice(art.price);
  const availCodes = state.discounts;

  function applyCode() {
    if (/^okno\s*10$/i.test(code.trim()) || availCodes.includes(10)) setDiscountApplied(10);
    else setDiscountApplied(0);
    setCode("");
  }

  function placeOrder() {
    setPlacing(true);
    // simulate gateway / bank handshake
    setTimeout(() => {
      const order = completeOrder(pay);
      if (order) router.push("/success");
      else {
        setPlacing(false);
        router.push("/#galeria");
      }
    }, pay === "card" ? 900 : 600);
  }

  return (
    <div className="container-x py-8">
      <Link href={`/artwork/${art.slug}`} className="text-sm text-mute hover:text-cream">← Späť na dielo</Link>
      <h1 className="mt-3 font-display text-3xl font-semibold">Pokladňa</h1>
      <p className="mt-1 text-sm text-mute">Dva kroky a obraz je tvoj. Toto je demo — nič sa neúčtuje a dáta sa nikam neposielajú.</p>

      <div className="mt-7 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: form */}
        <div className="space-y-6">
          <section className="rounded-xl2 border border-line bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Doručenie</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Meno a priezvisko" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Janka Nová" full />
              <Field label="E-mail" value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="janka@email.sk" full />
              <Field label="Ulica a číslo" value={form.street} onChange={(v) => setForm({ ...form, street: v })} placeholder="Hlavná 12" full />
              <Field label="Mesto" value={form.city} onChange={(v) => setForm({ ...form, city: v })} placeholder="Bratislava" />
              <Field label="PSČ" value={form.zip} onChange={(v) => setForm({ ...form, zip: v })} placeholder="811 01" />
            </div>
          </section>

          <section className="rounded-xl2 border border-line bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Spôsob platby</h2>
            <div className="mt-4 space-y-2.5">
              {PAYMENTS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPay(p.id)}
                  className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
                    pay === p.id ? "border-grape bg-grape/10" : "border-line bg-ink-2/40 hover:border-grape/40"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink/60 text-xl">{p.icon}</span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 text-sm font-bold text-cream">
                      {p.title}
                      {p.note && <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold-2">{p.note}</span>}
                    </span>
                    <span className="mt-0.5 block text-xs text-mute">{p.desc}</span>
                  </span>
                  <span className={`mt-1 h-4 w-4 shrink-0 rounded-full border ${pay === p.id ? "border-grape bg-grape" : "border-line"}`} />
                </button>
              ))}
            </div>
            {pay === "card" && (
              <div className="mt-3 rounded-xl border border-line bg-ink/40 p-3 text-xs text-mute">
                🔒 V ostrej verzii sa tu otvorí <span className="text-cream">Stripe Checkout</span> (karty, Apple Pay, Google Pay).
                Stačí doplniť kľúče <code className="text-gold-2">STRIPE_SECRET_KEY</code> a webhook. Teraz to len odsimulujeme.
              </div>
            )}
          </section>

          <section className="rounded-xl2 border border-line bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Zľavový kód</h2>
            <div className="mt-3 flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={availCodes.includes(10) ? "Máš kód OKNO10 z kolesa 🎡" : "napr. OKNO10"}
                className="flex-1 rounded-xl border border-line bg-ink/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-mute/60 focus:border-grape/50"
              />
              <button onClick={applyCode} className="rounded-xl bg-ink-3 px-4 py-2.5 text-sm font-bold text-cream hover:bg-line">Použiť</button>
            </div>
            {discountApplied > 0 && <p className="mt-2 text-xs text-mint">✓ Zľava {discountApplied}% uplatnená.</p>}
            {availCodes.includes(10) && discountApplied === 0 && (
              <button onClick={() => setDiscountApplied(10)} className="mt-2 text-xs text-grape underline">Použiť môj kód OKNO10 (−10 %)</button>
            )}
          </section>
        </div>

        {/* RIGHT: summary */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl2 border border-line bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Tvoja objednávka</h2>
            <div className="mt-4 flex gap-3">
              <div className="h-24 w-20 shrink-0 overflow-hidden rounded-xl border border-line">
                <ArtImage src={art.image} alt={art.title} palette={art.palette} className="h-full w-full" />
              </div>
              <div className="min-w-0">
                <div className="truncate font-display text-base font-semibold">{art.title}</div>
                <div className="text-xs text-mute">{artist.name} · {art.medium}</div>
                <div className="mt-1 text-xs text-mute">{art.kind === "original" ? "Originál · 1/1" : `Limitka · 1 ks z ${art.editionTotal}`}</div>
              </div>
            </div>

            <dl className="mt-4 space-y-1.5 border-t border-line/60 pt-4 text-sm">
              <Row k="Dielo" v={eur(totals.sub)} />
              {totals.disc > 0 && <Row k={`Zľava ${discountApplied}%`} v={`−${eur(totals.disc)}`} accent />}
              <Row k="Doprava (SK)" v={totals.shipping === 0 ? "zdarma" : eur(totals.shipping)} />
              {totals.codFee > 0 && <Row k="Poplatok za dobierku" v={eur(totals.codFee)} />}
              <div className="!mt-3 flex items-center justify-between border-t border-line/60 pt-3 text-base font-bold">
                <span>Spolu</span><span className="font-display text-xl">{eur(totals.total)}</span>
              </div>
            </dl>

            <div className="mt-4 rounded-xl bg-gradient-to-br from-gold/15 to-grape/10 p-3 text-xs text-cream/90 ring-1 ring-gold/25">
              Po zaplatení získaš: <span className="font-semibold text-gold-2">+{pts} bodov</span> · 🎡 +1 spin · 🎁 mystery print
            </div>

            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-4 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-gold-2 via-gold to-coral px-6 py-4 font-bold text-ink shadow-[0_14px_40px_-12px_rgba(240,180,41,0.7)] transition active:scale-[0.99] disabled:opacity-70"
            >
              {placing ? (pay === "card" ? "Otváram Stripe…" : "Potvrdzujem objednávku…") : pay === "card" ? `Zaplatiť ${eur(totals.total)}` : pay === "transfer" ? "Rezervovať & poslať údaje na prevod" : `Objednať na dobierku · ${eur(totals.total)}`}
            </button>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11px] text-mute">
              <span>🔒 Bezpečná platba</span><span>· 14 dní na vrátenie</span><span>· Faktúra e-mailom</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, full }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; full?: boolean }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs text-mute">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-line bg-ink/50 px-3.5 py-2.5 text-sm outline-none placeholder:text-mute/60 focus:border-grape/50" />
    </label>
  );
}
function Row({ k, v, accent }: { k: string; v: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-mute">{k}</dt>
      <dd className={accent ? "text-mint" : "text-cream"}>{v}</dd>
    </div>
  );
}
