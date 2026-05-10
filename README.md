# Vernis — galéria & obchod pre nezávislých umelcov

Webová aplikácia na predaj obrazov (originály, limitky, printy) priamo od umelcov.
Zameraná na **jednoduchý nákup na dva kliky**, **gamifikáciu** a jemné **dopamínové slučky**, ktoré z kúpy a zbierania umenia robia zážitok.

> **Stav:** funkčný UX/UI prototyp. Platby, dáta a doručenie sú **simulované**; stav používateľa sa drží v `localStorage`. Kompletná špecifikácia je v [`spec.md`](./spec.md).

## Čo to vie

- 🛒 **Nákup na 2 kliky** — *Kúpiť teraz* → jedna obrazovka pokladne (karta/Stripe · bankový prevod/rezervácia · dobierka) → hotovo.
- 🖼️ **Galéria** s filtrami (kategória, cena, len dropy, triedenie), detail diela, profily umelcov.
- ⏳ **Dropy & vzácnosť** — tikajúce odpočty, reálne klesajúce edície, „posledné kusy", live počet pozerajúcich, live ticker udalostí.
- ✦ **Body, XP a 7 levelov** s perkami; animované počítadlo v hlavičke.
- 🏆 **10 odznakov** s progresom, **rebríček zberateľov**.
- 🎡 **Koleso odmien** (1 spin za nákup / level-up) a 🎁 **mystery print** ku každej objednávke.
- 🔥 **Denná odmena** so 7-dňovou sériou.
- 🎉 Konfety, toasty, reveal-on-scroll, tmavá „galerijná" estetika.

## Technológie

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS v4 · motion (Framer Motion) · canvas-confetti.

## Spustenie

```bash
npm install
npm run dev          # http://localhost:3000
# produkčne:
npm run build && npm run start
```

Demo profil vyčistíš tlačidlom „↺ Vynulovať demo" v `/collection` (alebo zmaž `localStorage` kľúče `vernis_*`).

## Štruktúra

```
app/          stránky (/, /artwork/[slug], /artists, /artists/[slug], /checkout, /success, /collection)
components/    UI komponenty (ArtworkCard, Countdown, WheelOfFortune, MysteryReveal, BadgeGrid, ...)
lib/           data.ts (ukážkové diela/umelci), store.tsx (stav + gamifikácia), badges.ts, format.ts, confetti.ts
spec.md       produktová a UX špecifikácia
```

## Ďalšie kroky

Reálne platby (Stripe webhooky), backend + kontá zberateľov, sklad/doručenie, plánované dropy + notifikácie, `prefers-reduced-motion`, lokalizácia. Detaily v `spec.md` → *Roadmap*.
