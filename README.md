# Euclides

Sistema de ensino de matemática browser-only. Sem frameworks, sem dependências externas, sem servidor obrigatório.

```
84 tópicos  ·  EFI → ES  ·  PWA  ·  469 testes  ·  ~480 KB zip
```

---

## Stack

| Camada | Tecnologia |
|---|---|
| UI | HTML5 + CSS3 + JavaScript ES5 puro |
| Canvas | Canvas 2D API (sem bibliotecas) |
| Math engine | C compilado para WebAssembly via Emscripten; fallback em JS puro |
| Storage | `localStorage` — sem backend |
| PWA | Service Worker (cache-first) |
| Testes | Node.js, sem framework de testes externo |

---

## Rodar localmente

```bash
# VS Code: botão direito em index.html → Open with Live Server

# ou qualquer servidor HTTP estático:
cd euclides
python3 -m http.server 8000
# abrir http://localhost:8000
```

`file://` não funciona — `fetch('data/topics.json')` é bloqueado por CORS.

## Rodar os testes

```bash
node test/runner.js
# → ALL TESTS PASSED (469 tests)
```

Não requer servidor nem browser. O runner faz shimming de `window`, `localStorage` e `document`.

## Compilar o WASM (opcional)

O fallback JS cobre todas as funcionalidades. WASM é opcional e melhora performance em dispositivos lentos.

```bash
# Instalar Emscripten SDK: https://emscripten.org/docs/getting_started/downloads.html
source /path/to/emsdk/emsdk_env.sh
cd euclides/wasm/src
bash build.sh   # ou build.bat no Windows
```

Output: `wasm/math_core.js` + `wasm/math_core.wasm`. O `wasm-loader.js` detecta e usa automaticamente.

---

## Estrutura

```
euclides/
├── index.html              — shell SPA; nenhuma lógica de domínio
├── style.css               — design system completo (~1900 linhas)
├── manifest.json           — PWA manifest
├── sw.js                   — service worker (cache-first, offline)
│
├── js/                     — 13 módulos de infraestrutura
│   ├── main.js             — boot sequence
│   ├── router.js           — SPA routing
│   ├── progress.js         — localStorage (sem DOM)
│   ├── renderer.js         — Canvas 2D (sem DOM fora do canvas)
│   ├── ui.js               — construção DOM (sem math, sem canvas)
│   ├── wasm-loader.js      — carrega WASM; fallback automático
│   ├── stats.js            — tela de estatísticas
│   ├── exam.js             — prova cronometrada
│   ├── review.js           — revisão ponderada por desempenho
│   ├── teacher.js          — modo professor
│   ├── completion.js       — overlay de conclusão
│   ├── sidebar.js          — sidebar mobile
│   └── anim.js             — utilitários de animação
│
├── modules/                — 84 módulos de tópico
│   └── <topicId>.js        — conceito + exemplo + prática + canvas
│
├── math/
│   ├── rng.js              — RNG determinístico com reseed
│   ├── fallback.js         — MathCore em JS puro
│   └── generators/         — 18 arquivos de geradores por domínio
│       ├── efI.js, efII.js
│       ├── algebra.js, trig.js, geometry.js, functions.js
│       ├── matrices_logic.js, prob.js
│       ├── calc_I.js, calc_II.js, calc_III.js
│       ├── lin_alg.js, lin_alg_adv.js
│       ├── calculus_adv.js, numeric_transforms.js, ode_prob.js
│       ├── batch3.js       — ES: lagrange, linear_prog, markov, graph_theory, heat_eq
│       └── batch4.js       — ES: complex_var, runge_kutta, wave_eq, interpolation, ode_systems
│
├── wasm/src/               — math_core.c + build.sh + build.bat
├── data/topics.json        — 84 tópicos (id, title, symbol, level, group, status)
│
├── test/
│   ├── runner.js           — runner Node.js
│   ├── assert.js           — asserções (equal, approx, ok, deepEqual, throws, hasShape)
│   └── tests/              — 5 suites, 469 testes
│
└── docs/                   — documentação técnica detalhada
    ├── architecture.md     — separação de responsabilidades, fluxo de dados
    ├── api.md              — interfaces públicas de todos os módulos JS
    ├── adding-topics.md    — guia passo a passo para novos tópicos
    └── design-system.md   — tokens CSS, paleta, tipografia, componentes
```

---

## Cobertura de tópicos

| Nível | Tópicos | Exemplos |
|---|---|---|
| Fundamental I | 3 | Aritmética, Geometria básica, Racionais |
| Fundamental II | 13 | Equações, Frações, Potências, MMC/MDC, Semelhança |
| Ensino Médio | 31 | Trigonometria, Matrizes, Probabilidade, Cálculo intro, Cônicas |
| Ensino Superior | 37 | Cálculo I/II/III, Álgebra Linear, EDO, EDP, Grafos, Var. Complexa, Runge-Kutta |

---

## Funcionalidades

- **Prática adaptativa** — dificuldade 1-5 ajustada pelo histórico dos últimos 5 exercícios
- **Revisão ponderada** — seleciona tópicos com maior peso para os de menor acurácia
- **Prova cronometrada** — 20 questões, 30 minutos, com resultado detalhado
- **Estatísticas** — acurácia global, por nível, por tópico; tabelas de pontos fortes/fracos
- **Modo professor** — cria exercícios custom com enunciado, equação, resposta e dicas
- **Folha imprimível** — gera folha A4 com gabarito opcional via print dialog
- **Topbar** — barra fixa com abas Sobre, Ajuda e Ecossistema; painéis deslizantes com conteúdo contextual
- **PWA** — instalável, funciona offline após primeiro carregamento
- **Mobile** — sidebar colapsável com hamburger, breakpoint 640px

### Páginas auxiliares

| Página | Arquivo | Descrição |
|---|---|---|
| Sobre | `sobre.html` | Origem do nome, filosofia, cobertura de tópicos, stack, ecossistema |
| Fórmulas | `formulas.html` | Referência de fórmulas, regras e dicas — EF I, EF II, EM e ES; sidebar com navegação por âncoras |
| Guia do Professor | `guia-professor.html` | Como usar em sala de aula — atividades práticas, orientações pedagógicas, referência de funcionalidades |
| Plano de Aula | `plano-aula.html` | Gerador de planos com habilidades BNCC de Matemática por ano/série (EF1–EM3), presets de objetivos, metodologias, recursos e avaliação; exporta para impressão/PDF |

---

## Ecossistema

Plataformas educacionais do mesmo ecossistema:

| Plataforma | Área | URL |
|---|---|---|
| Quintiliano | Português e literatura | https://luddevergard3n.github.io/quintiliano/ |
| Johnson English | Língua inglesa | https://luddevergard3n.github.io/johnson-english/ |
| Humboldt | Geografia | https://luddevergard3n.github.io/humboldt/ |
| Heródoto | História | https://luddevergard3n.github.io/Herodoto/ |
| Lavoisier | Química | https://luddevergard3n.github.io/lavoisier/ |
| Archimedes | Física | https://luddevergard3n.github.io/archimedes/ |

---

## Arquitetura em uma linha

```
Router → Module → { Progress (localStorage), UI (DOM), MathCore (WASM|JS), Renderer (Canvas) }
```

Ver [`docs/architecture.md`](docs/architecture.md) para detalhe completo.

---

## Licença

MIT
