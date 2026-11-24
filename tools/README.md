# `tools/` — Legacy Upstream Release Tooling (Archival)

> **Note (`awesome-os/lo`):** Static `libv8_monolith-*.a.gz` / `libv8_monolith-win-x64.zip` tarballs from `just-js/v8` are **superseded** in `awesome-os/lo` by content-addressed dynamic V8 + 5-OS C/Wasm shards hosted in [`awesome-os/b8g-ghost @ cas-v1`](https://github.com/awesome-os/b8g-ghost/releases/tag/cas-v1).
>
> For current hydration, verification, and 4-OS launcher builds, use:
> - [`ghost-hydrate.mts`](../ghost-hydrate.mts) — CI/dev Ghost CAS hydration helper
> - [`examples/ghost-cas-quickstart.mts`](../examples/ghost-cas-quickstart.mts) — live `cas-v1` catalog & host shard quickstart
> - [`src/lo_launcher.c`](../src/lo_launcher.c) — zero-dependency 4-OS C11 native launcher (cross-compiled via `zig cc`)

The original upstream script [`release.js`](release.js) is retained for historical reference only. It expects upstream `just-js/v8` release assets (`Makefile` / `build.cmd`) and is not used by `awesome-os/lo` Ghost CAS releases.
