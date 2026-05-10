# Vernis — špecifikácia produktu

> Webová galéria a obchod, kde poloprofesionálni a nezávislí umelci predávajú svoje obrazy.
> Dôraz na **jednoduchý nákup (dva kliky)**, **gamifikáciu** a **dopamínové slučky**, ktoré motivujú zbierať a vracať sa.
>
> Stav: funkčný UX/UI prototyp (Next.js 16 + Tailwind v4). Platby, dáta a doručenie sú **simulované**. Stav používateľa sa drží v `localStorage`.

---

## 1. Cieľ a publikum

| | |
|---|---|
| **Pre koho** | Poloprofesionálny maliar + jeho komunita umelcov, ktorí chcú predávať originály a printy bez aukčných domov a galerijných provízií. |
| **Pre kupujúceho** | Ľudia 25–45, ktorí chcú „skutočné" umenie na stenu, ale e-shopy s umením im prídu chladné/komplikované. Hľadajú zážitok, príbeh a pocit, že niečo „ulovili". |
| **Hlavná hodnota** | Nákup originálu na 2 kliky · 88 % z ceny ide umelcovi · zbieranie je hra (body, levely, odmeny). |
| **Obchodný model** | Provízia 12 % z predaja. Výplaty umelcom týždenne. |

---

## 2. Princípy návrhu (UX)

1. **Friction-free nákup.** Od „páči sa mi to" k „je to moje" maximálne dva kliky: *Kúpiť teraz* → *jedna* obrazovka pokladne → hotovo. Žiadne viackrokové wizardy, žiadne povinné registrácie.
2. **Dopamín v správnych momentoch.** Mikro-odmeny (body, confetti, animované číselníky), variabilné odmeny (koleso, mystery print) a sociálny dôkaz (live ticker, „X pozerá") — ale nikdy nie temné vzory, ktoré používateľa oberajú. Prehrať sa nedá nič; len získať.
3. **Vzácnosť je pravdivá.** Originál = 1/1. Limitka = reálny počet kusov, viditeľný a klesajúci. Drop = reálny odpočet; po ňom dielo z dropu zmizne. Žiadne falošné „len dnes navždy".
4. **Príbeh predáva.** Každé dielo má príbeh autora; každý umelec má profil s mestom, technikou a bio. To je to, čo odlišuje Vernis od stock e-shopu.
5. **Tmavá galéria.** Vizuál = tmavá „stena galérie" s nasvietenými dielami, akcent fialová/zlatá, výrazná typografia (Fraunces serif + Plus Jakarta Sans). Obrazy sú hrdinom, UI ustupuje.
6. **Demo je úprimné.** Všade, kde je niečo simulované (platby, ostatní zberatelia), to appka jasne hovorí.

---

## 3. Informačná architektúra / stránky

| Route | Účel | Kľúčové prvky |
|---|---|---|
| `/` | Domov / výklad | Hero s featured dropom + odpočtom · pás aktívnych dropov · „Ako to funguje" (4 kroky) · rebríček levelov a perkov · galéria s filtrami · pás umelcov · CTA pre umelcov |
| `/artwork/[slug]` | Detail diela | Veľké foto · autor (link) · technika/rozmer/rok · cena · `ScarcityBar` (1/1 alebo edícia) · live počet pozerajúcich · odpočet dropu · `Kúpiť teraz` · wishlist · „Čo k tomu dostaneš" · príbeh diela · ďalšie od autora · odporúčania |
| `/artists` | Zoznam umelcov | Karta na umelca: avatar, bio, počet diel, „od X €", 3 náhľady diel |
| `/artists/[slug]` | Profil umelca | Hero (avatar, mesto, bio, sledujúci) · `Sledovať` · mriežka jeho diel |
| `/checkout` | Pokladňa (1 obrazovka) | Súhrn objednávky · doručovacie údaje · **spôsob platby** (Karta/Stripe · Bankový prevod/rezervácia · Dobierka) · zľavový kód · „čo získaš po zaplatení" · `Zaplatiť` |
| `/success` | Po nákupe | Confetti · „«Dielo» je tvoj" · animované +body, level, odznaky, spiny · detail objednávky · **Mystery print reveal** (flip karta) · **Koleso odmien** · zdieľanie · odporúčania |
| `/collection` | Profil zberateľa | Avatar + level ring + XP bar · štatistiky (body, investované, diela, umelci, séria) · **Denná odmena** (7-dňová séria) · **Koleso** · moja zbierka (mriežka) · mystery bonusy · **mriežka odznakov** s progресom · **rebríček zberateľov** · história objednávok · „Vynulovať demo" |

Globálne: lepkavý **Live ticker** (marquee s udalosťami), **Header** s navigáciou + „body pill" (level ring + počet bodov + spiny), **Footer**, **Toast host** (oznámenia o odznakoch/bodoch/leveloch).

---

## 4. Nákupný tok (happy path)

```
Galéria/Detail ──[Kúpiť teraz]──▶ /checkout (predvyplnené, 1 obrazovka)
                                      │  vyber platbu (karta / prevod / dobierka)
                                      │  voliteľne zľavový kód
                                      ▼
                              [Zaplatiť] ── simulácia brány ──▶ /success
                                                                  │ +body, +XP, (level up?), +odznaky?
                                                                  │ +1 spin · mystery print
                                                                  ▼
                                                       koleso · mystery reveal · zdieľať
```

- **Kúpiť teraz** uloží `pendingCheckout` a presmeruje na `/checkout`.
- **Pokladňa** je jedna stránka: kontakt + adresa (nevynucované v deme), výber platby, súhrn, zľavový kód. Doprava zdarma nad 150 €, inak 6 €; dobierka +1,50 €.
- **Platba**: `card` otvorí (v ostrej verzii) Stripe Checkout — stačí doplniť `STRIPE_SECRET_KEY` + webhook; `transfer` = rezervácia 48 h a údaje na prevod e-mailom; `cod` = dobierka. V deme sa všetko len odsimuluje s krátkou „handshake" pauzou.
- **Po objednávke**: dielo pribudne do zbierky, pripíšu sa body a XP, prípadný level-up a odznaky vyhodia toast, používateľ dostane +1 spin kolesa a mystery print.

---

## 5. Gamifikácia — mechaniky

### 5.1 Body (`✦`)
- Mena skóre. Získavaš ich: nákupom (`≈ 12 bodov / €`, zaokrúhlené), dennou odmenou, kolesom odmien.
- Zobrazené v hlavičke s animovaným počítadlom (count-up) a „bumpom" pri pripísaní.

### 5.2 XP a levely
- XP rastie najmä nákupmi (`10 XP / €`) + drobné z odmien. Level sa odvodzuje z XP, nedá sa „minúť".
- 7 levelov s perkami:

| Lvl | Názov | od XP | Perk |
|---|---|---|---|
| 1 | Návštevník | 0 | Vitaj v galérii. |
| 2 | Pozorovateľ | 200 | Odznak v profile + spin kolesa. |
| 3 | Zberateľ | 700 | Skorý prístup k novým dropom (24 h). |
| 4 | Mecenáš | 1 800 | Stála zľava 5 % na printy. |
| 5 | Patrón | 4 000 | Pozvánky na ateliérové vernisáže. |
| 6 | Kurátor | 8 000 | Vlastná stránka zbierky + 10 % na všetko. |
| 7 | Legenda galérie | 16 000 | Meno na stene slávy. |

- Level-up = toast + confetti + (každý nový level dáva +1 spin).

### 5.3 Odznaky (10)
Odomykajú sa automaticky podľa stavu; niektoré majú v profile progress bar.
`Prvý kúsok na stene` (1. nákup) · `Originál na stene` · `Lovec edícií` (limitka) · `Mecenáš trojky` (3 rôzni umelci) · `Zbierka rastie` (5 diel) · `Veľký mecenáš` (1 000 €) · `Na poslednú chvíľu` (dielo z dropu) · `Verný divák` (3 dni za sebou) · `Točič šťastia` (roztočené koleso) · `Tajný zberateľ` (odhalený mystery print).

### 5.4 Koleso odmien 🎡
- 1 spin za každý nákup + 1 za každý level-up. Bez nákupu sa nedá prehrať nič — len získať.
- 8 sektorov s váženou pravdepodobnosťou: `+10/+50/+120/+300 bodov`, `+1 spin`, `10% zľava (kód VERNIS10)`, `mini print zadarmo`, `skús zajtra` (nič). SVG koleso, fyzikálne dotočenie (cubic-bezier ~4 s), confetti pri výhre (väčšia pri veľkej výhre).

### 5.5 Mystery print 🎁
- Ku každej objednávke jeden „darček" — flip karta na `/success` (a v zbierke). Po kliknutí sa odhalí jeden z poolu (mini riso print, set pohľadníc, skica z ateliéru, samolepky, plagát A4, záložka + odznak). Deterministicky podľa ID objednávky; confetti pri odhalení.

### 5.6 Denná odmena & séria 🔥
- 7-dňová séria (vizuálne dlaždice, 7. deň = darček). Odmena `50 + min(séria,7)·15` bodov / deň. Séria sa počíta z dátumu poslednej návštevy; pri prerušení padá na 1. Jedno vyzdvihnutie / deň.

### 5.7 Sociálny dôkaz / FOMO (pravdivé, nie temné)
- **Live ticker**: simulované udalosti (kúpy, „ostáva X ks", „nový drop o 2 h", „X pozerá", level-upy iných).
- **Detail diela**: živý počítadlo pozerajúcich (jemný náhodný walk okolo základu).
- **ScarcityBar**: pri limitkách reálny `predaných / total` + „🔥 posledné kusy" pri ≤ 15 %; pri origináloch jednoznačné `1/1`.
- **Odpočty dropov**: tikajúce; pod 1 h prepnú do „urgentného" stavu (pulzujúci, červený).
- **Rebríček zberateľov**: top zberatelia (simulovaní, jasne označené) + „Ty" zaradený podľa bodov.

---

## 6. Dátový model (prototyp)

- **Artist**: `id, slug, name, city, tagline, bio, accent, avatarSeed, followers`.
- **Artwork**: `id, slug, title, artistId, year, medium, size, category(Maľba|Ilustrácia|Fotografia|Print), price(EUR), image, palette[3], kind(original|limited), editionTotal, editionSold, dropEndsAt?, baseViewers, story, tags[]`.
- **Stav používateľa** (`localStorage: vernis_v1`): `points, xp, ownedIds[], badges[], spins, orders[], mysteryPrints[], wishlist[], discounts[], streak, lastVisit, pendingCheckout, lastOrderId` + denné flagy `daily_<YYYY-MM-DD>`.
- **Order**: `id, artworkId, title, artistId, price, payment(card|transfer|cod), date, pointsEarned`.
- Sledovaní umelci: `localStorage: vernis_follows`.

Obrázky: externé URL (Unsplash); ak sa nenačítajú, `ArtImage` vykreslí jemný gradientový „mesh" z palety diela — appka tak vždy vyzerá kompletne, aj offline.

---

## 7. Technológie

- **Next.js 16** (App Router, Turbopack), **React 19**, **TypeScript**.
- **Tailwind CSS v4** (téma cez `@theme` v `globals.css`), vlastné animácie (shimmer, float, pulse-glow, marquee, pop, rise).
- **motion** (Framer Motion) — toasty, reveal-on-scroll.
- **canvas-confetti** — oslavné efekty (burst, side cannons).
- Žiadny backend; všetko client-side / staticky generované. Pripravené na neskoršie napojenie: Stripe (platby), CMS/DB (diela a umelci), auth (kontá zberateľov), webhooky (potvrdenia, sklad edícií).

---

## 8. Roadmap (po prototype)

1. **Reálne platby**: Stripe Checkout + webhook (`payment_intent.succeeded`) → vznik objednávky, dekrement edície, e-mail s faktúrou; bankový prevod s variabilným symbolom; dobierka cez kuriéra.
2. **Backend & autentifikácia**: kontá zberateľov (aby body/zbierka/odznaky boli naprieč zariadeniami), onboarding umelcov, nahrávanie diel, výplaty.
3. **Sklad & doručenie**: rezervácie kusov (lock pri rozbehnutej platbe), stavy zásielok, integrácia s prepravcami, COA generátor (certifikát pravosti).
4. **Skutočné dropy & notifikácie**: plánovanie dropov, push/e-mail upozornenia pre sledujúcich („tvoj umelec spúšťa drop o 18:00").
5. **Anti-abuse pre gamifikáciu**: rate-limit kolesa, vyhodnocovanie odznakov na serveri, ochrana pred zneužitím denných odmien.
6. **Sociálne**: verejné profily zbierok, „chcem to tiež", komentáre/srdiečka pod dielami, zdieľacie OG obrázky.
7. **Prístupnosť & výkon**: `next/image` s povolenými doménami, `prefers-reduced-motion` (vypnúť konfety/marquee), kontrast, klávesnica, lokalizácia (SK/EN/CZ).
8. **Analytika**: lievik nákupu, vplyv gamifikácie na konverziu a retenciu, A/B testy odmien.

---

## 9. Ako spustiť

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start   # produkčný build
```

Stav je v `localStorage` — na vyčistenie demo profilu slúži tlačidlo „↺ Vynulovať demo" v `/collection` (alebo vymaž kľúče `vernis_*`).
