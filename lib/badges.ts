export type BadgeDef = {
  id: string;
  name: string;
  desc: string;
  icon: string;
  hint: string; // shown while locked
  color: string;
};

export const BADGES: BadgeDef[] = [
  { id: "first-buy", name: "Prvý kúsok na stene", desc: "Kúpil si svoje prvé dielo.", icon: "🖼️", hint: "Kúp svoje prvé dielo.", color: "#f0b429" },
  { id: "original", name: "Originál na stene", desc: "Vlastníš originál — jediný kus na svete.", icon: "🎨", hint: "Kúp originálne dielo (nie print).", color: "#7c4dff" },
  { id: "limited", name: "Lovec edícií", desc: "Ulovil si dielo z limitovanej edície.", icon: "🏷️", hint: "Kúp dielo z limitky.", color: "#ff5d7d" },
  { id: "patron-3", name: "Mecenáš trojky", desc: "Podporil si 3 rôznych umelcov.", icon: "🤝", hint: "Kúp dielo od 3 rôznych umelcov.", color: "#25e6b0" },
  { id: "collector-5", name: "Zbierka rastie", desc: "Máš 5 diel v zbierke.", icon: "🧱", hint: "Vlastni 5 diel.", color: "#38bdf8" },
  { id: "big-spender", name: "Veľký mecenáš", desc: "Investoval si do umenia 1 000 € a viac.", icon: "💎", hint: "Podpor umelcov sumou 1 000 €.", color: "#ffd25f" },
  { id: "last-minute", name: "Na poslednú chvíľu", desc: "Stihol si dielo v drope, kým neuplynul čas.", icon: "⏱️", hint: "Kúp dielo, ktoré je v časovo limitovanom drope.", color: "#ff8a5b" },
  { id: "streak-3", name: "Verný divák", desc: "Tri dni po sebe v galérii.", icon: "🔥", hint: "Príď tri dni po sebe.", color: "#ff5d7d" },
  { id: "spinner", name: "Točič šťastia", desc: "Roztočil si koleso odmien.", icon: "🎡", hint: "Roztoč koleso po nákupe.", color: "#7c4dff" },
  { id: "mystery", name: "Tajný zberateľ", desc: "Odhalil si mystery print.", icon: "🎁", hint: "Odhaľ darček po nákupe.", color: "#25e6b0" },
];

export const BADGE_MAP: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((b) => [b.id, b]));

export type Level = { n: number; name: string; minXp: number; perk: string };

export const LEVELS: Level[] = [
  { n: 1, name: "Návštevník", minXp: 0, perk: "Vitaj v galérii." },
  { n: 2, name: "Pozorovateľ", minXp: 200, perk: "Odznak v profile + 1 spin kolesa." },
  { n: 3, name: "Zberateľ", minXp: 700, perk: "Skorý prístup k novým dropom (24 h)." },
  { n: 4, name: "Mecenáš", minXp: 1800, perk: "Stála zľava 5 % na printy." },
  { n: 5, name: "Patrón", minXp: 4000, perk: "Pozvánky na ateliérové vernisáže." },
  { n: 6, name: "Kurátor", minXp: 8000, perk: "Vlastná stránka zbierky + 10 % na všetko." },
  { n: 7, name: "Legenda galérie", minXp: 16000, perk: "Tvoje meno na stene slávy. Navždy." },
];

export function levelForXp(xp: number): { current: Level; next: Level | null; progress: number } {
  let current = LEVELS[0];
  for (const l of LEVELS) if (xp >= l.minXp) current = l;
  const next = LEVELS.find((l) => l.n === current.n + 1) ?? null;
  const span = next ? next.minXp - current.minXp : 1;
  const into = xp - current.minXp;
  const progress = next ? Math.min(1, into / span) : 1;
  return { current, next, progress };
}
