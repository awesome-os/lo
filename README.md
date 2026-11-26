# `awesome-os/lo` — Holo `v11` CAS Low-Level V8 Runtime (Zero 250 MB Static Monolith)

> **Upstream Origin:** Debloated fork of [`just-js/lo`](https://github.com/just-js/lo) wired directly to the **AwesomeOS Holo `v11` CAS** ([`awesome-os/holo-v11`](https://github.com/awesome-os/holo-v11)) and [`awesome-os/holo-ffi`](https://github.com/awesome-os/holo-ffi).

## Highlights

- **Shared V8 (`dup_v8 = 0 B`):** Dynamically binds shared `libv8` via [`awesome-os/chromium-baseline`](https://github.com/awesome-os/chromium-baseline/tree/main/components/libv8_monolith) (`components/libv8_monolith` & `components/just-js/lo`) instead of embedding a `250 MB` static `libv8_monolith.a`.
- **Direct Erasable TypeScript Execution:** Runs `.ts` / `.mts` and `.js` directly with zero `tsc` / `webpack` build steps.
- **4-OS Native Launcher (`src/lo_launcher.c`):** Prebuilt `lo.exe`, `lo-linux-x64`, `lo-linux-arm64`, and `lo-macos-arm64` cross-compiled via `zig cc`.
- **Unified `Holo v11` CAS:** Shares `~/.b8g/cas/v11` via 0-byte hardlinks with [`awesome-os/awesome-os`](https://github.com/awesome-os/awesome-os) and [`awesome-os/sectium-browser`](https://github.com/awesome-os/sectium-browser).

## Quick Install & Run (Windows / Linux / macOS)

```sh
# Install / hydrate from v11 CAS via holo-pm
holo-pm install repository://github.com/awesome-os/lo@main

# Or project & run directly via holo-project (0-byte hardlink)
holo-project "project://cpp/lo?from=repository://github.com/awesome-os/lo@main"
```
