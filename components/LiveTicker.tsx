import { artworks, getArtist } from "@/lib/data";
import { eur } from "@/lib/format";

const NAMES = ["Mária", "Peter", "Janka", "Tomáš", "Lucia", "Marek", "Zuzana", "Andrej", "Katka", "Michal", "Veronika", "Jakub", "Soňa", "Dávid"];
const CITIES = ["Bratislava", "Košice", "Žilina", "Prešov", "Nitra", "Trnava", "Banská Bystrica", "Martin", "Trenčín", "Poprad"];

function pick<T>(arr: T[], i: number) {
  return arr[i % arr.length];
}

function buildItems(): { icon: string; text: string }[] {
  const items: { icon: string; text: string }[] = [];
  artworks.forEach((a, i) => {
    const artist = getArtist(a.artistId);
    if (i % 3 === 0) items.push({ icon: "🟢", text: `${pick(NAMES, i)} z mesta ${pick(CITIES, i)} práve kúpil/a „${a.title}" za ${eur(a.price)}` });
    if (a.kind === "limited") items.push({ icon: "🔥", text: `„${a.title}" — ostáva ${a.editionTotal - a.editionSold} z ${a.editionTotal} ks` });
    if (a.dropEndsAt && i % 2 === 0) items.push({ icon: "⏳", text: `Drop „${a.title}" sa čoskoro končí — ${artist?.name}` });
    if (i % 4 === 1) items.push({ icon: "👀", text: `${a.baseViewers + (i % 9)} ľudí si práve pozerá „${a.title}"` });
  });
  items.push({ icon: "🚀", text: 'Peter práve dosiahol level „Mecenáš"' });
  items.push({ icon: "🎁", text: "Lucia odhalila mystery print k svojej objednávke" });
  items.push({ icon: "🆕", text: "Nový drop od Lena H. — zajtra o 18:00" });
  items.push({ icon: "🏆", text: 'Top zberateľ týždňa: „art_kvocka" · 14 diel' });
  return items;
}

export function LiveTicker() {
  const items = buildItems();
  const row = [...items, ...items];
  return (
    <div className="relative z-50 overflow-hidden border-b border-line/60 bg-gradient-to-r from-grape-2/20 via-ink-2 to-gold/15">
      <div className="flex items-center">
        <span className="z-10 flex shrink-0 items-center gap-1.5 bg-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-coral">
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-coral" />
          Live
        </span>
        <div className="relative flex-1 overflow-hidden">
          <div className="flex w-max animate-marquee gap-8 py-1.5 pl-6 hover:[animation-play-state:paused]">
            {row.map((it, idx) => (
              <span key={idx} className="flex items-center gap-1.5 whitespace-nowrap text-xs text-mute">
                <span>{it.icon}</span>
                <span>{it.text}</span>
                <span className="text-line">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
