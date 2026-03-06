# Adicionando um Novo Tópico

Guia completo para adicionar um tópico ao Euclides. Todos os passos são obrigatórios.

---

## 1. Criar o gerador

Os geradores ficam em `math/generators/`. Escolha o arquivo correto pelo domínio:

| Domínio | Arquivo |
|---|---|
| EFI | `efI.js` |
| EFII | `efII.js` |
| EM — álgebra | `algebra.js` |
| EM — trig | `trig.js` |
| EM — geometria | `geometry.js` |
| ES — Cálculo I | `calc_I.js` |
| ES — Cálculo II | `calc_II.js` |
| ES — nicho | `batch4.js` (ou novo `batch5.js`) |

Dentro do arquivo, adicionar:

```js
MathGenerators['meu_topico'] = function (difficulty) {
  MathRNG.reseed();  // sempre na primeira linha

  // difficulty: 1 (fácil) a 5 (difícil)
  // Usar MathRNG.randInt(a, b) para todos os números aleatórios.

  return {
    statement: 'Enunciado completo em português.',
    equation:  'Forma matemática do problema.',
    answer:    'resposta_como_string',   // nunca number, sempre string
    hints: [
      'Primeira dica (passo inicial).',
      'Segunda dica (desenvolvimento).',
      'Terceira dica (próximo ao resultado).',
    ],
  };
};
```

**Requisitos do objeto retornado:**

- `statement`: string não-vazia
- `equation`: string não-vazia
- `answer`: string parseável por `parseFloat` (se numérico) ou texto exato (se textual)
- `hints`: array com 2-3 strings, nenhuma vazia

**Variabilidade obrigatória:** o gerador deve produzir exercícios diferentes entre chamadas
(via `MathRNG.randInt`). Dificuldade 5 deve ser visivelmente mais complexa que dificuldade 1.

---

## 2. Criar o módulo

Copiar `modules/heat_eq.js` como template e adaptar:

```js
(function () {
  var TOPIC_ID = 'meu_topico';              // deve bater com o id em topics.json

  function _mc(p, w, h) { /* não mudar */ }
  var _pr = { exercise:null, difficulty:1, history:[], hintsEnabled:false, hintIndex:0, solved:false };
  var _exStep = 0;

  // Canvas específico do tópico
  function _drawCanvas() {
    var ctx = Renderer.ctx(), W = Renderer.width(), H = Renderer.height();
    Renderer.clear();
    // ... desenho específico do conceito
  }

  function renderConcept(view) {
    Progress.markConcept(TOPIC_ID);
    view.innerHTML = '<div class="topic-screen"><div class="topic-content">' +
      UI.renderBreadcrumb([{label:'Início',href:''},{label:'Meu Tópico'}]) +
      UI.renderPhaseBar(TOPIC_ID, 'concept') +
      '<h1 class="topic-title">Meu Tópico</h1>' +
      '<p class="topic-meta">subtítulo · palavras-chave</p>' +
      '<div class="content-block">' +
        // 2-3 blocos .concept-highlight com label e conteúdo
      '</div>' +
      '<div class="btn-row mt-24">' +
        '<button class="btn btn-primary" onclick="Router.navigate(\'topic/meu_topico/example\')">Ver exemplo →</button>' +
      '</div>' +
    '</div><div class="topic-canvas-panel" id="canvas-panel"></div></div>';
    _mc(view.querySelector('#canvas-panel'), 420, 380);
    _drawCanvas();
  }

  var _exSteps = [
    { equation: 'Passo 1 — enunciado do problema.', note: 'contexto' },
    { equation: 'Passo 2 — desenvolvimento.', note: 'justificativa' },
    { equation: 'Passo 3 — resultado.', note: 'interpretação' },
    // 4-6 steps é o ideal
  ];

  // renderExample e renderPractice: copiar de heat_eq.js, substituindo:
  //   HeatEq → MeuTopico (nome do objeto público)
  //   heat_eq → meu_topico (TOPIC_ID)

  var _pub = {
    nextStep:      function () { /* ... */ },
    prevStep:      function () { /* ... */ },
    toggleHints:   function () { /* ... */ },
    showNextHint:  function () { /* ... */ },
    checkAnswer:   function () { /* ... */ },
    nextExercise:  function () { /* ... */ },
  };

  Router.register(TOPIC_ID, {
    renderConcept:  renderConcept,
    renderExample:  renderExample,
    renderPractice: renderPractice,
  });

  window.MeuTopico = _pub;
})();
```

---

## 3. Adicionar ao topics.json

```json
{
  "id": "meu_topico",
  "title": "Nome Legível",
  "symbol": "símbolo",
  "level": "ES",
  "group": "Grupo Existente",
  "status": "available"
}
```

Níveis válidos: `EFI`, `EFII`, `EM`, `ES`.

Grupos ES existentes: `Cálculo I`, `Cálculo II`, `Cálculo III`, `Álgebra Linear`,
`EDO`, `Prob & Estat`, `Cálculo Numérico`, `Transformadas`, `Otimização`, `Prob Avançada`,
`Grafos`, `EDP`.

---

## 4. Registrar em index.html

Adicionar **dois** `<script>` tags no lugar certo:

```html
<!-- após o arquivo de generator correspondente: -->
<script src="math/generators/batch4.js"></script>

<!-- após o último módulo: -->
<script src="modules/meu_topico.js"></script>
```

A ordem importa: generators devem ser carregados antes de `math/fallback.js`,
e módulos devem ser carregados após todos os arquivos de `js/`.

---

## 5. Adicionar ao cache do service worker

Em `sw.js`, dentro de `CACHE_URLS`:

```js
'./math/generators/batch4.js',   // se batch4 for novo
'./modules/meu_topico.js',
```

---

## 6. Bumpar a versão do cache

```js
// sw.js — linha 7
var CACHE_VER = 'euclides-v4';   // incrementar a cada deploy
```

---

## 7. Rodar os testes

```bash
node test/runner.js
```

O runner carrega `data/topics.json` dinamicamente — o novo tópico é testado
automaticamente em 5 dificuldades. Verificar que todos os 469+ testes passam.

Se um exercício retornar `answer: ''` ou `answer: '—'`, o teste falha com
`Field "answer" failed validator`. Corrigir o gerador.

---

## Checklist rápido

```
[ ] MathGenerators['meu_topico'] em generators/batch4.js (ou arquivo adequado)
[ ] modules/meu_topico.js com renderConcept + renderExample + renderPractice
[ ] Entrada em data/topics.json
[ ] <script> do generator em index.html (se arquivo novo)
[ ] <script> do módulo em index.html
[ ] Arquivo do generator em CACHE_URLS do sw.js (se arquivo novo)
[ ] Arquivo do módulo em CACHE_URLS do sw.js
[ ] CACHE_VER incrementado em sw.js
[ ] node test/runner.js — todos passando
```
