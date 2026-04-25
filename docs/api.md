# API Reference

Interfaces públicas de todos os módulos JavaScript. Métodos prefixados com `_`
são internos e não fazem parte da API pública — estão expostos em `window` apenas
quando necessários por callbacks de eventos inline no HTML.

---

## TopPanel

Script inline em `index.html` → `window.TopPanel`

Controlador dos painéis deslizantes da topbar (Sobre, Ajuda, Ecossistema).

```js
TopPanel.open(key: 'sobre' | 'ajuda' | 'ecossistema')
// Abre o painel com o conteúdo do key dado.
// Se o mesmo key já estiver aberto, fecha (toggle).

TopPanel.close()
// Fecha o painel e remove o estado ativo das abas.
// Também disparado por tecla Escape e clique no #tpanel-overlay.
```

---

---

## Progress

`js/progress.js` → `window.Progress`

Estado de progresso do aluno. Persiste em `localStorage` como JSON.

```js
Progress.init()
// Carrega estado do localStorage. Chamado pelo main.js no boot.

Progress.markConcept(topicId: string)
// Marca fase de conceito como concluída.

Progress.markExample(topicId: string)
// Marca fase de exemplo como concluída.

Progress.recordAttempt(topicId: string, correct: boolean)
// Registra tentativa de exercício. Incrementa practiceCount e,
// se correct, practiceCorrect. Dispara 'euclides:topicComplete'
// quando practiceCorrect atinge 5 (se eventos não estiverem mutados).

Progress.get(topicId: string) → {
  conceptDone: boolean,
  exampleDone: boolean,
  practiceCount: number,
  practiceCorrect: number
}
// Retorna estado atual do tópico. Nunca retorna null.

Progress.accuracy(topicId: string) → number | -1
// Retorna acurácia em % (0-100). Retorna -1 se practiceCount === 0.

Progress.resetAll()
// Apaga todo o progresso. Sem confirmação — chamar apenas após confirmação do usuário.

Progress.muteEvents()
// Suprime dispatch de 'euclides:topicComplete'. Usado por exam.js.

Progress.unmuteEvents()
// Restaura dispatch de 'euclides:topicComplete'.
```

---

## Router

`js/router.js` → `window.Router`

```js
Router.register(topicId: string, moduleObj: {
  renderConcept: function(view: HTMLElement),
  renderExample: function(view: HTMLElement),
  renderPractice: function(view: HTMLElement)
})
// Registra um módulo de tópico. Chamado pelo IIFE de cada modules/*.js.

Router.navigate(path: string)
// Navega para o path dado. Atualiza window.location.hash.
// Em mobile, fecha o sidebar.
// Paths válidos:
//   ''                        → home
//   'topic/:id/concept'       → conceito
//   'topic/:id/example'       → exemplo
//   'topic/:id/practice'      → prática
//   'exam'                    → prova cronometrada
//   'review'                  → revisão ponderada
//   'stats'                   → estatísticas
//   'teacher'                 → modo professor
```

---

## Renderer

`js/renderer.js` → `window.Renderer`

Canvas 2D. Todas as coordenadas de math são em espaço matemático (não pixels).
O Renderer faz a conversão via origem e escala configuráveis.

```js
Renderer.init(canvas: HTMLCanvasElement)
// Inicializa com o elemento canvas. Reseta origem e escala.

Renderer.ctx() → CanvasRenderingContext2D
Renderer.width() → number   // largura em pixels
Renderer.height() → number  // altura em pixels

Renderer.clear()
// Limpa o canvas com a cor de fundo.

Renderer.drawAxes(opts?: { xLabel?: string, yLabel?: string })
// Desenha grid, eixos x e y, e tick marks.

Renderer.plotFunction(f: function(x) → number, opts?: {
  color?: string,        // default: COLORS.teal
  lineWidth?: number,    // default: 2
  xMin?: number,
  xMax?: number,
  step?: number
})
// Plota uma função contínua no intervalo [xMin, xMax].

Renderer.drawPoint(x: number, y: number, opts?: {
  color?: string,
  radius?: number,
  label?: string
})

Renderer.drawRootsOnAxis(roots: number[], opts?: { color?: string })
// Marca raízes no eixo x.

Renderer.drawXRegion(x1: number, x2: number, opts?: {
  color?: string,    // fill color com alpha
  label?: string
})
// Preenche área vertical entre x1 e x2.

Renderer.drawLabel(x: number, y: number, text: string, opts?: {
  color?: string,
  font?: string,
  align?: string
})

Renderer.drawVerticalLine(x: number, opts?: { color?: string, dashed?: boolean })

Renderer.drawArrow(x1: number, y1: number, x2: number, y2: number, opts?: {
  color?: string,
  lineWidth?: number
})

Renderer.drawEquationSteps(steps: Array<{ equation: string, note?: string }>, activeIndex: number)
// Renderiza lista de steps no canvas. Step ativo em destaque.

Renderer.mathToPixel(mx: number, my: number) → { x: number, y: number }
Renderer.pixelToMath(px: number, py: number) → { x: number, y: number }

Renderer.canvas() → HTMLCanvasElement
```

---

## UI

`js/ui.js` → `window.UI`

Constrói strings HTML e manipula DOM. Sem canvas, sem math.

```js
UI.setTopics(topics: Topic[])
// Inicializa com o array de tópicos do topics.json.

UI.renderHome(view: HTMLElement, topics: Topic[])
// Renderiza a tela inicial com o grid de tópicos agrupados por nível.

UI.renderSidebar(activeTopicId: string | null)
// Atualiza o sidebar com progresso atual. activeTopicId para destacar o tópico ativo.

UI.renderBreadcrumb(items: Array<{ label: string, href?: string }>) → string
// Retorna HTML string do breadcrumb.

UI.renderPhaseBar(topicId: string, activePhase: 'concept' | 'example' | 'practice') → string
// Retorna HTML string da barra de fases.

// Topic shape (de data/topics.json):
// { id: string, title: string, symbol: string, level: 'EFI'|'EFII'|'EM'|'ES',
//   group: string, status: 'available' | 'coming-soon' }
```

---

## MathCore

`window.MathCore` — alias para `WasmCore` ou `MathFallback` dependendo de disponibilidade.

```js
MathCore.generateExercise(topicId: string, difficulty: 1|2|3|4|5) → {
  statement: string,    // enunciado em português
  equation: string,     // forma matemática do problema
  answer: string,       // resposta correta (string)
  hints: string[],      // array de 2-3 dicas
  // campos opcionais por tópico:
  a?: number, b?: number, c?: number, delta?: number
}

MathCore.validate(topicId: string, studentAnswer: string, correctAnswer: string) → boolean
// Compara com tolerância numérica ±0.05. Suporta respostas multi-raiz ("2 ou -3").

MathCore.analyzeError(topicId: string, studentAnswer: string, correctAnswer: string) → 0|1|2|3
// 0 = erro genérico; 1-3 = tipo específico para selecionar dica direcionada.

MathCore.nextDifficulty(history: boolean[]) → 1|2|3|4|5
// history: array de resultados (true=correto, false=errado).
// Usa janela dos últimos 5 itens.
```

---

## MathGenerators

`window.MathGenerators` — objeto chave→função populado pelos arquivos em `math/generators/*.js`.

Cada gerador recebe `difficulty` (1–5) e retorna um objeto de exercício no mesmo formato
de `MathCore.generateExercise`. O dispatcher em `MathFallback.generateExercise` faz:

```js
var gen = MathGenerators[topicId];
if (gen) return gen(difficulty);
// senão: retorna objeto com mensagem "Tópico não encontrado"
```

**Aliases do módulo `arithmetic`** (registrados em `math/generators/efI.js`):

O módulo `arithmetic.js` gera exercícios por tipo de operação via `_genForType(opType, d)`,
que chama `MathFallback.generateExercise('arith_' + opType, d)`. Por isso, além do
gerador geral `'arithmetic'`, os seguintes aliases devem estar registrados:

```
'arith_addition'        'addition'
'arith_subtraction'     'subtraction'
'arith_multiplication'  'multiplication'
'arith_division'        'division'
```

Nunca remover esses aliases — o módulo depende deles. Nunca usar `MathFallback._genByType`
com chave sem prefixo `arith_`; esse método é alias interno de `generateExercise`.

---

## Stats

`js/stats.js` → `window.Stats`

```js
Stats.setTopics(topics: Topic[])
// Inicializa. Chamado pelo main.js.

Stats.render(view: HTMLElement)
// Renderiza a tela de estatísticas completa no elemento dado.

// Métodos internos expostos para callbacks HTML:
Stats._confirmReset()   // abre modal de confirmação
Stats._closeReset()     // fecha modal
Stats._doReset()        // executa reset (chama Progress.resetAll())
```

---

## Exam

`js/exam.js` → `window.Exam`

```js
Exam.setTopics(topics: Topic[])

Exam.render(view: HTMLElement)
// Inicializa e começa a prova. Chama Exam.start() internamente.

Exam.start()
// Seleciona 20 tópicos aleatórios disponíveis, configura timer de 30min,
// chama Progress.muteEvents(). Ao terminar: Progress.unmuteEvents().

Exam.abort()
// Encerra prova antecipadamente. Para timer. Mostra resultado parcial.

// Callbacks HTML:
Exam.checkAnswer()
Exam.nextQuestion()
```

---

## Review

`js/review.js` → `window.Review`

```js
Review.setTopics(topics: Topic[])

Review.render(view: HTMLElement)
// Renderiza tela de revisão com seleção ponderada de tópicos.
// Peso: 1 + round((1 - accuracy/100) * 4). Sem dados → peso 3.
```

---

## Sidebar

`js/sidebar.js` → `window.Sidebar`

```js
Sidebar.open()    // adiciona .sidebar-open ao #sidebar e ao #sidebar-overlay
Sidebar.close()   // remove .sidebar-open
```

---

## Completion

`js/completion.js` → `window.Completion`

```js
Completion.setTopics(topics: Topic[])
// Inicializa. Registra listener para 'euclides:topicComplete'.
// O evento é disparado por progress.js automaticamente.
```

---

## MathRNG

`math/rng.js` → `window.MathRNG`

```js
MathRNG.reseed()              // nova semente via Date.now() ^ Math.random()
MathRNG.randInt(a: number, b: number) → number
// Inteiro uniforme em [a, b] inclusivo.
```
