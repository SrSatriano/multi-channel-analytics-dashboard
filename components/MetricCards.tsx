import type { AggregatedMetrics } from "@/lib/metrics";

export function MetricCards({ metrics }: { metrics: AggregatedMetrics }) {
  const items = [
    { label: "RPM médio", value: `$${metrics.rpm.toFixed(2)}` },
    { label: "Retenção", value: `${(metrics.retention * 100).toFixed(1)}%` },
    { label: "Conversão", value: `${(metrics.conversion * 100).toFixed(2)}%` },
    { label: "Receita total", value: `$${metrics.totalRevenue.toLocaleString()}` },
  ];
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
          <p className="text-sm text-slate-400">{item.label}</p>
          <p className="text-2xl font-semibold mt-1">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
