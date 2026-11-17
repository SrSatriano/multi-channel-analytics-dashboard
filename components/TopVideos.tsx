"use client";

import { useState } from "react";
import { fmtDuration, rpmOf, topVideos, type SortKey } from "@/lib/metrics";
import type { Video } from "@/lib/youtube";

const COLS: { key: SortKey; label: string }[] = [
  { key: "views", label: "Views" },
  { key: "revenueUsd", label: "Receita" },
  { key: "rpm", label: "RPM" },
  { key: "ctrPct", label: "CTR" },
  { key: "avgViewSec", label: "Média assistida" },
  { key: "published", label: "Publicado" },
];

export function TopVideos({ videos }: { videos: Video[] }) {
  const [key, setKey] = useState<SortKey>("views");
  const rows = topVideos(videos, key, 25);
  return (
    <section className="rounded-xl border border-slate-800 overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="text-left p-3">Vídeo</th>
            {COLS.map((c) => (
              <th key={c.key} className="text-right p-3">
                <button className={key === c.key ? "text-sky-400" : "hover:text-slate-200"} onClick={() => setKey(c.key)}>
                  {c.label}{key === c.key ? " ↓" : ""}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((v) => (
            <tr key={`${v.channel}-${v.id}`} className="border-t border-slate-800">
              <td className="p-3">
                <div className="font-medium">{v.title}</div>
                <div className="text-xs text-slate-500">{v.channel}</div>
              </td>
              <td className="p-3 text-right">{v.views.toLocaleString("pt-BR")}</td>
              <td className="p-3 text-right">US$ {v.revenueUsd.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="p-3 text-right">US$ {rpmOf(v).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              <td className="p-3 text-right">{v.ctrPct === null ? "—" : `${v.ctrPct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`}</td>
              <td className="p-3 text-right">{v.views ? fmtDuration((v.watchHours * 3600) / v.views) : "—"}</td>
              <td className="p-3 text-right">{v.published ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
