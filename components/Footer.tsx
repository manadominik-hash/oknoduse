import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/70">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-lg">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-gold-2 to-grape">
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden>
                <rect x="1" y="1" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
                <rect x="10" y="1" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
                <rect x="1" y="10" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
                <rect x="10" y="10" width="7" height="7" rx="1.2" fill="white" fillOpacity="0.92"/>
              </svg>
            </span>
            Okno duše<span className="text-grape">.</span>
          </div>
          <p className="mt-5 max-w-sm font-display text-sm leading-relaxed text-cream/75">
            Galéria, kde si kupuješ originály a printy priamo od umelcov. Žiadni medzičlánkari, žiadne aukčné domy — len ty, plátno a príbeh za ním.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-4 text-xs uppercase tracking-[0.22em] text-mute">Objavuj</div>
          <ul className="space-y-3 font-display">
            <li><Link href="/#galeria" className="text-cream/80 transition hover:text-grape">Galéria</Link></li>
            <li><Link href="/artists" className="text-cream/80 transition hover:text-grape">Umelci</Link></li>
            <li><Link href="/collection" className="text-cream/80 transition hover:text-grape">Moja zbierka</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-4 text-xs uppercase tracking-[0.22em] text-mute">Pre umelcov</div>
          <ul className="space-y-3 font-display text-cream/80">
            <li>Pridaj svoje diela</li>
            <li>Provízia 12 % — zvyšok je tvoj</li>
            <li>Výplaty každý týždeň</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Okno duše — koncept &amp; UX prototyp.</span>
          <span className="text-mute/70">Demo · platby a doručenie sú simulované.</span>
        </div>
      </div>
    </footer>
  );
}
