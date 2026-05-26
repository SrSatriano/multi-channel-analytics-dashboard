# Guia de deploy

## Vercel

1. Conecte o repositório GitHub.
2. Framework preset: Next.js.
3. Env vars em Project Settings.

## Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"
```

## Variáveis obrigatórias

- `NEXT_PUBLIC_APP_URL`
- Conectores de API por canal (ver `lib/connectors/`)
