"use client";
import confetti from "canvas-confetti";

const COLORS = ["#7c4dff", "#f0b429", "#ff5d7d", "#25e6b0", "#38bdf8", "#ffd25f"];

export function burst(power: "small" | "big" | "huge" = "big") {
  const counts = { small: 70, big: 160, huge: 280 }[power];
  confetti({ particleCount: counts, spread: power === "huge" ? 110 : 80, origin: { y: 0.6 }, colors: COLORS, scalar: 1.05 });
  if (power !== "small") {
    setTimeout(() => confetti({ particleCount: Math.round(counts * 0.5), angle: 60, spread: 70, origin: { x: 0 }, colors: COLORS }), 160);
    setTimeout(() => confetti({ particleCount: Math.round(counts * 0.5), angle: 120, spread: 70, origin: { x: 1 }, colors: COLORS }), 220);
  }
}

export function sideCannons(durationMs = 1600) {
  const end = Date.now() + durationMs;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 }, colors: COLORS });
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

export function emojiRain(emoji = "🎉") {
  const shape = (confetti as unknown as { shapeFromText?: (o: { text: string; scalar: number }) => unknown }).shapeFromText;
  const opts = shape ? { shapes: [shape({ text: emoji, scalar: 3 })] as never, scalar: 3 } : {};
  confetti({ particleCount: 26, spread: 100, origin: { y: 0.4 }, ...opts });
}
