"use client";

import { AnimatePresence, motion } from "motion/react";
import { useApp } from "@/lib/store";

const STYLES: Record<string, string> = {
  badge: "from-grape/30 to-gold/20 ring-grape/40",
  points: "from-gold/25 to-gold-2/10 ring-gold/40",
  level: "from-coral/25 to-grape/20 ring-coral/40",
  info: "from-mint/20 to-sky/10 ring-mint/40",
};

export function ToastHost() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,360px)] flex-col gap-2.5">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.button
            key={t.id}
            layout
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            onClick={() => dismissToast(t.id)}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl border border-white/10 bg-gradient-to-br ${STYLES[t.kind] ?? STYLES.info} p-3.5 text-left shadow-2xl backdrop-blur-xl ring-1`}
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink/70 text-lg">{t.icon ?? "✨"}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold leading-snug text-cream">{t.title}</span>
              {t.sub && <span className="mt-0.5 block text-xs leading-snug text-mute">{t.sub}</span>}
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
