"use client";

import { useState } from "react";
import { parseYoutubeCsv, type Video } from "@/lib/youtube";

export function Uploader({ onLoad }: { onLoad: (videos: Video[]) => void }) {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const handle = async (file: File | undefined) => {
    if (!file) return;
    const channel = name.trim() || file.name.replace(/\.csv$/i, "");
    const { videos, missing } = parseYoutubeCsv(await file.text(), channel);
    if (missing.length) {
      setMsg(`Colunas não encontradas: ${missing.join(", ")}. Exporte "Dados da tabela" na aba Conteúdo do Studio.`);
      return;
    }
    onLoad(videos);
    setMsg(`${videos.length} vídeos importados em "${channel}".`);
  };

  return (
    <div className="flex flex-col gap-2 text-sm">
      <div className="flex gap-2">
        <input
          placeholder="Nome do canal"
          className="rounded bg-slate-900 border border-slate-700 px-2 py-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="cursor-pointer rounded bg-sky-600 px-3 py-1 font-medium hover:bg-sky-500">
          Importar CSV
          <input type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => handle(e.target.files?.[0])} />
        </label>
      </div>
      {msg && <p className="text-slate-400">{msg}</p>}
    </div>
  );
}
