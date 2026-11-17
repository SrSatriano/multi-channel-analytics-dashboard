"use client";

import { useEffect, useMemo, useState } from "react";
import { ChannelBars } from "@/components/ChannelBars";
import { Kpis } from "@/components/Kpis";
import { MonthlyLine } from "@/components/MonthlyLine";
import { TopVideos } from "@/components/TopVideos";
import { Uploader } from "@/components/Uploader";
import { demoVideos } from "@/lib/demo";
import { byChannel, byMonth, inPeriod, totals } from "@/lib/metrics";
import type { Video } from "@/lib/youtube";

const STORAGE_KEY = "mcad.videos.v1";

function load(): Video[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Video[]) : null;
  } catch {
    return null;
  }
}

function save(videos: Video[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(videos));
  } catch {
    /* armazenamento indisponível: segue só em memória */
  }
}

export default function DashboardPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isDemo, setIsDemo] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [channel, setChannel] = useState("todos");

  useEffect(() => {
    const stored = load();
    if (stored?.length) {
      setVideos(stored);
      setIsDemo(false);
    } else setVideos(demoVideos());
  }, []);

  const addVideos = (incoming: Video[]) => {
    const base = isDemo ? [] : videos;
    const names = new Set(incoming.map((v) => v.channel));
    const next = [...base.filter((v) => !names.has(v.channel)), ...incoming];
    setVideos(next);
    setIsDemo(false);
    save(next);
  };

  const reset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nada a fazer */
    }
    setVideos(demoVideos());
    setIsDemo(true);
  };

  const channels = useMemo(() => [...new Set(videos.map((v) => v.channel))], [videos]);
  const filtered = useMemo(() => {
    const p = inPeriod(videos, from || undefined, to || undefined);
    return channel === "todos" ? p : p.filter((v) => v.channel === channel);
  }, [videos, from, to, channel]);

  return (
    <main className="mx-auto max-w-6xl p-6 md:p-8 space-y-6">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics multicanal</h1>
          <p className="text-slate-400 mt-1">
            RPM, CTR e retenção dos seus canais do YouTube a partir do CSV do Studio. Os dados ficam só no seu navegador.
          </p>
        </div>
        <Uploader onLoad={addVideos} />
      </header>

      {isDemo && (
        <p className="rounded-lg border border-amber-700/50 bg-amber-950/40 px-4 py-2 text-sm text-amber-200">
          Mostrando dados fictícios de demonstração. Importe o CSV de um canal para ver os seus números.
        </p>
      )}

      <section className="flex flex-wrap gap-3 text-sm">
        <label className="flex items-center gap-2">
          Canal
          <select className="rounded bg-slate-900 border border-slate-700 px-2 py-1" value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="todos">todos</option>
            {channels.map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Publicados de
          <input type="date" className="rounded bg-slate-900 border border-slate-700 px-2 py-1" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          até
          <input type="date" className="rounded bg-slate-900 border border-slate-700 px-2 py-1" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        {!isDemo && (
          <button className="ml-auto rounded border border-slate-700 px-3 py-1 hover:bg-slate-800" onClick={reset}>
            Apagar meus dados
          </button>
        )}
      </section>

      <Kpis t={totals(filtered)} />
      <div className="grid md:grid-cols-2 gap-6">
        <ChannelBars rows={byChannel(filtered)} />
        <MonthlyLine rows={byMonth(filtered)} channels={channel === "todos" ? channels : [channel]} />
      </div>
      <TopVideos videos={filtered} />
    </main>
  );
}
