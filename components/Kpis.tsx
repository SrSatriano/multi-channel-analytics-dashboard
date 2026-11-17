import { fmtDuration, type Totals } from "@/lib/metrics";

const usd = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "USD" });
const int = (n: number) => Math.round(n).toLocaleString("pt-BR");

export function Kpis({ t }: { t: Totals }) {
  const items = [
    { label: "Visualizações", value: int(t.views), hint: `${t.videos} vídeos` },
    { label: "Receita estimada", value: usd(t.revenueUsd), hint: `RPM ${usd(t.rpm)}` },
    { label: "CTR das impressões", value: t.ctrPct === null ? "—" : `${t.ctrPct.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`, hint: `${int(t.impressions)} impressões` },
    {
      label: "Duração média assistida",
      value: fmtDuration(t.avgViewSec),
      hint: t.avgViewPct === null ? "sem duração no CSV" : `${t.avgViewPct.toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% do vídeo`,
    },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">{i.label}</p>
          <p className="text-2xl font-semibold mt-1">{i.value}</p>
          <p className="text-xs text-slate-500 mt-1">{i.hint}</p>
        </div>
      ))}
    </div>
  );
}
