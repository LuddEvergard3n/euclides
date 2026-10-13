# Euclides

![JavaScript](https://img.shields.io/badge/JavaScript-ES5-F7DF1E?logo=javascript&logoColor=111111)
![WebAssembly](https://img.shields.io/badge/WebAssembly-Optional-654FF0?logo=webassembly&logoColor=white)
![Topics](https://img.shields.io/badge/Topics-84-7C3AED)
![Checks](https://img.shields.io/badge/Checks-667-2563EB)

Browser-only mathematics learning platform with 84 topics, interactive visualizations, offline support, and an optional WebAssembly calculation engine.

## Highlights

- Coverage from elementary mathematics through higher-education topics, with high school as the primary path.
- Searchable catalog, learning prerequisites, favorites, recent topics, and skill mastery.
- Strict shared answer validation and deterministic exercise generation.
- Canvas-based interactive visualizations without a rendering library.
- C mathematics engine compiled with Emscripten.
- Complete JavaScript fallback when WebAssembly is unavailable.
- Local progress storage and cache-first PWA behavior.
- Auxiliary teacher guide and classroom activity pages.
- No backend or required runtime dependency.

## Stack

| Layer | Technology |
|---|---|
| Interface | HTML5 and CSS3 |
| Application | Vanilla JavaScript ES5 |
| Visualization | Canvas 2D |
| Math engine | C and optional WebAssembly |
| Persistence | `localStorage` |
| Offline | Service Worker |
| Tests | Node.js without an external framework |

## Run locally

```bash
node tools/serve.js 8000
```

Open `http://localhost:8000`. Direct `file://` access is unsupported because topic data is loaded with `fetch()`.

## Tests

```bash
node test/runner.js
```

Also validate the authored catalog:

```bash
node tools/validate-content.js
```

The runner reports the current number of checks. This count is not presented as an equal number of independent user behaviors.

## Structure

```text
index.html        Application shell
style.css         Foundations, components, pages, and responsive rules
auxiliary.css     Shared visual layer for static pages
js/               Router, state, UI, Canvas renderer, practice, and exam
math/             Shared validation and deterministic exercise generators
modules/          Topic screens, loaded only when requested
data/             Lightweight topic catalog
tools/            Local static server and content validation
wasm/             Optional C source and build files
test/             Dependency-free runner and behavior checks
```

## Architecture decisions

- Hash routes keep reload, browser history, shared topic links, and GitHub Pages compatibility.
- The initial document loads a lightweight topic catalog; the 84 topic modules are loaded and cached on first use.
- Progress schema version 2 migrates legacy local data and keeps progress, favorites, filters, preferences, and skill mastery on the device.
- The task engine normalizes legacy exercises behind one declarative contract, with native text and single-choice controls in review and exam modes.
- UI libraries and a backend are intentionally absent. Browser APIs, Canvas 2D, local files, and the optional existing WASM engine are sufficient.

## Optional WebAssembly build

Follow the Emscripten setup instructions referenced in the project, then rebuild the C engine from the `wasm/` directory. This step is optional because every feature has a JavaScript implementation.

## Live version

[luddevergard3n.github.io/euclides](https://luddevergard3n.github.io/euclides/)

## License

No license file is currently included. All rights are reserved unless stated otherwise.
