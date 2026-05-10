import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line/70 bg-ink-2/40">
      <div className="container-x grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-gold-2 to-grape text-ink">✦</span>
            Vernis<span className="text-grape">.</span>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-mute">
            Galéria a obchod, kde si kupuješ originály a printy priamo od umelcov. Žiadni medzičlánkari, žiadne aukčné domy — len ty, plátno a príbeh za ním.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold text-cream">Objavuj</div>
          <ul className="space-y-2 text-mute">
            <li><Link href="/" className="hover:text-cream">Galéria</Link></li>
            <li><Link href="/#dropy" className="hover:text-cream">Aktívne dropy</Link></li>
            <li><Link href="/artists" className="hover:text-cream">Umelci</Link></li>
            <li><Link href="/collection" className="hover:text-cream">Moja zbierka & odznaky</Link></li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-semibold text-cream">Pre umelcov</div>
          <ul className="space-y-2 text-mute">
            <li>Pridaj svoje diela</li>
            <li>Provízia 12 % — zvyšok je tvoj</li>
            <li>Výplaty každý týždeň</li>
            <li>Predaj originály aj printy</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="container-x flex flex-col gap-2 py-5 text-xs text-mute sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Vernis — koncept &amp; UX prototyp.</span>
          <span className="rounded-full bg-gold/15 px-3 py-1 text-gold-2 ring-1 ring-gold/30">
            Demo: platby, dáta a doručenie sú simulované — nič sa neúčtuje.
          </span>
        </div>
      </div>
    </footer>
  );
}
