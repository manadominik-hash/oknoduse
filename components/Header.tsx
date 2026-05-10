"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PointsPill } from "./PointsPill";

const NAV = [
  { href: "/", label: "Galéria" },
  { href: "/#dropy", label: "Dropy" },
  { href: "/artists", label: "Umelci" },
  { href: "/#ako", label: "Ako to funguje" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center gap-4">
        <Link href="/" className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold-2 to-grape text-ink shadow-[0_0_24px_-4px_rgba(124,77,255,0.7)]">✦</span>
          <span>Vernis<span className="text-grape">.</span></span>
        </Link>

        <nav className="ml-4 hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href.replace(/#.*$/, "")) && n.href !== "/";
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`rounded-full px-3 py-1.5 text-sm transition ${active ? "bg-ink-3 text-cream" : "text-mute hover:bg-ink-2 hover:text-cream"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2.5">
          <PointsPill />
          <Link
            href="/collection"
            className="hidden rounded-full bg-cream px-4 py-2 text-sm font-bold text-ink transition hover:bg-white sm:block"
          >
            Moja zbierka
          </Link>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="grid h-9 w-9 place-items-center rounded-full border border-line text-mute md:hidden"
          >
            ☰
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-line/70 bg-ink px-5 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV.concat([{ href: "/collection", label: "Moja zbierka" }]).map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm text-mute hover:bg-ink-2 hover:text-cream">
                {n.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
