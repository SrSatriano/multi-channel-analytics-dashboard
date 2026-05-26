import type { Channel } from "@/lib/metrics";
import { rpm, retention } from "@/lib/metrics";

export function ChannelComparison({ channels }: { channels: Channel[] }) {
  return (
    <section className="rounded-xl border border-slate-800 overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-slate-400">
          <tr>
            <th className="text-left p-3">Canal</th>
            <th className="text-right p-3">Views</th>
            <th className="text-right p-3">RPM</th>
            <th className="text-right p-3">Retenção</th>
          </tr>
        </thead>
        <tbody>
          {channels.map((c) => (
            <tr key={c.id} className="border-t border-slate-800">
              <td className="p-3">{c.name}</td>
              <td className="p-3 text-right">{c.views.toLocaleString()}</td>
              <td className="p-3 text-right">${rpm(c.revenue, c.views).toFixed(2)}</td>
              <td className="p-3 text-right">{(retention(c.watchTimeHours, c.durationHours) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
