export function eur(n: number): string {
  return new Intl.NumberFormat("sk-SK", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function num(n: number): string {
  return new Intl.NumberFormat("sk-SK").format(n);
}

export function pointsForPrice(price: number): number {
  // 1 € ≈ 12 bodov, zaokrúhlené na desiatky, malé bonusy za drahšie diela
  const base = Math.round((price * 12) / 10) * 10;
  return base;
}

export function xpForPurchase(price: number): number {
  return Math.round(price * 10);
}

/** stable pseudo-random in [0,1) from a string seed */
export function seeded(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

export function timeLeft(iso: string): { d: number; h: number; m: number; s: number; done: boolean; total: number } {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, done: true, total: 0 };
  const s = Math.floor(diff / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
    done: false,
    total: diff,
  };
}
