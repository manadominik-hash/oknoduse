"use client";

import { useState } from "react";

export function mesh(palette: [string, string, string]): React.CSSProperties {
  const [a, b, c] = palette;
  return {
    backgroundColor: b,
    backgroundImage: [
      `radial-gradient(42% 52% at 18% 22%, ${a}, transparent 70%)`,
      `radial-gradient(46% 46% at 82% 28%, ${c}, transparent 70%)`,
      `radial-gradient(60% 60% at 62% 92%, ${a}, transparent 72%)`,
      `radial-gradient(30% 30% at 30% 70%, ${c}, transparent 70%)`,
      `linear-gradient(140deg, ${b}, ${a}33)`,
    ].join(","),
  };
}

export function ArtImage({
  src,
  alt,
  palette,
  className = "",
}: {
  src: string;
  alt: string;
  palette: [string, string, string];
  className?: string;
}) {
  const [err, setErr] = useState(false);
  const [loaded, setLoaded] = useState(false);
  if (err) {
    return (
      <div className={`relative overflow-hidden ${className}`} style={mesh(palette)} role="img" aria-label={alt}>
        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
        <div className="absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.25em] text-white/55">Okno duše · ukážka</div>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className}`} style={!loaded ? mesh(palette) : undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setErr(true)}
        onLoad={() => setLoaded(true)}
        className={`h-full w-full object-cover transition-all duration-700 ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
      />
    </div>
  );
}
