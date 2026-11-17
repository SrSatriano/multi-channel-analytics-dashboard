import type { Video } from "./youtube";

export type Totals = {
  videos: number;
  views: number;
  watchHours: number;
  revenueUsd: number;
  impressions: number;
  subscribers: number;
  rpm: number; // receita por mil visualizações
  ctrPct: number | null; // ponderado por impressões
  avgViewSec: number; // duração média assistida
  avgViewPct: number | null; // % do vídeo assistido em média (quando há duração)
};

const safeDiv = (a: number, b: number) => (b > 0 ? a / b : 0);

export function totals(videos: Video[]): Totals {
  const sum = (f: (v: Video) => number) => videos.reduce((s, v) => s + f(v), 0);
  const views = sum((v) => v.views);
  const watchHours = sum((v) => v.watchHours);
  const revenueUsd = sum((v) => v.revenueUsd);
  const impressions = sum((v) => v.impressions);
  const withCtr = videos.filter((v) => v.ctrPct !== null && v.impressions > 0);
  const clicks = withCtr.reduce((s, v) => s + (v.ctrPct! / 100) * v.impressions, 0);
  const ctrBase = withCtr.reduce((s, v) => s + v.impressions, 0);
  const withDur = videos.filter((v) => v.durationSec && v.views > 0);
  const watchedSec = withDur.reduce((s, v) => s + v.watchHours * 3600, 0);
  const possibleSec = withDur.reduce((s, v) => s + v.durationSec! * v.views, 0);
  return {
    videos: videos.length,
    views,
    watchHours,
    revenueUsd,
    impressions,
    subscribers: sum((v) => v.subscribers),
    rpm: safeDiv(revenueUsd, views) * 1000,
    ctrPct: ctrBase > 0 ? (clicks / ctrBase) * 100 : null,
    avgViewSec: safeDiv(watchHours * 3600, views),
    avgViewPct: possibleSec > 0 ? (watchedSec / possibleSec) * 100 : null,
  };
}

export function byChannel(videos: Video[]): { channel: string; totals: Totals }[] {
  const groups = new Map<string, Video[]>();
  for (const v of videos) groups.set(v.channel, [...(groups.get(v.channel) ?? []), v]);
  return [...groups.entries()]
    .map(([channel, vs]) => ({ channel, totals: totals(vs) }))
    .sort((a, b) => b.totals.views - a.totals.views);
}

/** Visualizações e receita agrupadas pelo mês de publicação, por canal. */
export function byMonth(videos: Video[]): { month: string; [channel: string]: number | string }[] {
  const rows = new Map<string, Record<string, number | string>>();
  for (const v of videos) {
    if (!v.published) continue;
    const m = v.published.slice(0, 7);
    const row = rows.get(m) ?? { month: m };
    row[v.channel] = ((row[v.channel] as number) ?? 0) + v.views;
    rows.set(m, row);
  }
  return [...rows.values()].sort((a, b) => String(a.month).localeCompare(String(b.month))) as {
    month: string;
  }[];
}

export type SortKey = "views" | "revenueUsd" | "rpm" | "ctrPct" | "avgViewSec" | "published";

export function rpmOf(v: Video): number {
  return safeDiv(v.revenueUsd, v.views) * 1000;
}

export function topVideos(videos: Video[], key: SortKey, n = 20): Video[] {
  const val = (v: Video): number | string => {
    switch (key) {
      case "rpm": return rpmOf(v);
      case "avgViewSec": return safeDiv(v.watchHours * 3600, v.views);
      case "ctrPct": return v.ctrPct ?? -1;
      case "published": return v.published ?? "";
      default: return v[key];
    }
  };
  return [...videos].sort((a, b) => (val(b) > val(a) ? 1 : val(b) < val(a) ? -1 : 0)).slice(0, n);
}

/** Filtra pelo período de publicação (inclusive). */
export function inPeriod(videos: Video[], from?: string, to?: string): Video[] {
  return videos.filter((v) => (!from || (v.published ?? "") >= from) && (!to || (v.published ?? "9999") <= to));
}

export function fmtDuration(sec: number): string {
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
