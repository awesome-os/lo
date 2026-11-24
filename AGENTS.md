# AGENTS.md

Notes for coding agents working in `awesome-os/lo`. See `README.md` for user-facing docs.

## Awesome-OS Ghost CAS Stack

- **Canonical CAS Index:** `https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json` (`149+` verified `cas-v1` entries, Keep-Last-5 retention).
- **Dynamic Shared V8:** Replaces the legacy `250 MB+` static `libv8_monolith.a` with shared `libv8` + `35/35` 5-OS C/Wasm shards (`libbrotli`, `liblz4`, `libsqlite3`, `libwebp`, `libexpat`, `libmd4c`, `libpicohttp`), `typescript-6.0.3-programmable.tar.gz` (Wave 2), and 4-OS zero-`node-gyp` `b8g-ghost-abi.node` addons.
- **Zero-Dependency Native Launcher:** [`src/lo_launcher.c`](src/lo_launcher.c) cross-compiles via `zig cc` to `dist/` (gitignored) for Win64, Linux x64/ARM64 (static musl), and macOS ARM64.
- **Verification Entrypoints:** Run `ghost-hydrate.mts` and `examples/ghost-cas-quickstart.mts` using erasable TypeScript (`erasableSyntaxOnly: true`).
- **Container:** `ghcr.io/awesome-os/t2linux:latest` (multi-arch `2.1 MB`).

## What lo is

A small JavaScript runtime: V8 plus a thin C++ layer (`lo.cc`, `main.cc`,
`main.h`) that exposes a global `lo` object. Everything else is JS
(`main.js`, `lib/*.js`) and native bindings (`lib/<name>/`, each defined by an
`api.js` that `lib/gen.js` turns into C++).

- `main.js` is the default bootstrap: module loader, `lo.load()` for
  bindings, CLI commands (`lo build`, `lo init`, `lo gen`, `lo repl`, or run a
  script). It's embedded in the binary.
- **Custom runtimes** are built from a config: `lo build runtime <name>`
  imports `<name>.config.js` (`runtime/*.config.js` for the ones in this repo)
  and links a new binary with the listed `bindings` statically linked and the
  `libs`/`embeds` files embedded. A config can set `index` (a script run by
  the default `main.js`) or override `main` entirely (e.g. `runtime/zero`).
- The `lo` binary embeds its own copy of `main.js` and `lib/*.js` and
  prefers them over files on disk. Set `LO_CACHE=1` to load from disk while
  editing, and rebuild a runtime after changing its embedded scripts.

## Conventions and gotchas

- Style: no semicolons, 2-space indent, snake_case functions, `const { x } = lo`
  destructuring at the top of a module.
- Import with bare, repo-relative specifiers (`'lib/net.js'`) or absolute
  paths. **Avoid relative specifiers (`./x.js`)**: the module loader can
  segfault on them. Run scripts with an absolute path
  (`./lo $PWD/script.js`).
- `console.log` / `console.error` take a single argument.
- File I/O: use `lo.core.read_file` / `write_file` (snake_case).
- No `Buffer`, `atob`, native `fetch`; `import.meta.url` is empty.
- Platform-specific code is guarded with `lo.core.os === 'linux' | 'mac' | 'win'`;
  configs can tag bindings per platform: `{ epoll: ['linux'] }`.
- Build outputs, runtime binaries and `v8/` are local; don't commit them.
  `builtins.S`, `builtins_linux.S` and `main.h` are tracked but rewritten by
  every runtime build, so check diffs to them before committing.

## Current work (2026-09-27)

**Generating runtime configs by parsing the program**, plan and status in
**[doc/PLAN-BUNDLE.md](doc/PLAN-BUNDLE.md)**. Summary:

- Goal: `lo init` then `lo build runtime foo --parse` (explicit opt-in; the
  default stays the manual config) finds the libs and bindings `foo.js` uses.
- Prototype, uncommitted: `lib/acorn/` (vendored acorn + acorn-walk),
  `lib/parse.js` (`parse(path)` → `{ bindings, libs, warnings }`),
  `parse-test.js` (run with `LO_CACHE=1 ./lo $PWD/parse-test.js <file | config>`).
- Decided: which files get scanned follows from the config shape (`main`
  overridden / `index` / neither); `workerSource` is folded to true for
  `index` runtimes; resolution should match the loader; bare and absolute
  imports are supported and relative ones produce a warning; the
  maintainer plans to simplify `main.js`'s `global_main()` to
  `handleCommand(args).catch(...)` on all platforms.
- Not decided: how scan results merge with hand-edited config arrays (see the
  doc; comment tags were rejected as fragile), binary-safe `embeds`, moving
  the `LOSSL` libssl/boringssl switch out of `lib/libssl.js`.

Discuss design questions with the maintainer before implementing; this work
is still in the planning stage.
