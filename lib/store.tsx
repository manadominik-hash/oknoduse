"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Artwork, getArtwork } from "./data";
import { BADGE_MAP, levelForXp } from "./badges";
import { pointsForPrice, xpForPurchase } from "./format";

export type Order = {
  id: string;
  artworkId: string;
  title: string;
  artistId: string;
  price: number;
  payment: "card" | "transfer" | "cod";
  date: string;
  pointsEarned: number;
};

export type SpinPrize =
  | { type: "points"; amount: number; label: string }
  | { type: "spin"; amount: number; label: string }
  | { type: "discount"; amount: number; label: string }
  | { type: "print"; label: string }
  | { type: "nothing"; label: string };

type State = {
  points: number;
  xp: number;
  ownedIds: string[];
  badges: string[];
  spins: number;
  orders: Order[];
  mysteryPrints: string[];
  wishlist: string[];
  discounts: number[];
  streak: number;
  lastVisit: string | null;
  pendingCheckout: { artworkId: string } | null;
  lastOrderId: string | null;
};

const DEFAULT: State = {
  points: 0,
  xp: 0,
  ownedIds: [],
  badges: [],
  spins: 0,
  orders: [],
  mysteryPrints: [],
  wishlist: [],
  discounts: [],
  streak: 0,
  lastVisit: null,
  pendingCheckout: null,
  lastOrderId: null,
};

export type Toast = { id: number; kind: "badge" | "points" | "level" | "info"; title: string; sub?: string; icon?: string };

type Ctx = {
  hydrated: boolean;
  state: State;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  pushToast: (t: Omit<Toast, "id">) => void;
  toggleWishlist: (artworkId: string) => void;
  isWished: (artworkId: string) => boolean;
  setPendingCheckout: (artworkId: string | null) => void;
  completeOrder: (payment: Order["payment"]) => Order | null;
  awardSpinPrize: (p: SpinPrize) => void;
  consumeSpin: () => boolean;
  revealMystery: (name: string) => void;
  unlockBadge: (id: string) => void;
  claimDaily: () => { ok: boolean; reward: number; streak: number };
  resetAll: () => void;
  spent: number;
  artistsSupported: number;
  level: ReturnType<typeof levelForXp>;
};

const AppCtx = createContext<Ctx | null>(null);
const KEY = "okno_v1";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}
function dayDiff(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}

function earnedBadges(s: State): string[] {
  const owned = s.ownedIds.map((id) => getArtwork(id)).filter(Boolean) as Artwork[];
  const out = new Set<string>(s.badges); // keep action-granted ones (spinner, mystery)
  if (owned.length >= 1) out.add("first-buy");
  if (owned.some((a) => a.kind === "original")) out.add("original");
  if (owned.some((a) => a.kind === "limited")) out.add("limited");
  if (new Set(owned.map((a) => a.artistId)).size >= 3) out.add("patron-3");
  if (owned.length >= 5) out.add("collector-5");
  if (s.orders.reduce((x, o) => x + o.price, 0) >= 1000) out.add("big-spender");
  if (owned.some((a) => a.dropEndsAt)) out.add("last-minute");
  if (s.streak >= 3) out.add("streak-3");
  return [...out];
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(1);

  const pushToast = useCallback((t: Omit<Toast, "id">) => {
    const id = toastId.current++;
    setToasts((arr) => [...arr, { ...t, id }]);
    setTimeout(() => setToasts((arr) => arr.filter((x) => x.id !== id)), 5200);
  }, []);
  const dismissToast = useCallback((id: number) => setToasts((arr) => arr.filter((x) => x.id !== id)), []);

  // hydrate + daily streak
  useEffect(() => {
    let loaded: State = DEFAULT;
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) loaded = { ...DEFAULT, ...(JSON.parse(raw) as State) };
    } catch {}
    const t = todayStr();
    if (loaded.lastVisit !== t) {
      const gap = loaded.lastVisit ? dayDiff(loaded.lastVisit, t) : 999;
      loaded.streak = gap === 1 ? loaded.streak + 1 : 1;
      loaded.lastVisit = t;
    }
    loaded.badges = earnedBadges(loaded);
    setState(loaded);
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {}
  }, [state, hydrated]);

  const applyBadgeToasts = useCallback(
    (before: string[], after: string[]) => {
      after
        .filter((id) => !before.includes(id))
        .forEach((id) => {
          const b = BADGE_MAP[id];
          if (b) pushToast({ kind: "badge", title: `Odznak odomknutý: ${b.name}`, sub: b.desc, icon: b.icon });
        });
    },
    [pushToast]
  );

  const toggleWishlist = useCallback((artworkId: string) => {
    setState((s) => {
      const has = s.wishlist.includes(artworkId);
      return { ...s, wishlist: has ? s.wishlist.filter((x) => x !== artworkId) : [...s.wishlist, artworkId] };
    });
  }, []);
  const isWished = useCallback((id: string) => state.wishlist.includes(id), [state.wishlist]);

  const setPendingCheckout = useCallback((artworkId: string | null) => {
    setState((s) => ({ ...s, pendingCheckout: artworkId ? { artworkId } : null }));
  }, []);

  const completeOrder = useCallback(
    (payment: Order["payment"]): Order | null => {
      const art = state.pendingCheckout ? getArtwork(state.pendingCheckout.artworkId) : null;
      if (!art) return null;
      const pts = pointsForPrice(art.price);
      const xpGain = xpForPurchase(art.price);
      const order: Order = {
        id: `ORD-${Date.now().toString(36).toUpperCase()}`,
        artworkId: art.id,
        title: art.title,
        artistId: art.artistId,
        price: art.price,
        payment,
        date: new Date().toISOString(),
        pointsEarned: pts,
      };
      setState((s) => {
        const beforeBadges = s.badges;
        const beforeLevel = levelForXp(s.xp).current.n;
        const xp = s.xp + xpGain;
        const afterLevel = levelForXp(xp).current.n;
        const leveledUp = afterLevel > beforeLevel;
        let next: State = {
          ...s,
          xp,
          points: s.points + pts,
          ownedIds: s.ownedIds.includes(art.id) ? s.ownedIds : [...s.ownedIds, art.id],
          orders: [order, ...s.orders],
          wishlist: s.wishlist.filter((x) => x !== art.id),
          spins: s.spins + 1 + (leveledUp ? afterLevel - beforeLevel : 0),
          pendingCheckout: null,
          lastOrderId: order.id,
        };
        next.badges = earnedBadges(next);
        // toasts (after state update tick)
        setTimeout(() => {
          pushToast({ kind: "points", title: `+${pts} bodov`, sub: `Za nákup „${art.title}"`, icon: "✨" });
          if (leveledUp) {
            const lv = levelForXp(xp).current;
            pushToast({ kind: "level", title: `Level ${lv.n} — ${lv.name}!`, sub: lv.perk, icon: "🚀" });
          }
          applyBadgeToasts(beforeBadges, next.badges);
        }, 0);
        return next;
      });
      return order;
    },
    [state.pendingCheckout, pushToast, applyBadgeToasts]
  );

  const consumeSpin = useCallback((): boolean => {
    let ok = false;
    setState((s) => {
      if (s.spins <= 0) return s;
      ok = true;
      return { ...s, spins: s.spins - 1 };
    });
    return ok;
  }, []);

  const awardSpinPrize = useCallback(
    (p: SpinPrize) => {
      setState((s) => {
        const next = { ...s };
        if (p.type === "points") {
          next.points = s.points + p.amount;
          next.xp = s.xp + Math.round(p.amount / 4);
        } else if (p.type === "spin") next.spins = s.spins + p.amount;
        else if (p.type === "discount") next.discounts = [...s.discounts, p.amount];
        else if (p.type === "print") next.mysteryPrints = [...s.mysteryPrints, p.label];
        if (!next.badges.includes("spinner")) next.badges = [...next.badges, "spinner"];
        setTimeout(() => {
          if (p.type !== "nothing")
            pushToast({ kind: "info", title: "Výhra z kolesa!", sub: p.label, icon: "🎡" });
          if (!s.badges.includes("spinner")) {
            const b = BADGE_MAP["spinner"];
            pushToast({ kind: "badge", title: `Odznak odomknutý: ${b.name}`, sub: b.desc, icon: b.icon });
          }
        }, 0);
        return next;
      });
    },
    [pushToast]
  );

  const revealMystery = useCallback(
    (name: string) => {
      setState((s) => {
        if (s.mysteryPrints.includes(name)) return s;
        const next = { ...s, mysteryPrints: [...s.mysteryPrints, name] };
        if (!next.badges.includes("mystery")) next.badges = [...next.badges, "mystery"];
        setTimeout(() => {
          pushToast({ kind: "info", title: "Mystery print je tvoj!", sub: name, icon: "🎁" });
          if (!s.badges.includes("mystery")) {
            const b = BADGE_MAP["mystery"];
            pushToast({ kind: "badge", title: `Odznak odomknutý: ${b.name}`, sub: b.desc, icon: b.icon });
          }
        }, 0);
        return next;
      });
    },
    [pushToast]
  );

  const unlockBadge = useCallback(
    (id: string) => {
      setState((s) => {
        if (s.badges.includes(id)) return s;
        const b = BADGE_MAP[id];
        if (b) setTimeout(() => pushToast({ kind: "badge", title: `Odznak odomknutý: ${b.name}`, sub: b.desc, icon: b.icon }), 0);
        return { ...s, badges: [...s.badges, id] };
      });
    },
    [pushToast]
  );

  const claimDaily = useCallback((): { ok: boolean; reward: number; streak: number } => {
    const flag = `daily_${todayStr()}`;
    let result = { ok: false, reward: 0, streak: state.streak };
    setState((s) => {
      // store claimed flag inside discounts? no — use a tiny separate trick: keep in badges? no.
      // Use lastVisit-based: we allow one claim per day tracked via a key on the object.
      const claimedKey = (s as unknown as Record<string, unknown>)[flag];
      if (claimedKey) return s;
      const reward = 50 + Math.min(s.streak, 7) * 15;
      result = { ok: true, reward, streak: s.streak };
      setTimeout(() => pushToast({ kind: "points", title: `Denná odmena +${reward}`, sub: `Séria ${s.streak} ${s.streak === 1 ? "deň" : s.streak < 5 ? "dni" : "dní"} 🔥`, icon: "🎯" }), 0);
      return { ...s, points: s.points + reward, xp: s.xp + Math.round(reward / 3), [flag]: true } as State;
    });
    return result;
  }, [state.streak, pushToast]);

  const resetAll = useCallback(() => {
    try { localStorage.removeItem(KEY); } catch {}
    const fresh = { ...DEFAULT, lastVisit: todayStr(), streak: 1 };
    setState(fresh);
    pushToast({ kind: "info", title: "Profil vynulovaný", sub: "Demo začína odznova.", icon: "↺" });
  }, [pushToast]);

  const spent = useMemo(() => state.orders.reduce((x, o) => x + o.price, 0), [state.orders]);
  const artistsSupported = useMemo(
    () => new Set(state.ownedIds.map((id) => getArtwork(id)?.artistId).filter(Boolean)).size,
    [state.ownedIds]
  );
  const level = useMemo(() => levelForXp(state.xp), [state.xp]);

  const value: Ctx = {
    hydrated, state, toasts, dismissToast, pushToast,
    toggleWishlist, isWished, setPendingCheckout, completeOrder,
    awardSpinPrize, consumeSpin, revealMystery, unlockBadge, claimDaily, resetAll,
    spent, artistsSupported, level,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}

/** Simulated "live viewers" — a gentle random walk seeded per artwork. */
export function useLiveViewers(base: number, key: string) {
  const [n, setN] = useState(base);
  useEffect(() => {
    let cur = base + Math.floor(Math.random() * 5) - 2;
    setN(Math.max(1, cur));
    const t = setInterval(() => {
      cur = Math.max(1, cur + (Math.random() < 0.5 ? -1 : 1) * (Math.random() < 0.25 ? 2 : 1));
      // gravitate toward base
      if (cur > base + 12) cur -= 2;
      if (cur < Math.max(1, base - 8)) cur += 2;
      setN(cur);
    }, 2200 + Math.random() * 1600);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  return n;
}
