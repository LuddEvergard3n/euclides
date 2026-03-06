# Design System

Tokens, componentes e convenções visuais do Euclides. Tudo definido em `style.css`.

---

## Paleta

```css
/* Backgrounds */
--bg:          #0c0c10    /* fundo global — quase preto com leve azul */
--surface:     #13131c    /* cards, sidebar, canvas panel */
--surface-2:   #1a1a28    /* elementos elevados, hover states */

/* Borders */
--border:      #22223a    /* borda padrão */
--border-2:    #2e2e4a    /* borda mais visível (divisores) */

/* Text */
--text:        #e8e8f2    /* texto primário */
--text-muted:  #72728c    /* texto secundário */
--text-dim:    #3e3e58    /* texto terciário, labels */

/* Accents */
--gold:        #c8a44a    /* primário — títulos, destaque matemático */
--gold-light:  #e0bb6a    /* hover do gold */
--gold-dim:    rgba(200,164,74,.15)   /* background suave gold */
--teal:        #4ab8b2    /* canvas, interativo, correto-alternativo */
--blue:        #5a8fd2    /* ações secundárias, links */
--green:       #4e9e70    /* feedback correto */
--red:         #c45252    /* feedback errado, danger */

/* Layout */
--sidebar-w:   220px
--radius:      4px
--gap:         24px

/* Typography */
--font-ui:     'Inter', system-ui, sans-serif
--font-mono:   'JetBrains Mono', 'Fira Code', monospace
```

**Convenções da paleta:**
- Gold é o acento primário — usar para títulos de tópico, equações em destaque, CTAs principais.
- Teal é para elementos de canvas e interatividade.
- Blue para ações secundárias.
- Nunca usar gradientes. Nunca usar `border-radius > 8px`.

---

## Tipografia

| Uso | Fonte | Tamanho | Peso |
|---|---|---|---|
| UI geral | Inter | 13-14px | 400 |
| Labels, meta | Inter | 11-12px | 600 (caps) |
| Equações, código | JetBrains Mono | 13-14px | 400 |
| Títulos de tópico | JetBrains Mono | 22-28px | 500 |
| Valores em stats | JetBrains Mono | 24-28px | 600 |

---

## Componentes

### Botões

```html
<button class="btn">Padrão</button>
<button class="btn btn-primary">Primário (gold)</button>
<button class="btn btn-danger">Perigo (red)</button>
```

`.btn` base: padding 8px 16px, border 1px solid var(--border), background transparente,
cor var(--text-muted), radius var(--radius), cursor pointer.

`.btn-primary`: background gold-dim, border gold, cor gold.

`.btn-danger`: background red/12%, border red/30%, cor red.

### Breadcrumb

```js
UI.renderBreadcrumb([
  { label: 'Início', href: '' },
  { label: 'Tópico', href: 'topic/id/concept' },
  { label: 'Prática' }   // sem href = item atual
])
```

### Phase bar

```js
UI.renderPhaseBar(topicId, 'concept' | 'example' | 'practice')
```

Mostra 3 steps: Conceito → Exemplo → Prática. Preenchido conforme `Progress.get()`.

### Concept highlight

```html
<div class="concept-highlight">
  <div class="hl-label">Título da seção</div>
  Conteúdo HTML — pode ter <br>, fórmulas inline, etc.
</div>
```

Usar 2-3 blocos por tópico. Nunca mais de 4.

### Exercise card

```html
<div class="exercise-card">
  <p class="exercise-statement">Enunciado.</p>
  <div class="exercise-equation">f(x) = ax² + bx + c</div>
  <div class="answer-row">
    <span class="answer-label">= </span>
    <input class="answer-input" type="text" />
  </div>
  <p class="feedback-line correct|wrong" id="feedback"></p>
  <div id="hint-area"></div>
  <div class="btn-row">...</div>
</div>
```

`.feedback-line.correct`: cor green.
`.feedback-line.wrong`: cor red.

### Hint box

```html
<div class="hint-box">
  <div class="hint-label">Dica 1</div>
  Texto da dica.
</div>
```

### Stat card (tela de stats)

```html
<div class="stat-card stat-card-accent">  <!-- accent = gold -->
  <div class="stat-card-val">87%</div>
  <div class="stat-card-label">Precisão global</div>
</div>
```

---

## Layout de tópico

```
.topic-screen (grid: 1fr 420px)
├── .topic-content (overflow-y: auto, padding: 24px 32px)
│   ├── .breadcrumb
│   ├── .phase-bar
│   ├── h1.topic-title
│   ├── p.topic-meta
│   └── .content-block | .exercise-card | steps
└── .topic-canvas-panel (420px, border-left)
    └── canvas#main-canvas (420×380 ou 420×340)
```

Em mobile (≤640px): `.topic-canvas-panel` é ocultado (`display: none`).
`.topic-screen` vira `grid-template-columns: 1fr`.

---

## Canvas — convenções

Todas as funções de canvas nos módulos devem:

1. Chamar `Renderer.clear()` primeiro.
2. Usar as cores de `Renderer.COLORS` para consistência.
3. Usar `JetBrains Mono` para textos.
4. Não usar tamanhos de fonte acima de 12px (canvas é 420px de largura).
5. Deixar margem mínima de 20px em todos os lados.

Cores recomendadas para canvas:
```
Grid fino:    #17172a
Grid médio:   #1a1a28
Eixos:        #3e3e58
Tick labels:  #3e3e58 (9px)
Curva:        #5a8fd2 (azul) ou #4ab8b2 (teal)
Destaque:     #c8a44a (gold)
Correto/OK:   #4e9e70
Errado:       #c45252
```

---

## Mobile

Breakpoint único: `@media (max-width: 640px)`.

Comportamento:
- Sidebar: `position: fixed`, oculto via `transform: translateX(-100%)`,
  expande para `translateX(0)` com classe `.sidebar-open`.
- `#mobile-bar`: visível apenas em mobile, contém hamburger + título.
- `#sidebar-overlay`: backdrop semi-transparente quando sidebar aberto.
- Canvas panel: oculto em mobile.
- Stats: `.stats-two-col` colapsa para 1 coluna.

---

## Classes utilitárias

```css
.mt-24        { margin-top: 24px; }
.text-mono    { font-family: var(--font-mono); }
.text-gold    { color: var(--gold); }
.text-dim     { color: var(--text-dim); }
.text-muted   { color: var(--text-muted); }
.btn-row      { display: flex; gap: 8px; flex-wrap: wrap; }
```
