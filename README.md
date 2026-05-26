# Multi-Channel Analytics Dashboard

Front-end analítico que consolida métricas de múltiplos canais: RPM médio, retenção e taxas de conversão cruzando engajamento e faturamento.

## Stack

- Next.js 14 (App Router)
- TailwindCSS
- Node.js API routes

## Mockups de interface

Screenshots de referência em `mockups/`:

- `mockups/overview.png` — visão consolidada
- `mockups/channels.png` — comparação por canal
- `mockups/revenue.png` — RPM e receita

> Gere mockups com Figma ou substitua por capturas após `npm run dev`.

## Estrutura de pastas

```
app/
  (dashboard)/
    page.tsx          # Overview
    channels/
    revenue/
components/
  charts/             # Recharts wrappers
  tables/
lib/
  metrics.ts          # RPM, retenção, conversão
  connectors/         # YouTube, TikTok adapters
public/
docs/
```

## Métricas calculadas

| Métrica | Fórmula |
|---------|---------|
| RPM | `(revenue / views) * 1000` |
| Retenção | `avg_watch_time / duration` |
| Conversão | `clicks / impressions` |

## Deploy — Vercel

```bash
npm install
cp .env.example .env.local
vercel
```

Variáveis: `YOUTUBE_API_KEY`, `DATABASE_URL` (opcional).

## Deploy — Netlify

```bash
npm run build
# netlify.toml já configura publish = .next
```

Guia: [docs/DEPLOY.md](docs/DEPLOY.md)

## Desenvolvimento local

```bash
npm install
npm run dev
# http://localhost:3000
```
