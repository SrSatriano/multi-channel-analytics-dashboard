import { ChannelComparison } from "@/components/ChannelComparison";
import { MetricCards } from "@/components/MetricCards";
import { RevenueChart } from "@/components/RevenueChart";
import { computeMetrics, mockChannels } from "@/lib/metrics";

export default function DashboardPage() {
  const channels = mockChannels();
  const aggregated = computeMetrics(channels);

  return (
    <main className="mx-auto max-w-6xl p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-1">Métricas consolidadas de todos os canais</p>
      </header>
      <MetricCards metrics={aggregated} />
      <RevenueChart channels={channels} />
      <ChannelComparison channels={channels} />
    </main>
  );
}
