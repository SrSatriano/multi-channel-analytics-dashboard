// Parser do CSV exportado pelo YouTube Studio ("Dados da tabela", aba Conteúdo),
// em português ou inglês, e de um formato simples próprio.

export type Video = {
  channel: string;
  id: string;
  title: string;
  published: string | null; // AAAA-MM-DD
  durationSec: number | null;
  views: number;
  watchHours: number;
  revenueUsd: number;
  impressions: number;
  ctrPct: number | null;
  subscribers: number;
};

const ALIASES: Record<keyof Omit<Video, "channel">, string[]> = {
  id: ["conteúdo", "conteudo", "content", "id"],
  title: ["título do vídeo", "titulo do video", "video title", "titulo", "title"],
  published: ["horário de publicação do vídeo", "horario de publicacao do video", "video publish time", "publicado", "published"],
  durationSec: ["duração", "duracao", "duration"],
  views: ["visualizações", "visualizacoes", "views"],
  watchHours: ["tempo de exibição (horas)", "tempo de exibicao (horas)", "watch time (hours)", "horas"],
  revenueUsd: ["receita estimada (usd)", "estimated revenue (usd)", "your estimated revenue (usd)", "receita"],
  impressions: ["impressões", "impressoes", "impressions"],
  ctrPct: ["taxa de cliques de impressões (%)", "taxa de cliques de impressoes (%)", "impressions click-through rate (%)", "ctr"],
  subscribers: ["inscritos", "subscribers"],
};

const MONTHS: Record<string, string> = {
  jan: "01", fev: "02", feb: "02", mar: "03", abr: "04", apr: "04", mai: "05", may: "05", jun: "06",
  jul: "07", ago: "08", aug: "08", set: "09", sep: "09", out: "10", oct: "10", nov: "11", dez: "12", dec: "12",
};

/** Divide uma linha CSV respeitando aspas ("a, b" e aspas duplicadas ""). */
export function splitCsvLine(line: string, sep = ","): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === sep) { out.push(cur); cur = ""; }
    else cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.trim());
}

/** "1.234,5" (pt-BR), "1,234.5" (en) ou "1234.5" → número. Vazio → 0. */
export function parseNumber(raw: string | undefined): number {
  if (!raw) return 0;
  let s = raw.replace(/[^\d.,-]/g, "");
  if (!s) return 0;
  const lastComma = s.lastIndexOf(",");
  const lastDot = s.lastIndexOf(".");
  if (lastComma > lastDot) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

/** "Nov 3, 2026", "3 de nov. de 2026", "2026-11-03" → "2026-11-03". */
export function parseDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const iso = raw.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;
  const lower = raw.toLowerCase();
  const en = lower.match(/([a-z]{3})[a-z.]*\s+(\d{1,2}),?\s+(\d{4})/);
  if (en && MONTHS[en[1]]) return `${en[3]}-${MONTHS[en[1]]}-${en[2].padStart(2, "0")}`;
  const pt = lower.match(/(\d{1,2})\s+de\s+([a-zç]{3})[a-zç.]*\s+de\s+(\d{4})/);
  if (pt && MONTHS[pt[2]]) return `${pt[3]}-${MONTHS[pt[2]]}-${pt[1].padStart(2, "0")}`;
  const br = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return null;
}

export function parseYoutubeCsv(text: string, channel: string): { videos: Video[]; missing: string[] } {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).filter((l) => l.trim());
  if (!lines.length) return { videos: [], missing: ["arquivo vazio"] };
  const sep = lines[0].split(";").length > lines[0].split(",").length ? ";" : ",";
  const header = splitCsvLine(lines[0], sep).map((h) => h.toLowerCase());
  const col = {} as Record<keyof typeof ALIASES, number>;
  const missing: string[] = [];
  for (const [key, names] of Object.entries(ALIASES) as [keyof typeof ALIASES, string[]][]) {
    col[key] = header.findIndex((h) => names.includes(h));
  }
  for (const req of ["views"] as const) if (col[req] < 0) missing.push(req);
  if (missing.length) return { videos: [], missing };

  const videos: Video[] = [];
  for (const line of lines.slice(1)) {
    const f = splitCsvLine(line, sep);
    const get = (k: keyof typeof ALIASES) => (col[k] >= 0 ? f[col[k]] : undefined);
    const id = get("id") ?? "";
    if (id.toLowerCase() === "total") continue; // a 1ª linha do Studio é o total do canal
    videos.push({
      channel,
      id: id || `${channel}-${videos.length + 1}`,
      title: get("title") || id || "(sem título)",
      published: parseDate(get("published")),
      durationSec: col.durationSec >= 0 ? parseNumber(get("durationSec")) : null,
      views: parseNumber(get("views")),
      watchHours: parseNumber(get("watchHours")),
      revenueUsd: parseNumber(get("revenueUsd")),
      impressions: parseNumber(get("impressions")),
      ctrPct: col.ctrPct >= 0 ? parseNumber(get("ctrPct")) : null,
      subscribers: parseNumber(get("subscribers")),
    });
  }
  return { videos, missing };
}
