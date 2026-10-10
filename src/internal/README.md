# Internal source

Files below this directory are repository implementation details. They are not public package exports and must not be imported by consumers.

The namespace contract is fixed by the approved Stage 3 proposal. It contains no brand value, component API, or adopting-application behavior.

`components/` holds the implementation of the root entry, one module per governed component family. `src/index.ts` remains the complete, explicit list of public exports. The build bundles the root entry's declarations into a single `dist/index.d.ts` (`scripts/bundle-declarations.mjs`), so these module paths never appear in the package.
