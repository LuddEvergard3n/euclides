# Architecture

## Visão geral

Euclides é uma SPA (Single Page Application) browser-only sem framework. Toda
navegação é hash-based, todo estado persistido é `localStorage`, e toda matemática
roda em JS puro (ou WASM quando compilado).

```
Topbar (Sobre | Ajuda | Ecossistema)
    └── TopPanel (painel deslizante, script inline)

URL hash → Router → Module.renderPhase(view)
                         │
              ┌──────────┼──────────────┐
              ▼          ▼              ▼
         Progress     MathCore      Renderer
        (storage)    (math only)   (canvas only)
              │
              └── UI (DOM strings)
```

---

## Separação de responsabilidades

Cada arquivo tem exatamente uma responsabilidade. Violações desta tabela são bugs de arquitetura.

| Arquivo | Pode | Não pode |
|---|---|---|
| `js/main.js` | boot sequence, inicializar módulos | DOM, math, storage |
| `js/router.js` | mapear hash → módulo, chamar render | math, canvas, storage |
| `js/progress.js` | ler/escrever localStorage | DOM, math, canvas |
| `js/ui.js` | construir strings HTML, manipular DOM | canvas, math, localStorage |
| `js/renderer.js` | Canvas 2D API | DOM fora do canvas, math |
| `js/stats.js` | ler Progress, renderizar tela de stats | escrever Progress, math |
| `js/exam.js` | orquestrar prova, timer | math logic, canvas |
| `js/review.js` | seleção ponderada de tópicos | math logic, canvas |
| `js/teacher.js` | exercícios custom, folha imprimível | math, canvas |
| `js/completion.js` | overlay de conclusão, partículas | math, storage |
| `js/sidebar.js` | toggle mobile sidebar | qualquer outra coisa |
| `math/fallback.js` | math pura (generate, validate, difficulty) | DOM, canvas, storage |
| `math/generators/*.js` | gerar exercícios por tópico | DOM, canvas, storage |
| `wasm/src/math_core.c` | math pura em C | qualquer coisa do browser |
| `modules/<id>.js` | orquestrar as 3 fases de um tópico | implementar math diretamente |

---

## Layout estrutural

```
<body>                         display: flex; flex-direction: column
  <header #topbar>             altura fixa 44px — logo + abas Sobre/Ajuda/Ecossistema
  <div #app>                   flex: 1; overflow: hidden
    <aside #sidebar>           220px, fixo
    <main #main>               flex: 1
  <div #tpanel-overlay>        overlay do painel (z-index 500)
  <div #tpanel>                painel deslizante (z-index 501, top: 44px, right: 0)
```

---

## TopPanel

Script inline no final de `index.html`. Controlador simples de painel único.

```js
TopPanel.open('sobre' | 'ajuda' | 'ecossistema')
// Abre o painel com o conteúdo correspondente.
// Se o mesmo key já estiver aberto, fecha (toggle).

TopPanel.close()
// Fecha o painel. Também disparado por Escape e clique no overlay.
```

Conteúdo dos três painéis é declarado como objeto literal `_content` dentro do IIFE.
Nenhuma dependência dos outros módulos — completamente isolado.

---

```
1. Usuário clica em link ou botão
2. Router.navigate(path) é chamado
3. Router atualiza window.location.hash
4. Router limpa #view e chama o handler correto:
   - '' → UI.renderHome(view, topics)
   - 'topic/:id/:phase' → Module.renderPhase(view)
   - 'exam' → Exam.render(view) → Exam.start()
   - 'review' → Review.render(view)
   - 'stats' → Stats.render(view)
   - 'teacher' → Teacher.render(view)
5. UI.renderSidebar(activeTopicId) atualiza o estado do sidebar
6. Em mobile: Router.navigate() chama Sidebar.close()
```

---

## Fluxo de um tópico

```
concept → example → practice

renderConcept(view):
  Progress.markConcept(topicId)
  view.innerHTML = [breadcrumb + phaseBar + conteúdo]
  Renderer.init(canvas)
  _drawCanvas() — visualização específica do tópico

renderExample(view):
  steps = array de {equation, note}
  Renderer.drawEquationSteps(steps, stepIndex)
  navegação ← → entre steps
  último step → Progress.markExample(topicId) → navigate('practice')

renderPractice(view):
  exercise = MathCore.generateExercise(topicId, difficulty)
  aluno responde → MathCore.validate(topicId, answer, correct)
  correto:  Progress.recordAttempt(topicId, true) → pode disparar euclides:topicComplete
  errado:   Progress.recordAttempt(topicId, false) → mostrar dica se habilitada
  difficulty = MathCore.nextDifficulty(history)
```

---

## Sistema de eventos

Apenas um evento customizado existe:

```js
// Disparado por progress.js quando practiceCorrect atinge 5
// Suprimido durante exam (muteEvents/unmuteEvents)
document.dispatchEvent(new CustomEvent('euclides:topicComplete', {
  detail: { topicId }
}));

// Ouvido por completion.js
document.addEventListener('euclides:topicComplete', handler);
```

---

## MathCore — interface pública

```js
// Gera um exercício. Retorna o objeto abaixo ou equivalente via WASM.
MathCore.generateExercise(topicId, difficulty)
// → { statement: string, equation: string, answer: string, hints: string[] }

// Valida resposta do aluno. Tolerância numérica: ±0.05.
MathCore.validate(topicId, studentAnswer, correctAnswer)
// → boolean

// Analisa o tipo de erro para selecionar dica específica.
MathCore.analyzeError(topicId, studentAnswer, correctAnswer)
// → 0 (genérico) | 1 | 2 | 3

// Sugere próxima dificuldade com base nos últimos 5 itens do histórico.
MathCore.nextDifficulty(historyArray)
// → 1 | 2 | 3 | 4 | 5
```

---

## Carregamento do WASM

`wasm-loader.js` tenta carregar `wasm/math_core.js` via `fetch`. Se falhar
(arquivo não existe ou browser bloqueia), silenciosamente usa `MathFallback`
de `math/fallback.js`. Os dois expõem a mesma interface.

```
wasm-loader.js
  fetch('wasm/math_core.js')
    OK  → window.MathCore = WasmCore
    ERR → window.MathCore = MathFallback
```

---

## Dificuldade adaptativa

Algoritmo em `MathCore.nextDifficulty(history)`:

```
janela = últimos 5 itens de history (true/false)
acertos = count(true na janela)

acertos >= 4  → difficulty + 1  (max 5)
acertos <= 1  → difficulty - 1  (min 1)
else          → difficulty mantido
```

---

## Revisão ponderada

Algoritmo em `review.js → _randomTopic()`:

```
weight(topicId) = 1 + round((1 - accuracy/100) * 4)
  accuracy 0%   → weight 5
  accuracy 50%  → weight 3
  accuracy 100% → weight 1
  sem dados     → weight 3

Seleção: distribuição cumulativa + random uniform
```

---

## PWA e cache

`sw.js` usa duas estratégias separadas:

**App assets** (cache-first) — todos os arquivos estáticos em `CACHE_URLS`:
pré-cacheados no install, servidos do cache sem tocar na rede.

**Google Fonts** (network-first com fallback persistente):
- Detectado por `_isFont(url)`: qualquer request para `fonts.googleapis.com` ou `fonts.gstatic.com`
- Tenta a rede primeiro; em sucesso, salva em `FONT_CACHE` (cache separado e persistente)
- Se offline, serve a versão em cache — fontes ficam disponíveis após primeira visita online
- `FONT_CACHE = 'euclides-fonts-v1'` **não é apagado** quando `CACHE_VER` sobe,
  garantindo que as fontes sobrevivam a atualizações do app

```js
var CACHE_VER  = 'euclides-v3';       // bumpar a cada deploy com mudanças de app
var FONT_CACHE = 'euclides-fonts-v1'; // estável; só mudar se trocar de fonte
```

---

## RNG determinístico

`math/rng.js` implementa um LCG (Linear Congruential Generator). `MathRNG.reseed()`
é chamado no início de cada `generateExercise` para garantir que exercícios com
mesma semente produzam resultado idêntico (útil para testes reproduzíveis).

```js
MathRNG.reseed()        // nova semente baseada em Date.now()
MathRNG.randInt(a, b)   // inteiro uniformemente distribuído em [a, b]
```

---

## Páginas auxiliares

| Arquivo | Template | Descrição |
|---|---|---|
| `sobre.html` | Coluna única centrada (max 860px) | Origem do nome, filosofia, cobertura, ecossistema |
| `guia-professor.html` | Sidebar 220px + conteúdo flex:1 | Orientações pedagógicas, atividades práticas, referência |
| `plano-aula.html` | Dois painéis (grid 480px + 1fr) | Gerador de plano com BNCC Matemática, presets, export print |

As três páginas compartilham o mesmo sistema de variáveis CSS e estrutura de topbar do `index.html`. Nenhuma importa módulos externos — todo JS é inline no `<script>` do próprio arquivo.

---

## Ecossistema

Plataformas educacionais do mesmo ecossistema, referenciadas no painel Ecossistema, nas páginas auxiliares e no README:

| Plataforma | Área | URL |
|---|---|---|
| Quintiliano | Português e literatura | https://luddevergard3n.github.io/quintiliano/ |
| Johnson English | Língua inglesa | https://luddevergard3n.github.io/johnson-english/ |
| Humboldt | Geografia | https://luddevergard3n.github.io/humboldt/ |
| Heródoto | História | https://luddevergard3n.github.io/Herodoto/index.html |
| Lavoisier | Química | https://luddevergard3n.github.io/lavoisier/ |
| Archimedes | Física | https://luddevergard3n.github.io/archimedes/ |
