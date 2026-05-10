"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PointsPill } from "./PointsPill";

const NAV = [
  { href: "/", label: "Galéria" },
  { href: "/artists", label: "Umelci" },
];

export function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-ink/80 backdrop-blur-xl">
      <div className="container-x flex h-16 items-center gap-4">
        <Link href="/" className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-gold-2 to-grape shadow-[0_0_24px_-4px_rgba(107,53,238,0.55)]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
              <rect x="1" y="1" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
              <rect x="10" y="1" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
              <rect x="1" y="10" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
              <rect x="10" y="10" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
            </svg>
          </span>
          <span>Okno duše<span className="text-grape">.</span></span>
        </Link>

        <nav className="ml-6 hidden items-center gap-7 md:flex">
          {NAV.map((n) => {
            const active = n.href === "/" ? path === "/" : path.startsWith(n.href.replace(/#.*$/, "")) && n.href !== "/";
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`text-xs uppercase tracking-[0.18em] transition ${active ? "text-cream" : "text-mute hover:text-cream"}`}
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
            className="hidden text-xs uppercase tracking-[0.18em] text-cream transition hover:text-grape sm:block"
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
