# Euclides

![JavaScript](https://img.shields.io/badge/JavaScript-ES5-F7DF1E?logo=javascript&logoColor=111111)
![WebAssembly](https://img.shields.io/badge/WebAssembly-Optional-654FF0?logo=webassembly&logoColor=white)
![Topics](https://img.shields.io/badge/Topics-84-7C3AED)
![Tests](https://img.shields.io/badge/Tests-469-2563EB)

Browser-only mathematics learning platform with 84 topics, interactive visualizations, offline support, and an optional WebAssembly calculation engine.

## Highlights

- Coverage from elementary mathematics through high-school topics.
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
python3 -m http.server 8000
```

Open `http://localhost:8000`. Direct `file://` access is unsupported because topic data is loaded with `fetch()`.

## Tests

```bash
node test/runner.js
```

Expected result: 469 passing checks.

## Structure

```text
index.html       Application shell
css/             Layout, themes, components, and responsive rules
js/              Navigation, state, topics, visualizations, accessibility
data/            Topic and exercise content
wasm/            C source, build files, and compiled module
test/            Dependency-free runner
```

## Optional WebAssembly build

Follow the Emscripten setup instructions referenced in the project, then rebuild the C engine from the `wasm/` directory. This step is optional because every feature has a JavaScript implementation.

## Live version

[luddevergard3n.github.io/euclides](https://luddevergard3n.github.io/euclides/)

## License

No license file is currently included. All rights are reserved unless stated otherwise.
