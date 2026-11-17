import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { demoVideos } from "../lib/demo";
import { byChannel, byMonth, fmtDuration, inPeriod, topVideos, totals } from "../lib/metrics";
import { parseDate, parseNumber, parseYoutubeCsv, splitCsvLine } from "../lib/youtube";

const PT = readFileSync(new URL("../examples/studio_pt.csv", import.meta.url), "utf8");
const EN = readFileSync(new URL("../examples/studio_en.csv", import.meta.url), "utf8");

describe("parser do CSV do YouTube Studio", () => {
  it("separa campos com aspas e vírgulas", () => {
    expect(splitCsvLine('a,"b, c","d ""e"""')).toEqual(["a", "b, c", 'd "e"']);
  });

  it("entende números e datas em pt-BR e en", () => {
    expect(parseNumber("1.234,56")).toBe(1234.56);
    expect(parseNumber("1,234.56")).toBe(1234.56);
    expect(parseNumber("")).toBe(0);
    expect(parseDate("Nov 3, 2026")).toBe("2026-11-03");
    expect(parseDate("3 de nov. de 2026")).toBe("2026-11-03");
    expect(parseDate("05/11/2026")).toBe("2026-11-05");
    expect(parseDate("lixo")).toBeNull();
  });

  it("lê a exportação em português e ignora a linha de total", () => {
    const { videos, missing } = parseYoutubeCsv(PT, "Meu canal");
    expect(missing).toEqual([]);
    expect(videos).toHaveLength(3);
    expect(videos[0]).toMatchObject({
      channel: "Meu canal", title: "Como funciona o Pix, explicado", published: "2026-10-02",
      views: 12500, durationSec: 480, revenueUsd: 31.25, ctrPct: 6.4,
    });
  });

  it("lê a exportação em inglês com o mesmo resultado", () => {
    const pt = parseYoutubeCsv(PT, "c").videos;
    const en = parseYoutubeCsv(EN, "c").videos;
    expect(en.map((v) => [v.views, v.revenueUsd, v.published])).toEqual(pt.map((v) => [v.views, v.revenueUsd, v.published]));
  });

  it("avisa quando falta coluna obrigatória", () => {
    expect(parseYoutubeCsv("titulo,receita\nx,1", "c").missing).toEqual(["views"]);
  });
});

describe("métricas", () => {
  const vids = parseYoutubeCsv(PT, "A").videos;

  it("RPM, CTR ponderado e retenção", () => {
    const t = totals(vids);
    expect(t.views).toBe(12500 + 3200 + 48000);
    expect(t.rpm).toBeCloseTo(((31.25 + 6.1 + 4.8) / 63700) * 1000, 6);
    // CTR ponderado por impressões, não média simples
    const clicks = 0.064 * 190000 + 0.041 * 70000 + 0.112 * 410000;
    expect(t.ctrPct!).toBeCloseTo((clicks / (190000 + 70000 + 410000)) * 100, 6);
    expect(t.avgViewPct!).toBeGreaterThan(0);
    expect(t.avgViewPct!).toBeLessThan(100);
  });

  it("agrupa por canal e por mês e ordena vídeos", () => {
    const all = [...vids, ...parseYoutubeCsv(EN, "B").videos];
    expect(byChannel(all).map((c) => c.channel).sort()).toEqual(["A", "B"]);
    const months = byMonth(all);
    expect(months[0].month <= months[months.length - 1].month).toBe(true);
    expect(topVideos(all, "rpm", 1)[0].title).toBe("Como funciona o Pix, explicado");
    expect(inPeriod(all, "2026-10-15", "2026-10-31").every((v) => v.published! >= "2026-10-15")).toBe(true);
    expect(fmtDuration(125)).toBe("2:05");
  });

  it("demo é determinística", () => {
    expect(totals(demoVideos())).toEqual(totals(demoVideos()));
    expect(new Set(demoVideos().map((v) => v.channel)).size).toBe(3);
  });
});
