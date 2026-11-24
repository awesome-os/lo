/**
 * @file ghost-hydrate.mts
 * @description Hydrates dynamic shared V8 (replacing legacy 250MB libv8_monolith.a)
 * + native component libraries (libbrotli, libsqlite3, libexpat, libwebp) directly
 * from canonical O(1) Ghost CAS (`awesome-os/b8g-ghost @ cas-v1`).
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const GHOST_INDEX_URL = 'https://raw.githubusercontent.com/awesome-os/b8g-ghost/main/manifests/index.json';
const casRoot =
  process.env['B8G_CAS_DIR']?.trim() ||
  (process.platform === 'win32'
    ? join(process.env['LOCALAPPDATA'] ?? join(homedir(), 'AppData', 'Local'), 'AwesomeOS', 'cas')
    : join(homedir(), '.local', 'share', 'awesome-os', 'cas'));

const idx = (await (await fetch(GHOST_INDEX_URL)).json()) as {
  schema: string;
  total_entries: number;
  entries: Record<string, { filename: string; sha256: string; bytes: number; download_url: string }>;
};

const isWin = process.platform === 'win32';
const deps = isWin
  ? ['v8-shared-win64.zip', 'typescript-6.0.3-programmable.tar.gz', 'libbrotli-win64.dll', 'libsqlite3-win64.dll', 'libexpat-win64.dll']
  : ['v8-shared-linux-x64.tar.gz', 'typescript-6.0.3-programmable.tar.gz', 'libbrotli-linux-x64.so', 'libsqlite3-linux-x64.so', 'libexpat-linux-x64.so'];

console.log(`[ghost-hydrate] Connected to ${idx.schema} (${idx.total_entries} canonical cas-v1 assets)`);

for (const name of deps) {
  const e = idx.entries[name];
  if (!e) throw new Error(`Missing "${name}" in canonical Ghost CAS index`);
  const dir = join(casRoot, e.sha256);
  const out = join(dir, name);
  if (existsSync(out) && createHash('sha256').update(readFileSync(out)).digest('hex') === e.sha256) {
    console.log(`  [CAS-HIT ] ${name} (${e.bytes} B, sha256=${e.sha256.slice(0, 16)}...)`);
    continue;
  }
  const buf = new Uint8Array(await (await fetch(e.download_url)).arrayBuffer());
  const actual = createHash('sha256').update(buf).digest('hex');
  if (actual !== e.sha256) throw new Error(`SHA-256 mismatch for ${name}`);
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
}
console.log('[ghost-hydrate] All dynamic V8 + native components verified in Machine CAS (0 static monoliths).');
