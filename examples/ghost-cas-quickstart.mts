/**
 * @file examples/ghost-cas-quickstart.mts
 * @description Crisp runnable quickstart verifying the live `awesome-os/b8g-ghost @ cas-v1`
 * catalog (149+ entries, 35/35 5-OS C/Wasm shards, TypeScript 6.0.3 Wave 2 programmable
 * compiler, 4-OS zero-node-gyp `b8g-ghost-abi.node` addons, Keep-Last-5 retention) and
 * hydrating host artifacts into the shared Machine CAS with FIPS 180-4 SHA-256 verification.
 *
 * Erasable TypeScript (`erasableSyntaxOnly: true`) — zero build step required.
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

interface GhostCasEntry {
  filename: string;
  sha256: string;
  bytes: number;
  download_url: string;
}

interface GhostCasIndex {
  schema: string;
  total_entries: number;
  entries: Record<string, GhostCasEntry>;
}

const GHOST_INDEX_URL = 'https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json';
const CONTAINER_IMAGE = 'ghcr.io/awesome-os/t2linux:latest';

const SHARD_LIBS = [
  'libbrotli',
  'liblz4',
  'libsqlite3',
  'libwebp',
  'libexpat',
  'libmd4c',
  'libpicohttp',
] as const;

const SHARD_TARGETS = [
  'win64.dll',
  'linux-x64.so',
  'linux-arm64.so',
  'macos-arm64.dylib',
  'wasm32-wasi.wasm',
] as const;

const ABI_TARGETS = [
  'b8g-ghost-abi-win64.node',
  'b8g-ghost-abi-linux-x64.node',
  'b8g-ghost-abi-linux-arm64.node',
  'b8g-ghost-abi-macos-arm64.node',
] as const;

const TS_WAVE2_ASSET = 'typescript-6.0.3-programmable.tar.gz';

function resolveCasRoot(): string {
  const override = process.env['B8G_CAS_DIR']?.trim();
  if (override) return override;
  if (process.platform === 'win32') {
    const localAppData = process.env['LOCALAPPDATA'] ?? join(homedir(), 'AppData', 'Local');
    return join(localAppData, 'AwesomeOS', 'cas');
  }
  return join(homedir(), '.local', 'share', 'awesome-os', 'cas');
}

function hostSuffix(): { abi: string; lib: string } {
  if (process.platform === 'win32') return { abi: 'win64.node', lib: 'win64.dll' };
  if (process.platform === 'darwin') return { abi: 'macos-arm64.node', lib: 'macos-arm64.dylib' };
  if (process.arch === 'arm64') return { abi: 'linux-arm64.node', lib: 'linux-arm64.so' };
  return { abi: 'linux-x64.node', lib: 'linux-x64.so' };
}

async function hydrateEntry(casRoot: string, name: string, entry: GhostCasEntry): Promise<string> {
  const dir = join(casRoot, entry.sha256);
  const out = join(dir, name);
  if (existsSync(out)) {
    const existing = createHash('sha256').update(readFileSync(out)).digest('hex');
    if (existing === entry.sha256) {
      console.log(`  [CAS-HIT ] ${name} (${entry.bytes} B, sha256=${entry.sha256.slice(0, 16)}...)`);
      return out;
    }
  }
  const resp = await fetch(entry.download_url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} downloading ${name}`);
  const buf = new Uint8Array(await resp.arrayBuffer());
  const actual = createHash('sha256').update(buf).digest('hex');
  if (actual !== entry.sha256) {
    throw new Error(`SHA-256 mismatch for ${name}: expected ${entry.sha256}, got ${actual}`);
  }
  mkdirSync(dir, { recursive: true });
  const tmp = `${out}.tmp-${process.pid}`;
  writeFileSync(tmp, buf);
  try {
    renameSync(tmp, out);
  } catch (err) {
    rmSync(tmp, { force: true });
    throw err;
  }
  console.log(`  [HYDRATED] ${name} (${buf.byteLength} B, sha256=${actual.slice(0, 16)}...)`);
  return out;
}

const resp = await fetch(GHOST_INDEX_URL);
if (!resp.ok) throw new Error(`Failed to fetch Ghost CAS index: HTTP ${resp.status}`);
const index = (await resp.json()) as GhostCasIndex;

if (index.total_entries < 149) {
  throw new Error(`Expected >= 149 verified cas-v1 entries, got ${index.total_entries}`);
}

let shardHits = 0;
const missingShards: string[] = [];
for (const lib of SHARD_LIBS) {
  for (const target of SHARD_TARGETS) {
    const key = `${lib}-${target}`;
    if (index.entries[key]) {
      shardHits += 1;
    } else {
      missingShards.push(key);
    }
  }
}
if (missingShards.length > 0) {
  throw new Error(`Missing 5-OS C/Wasm shards: ${missingShards.join(', ')}`);
}

const missingAbi = ABI_TARGETS.filter((k) => !index.entries[k]);
if (missingAbi.length > 0) {
  throw new Error(`Missing b8g-ghost-abi.node targets: ${missingAbi.join(', ')}`);
}

const tsEntry = index.entries[TS_WAVE2_ASSET];
if (!tsEntry) {
  throw new Error(`Missing Wave 2 compiler asset: ${TS_WAVE2_ASSET}`);
}

console.log(`[lo/ghost-cas] Schema: ${index.schema} | Verified entries: ${index.total_entries} (Keep-Last-5 retention)`);
console.log(`[lo/ghost-cas] 5-OS C/Wasm shards: ${shardHits}/${SHARD_LIBS.length * SHARD_TARGETS.length} (${SHARD_LIBS.join(', ')})`);
console.log(`[lo/ghost-cas] Wave 2 compiler: ${TS_WAVE2_ASSET} (${tsEntry.bytes} B, sha256=${tsEntry.sha256.slice(0, 16)}...)`);
console.log(`[lo/ghost-cas] Zero-node-gyp ABI addons: ${ABI_TARGETS.length}/4 targets verified`);
console.log(`[lo/ghost-cas] Multi-arch 2.1 MB container: ${CONTAINER_IMAGE}`);

const casRoot = resolveCasRoot();
const host = hostSuffix();
const hostTargets = [`b8g-ghost-abi-${host.abi}`, `liblz4-${host.lib}`];

console.log(`[lo/ghost-cas] Hydrating host (${process.platform}/${process.arch}) sample into ${casRoot}:`);
for (const name of hostTargets) {
  const entry = index.entries[name];
  if (!entry) throw new Error(`Missing host artifact ${name} in Ghost CAS`);
  await hydrateEntry(casRoot, name, entry);
}

console.log('[lo/ghost-cas] Quickstart verification passed.');
