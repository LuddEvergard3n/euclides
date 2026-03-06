#!/usr/bin/env bash
# wasm/src/build.sh
# Compile math_core.c to WebAssembly via Emscripten.
#
# Prerequisites:
#   - Emscripten SDK installed and activated (source emsdk_env.sh)
#   - Run from the wasm/src/ directory
#
# Output:
#   ../math_core.js   — Emscripten JS glue (sets window.MathCoreWasm)
#   ../math_core.wasm — compiled binary

set -e

emcc math_core.c \
  -o ../math_core.js \
  -s WASM=1 \
  -s EXPORTED_RUNTIME_METHODS='["cwrap","UTF8ToString","stringToUTF8","allocate","ALLOC_NORMAL"]' \
  -s EXPORTED_FUNCTIONS='["_generate_exercise","_validate_answer","_analyze_error","_next_difficulty","_free_string","_malloc","_free"]' \
  -s MODULARIZE=1 \
  -s EXPORT_NAME='MathCoreWasm' \
  -s ALLOW_MEMORY_GROWTH=1 \
  -s ENVIRONMENT='web' \
  -lm \
  -O2

echo "Build complete: ../math_core.js + ../math_core.wasm"
