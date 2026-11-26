/**
 * @file ghost-hydrate.mts
 * @description Hydrates shared Awesome-OS libv8_monolith (V8 15.8) + max-version-lock.json
 * native libraries directly into the canonical v11 CAS (`~/.b8g/cas/v11/files/`).
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const MAX_LOCK_URL =
  'https://raw.githubusercontent.com/awesome-os/t2linux-baseline/main/catalog/max-version-lock.json';
const casRoot = process.env['B8G_CAS_DIR']?.trim() || join(homedir(), '.b8g', 'cas', 'v11');
mkdirSync(join(casRoot, 'files'), { recursive: true });
mkdirSync(join(casRoot, 'locks'), { recursive: true });

const res = await fetch(MAX_LOCK_URL);
if (!res.ok) throw new Error(`Failed to fetch max-version-lock.json: HTTP ${res.status}`);
const lockText = await res.text();
const lock = JSON.parse(lockText) as {
  schema: string;
  abiMagic: string;
  summary: { totalLadybirdDeps: number; coveredInV11: number; overlapPercent: number };
  libraries: ReadonlyArray<{ name: string; maxVersion: string; winner: string }>;
};

const lockPath = join(casRoot, 'locks', 'max-version-lock.json');
writeFileSync(lockPath, lockText, 'utf8');

console.log(`[holo-hydrate] Connected to ${lock.schema} (ABI=${lock.abiMagic})`);
console.log(`[holo-hydrate] Shared V8 : awesome-os/libv8_monolith @ V8 15.8`);
console.log(`[holo-hydrate] Shared FFI: awesome-os/holo-ffi (lib/holo V8 fastcall, zero-HTTP Sectium)`);
console.log(`[holo-hydrate] Saved max-version lock (${lock.libraries.length} pinned libs) -> ${lockPath}`);
