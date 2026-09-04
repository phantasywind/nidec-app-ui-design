# Button functional prototype — implementation record

- Date: 2026-09-04
- Entry commit: `fe83ee68f33333278ced3e716365f1fa114ae498`; clean at entry.
- Authorization: Locke explicitly agreed to the Button-only prototype proposal.
- Status: Implemented; core contract, local package consumption and bounded browser interaction checks passed. Full component qualification/acceptance remains pending.

## Implemented scope

The root API now exports only runtime `Button` and compile-time `ButtonProps`. The component renders a native HTML button, defaults to `type="button"`, preserves explicit `submit`/`reset`, native disabled behavior, applicable native attributes, caller handler/ref and composed CSS classes. Its typed contract requires a string child and excludes HTML injection and links.

React remains an external optional peer; token/style-only consumers need not install it. The component does not own permissions, eligibility, validation, async behavior or business state. TextInput/Field, icons, loading behavior, routing and semantic visual variants were not implemented.

The browser's native appearance and focus outline are retained. No custom Button CSS or brand value was added; existing non-brand fixture tokens and empty component-style layer remain. This deliberate functional prototype is not the finished visual design. Applications must provide meaningful labels and must not override native semantics with inappropriate supplied attributes.

The existing React consumer fixture is the isolated demo harness: it exposes click/submit/disabled counters. Form state and its event handlers live only in that fixture, not in the shared package.

## Verification

Portable Node `24.20.0` / npm `11.19.0` was used; no dependencies or global tool configuration changed.

- `npm run verify` passed lint, typecheck, library build, CSS checks, 6 test files / 32 tests, and public-boundary checks.
- Five new tests cover default type/text escaping, explicit submit/reset, disabled/native accessibility attributes, class composition and handler/ref forwarding. Typecheck includes negative cases for missing text, HTML injection and link props. These are native-contract/SSR checks, not a full automated accessibility audit.
- Exact runtime root exports are checked against `['Button']`; declarations contain the Button contract; React is externally imported and the build contains no detected React implementation markers. Existing private metadata/subpaths and source-business-boundary checks remain.
- The actual 9-file local tarball was inspected and consumed by both isolated fixtures. Both clean reinstall/typecheck/build paths passed; installed package inventory, hash binding, physical React resolution, token-only absence of React and static GitHub-reference checks passed. Temporary consumer installs were removed.
- Same-tree rollback matched baseline `184d73b` across 7 files and restored 70 source files at test time. The real worktree was not rolled back.
- Publication guard returned expected exit `1` for private/fixture data. No publish was attempted.

The initial pack attempt hit sandbox npm-cache `EPERM`; a scoped elevated retry passed. The first consumer run waited on automatic npm audit and was interrupted. It was rerun with process-only `npm_config_audit=false`; the complete functional regression then passed. No global npm setting changed, and no security-audit pass is claimed.

## Browser interaction evidence

A separate temporary fixture installed the actual `.tgz` and built using the CPQ-shaped React/Vite dependencies. A loopback preview and a new controlled Edge tab exercised the generated output:

| Action / observation | Result |
| --- | --- |
| Initial accessible tree | Three named native buttons; disabled button identified as disabled |
| Pointer click on default button | Clicks 1, submits 0 |
| Enter and Space on default button | Clicks 3, submits 0 |
| Tab from default button | Focus moved to explicit submit, skipping disabled button |
| Enter on explicit submit | Clicks 3, submits 1 |
| Pointer click on disabled button | Counters unchanged; disabled clicks 0 |
| Focus appearance | Visible native outline; computed outline style `auto` |
| Captured warnings/errors | None returned |

The browser showed native `button` types for normal/disabled controls and `submit` for the explicit submit control. These are bounded interactive observations, not an approved cross-browser/viewport matrix, automated WCAG audit or independent application acceptance. Explicit reset was tested at markup/type-contract level, not with a live reset form.

## Artifact and retention

Archive SHA-256: `fe21b63b79b4a757fc1d7c8a37ed3245379d3ca5018260191a85f1220966585e`.

Source `src/index.ts` SHA-256 at implementation: `208d88452abacc0f5793d101450b47931060f1173cd65c7afb89d05e548fe4fb`.

Local retained material: `.qualification/runs/button-prototype-fe83ee6/` contains the tarball, pack/consumer records and built browser demo. This is a dirty-worktree prototype artifact, not a new clean-commit Stage 4 qualification. Its development version must never be published or reused as a release identity. Historical Stage 4 evidence stays tied to the earlier empty-API scaffold; it does not qualify these new bytes.

The manual browser demo used an absolute local artifact reference and temporary lock; it is supplementary interaction evidence, not a frozen portable replay. Existing Stage 3 consumer checks likewise do not replace future candidate qualification.

The created browser tab and preview process were closed. `.tmp/button-browser` and the consumer temporary installations were removed; retained outputs allow inspection without keeping installs. No application repository was changed.

## Outstanding gates and next step

Review/commit the prototype, then define and execute the remaining component qualification slice before adding further components: approved browser/viewport environment, automated accessibility/interaction coverage, and clean committed artifact verification including any renewed Node 22 checks. This turn did not rerun Node 22 or the CSP probe for the new Button bytes. Keep these absent results explicit.

Brand authority and production token values remain `Business Rule Pending`. No branded visual acceptance, publication, CPQ/EPM integration or Production authorization follows from the functional checks.

Rollback is a targeted revert of this Button source/export, fixture and test/boundary changes to the previous empty API. Preserve unrelated changes and all historical evidence; do not reset the repository or remove evidence directories.
