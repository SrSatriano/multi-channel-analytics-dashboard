"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Totals } from "@/lib/metrics";

export function ChannelBars({ rows }: { rows: { channel: string; totals: Totals }[] }) {
  const data = rows.map((r) => ({
    canal: r.channel,
    receita: Number(r.totals.revenueUsd.toFixed(2)),
    rpm: Number(r.totals.rpm.toFixed(2)),
  }));
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 h-80">
      <h2 className="text-sm font-medium text-slate-400 mb-2">Receita (US$) e RPM por canal</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="canal" stroke="#94a3b8" />
          <YAxis yAxisId="r" stroke="#94a3b8" />
          <YAxis yAxisId="rpm" orientation="right" stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
          <Legend />
          <Bar yAxisId="r" dataKey="receita" fill="#38bdf8" />
          <Bar yAxisId="rpm" dataKey="rpm" fill="#a78bfa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
