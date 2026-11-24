/**
 * @file lib/ts-strip.js
 * @description Zero-dependency, single-pass Erasable TypeScript stripper for awesome-os/lo.
 * Runs `.ts` / `.mts` directly inside lo's V8 runtime at native speed (zero tsc/rollup/webpack),
 * preserving line numbers for clean V8 stack traces.
 */
export function stripErasableTypeScript(source) {
  let out = source;
  // 1. Erase `import type { ... } from '...';` and `export type { ... };`
  out = out.replace(/^\s*(?:import|export)\s+type\s+[^;\n]+;?/gm, (m) => ' '.repeat(m.length));
  // 2. Erase top-level `interface Foo { ... }` and `type Foo = ...;`
  out = out.replace(/^\s*(?:export\s+)?interface\s+[A-Za-z_$][\w$]*(?:<[^>]+>)?(?:\s+extends\s+[^{]+)?\{[^}]*\}/gm, (m) =>
    m.replace(/[^\n]/g, ' ')
  );
  out = out.replace(/^\s*(?:export\s+)?type\s+[A-Za-z_$][\w$]*(?:<[^>]+>)?\s*=\s*[^;\n]+;?/gm, (m) =>
    m.replace(/[^\n]/g, ' ')
  );
  // 3. Erase `readonly ` modifiers and `as Type` assertions
  out = out.replace(/\breadonly\s+/g, '');
  out = out.replace(/\s+as\s+(?:const|[A-Za-z_$][\w$.<>\[\]\s|&]*)/g, '');
  // 4. Erase parameter & variable type annotations `: Type` (excluding ternary `? a : b` and object literals)
  out = out.replace(/(\b(?:const|let|var)\s+[A-Za-z_$][\w$]*)\s*:\s*[^=;\n]+(?==|;|\n)/g, '$1');
  out = out.replace(/(\([^(]*?\))\s*:\s*[A-Za-z_$][\w$.<>\[\]|&\s]*(?=\s*(?:\{|=>))/g, '$1');
  return out;
}
