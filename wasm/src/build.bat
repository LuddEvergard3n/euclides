@echo off
REM wasm\src\build.bat
REM Compile math_core.c to WebAssembly on Windows.
REM Run from the wasm\src\ directory with emsdk_env.bat already called.

emcc math_core.c ^
  -o ..\math_core.js ^
  -s WASM=1 ^
  -s "EXPORTED_RUNTIME_METHODS=[\"cwrap\",\"UTF8ToString\",\"stringToUTF8\",\"allocate\",\"ALLOC_NORMAL\"]" ^
  -s "EXPORTED_FUNCTIONS=[\"_generate_exercise\",\"_validate_answer\",\"_analyze_error\",\"_next_difficulty\",\"_free_string\",\"_malloc\",\"_free\"]" ^
  -s MODULARIZE=1 ^
  -s EXPORT_NAME=MathCoreWasm ^
  -s ALLOW_MEMORY_GROWTH=1 ^
  -s ENVIRONMENT=web ^
  -lm ^
  -O2

if %ERRORLEVEL% == 0 (
    echo Build OK: ..\math_core.js + ..\math_core.wasm
) else (
    echo Build FAILED.
)
