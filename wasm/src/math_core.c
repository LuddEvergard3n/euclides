/**
 * wasm/src/math_core.c
 *
 * Euclides math engine — compiled to WebAssembly via Emscripten.
 * Single responsibility: all mathematical rules, validation, generation
 * and progression logic. Zero DOM, zero JS, zero external dependencies.
 *
 * Compile:
 *   emcc math_core.c -o ../math_core.js \
 *     -s WASM=1 \
 *     -s EXPORTED_RUNTIME_METHODS='["cwrap","UTF8ToString","stringToUTF8","allocate","ALLOC_NORMAL"]' \
 *     -s EXPORTED_FUNCTIONS='["_generate_exercise","_validate_answer","_analyze_error","_next_difficulty","_free_string"]' \
 *     -s MODULARIZE=1 \
 *     -s EXPORT_NAME='MathCoreWasm' \
 *     -s ALLOW_MEMORY_GROWTH=1 \
 *     -O2
 *
 * All string outputs are heap-allocated. JS must call _free_string() after use.
 */

#include <emscripten.h>
#include <math.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <time.h>
#include <stdint.h>

/* ── PRNG (xorshift64) ────────────────────────────────────────────── */

static uint64_t _rng_state = 0x853c49e6748fea9bULL;

static uint64_t _rng_next(void) {
    _rng_state ^= _rng_state << 13;
    _rng_state ^= _rng_state >> 7;
    _rng_state ^= _rng_state << 17;
    return _rng_state;
}

static void _rng_seed(uint64_t s) {
    _rng_state = s ? s : 0xdeadbeefcafeULL;
}

/* Returns a random integer in [min, max] inclusive. */
static int _rand_int(int min, int max) {
    if (min >= max) return min;
    return (int)((_rng_next() & 0x7FFFFFFF) % (uint32_t)(max - min + 1)) + min;
}

/* ── Memory helpers ──────────────────────────────────────────────── */

/* Allocate and return a heap copy of src. Caller must call _free_string. */
static char *_strdup_heap(const char *src) {
    size_t len = strlen(src) + 1;
    char  *dst = (char *)malloc(len);
    if (dst) memcpy(dst, src, len);
    return dst;
}

EMSCRIPTEN_KEEPALIVE
void free_string(char *s) { free(s); }

/* ── JSON builder ────────────────────────────────────────────────── */

typedef struct {
    char  *buf;
    size_t cap;
    size_t len;
} Buf;

static void _buf_init(Buf *b, size_t initial) {
    b->buf = (char *)malloc(initial);
    b->cap = initial;
    b->len = 0;
    if (b->buf) b->buf[0] = '\0';
}

static void _buf_grow(Buf *b, size_t needed) {
    if (b->len + needed < b->cap) return;
    size_t newcap = (b->cap + needed) * 2;
    b->buf = (char *)realloc(b->buf, newcap);
    b->cap = newcap;
}

static void _buf_append(Buf *b, const char *s) {
    size_t slen = strlen(s);
    _buf_grow(b, slen + 1);
    memcpy(b->buf + b->len, s, slen + 1);
    b->len += slen;
}

static void _buf_appendf(Buf *b, const char *fmt, ...) {
    char tmp[512];
    va_list ap;
    va_start(ap, fmt);
    vsnprintf(tmp, sizeof(tmp), fmt, ap);
    va_end(ap);
    _buf_append(b, tmp);
}

/* Append a JSON string value with escaping. */
static void _buf_json_str(Buf *b, const char *key, const char *val, int comma) {
    _buf_appendf(b, "\"%s\":\"", key);
    /* Escape quotes in val */
    for (const char *p = val; *p; p++) {
        if (*p == '"')  _buf_append(b, "\\\"");
        else if (*p == '\\') _buf_append(b, "\\\\");
        else { char c[2] = {*p, 0}; _buf_append(b, c); }
    }
    _buf_append(b, comma ? "\"," : "\"");
}

/* ── Number formatting ───────────────────────────────────────────── */

/* Format integer as decimal string. */
static void _fmt_int(char *dst, int n) {
    snprintf(dst, 32, "%d", n);
}

/* Format a/b: if b divides a exactly, return integer; else return fraction. */
static void _fmt_frac(char *dst, int a, int b) {
    if (b == 0) { strcpy(dst, "∞"); return; }
    int sign = ((a < 0) != (b < 0)) ? -1 : 1;
    int an = abs(a), bn = abs(b);
    /* GCD */
    int x = an, y = bn;
    while (y) { int t = y; y = x % y; x = t; }
    int g = x;
    an /= g; bn /= g;
    if (bn == 1) snprintf(dst, 32, "%d", sign * (int)an);
    else         snprintf(dst, 32, "%d/%d", sign * (int)an, (int)bn);
}

/* ── Equation builders ───────────────────────────────────────────── */

/* Build display string for ax + b = c */
static void _build_eq1(char *out, int a, int b, int c) {
    char buf[128] = {0};
    char aStr[32], bStr[32], cStr[32];
    _fmt_int(cStr, c);

    if (a == 1)       strcpy(aStr, "x");
    else if (a == -1) strcpy(aStr, "-x");
    else              snprintf(aStr, 32, "%dx", a);

    if (b == 0) {
        snprintf(buf, sizeof(buf), "%s = %s", aStr, cStr);
    } else if (b > 0) {
        snprintf(buf, sizeof(buf), "%s + %d = %s", aStr, b, cStr);
    } else {
        snprintf(buf, sizeof(buf), "%s - %d = %s", aStr, abs(b), cStr);
    }
    strcpy(out, buf);
}

/* Build display string for ax² + bx + c = 0 */
static void _build_eq2(char *out, int a, int b, int c) {
    char buf[128] = {0};
    char aStr[32];

    if (a == 1)       strcpy(aStr, "x²");
    else if (a == -1) strcpy(aStr, "-x²");
    else              snprintf(aStr, 32, "%dx²", a);

    if (b == 0 && c == 0)
        snprintf(buf, sizeof(buf), "%s = 0", aStr);
    else if (b == 0)
        snprintf(buf, sizeof(buf), "%s %s %d = 0", aStr, c>0?"+":"-", abs(c));
    else if (c == 0) {
        if (b == 1) snprintf(buf, sizeof(buf), "%s + x = 0", aStr);
        else if (b == -1) snprintf(buf, sizeof(buf), "%s - x = 0", aStr);
        else snprintf(buf, sizeof(buf), "%s %s %dx = 0", aStr, b>0?"+":"-", abs(b));
    } else {
        char bStr[32];
        if (abs(b) == 1) snprintf(bStr, 32, "%sx", b>0?"+":"-");
        else snprintf(bStr, 32, "%s%dx", b>0?"+":"-", abs(b));
        snprintf(buf, sizeof(buf), "%s %s %s %d = 0", aStr, bStr, c>0?"+":"-", abs(c));
    }
    strcpy(out, buf);
}

/* ── Exercise generators ─────────────────────────────────────────── */

static char *_gen_eq1(int difficulty) {
    _rng_seed((uint64_t)rand() ^ (uint64_t)time(NULL));
    int maxCoef = difficulty <= 2 ? 9 : difficulty <= 4 ? 19 : 49;
    int a = _rand_int(1, maxCoef);
    int x = _rand_int(-maxCoef, maxCoef);
    if (x == 0) x = 1;
    int b = difficulty > 1 ? _rand_int(-maxCoef, maxCoef) : 0;
    int c = a * x + b;

    char eq[128], answer[32];
    _build_eq1(eq, a, b, c);
    _fmt_int(answer, x);

    /* Hints */
    char h1[256], h2[256], h3[64];
    if (b != 0)
        snprintf(h1, sizeof(h1), "Isole o termo com x: passe %+d para o outro lado, mudando o sinal.", b);
    else
        strcpy(h1, "Você precisa isolar x dividindo ambos os lados.");
    if (a != 1)
        snprintf(h2, sizeof(h2), "Divida ambos os lados da igualdade por %d.", a);
    else
        strcpy(h2, "x já tem coeficiente 1 — basta simplificar o outro lado.");
    snprintf(h3, sizeof(h3), "x = %d", x);

    Buf b_out;
    _buf_init(&b_out, 512);
    _buf_append(&b_out, "{");
    _buf_json_str(&b_out, "statement", "Resolva a equacao e encontre o valor de x.", 1);
    _buf_json_str(&b_out, "equation",  eq,     1);
    _buf_json_str(&b_out, "answer",    answer, 1);
    _buf_appendf(&b_out, "\"hints\":[\"%s\",\"%s\",\"%s\"]", h1, h2, h3);
    _buf_append(&b_out, "}");

    return b_out.buf; /* caller frees */
}

static char *_gen_eq2(int difficulty) {
    _rng_seed((uint64_t)rand() ^ (uint64_t)time(NULL) ^ 0xABCD);
    char eq[128], answer[128];
    int a, b, c, delta;

    if (difficulty <= 3) {
        /* Generate from integer roots */
        int r1 = _rand_int(-9, 9);
        int r2 = _rand_int(-9, 9);
        if (r1 == r2 && difficulty < 3) r2 = r2 >= 0 ? r2 + 1 : r2 - 1;
        a = 1;
        b = -(r1 + r2);
        c = r1 * r2;
        delta = b * b - 4 * a * c;
        _build_eq2(eq, a, b, c);
        if (r1 == r2) snprintf(answer, sizeof(answer), "%d", r1);
        else {
            char s1[32], s2[32];
            _fmt_int(s1, r1); _fmt_int(s2, r2);
            snprintf(answer, sizeof(answer), "%s ou %s", s1, s2);
        }
    } else {
        a = _rand_int(1, 4);
        b = _rand_int(-10, 10);
        c = _rand_int(-10, 10);
        delta = b * b - 4 * a * c;
        _build_eq2(eq, a, b, c);
        if (delta < 0) {
            strcpy(answer, "sem raizes reais");
        } else if (delta == 0) {
            _fmt_frac(answer, -b, 2 * a);
        } else {
            int sd = (int)round(sqrt((double)delta));
            if (sd * sd == delta) {
                char f1[32], f2[32];
                _fmt_frac(f1, -b + sd, 2 * a);
                _fmt_frac(f2, -b - sd, 2 * a);
                snprintf(answer, sizeof(answer), "%s ou %s", f1, f2);
            } else {
                snprintf(answer, sizeof(answer),
                    "(%d + sqrt(%d)) / %d ou (%d - sqrt(%d)) / %d",
                    -b, delta, 2*a, -b, delta, 2*a);
            }
        }
    }

    /* Hints */
    char h1[128], h2[128], h3[256];
    snprintf(h1, sizeof(h1), "Identifique: a = %d, b = %d, c = %d", a, b, c);
    snprintf(h2, sizeof(h2), "Delta = b^2 - 4ac = %d^2 - 4*%d*(%d) = %d",
             b, a, c, delta);
    if (delta < 0)
        strcpy(h3, "Delta < 0: a equacao nao tem raizes reais.");
    else
        snprintf(h3, sizeof(h3), "Aplique Bhaskara: x = (-b +- sqrt(Delta)) / 2a");

    Buf b_out;
    _buf_init(&b_out, 768);
    _buf_append(&b_out, "{");
    _buf_json_str(&b_out, "statement", "Resolva a equacao de 2o grau usando Bhaskara.", 1);
    _buf_json_str(&b_out, "equation",  eq,     1);
    _buf_json_str(&b_out, "answer",    answer, 1);
    _buf_appendf(&b_out, "\"a\":%d,\"b\":%d,\"c\":%d,\"delta\":%d,", a, b, c, delta);
    _buf_appendf(&b_out, "\"hints\":[\"%s\",\"%s\",\"%s\"]", h1, h2, h3);
    _buf_append(&b_out, "}");

    return b_out.buf;
}

/* ── Public WASM exports ─────────────────────────────────────────── */

/**
 * Generate an exercise JSON string.
 * Caller must free result with free_string().
 */
EMSCRIPTEN_KEEPALIVE
char *generate_exercise(const char *topic_id, int difficulty) {
    if (strcmp(topic_id, "equations1") == 0) return _gen_eq1(difficulty);
    if (strcmp(topic_id, "equations2") == 0) return _gen_eq2(difficulty);

    /* Unknown topic */
    return _strdup_heap("{\"statement\":\"Topico nao disponivel.\","
                        "\"equation\":\"--\",\"answer\":\"\",\"hints\":[]}");
}

/**
 * Validate student answer against correct answer.
 * Returns 1 if correct, 0 otherwise.
 *
 * Handles:
 *   - Direct string match (case-insensitive, trim)
 *   - Numeric comparison (tolerance 1e-9)
 *   - Multi-root "x1 ou x2" comparison (order-independent)
 */
EMSCRIPTEN_KEEPALIVE
int validate_answer(const char *topic_id, const char *student, const char *correct) {
    (void)topic_id;

    if (!student || !correct) return 0;

    /* Trim and lower-case comparison */
    /* Direct match */
    if (strcasecmp(student, correct) == 0) return 1;

    /* Numeric comparison */
    char *end1, *end2;
    double sv = strtod(student, &end1);
    double cv = strtod(correct, &end2);
    if (*end1 == '\0' && *end2 == '\0') {
        return fabs(sv - cv) < 1e-9 ? 1 : 0;
    }

    /* Multi-root: "r1 ou r2" */
    if (strstr(correct, " ou ") != NULL) {
        /* Split correct into roots */
        char cbuf[256]; strncpy(cbuf, correct, 255); cbuf[255] = 0;
        char *tok = strtok(cbuf, " ou ");
        double roots[8]; int nroots = 0;
        while (tok && nroots < 8) {
            roots[nroots++] = strtod(tok, NULL);
            tok = strtok(NULL, " ou ");
        }

        /* Split student into parts */
        char sbuf[256]; strncpy(sbuf, student, 255); sbuf[255] = 0;
        double sroots[8]; int nsroots = 0;
        char *stok = strtok(sbuf, " ou ,;e ");
        while (stok && nsroots < 8) {
            sroots[nsroots++] = strtod(stok, NULL);
            stok = strtok(NULL, " ou ,;e ");
        }

        /* Every correct root must be found in student roots */
        for (int i = 0; i < nroots; i++) {
            int found = 0;
            for (int j = 0; j < nsroots; j++) {
                if (fabs(roots[i] - sroots[j]) < 1e-9) { found = 1; break; }
            }
            if (!found) return 0;
        }
        return 1;
    }

    return 0;
}

/**
 * Analyze the student error and return a hint index (1–3, 0 = generic).
 */
EMSCRIPTEN_KEEPALIVE
int analyze_error(const char *topic_id, const char *student, const char *correct) {
    if (!student || student[0] == '\0') return 1;

    double sv = strtod(student, NULL);
    double cv = strtod(correct, NULL);

    if (strcmp(topic_id, "equations1") == 0) {
        /* Sign inversion error */
        if (fabs(sv + cv) < 1e-9) return 2;
        /* Forgot to divide — answer is too large */
        if (fabs(sv) > fabs(cv) * 2.5) return 2;
        return 1;
    }

    if (strcmp(topic_id, "equations2") == 0) {
        /* Only one root given when two expected */
        if (strstr(correct, " ou ") && !strstr(student, "ou")) return 2;
        return 2;
    }

    return 0;
}

/**
 * Compute next difficulty (1–5) from history array of ints (1=correct, 0=wrong).
 * Simple streak-based adjustment.
 */
EMSCRIPTEN_KEEPALIVE
int next_difficulty(const int *history, int len, int current) {
    if (len <= 0) return 1;

    /* Count streak of correct at end */
    int streak = 0, tail = len < 5 ? len : 5;
    for (int i = len - 1; i >= len - tail; i--) {
        if (history[i] == 1) streak++;
        else break;
    }

    /* Count wrong in last 5 */
    int wrong = 0;
    for (int i = len - 1; i >= len - tail && i >= 0; i--) {
        if (history[i] == 0) wrong++;
    }

    if (streak >= 3 && current < 5) return current + 1;
    if (wrong  >= 3 && current > 1) return current - 1;
    return current;
}
