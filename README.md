# `awesome-os/lo` — Ghost-Hydrated Low-Level V8 Runtime (Zero 250 MB Static Monolith)

> **Upstream Origin:** Debloated fork of [`just-js/lo`](https://github.com/just-js/lo) wired directly to the **Awesome-OS Sovereign Ghost CAS** ([`awesome-os/b8g-ghost @ cas-v1`](https://github.com/awesome-os/b8g-ghost/releases/tag/cas-v1)).  
> **Canonical Index:** [`https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json`](https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json)

---

## What Changed in `awesome-os/lo`

Traditional `lo` builds required downloading a `250 MB+` static `libv8_monolith.a` tarball and manually compiling third-party C/C++ libraries per machine. **`awesome-os/lo`** replaces that entire legacy stack with **content-addressed $O(1)$ Ghost CAS hydration**:

| Legacy `lo` Stack | `awesome-os/lo` (Ghost CAS Stack) |
| :--- | :--- |
| `250 MB+` static `libv8_monolith.a` duplicated in every binary | **Dynamic shared V8** (`libv8.so` / `v8.dll` / `libv8.dylib`) via [`awesome-os/libv8_monolith`](https://github.com/awesome-os/libv8_monolith) — **`dup_v8 = 0 B`** in OS RAM across `lo`, `just-js`, `bun-neon`, `b8g-ide`, and `sectium-browser` |
| Ad-hoc `docker/`, `install-llvm.cmd`, local CMake/Make builds | **Zero-CMake `holo-compiler` 5-OS shards** (`Win64`, `Linux x64/ARM64`, `macOS ARM64`, `wasm32-wasi`) hosted in `awesome-os/b8g-ghost @ cas-v1` |
| Duplicate per-project caches | **One shared Machine CAS** (`%LOCALAPPDATA%\AwesomeOS\cas\<sha256>\` / `~/.local/share/awesome-os/cas/<sha256>/`) with FIPS 180-4 SHA-256 verification |
| Manual upstream tracking | **21 sparse append-only mirrors** in [`awesome-os/upstream-mirrors`](https://github.com/awesome-os/upstream-mirrors) (`boringssl`, `brotli`, `sqlite3`, `libwebp`, `expat`, `zlib-ng`, `lz4`, `libdeflate`, `md4c`, `picohttp`, `libffi`, `mbedtls`, `curl`, `luajit`, `raylib`, `tcc`, `ada`, `simdutf`, `libpng`, `freetype`, `harfbuzz`, `libjpeg-turbo`) |

---

## Quickstart (Zero Node.js, Zero Docker, Zero `libv8_monolith.a`)

`awesome-os/lo` is a **self-hydrating standalone runtime** — it does **not** depend on Node.js. On first launch, the tiny `lo` binary fetches `manifests/index.json` from `awesome-os/b8g-ghost`, hydrates shared `libv8` + any requested native/`wasm32-wasi` libs into the local Machine CAS with FIPS 180-4 SHA-256 verification, and executes immediately:

```bash
# Run any JS or Erasable TypeScript file directly — zero tsc/webpack, zero Node.js!
./lo app.ts
./lo app.js

# Or inspect / pre-hydrate your Machine CAS directly without Node.js (POSIX / PowerShell):
curl -fsSL https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json | head -n 20
```

*(Optional CI/dev verification helper: `ghost-hydrate.mts` is also included for automated CI matrix checks.)*

---

## Ecosystem Alignment

- **Ghost CAS Store & Index:** [`awesome-os/b8g-ghost`](https://github.com/awesome-os/b8g-ghost) (`cas-v1` + `manifests/index.json`)
- **Dynamic V8 Shim:** [`awesome-os/libv8_monolith`](https://github.com/awesome-os/libv8_monolith)
- **Sibling Runtimes Sharing the Same Machine CAS:** [`awesome-os/just-js`](https://github.com/awesome-os/just-js), [`awesome-os/bun-neon`](https://github.com/awesome-os/bun-neon), [`awesome-os/sectium-browser`](https://github.com/awesome-os/sectium-browser), [`awesome-os/b8g-ide`](https://github.com/awesome-os/b8g-ide)
- **Top 100 1-Line `ghostFFI` Demos:** [`awesome-os/ghost-100`](https://github.com/awesome-os/ghost-100)
