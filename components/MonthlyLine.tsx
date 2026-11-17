"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const COLORS = ["#38bdf8", "#f472b6", "#34d399", "#fbbf24", "#a78bfa", "#f87171"];

export function MonthlyLine({ rows, channels }: { rows: { month: string }[]; channels: string[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 h-80">
      <h2 className="text-sm font-medium text-slate-400 mb-2">Visualizações por mês de publicação</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="month" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: "#0f172a", border: "1px solid #334155" }} />
          <Legend />
          {channels.map((c, i) => (
            <Line key={c} type="monotone" dataKey={c} stroke={COLORS[i % COLORS.length]} dot={false} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
