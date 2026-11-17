# Changelog

Todas as mudanças notáveis deste projeto são documentadas neste arquivo.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

## [1.1.0] — 2026-11-17

### Mudado

- Os dados deixam de ser fixos no código: o painel importa o CSV do YouTube Studio (pt-BR e en).
- Next 15, React 19 e exportação estática.

### Adicionado

- Filtros por canal e período, RPM e CTR ponderado, duração média e % assistido.
- Visualizações por mês, ranking ordenável e dados persistidos no navegador.
- 8 testes (vitest) e CI com typecheck, testes e build.

### Removido

- Variável `YOUTUBE_API_KEY` não usada e documentação de deploy que não correspondia ao projeto.

## [1.0.0] — 2026-03-26

### Adicionado

- Documentação completa em português brasileiro (README e `docs/`)
- Implementação do núcleo descrito no README
- Suíte de testes: `npm run build`
- Pipeline CI em `.github/workflows/ci.yml`

### Desempenho

- Benchmarks documentados no README e em `docs/ARCHITECTURE.md`

### Segurança

- Política em [SECURITY.md](SECURITY.md)
- Revisão de dependências na release 1.0.0

## [0.9.0] — 2026-02-15

### Adicionado

- Release candidate com contratos de API estáveis
- Testes de carga em homologação

## [0.1.0] — 2026-01-10

### Adicionado

- Estrutura inicial do repositório e prova de conceito
