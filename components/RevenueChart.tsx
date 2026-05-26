"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { Channel } from "@/lib/metrics";
import { rpm } from "@/lib/metrics";

export function RevenueChart({ channels }: { channels: Channel[] }) {
  const data = channels.map((c) => ({
    name: c.name,
    revenue: c.revenue,
    rpm: Number(rpm(c.revenue, c.views).toFixed(2)),
  }));

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 h-72">
      <h2 className="text-sm font-medium text-slate-400 mb-4">Receita por canal</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #334155" }}
          />
          <Bar dataKey="revenue" fill="#38bdf8" name="Receita ($)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
