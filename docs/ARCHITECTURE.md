# Arquitetura

Aplicação Next.js 15 exportada como site estático (`output: "export"`). Não há backend: o CSV é lido no navegador com `File.text()` e os vídeos ficam em `localStorage` (com try/catch, porque o armazenamento pode estar indisponível).

```
CSV do Studio ──► parseYoutubeCsv(texto, canal) ──► Video[]
                                                   │
             filtros (canal, período) ─────────────┤
                                                   ▼
        totals / byChannel / byMonth / topVideos ──► componentes Recharts e tabela
```

- **Parser:** acha as colunas por nome em pt-BR ou en, separa respeitando aspas e detecta vírgula ou ponto e vírgula como separador. Interpreta "1.234,56" e "1,234.56" e os formatos de data do Studio.
- **Métricas:** funções puras em `lib/metrics.ts`, todas testadas. O CTR é ponderado pelas impressões e a retenção usa só os vídeos com duração conhecida.
- **Demo:** gerador congruencial com seed fixa. Os dados de demonstração são sempre os mesmos e marcados na tela como fictícios.
