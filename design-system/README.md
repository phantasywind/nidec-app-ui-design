# Claude Design System build

This directory builds the Claude Design System artifact for `@phantasywind/nidec-app-ui-design` from this repository's own source. It is not part of the npm package (`package.json` `files` is `dist` only), is not published, and is not scanned by the repository's type, colour or boundary checks. It has its own `package.json` so the package's dependency contract is unchanged.

## What it produces

`npm run build` writes `dist/project/`, the files of the artifact:

- `tokens.json`: colours resolved from `src/internal/light-palette.mjs` through `content/tokens.template.json`, so no colour is retyped here. The build fails if a contrast pair listed under `checks` drops below its minimum.
- `README.md`, `page-selection.md`, `assets/Logos/README.md`, `components/<Name>/README.md`: the guidance, from `content/`.
- `components/bundle.js`, `bundle.css`, `index.d.ts`: the real components from `src/`, bundled with React, plus `styles/styles.css` and the type declarations.
- `components/<Name>/preview.html`: one live preview per component, compiled from `previews/<Name>.jsx`. `previews/Cover.html` is the static cover.

The index (`project/design-system.json`) and the logo images live in the artifact, not here. The logo PNGs are brand assets whose approval is still open (ADR-0006); `config.json` only records the id of the logo the cover shows.

## Commands

Run `npm ci` in the repository root and in this directory first.

```
npm run build     # dist/project
npm run verify    # render every preview in Chromium; screenshots in dist/screens
npm run files     # print the `files` map for the Artifact tool's publish call
```

`verify` needs a Chromium. Set `DS_CHROMIUM_PATH` to its executable if Playwright cannot find one. The cover's logo is an artifact URL that does not exist locally; its load error is expected and ignored.

## Publishing to the artifact

Only Claude, acting for Locke, publishes the artifact; it is private until Locke shares it.

1. Run `npm run build` and `npm run verify`.
2. Read the artifact's current `project/design-system.json` and `project/README.md` (people edit them on the page, and the page appends a generated section to the README).
3. Publish with the Artifact tool: `root` is `design-system/dist`, `file_path` is the index you just read (edit only `lastChange`), and `files` is the output of `npm run files`, leaving out the README if only previews changed. Keep the index's assets and logo records as read.
4. After a component is removed from `content/components`, publish `null` for its `README.md` and `preview.html`.

## Changing it

- A guideline page: edit `content/components/<Name>/README.md`. First sentence is the summary the page shows.
- A preview: edit `previews/<Name>.jsx`. The first line is `// @card group="..." height=N subtitle="..."`, optionally `width=N`. It defines `Demo`, uses components from the bundle by name and `Icons.<Name>` for icons, and uses sample data that carries no business meaning.
- A new component: add `content/components/<Name>/README.md` and `previews/<Name>.jsx`. Page layouts and other compositions do not get a component page; describe them in `content/page-selection.md`.
- Colours or spacing: change the governed source (ADR-0006) or `content/tokens.template.json`, never a literal in a preview.
- Usage notes quote contrast ratios by hand. Update them when the palette changes.
