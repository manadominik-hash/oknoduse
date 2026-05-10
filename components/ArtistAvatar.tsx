import { Artist } from "@/lib/data";
import { seeded } from "@/lib/format";

export function ArtistAvatar({ artist, size = 40, ring = true }: { artist: Artist; size?: number; ring?: boolean }) {
  const initials = artist.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  const hue = Math.floor(seeded(artist.id) * 360);
  return (
    <span
      className={`inline-grid shrink-0 place-items-center rounded-full font-display font-semibold ${ring ? "ring-2 ring-white/15" : ""}`}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `linear-gradient(135deg, hsl(${hue} 70% 55%), ${artist.accent})`,
        color: "#0b0913",
      }}
      aria-hidden
    >
      {initials}
    </span>
  );
}
