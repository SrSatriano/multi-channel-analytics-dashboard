import type { Video } from "./youtube";

// Dados fictícios e determinísticos para a demonstração (não são de nenhum canal real).
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export function demoVideos(): Video[] {
  const r = rng(2026);
  const channels = [
    { name: "Canal Ciência", rpm: 3.2, base: 18000, dur: 540 },
    { name: "Canal Finanças", rpm: 7.8, base: 9000, dur: 780 },
    { name: "Canal Shorts", rpm: 0.12, base: 60000, dur: 45 },
  ];
  const out: Video[] = [];
  for (const c of channels) {
    for (let i = 0; i < 24; i++) {
      const month = 1 + Math.floor(i / 2.4);
      const day = 1 + Math.floor(r() * 27);
      const views = Math.round(c.base * (0.3 + r() * 2.2) * (1 + i / 30));
      const retention = 0.25 + r() * 0.35;
      const impressions = Math.round(views * (8 + r() * 10));
      out.push({
        channel: c.name,
        id: `${c.name}-${i}`,
        title: `${c.name.replace("Canal ", "")} #${i + 1}`,
        published: `2026-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
        durationSec: Math.round(c.dur * (0.7 + r() * 0.6)),
        views,
        watchHours: (views * c.dur * retention) / 3600,
        revenueUsd: (views / 1000) * c.rpm * (0.7 + r() * 0.6),
        impressions,
        ctrPct: (views / impressions) * 100,
        subscribers: Math.round(views * (0.002 + r() * 0.004)),
      });
    }
  }
  return out;
}
