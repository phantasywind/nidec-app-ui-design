// Prints the `files` map for the Artifact tool's publish call: every built file under dist/project except the index.
import { readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const out = resolve(import.meta.dirname, '../dist/project');
const files = {};
const walk = (dir) => {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else {
      const rel = `project/${relative(out, full).split('\\').join('/')}`;
      files[rel] = rel.endsWith('.d.ts') ? { from: rel, contentType: 'text/plain' } : rel;
    }
  }
};
walk(out);
console.log(JSON.stringify(files, null, 1));
