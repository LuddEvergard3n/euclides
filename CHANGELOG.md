# Changelog — Euclides

Todas as mudanças significativas são documentadas aqui.
Formato: [versão] — data | mudanças agrupadas por tipo.

---

## [v3.2] — 2026-03-09

### Corrigido
- **`wave_eq.js`** — `d'Alembert` dentro de string JS com aspas simples causava syntax error; substituído por entidade HTML `d&#39;Alembert`.
- **`ode_systems.js`** — `y''`, `y'`, `x'` dentro de strings single-quoted causavam syntax error; substituídos por `&#39;`.
- **`markov.js`** — corpo da função `_drawAxes()` havia ficado solto após `var _exStep=0` sem a declaração da função; declaração restaurada.

---

## [v3.1] — 2026-03-09

### Adicionado
- **Topbar** (`#topbar`): barra fixa de 44px spanning full-width com logo + "Euclides" à esquerda e abas "Sobre", "Ajuda" e "Ecossistema" à direita.
- **`TopPanel`** (script inline em `index.html`): controlador de painéis deslizantes ancorados no canto direito, abaixo do topbar. Fecha com Escape ou clique no overlay. Aba ativa recebe destaque gold.
  - **Sobre** — descrição da plataforma, cobertura de tópicos, stack e filosofia
  - **Ajuda** — guia de uso em 4 passos, features e explicação da dificuldade adaptativa
  - **Ecossistema** — cards com links para Quintiliano, Johnson English, Humboldt, Heródoto e Lavoisier

### Alterado
- Logo e nome "Euclides" movidos do `#sidebar-header` para o `#topbar-brand`.
- `body` mudou de `height: 100vh; overflow: hidden` para `display: flex; flex-direction: column` com topbar acima e `#app` abaixo.
- `#sidebar-header` agora tem `display: none` no desktop — aparece apenas no mobile para segurar o botão de fechar, eliminando a barra vazia e assimétrica.
- Sidebar mobile passa a ter `top: 44px` (abaixo do topbar) em vez de `top: 0`.
- Bloco `#ecosystem` removido do `#sidebar-footer`.
- Descrições corrigidas: Quintiliano → "Português e literatura"; Humboldt → "Geografia".

---

## [v3] — 2026-03-06

### Adicionado
- **Tela de estatísticas** (`js/stats.js`): rota `/stats`, cards de resumo global,
  breakdown por nível com barra de progresso, tabelas de pontos fortes/fracos,
  tabela completa ordenada por acurácia, reset de progresso com confirmação modal.
- **5 tópicos ES de nicho** (geradores em `math/generators/batch4.js` + módulos):
  - `complex_var` — Variável Complexa (módulo, argumento, polar, Euler)
  - `runge_kutta` — Runge-Kutta (Euler, RK2, RK4, erro global, convergência)
  - `wave_eq` — Equação de Onda (d'Alembert, modos normais, energia)
  - `interpolation` — Interpolação Polinomial (Lagrange, Newton, erro)
  - `ode_systems` — Sistemas de EDO (autovalores, retrato de fase, estabilidade)
- **Botão "Estatísticas"** no sidebar, com estilo próprio.
- `.gitignore` na raiz.
- Pasta `docs/` com documentação técnica:
  - `docs/architecture.md` — separação de responsabilidades e fluxo de dados
  - `docs/api.md` — interfaces públicas de todos os módulos JS
  - `docs/adding-topics.md` — guia passo a passo para novos tópicos
  - `docs/design-system.md` — tokens CSS, paleta, tipografia, componentes

### Melhorado
- **Canvas elaborados**: `derivatives` (tangente com projeções dashed), `integrals`
  (área sombreada sob x² de 0 a 2), `calc_limits` (sen(x)/x com discontinuidade
  removível), `fourier_series` (somas parciais N=1,3,9 com fenômeno de Gibbs visível).
- **Mobile polish**: padding compacto em telas ≤640px, `exercise-card` full-width,
  `answer-row` com wrap, `stats-two-col` colapsa para 1 coluna, overlay de
  conclusão empilha botões verticalmente.
- `continuation.md` reescrito com contagens corretas e checklist de novos tópicos.
- `README.md` criado como documentação pública técnica.

### Corrigido
- Suite de testes atualizada para carregar `batch4.js`; contagem sobe de 444 para **469**.
- `sw.js` cache atualizado com todos os novos arquivos; versão bumped para `euclides-v3`.

---

## [v2] — 2026-03-05

### Adicionado
- **Framework de testes automatizados** (`test/runner.js`, `test/assert.js`, 5 suites):
  444 casos cobrindo 79 tópicos × 5 dificuldades, validação, dificuldade adaptativa,
  RNG e shape de exercícios. Runner Node.js com bootstrap de browser globals.
- **Sidebar mobile** (`js/sidebar.js`): hamburger button em `#mobile-bar`, overlay de
  fundo, animação CSS `transform: translateX`. `Router.navigate()` fecha o sidebar.
- **Revisão ponderada** (`js/review.js`): peso `1 + round((1 - acc/100) * 4)`;
  tópicos com 0% têm peso 5, 100% têm peso 1.
- **PWA** (`sw.js`, `manifest.json`): service worker cache-first, instalável,
  funciona offline. Cache v1 → v2.

### Melhorado
- Breakpoint mobile `@media (max-width: 640px)`: sidebar fixed com `translateX`,
  overlay com backdrop `rgba(0,0,0,.55)`, exam/review headers empilham.
- `progress.js`: `muteEvents()` / `unmuteEvents()` para suprimir `euclides:topicComplete`
  durante prova (evita overlay de conclusão mid-exam).

### Corrigido
- `math/fallback.js → _parseNum`: rejeitava strings não-numéricas via regex
  `/^-?[\d.]+$/`; antes aceitava "2 ou -3" como 2 via `parseFloat`.
- `math/fallback.js → _normTrig`: padrão `|nd` autossustituía "indef." como
  "iindef.ef."; corrigido com `\bnd\b` (word boundary).
- `exam.js → abort()`: `setInterval` continuava após encerramento manual;
  `_stopTimer()` adicionado antes de `_showResults()`.
- `modules/markov.js`: chamada morta a `_drawAxes()` imediatamente sobrescrita
  por `Renderer.clear()` removida.
- `modules/linear_prog.js`: eixos cartesianos substituídos por eixos do 1º quadrante
  (origem bottom-left, apenas x≥0 y≥0), alinhados ao contexto de LP.

---

## [v1] — 2026-03-05

### Adicionado
- **Overlay de conclusão de tópico** (`js/completion.js`): animação de partículas,
  triggered por `euclides:topicComplete` ao atingir 5 acertos.
- **Prova cronometrada** (`js/exam.js`): 20 questões aleatórias de tópicos disponíveis,
  timer de 30 minutos, resultado com breakdown por tópico.
- **Modo professor — folha imprimível** (`js/teacher.js`): tab "Folha de exercícios",
  seleção de tópico + dificuldade (1-5 + Misto), toggle de gabarito, 10 exercícios,
  exportável via print dialog (CSS A4, serif typography, page-break controls).
- **79 tópicos** (14 EFI + 21 EFII + 16 EM + 28 ES) com prática adaptativa.

### Implementado (sessão inicial)
- Shell SPA: `index.html`, `style.css`, `router.js`, `main.js`
- Sistema de progresso: `progress.js` (localStorage)
- Renderizador Canvas 2D: `renderer.js` (eixos, plot de funções, steps)
- Motor matemático JS puro: `math/fallback.js`
- Motor matemático C: `wasm/src/math_core.c` (compila via Emscripten)
- Módulo padrão com 3 fases: conceito → exemplo navegável → prática adaptativa
- Modo professor: criar/listar/apagar exercícios custom com localStorage
- Design system completo: paleta gold/teal/blue, Inter + JetBrains Mono
