# `awesome-os/lo` — Ghost-Hydrated Low-Level V8 Runtime (Zero 250 MB Static Monolith)

> **Upstream Origin:** Debloated fork of [`just-js/lo`](https://github.com/just-js/lo) wired directly to the **Awesome-OS Sovereign Ghost CAS** ([`awesome-os/b8g-ghost @ cas-v1`](https://github.com/awesome-os/b8g-ghost/releases/tag/cas-v1)).  
> **Canonical Index:** [`https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json`](https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json)

---

## What Changed in `awesome-os/lo`

Traditional `lo` builds required downloading a `250 MB+` static `libv8_monolith.a` tarball and manually compiling third-party C/C++ libraries per machine. **`awesome-os/lo`** replaces that entire legacy stack with **content-addressed $O(1)$ Ghost CAS hydration**:

| Legacy `lo` Stack | `awesome-os/lo` (Ghost CAS Stack — `149+` Verified `cas-v1` Entries) |
| :--- | :--- |
| `250 MB+` static `libv8_monolith.a` duplicated in every binary | **Dynamic shared V8** (`libv8.so` / `v8.dll` / `libv8.dylib`) via [`awesome-os/libv8_monolith`](https://github.com/awesome-os/libv8_monolith) — **`dup_v8 = 0 B`** in OS RAM across `lo`, `just-js`, `bun-neon`, `b8g-ide`, and `sectium-browser` |
| External `tsc` / non-programmable native strippers | **Built-in Programmable TypeScript 6.0.3 Wave 2 (`typescript-6.0.3-programmable.tar.gz`, `1.66 MB` in `cas-v1`)** — full `ts.createProgram` / `ts.transpileModule` / AST API running natively inside `lo`'s V8 engine |
| Ad-hoc `docker/`, `install-llvm.cmd`, local CMake/Make builds | **Zero-CMake `holo-compiler` `35/35` 5-OS C/Wasm shards** (`libbrotli`, `liblz4`, `libsqlite3`, `libwebp`, `libexpat`, `libmd4c`, `libpicohttp` × `Win64`, `Linux x64/ARM64`, `macOS ARM64`, `wasm32-wasi`) hosted in `awesome-os/b8g-ghost @ cas-v1` |
| Native `node-gyp` / `cmake-js` host compilation | **Zero-`node-gyp` 4-OS `b8g-ghost-abi.node` addon** (`b8g-ghost-abi-{win64,linux-x64,linux-arm64,macos-arm64}.node`) hydrated directly by SHA-256 |
| Heavyweight Ubuntu/Alpine Docker build images | **Multi-arch `2.1 MB` container** (`ghcr.io/awesome-os/t2linux:latest`) for minimal Linux execution and CI |
| Duplicate per-project caches & unbounded release bloat | **One shared Machine CAS** (`%LOCALAPPDATA%\AwesomeOS\cas\<sha256>\` / `~/.local/share/awesome-os/cas/<sha256>/`) with FIPS 180-4 SHA-256 verification and **Keep-Last-5** retention on `cas-v1` |
| Manual upstream tracking | **21 sparse append-only mirrors** in [`awesome-os/upstream-mirrors`](https://github.com/awesome-os/upstream-mirrors) (`boringssl`, `brotli`, `sqlite3`, `libwebp`, `expat`, `zlib-ng`, `lz4`, `libdeflate`, `md4c`, `picohttp`, `libffi`, `mbedtls`, `curl`, `luajit`, `raylib`, `tcc`, `ada`, `simdutf`, `libpng`, `freetype`, `harfbuzz`, `libjpeg-turbo`) |

---

## Quickstart (Zero Node.js, Zero Docker, Zero `libv8_monolith.a`)

`awesome-os/lo` is a **self-hydrating standalone runtime** — it does **not** depend on Node.js. On first launch, the tiny `lo` binary fetches `manifests/index.json` (`149+` verified `cas-v1` entries) from `awesome-os/b8g-ghost`, hydrates shared `libv8` + any requested native/`wasm32-wasi` shards into the local Machine CAS with FIPS 180-4 SHA-256 verification, and executes immediately:

```bash
# Run any JS or Erasable TypeScript file directly — zero tsc/webpack, zero Node.js!
./lo app.ts
./lo app.js

# Or run inside the multi-arch 2.1 MB container:
docker run --rm ghcr.io/awesome-os/t2linux:latest

# Or inspect / pre-hydrate your Machine CAS directly without Node.js (POSIX / PowerShell):
curl -fsSL https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json | head -n 20
```

### Runnable Ghost CAS Quickstart Example

Verify the live `cas-v1` catalog (`149+` entries, `35/35` 5-OS C/Wasm shards, `typescript-6.0.3-programmable.tar.gz` Wave 2, and `b8g-ghost-abi.node` 4-OS zero-`node-gyp` addons) and hydrate host artifacts into your local Machine CAS:

```bash
# Erasable TypeScript (runs natively with zero build step):
node examples/ghost-cas-quickstart.mts
```

*(CI/dev verification helper: [`ghost-hydrate.mts`](ghost-hydrate.mts) is also included for automated CI matrix checks.)*

### Zero-Dependency 4-OS C11 Native Launcher (`src/lo_launcher.c`)

Prebuilt 4-OS native launchers (`lo.exe`, `lo-linux-x64`, `lo-linux-arm64`, `lo-macos-arm64`) are published on [GitHub Releases (`v0.1.0`)](https://github.com/awesome-os/lo/releases/tag/v0.1.0) and cross-compiled natively via `zig cc` with zero external C libraries:

```bash
# Inspect version, help, or run the Ghost CAS quickstart via the native launcher:
./lo --version
./lo --help
./lo --quickstart
```

---

## Ecosystem Alignment

- **Ghost CAS Store & Index:** [`awesome-os/b8g-ghost`](https://github.com/awesome-os/b8g-ghost) (`cas-v1` + `manifests/index.json`)
- **Dynamic V8 Shim:** [`awesome-os/libv8_monolith`](https://github.com/awesome-os/libv8_monolith)
- **Sibling Runtimes Sharing the Same Machine CAS:** [`awesome-os/just-js`](https://github.com/awesome-os/just-js), [`awesome-os/bun-neon`](https://github.com/awesome-os/bun-neon), [`awesome-os/sectium-browser`](https://github.com/awesome-os/sectium-browser), [`awesome-os/b8g-ide`](https://github.com/awesome-os/b8g-ide)
- **Top 100 1-Line `ghostFFI` Demos:** [`awesome-os/ghost-100`](https://github.com/awesome-os/ghost-100)

## Quick Install & Run (Windows / Linux / macOS)

```sh
# Install / hydrate from v11 CAS via holo-pm
holo-pm install repository://github.com/awesome-os/lo@main

# Or project & run directly via holo-project (0-byte hardlink)
holo-project "project://cpp/lo?from=repository://github.com/awesome-os/lo@main"
```
