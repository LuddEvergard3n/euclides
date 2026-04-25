# Changelog — Euclides

Todas as mudanças significativas são documentadas aqui.
Formato: [versão] — data | mudanças agrupadas por tipo.

---

## [v4.4] — 2026-04-25

### Adicionado
- **`formulas.html`** — página de referência matemática completa, organizada em 4 níveis: EF I (1º–5º ano), EF II (6º–9º ano), Ensino Médio e Ensino Superior. Conteúdo inclui:
  - **EF I**: quatro operações com prova real, frações (soma/subtração/multiplicação/divisão/simplificação), geometria básica (perímetros e áreas), tabela de conversões de medidas, porcentagem
  - **EF II**: equações e inequações do 1º grau com roteiro de resolução, regra de três direta/inversa/composta, razão e proporção, potências e raízes, áreas de figuras planas (tabela completa incluindo Heron e setor circular), Teorema de Pitágoras, razões trigonométricas, ângulos notáveis, estatística básica
  - **EM**: Bhaskara (discriminante + fórmula + relações de Girard + roteiro), funções afim/quadrática/exponencial/logarítmica, PA e PG (termo geral, soma, PG infinita), trigonometria (identidades, adição, arco duplo, lei dos senos e cossenos), propriedades de logaritmos, análise combinatória (fatorial, permutação, arranjo, combinação, Binômio de Newton), probabilidade (clássica, complementar, União, condicional), geometria espacial com tabela de volumes e áreas, geometria analítica, matrizes e determinantes (Sarrus, Cramer, produto)
  - **ES**: limites fundamentais e L'Hôpital, derivadas (definição, regras básicas, produto, quociente, cadeia, derivadas comuns), integrais (indefinida, Teorema Fundamental, imediatas, integração por partes, substituição), séries de Taylor e Maclaurin, fórmula de Euler, EDO (variáveis separáveis, linear 1ª ordem, 2ª ordem coef. constantes, lei de crescimento/decaimento), álgebra linear (produto escalar e vetorial, autovalores, Gram-Schmidt), números complexos (formas algébrica/polar, De Moivre)
  - Sidebar com navegação por âncoras e destaque do item ativo via `IntersectionObserver`
  - Blocos de dica (`.tip-block`) e roteiros passo a passo (`.steps`) nos tópicos mais complexos
- **`formulas.html` adicionado ao `CACHE_URLS`** do `sw.js`
- **Link "Fórmulas"** adicionado ao topbar de todas as páginas: `index.html`, `sobre.html`, `guia-professor.html`, `plano-aula.html`

### Corrigido
- **`batch3.js` — `linear_prog` d1**: operador ternário sem parênteses em `pr.type==='max'?'Maximize':'Minimize' + ' z = ...'` causava precedência incorreta — `statement` ficava só `'Maximize'` e `equation` ficava só `'max'`. Parênteses adicionados em todas as ocorrências.

- **`CACHE_VER`** incrementado para `euclides-v4-4`.

---

## [v4.3] — 2026-04-25

### Corrigido
- **`math/generators/efI.js` + `modules/arithmetic.js` — "Tópico não encontrado" em Aritmética**: o módulo `arithmetic.js` gera exercícios por tipo de operação (`'arith_addition'`, `'arith_subtraction'`, etc.), mas esses identificadores não estavam registrados em `MathGenerators` — só existia `'arithmetic'` (que sorteia a operação aleatoriamente). O `_genForType` então chamava `MathFallback._genByType(opType, d)` com a chave `'subtraction'` (sem prefixo), que também não existia. Resultado: a mensagem `Tópico "arith_subtraction" não encontrado.` aparecia no exercício, sem equação e com resposta `—`.

  **Correção em dois arquivos:**
  - `math/generators/efI.js` — registrados 8 novos aliases: `'arith_addition'`, `'arith_subtraction'`, `'arith_multiplication'`, `'arith_division'` e os equivalentes sem prefixo (`'addition'`, `'subtraction'`, `'multiplication'`, `'division'`). Cada alias força a operação específica em vez de sortear.
  - `modules/arithmetic.js` — `_genForType` agora chama `MathFallback.generateExercise('arith_' + opType, d)` em vez do método `_genByType` com chave incorreta.

  Também corrigido um bug secundário de ASI (Automatic Semicolon Insertion) no `efI.js`: a função geradora `arithmetic` não tinha `;` após o `}` de fechamento, o que fazia o browser interpretar o bloco de aliases seguinte como uma chamada à função geradora.

- **`CACHE_VER`** incrementado para `euclides-v4-3`.

---

## [v4.2] — 2026-04-25

### Corrigido
- **244 acessos DOM inseguros em 83 módulos** — todas as chamadas a `getElementById` seguidas de acesso direto a `.textContent`, `.innerHTML`, `.style.width` ou `.disabled` sem verificação de existência do elemento foram substituídas pelo padrão seguro:
  ```js
  // antes (crash se elemento não existir no DOM)
  document.getElementById('step-counter').textContent = '...';

  // depois (sem-op se elemento ausente)
  var _sc = document.getElementById('step-counter');
  if (_sc) _sc.textContent = '...';
  ```
  Elementos afetados: `step-counter`, `step-fill`, `step-desc`, `btn-prev`, `btn-next`. Isso eliminava o `TypeError: Cannot set properties of null` que ocorria quando o usuário navegava para outro tópico enquanto o temporizador de exemplo ainda estava ativo ou ao usar o botão Prev/Next em rápida sucessão.
- 38 ocorrências adicionais com atribuições ternárias multiline também corrigidas (mesmo padrão, não capturado pela primeira passagem).
- **`CACHE_VER`** incrementado para `euclides-v4-2` para forçar reinstalação do SW.
- **469 testes passando** após todas as alterações.

---

## [v4.1] — 2026-03-12

### Corrigido
- **`sw.js` — falha crítica no fetch handler**: o handler de `catch` retornava uma página HTML para **qualquer** request que falhasse — incluindo requisições de `.js`, `.wasm`, `.css`. Isso causava o erro "Um ServiceWorker interceptou a requisição e encontrou um erro não esperado" quando `wasm/math_core.js` era requisitado (arquivo não compilado — só o `.c` fonte existe em `wasm/src/`). O browser recebia `Content-Type: text/html` para um `<script>`, reportava o erro e podia impedir `script.onerror` de disparar, o que por sua vez impedia `wasm-loader.js` de chamar `_useFallback()` corretamente.

  **Solução**: o handler de fetch foi separado em dois caminhos:
  - **Navigation requests** (`e.request.mode === 'navigate'`): cache-first com fallback para `index.html` cacheado quando offline. A página HTML offline só é servida para requests de navegação.
  - **Assets estáticos** (JS, WASM, CSS, JSON, imagens): cache-first sem `catch`. Se o fetch falha, o erro propaga naturalmente — `script.onerror` dispara limpo, `_useFallback()` é chamado, fallback JS assume.

- **`CACHE_VER`** incrementado para `euclides-v4-1` para forçar reinstalação do SW em todos os clientes com a versão defeituosa.

---

## [v4.0] — 2026-03-12

### Adicionado
- **`plano-aula.html`** — gerador de plano de aula com layout dois painéis (formulário 480px + preview `1fr`). Funcionalidades:
  - Campos de identificação (professor, escola, disciplina, turma, data, ano/série, nº de aulas, duração, carga horária calculada automaticamente, tema)
  - Seletor de ano/série (EF1 ao EM3); ao selecionar, popula dinamicamente os painéis de Objetos de Conhecimento BNCC e Habilidades BNCC correspondentes
  - Habilidades BNCC de Matemática: 8–12 habilidades por ano (EF01MA–EF09MA); 12 habilidades EM compartilhadas (EM13MAT___)  com aliases EM1/EM2/EM3 — sem duplicação de dados
  - Presets de Objetivos de Aprendizagem, Metodologias, Recursos e Avaliação via checkboxes; cada seção tem textarea de adição livre
  - Campo de Observações livres
  - Botão "Gerar documento" produz HTML formatado para impressão no painel direito
  - Botão "Imprimir / PDF" chama `window.print()` com `@media print` completo: sem header/formulário, coluna única, `print-color-adjust: exact`
  - Botão "Limpar" reseta todos os campos
- **Archimedes** adicionado ao painel Ecossistema do `TopPanel` em `index.html` (estava ausente)
- **Seção Ecossistema** adicionada ao `guia-professor.html` — cards com os 7 projetos do ecossistema
- **`CACHE_VER`** no `sw.js` incrementado para `euclides-v4`; `sobre.html`, `guia-professor.html` e `plano-aula.html` adicionados ao `CACHE_URLS`

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
