import { readFile, readdir } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { RELEASE_PACKAGE_VERSION } from './release-contract.mjs';

const repositoryRoot = resolve(import.meta.dirname, '..');
const packagePath = join(repositoryRoot, 'package.json');
const publicEntryPath = join(repositoryRoot, 'src', 'index.ts');
const namespacePath = join(repositoryRoot, 'src', 'internal', 'namespace.ts');
const distPath = join(repositoryRoot, 'dist');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function readJson(path) {
  return JSON.parse(await readFile(path, 'utf8'));
}

async function listFiles(path) {
  const files = [];

  try {
    const entries = await readdir(path, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = join(path, entry.name);

      if (entry.isDirectory()) {
        files.push(...await listFiles(entryPath));
      } else if (entry.isFile()) {
        files.push(entryPath);
      } else {
        throw new Error(`Unsupported filesystem entry: ${entryPath}`);
      }
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      throw error;
    }
  }

  return files;
}

function isExactVersion(value) {
  return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(value);
}

const packageJson = await readJson(packagePath);

assert(packageJson.name === '@phantasywind/nidec-app-ui-design', 'Unexpected package name.');
assert(packageJson.version === RELEASE_PACKAGE_VERSION, 'Unexpected release-candidate version.');
assert(packageJson.private === false, 'Release candidate must be explicitly publishable.');
assert(packageJson.type === 'module', 'Package must remain ESM.');
assert(packageJson.packageManager === 'npm@11.19.0', 'Unexpected package manager.');
assert(packageJson.engines?.node === '>=22.12.0', 'Unexpected consumer Node engine floor.');
assert(JSON.stringify(packageJson.files) === JSON.stringify(['dist']), 'Package files allowlist must contain only dist.');
assert(JSON.stringify(packageJson.sideEffects) === JSON.stringify(['./dist/styles.css', './dist/tokens.css']), 'Only explicit CSS exports may have side effects.');
assert(packageJson.types === './dist/index.d.ts', 'Unexpected declaration entry.');
assert(packageJson.module === './dist/index.js', 'Unexpected ESM entry.');
assert(
  JSON.stringify(packageJson.exports) === JSON.stringify({
    '.': {
      types: './dist/index.d.ts',
      import: './dist/index.js',
    },
    './tokens.css': {
      types: './dist/tokens.css.d.ts',
      default: './dist/tokens.css',
    },
    './styles.css': {
      types: './dist/styles.css.d.ts',
      default: './dist/styles.css',
    },
    './tokens.json': './dist/tokens.json',
  }),
  'Only the approved Stage 3D public subpaths are allowed.',
);
assert(packageJson.dependencies === undefined, 'Runtime foundations must remain external optional peers.');
assert(packageJson.publishConfig?.registry === 'https://npm.pkg.github.com' && packageJson.publishConfig?.access === 'restricted', 'GitHub Packages publish configuration required.');
assert(packageJson.peerDependencies?.['@fluentui/react-components'] === '9.74.7', 'Exact Fluent peer required.');
assert(packageJson.peerDependenciesMeta?.['@fluentui/react-components']?.optional === true, 'Fluent must remain optional for token-only consumers.');
assert(packageJson.devDependencies?.['@fluentui/react-components'] === '9.74.7', 'Exact Fluent development dependency required.');
assert(packageJson.peerDependencies?.react === '>=19.2.0 <20', 'Unexpected React peer range.');
assert(packageJson.peerDependencies?.['react-dom'] === '>=19.2.0 <20', 'Unexpected React DOM peer range.');
assert(packageJson.peerDependenciesMeta?.react?.optional === true, 'React peer must remain optional for token-only consumers.');
assert(packageJson.peerDependenciesMeta?.['react-dom']?.optional === true, 'React DOM peer must remain optional for token-only consumers.');

for (const [name, version] of Object.entries(packageJson.devDependencies ?? {})) {
  assert(isExactVersion(version), `Development dependency must use an exact version: ${name}=${version}`);
}

const publicEntry = await readFile(publicEntryPath, 'utf8');
assert(publicEntry.includes('export function Button(') && publicEntry.includes('export type ButtonProps ='), 'Approved Button contract required.');

const namespaceSource = await readFile(namespacePath, 'utf8');
for (const requiredValue of [
  "hostAttribute: 'data-nidec-ui'",
  "hostSelector: '[data-nidec-ui]'",
  "cssVariablePrefix: '--nidec-ui-'",
  "cssClassPrefix: 'nidec-ui-'",
  "cascadeLayer: 'nidec-ui'",
]) {
  assert(namespaceSource.includes(requiredValue), `Missing namespace contract: ${requiredValue}`);
}

const sourceFiles = await listFiles(join(repositoryRoot, 'src'));
const publicSourceFiles = sourceFiles.filter((path) => !path.includes(`${sep}internal${sep}`));
const publicSourcePaths = publicSourceFiles.map((path) => relative(repositoryRoot, path).replaceAll('\\', '/'));
assert(
  JSON.stringify(publicSourcePaths) === JSON.stringify(['src/index.ts']),
  'The governed Fluent surface may expose only src/index.ts outside the internal directory.',
);

const forbiddenBusinessTerms = /\b(cpq|epm|quote|pricing|bom|configuration|approval|rbac)\b/i;
for (const sourcePath of sourceFiles.filter((path) => ['.ts', '.tsx'].includes(extname(path)))) {
  const source = await readFile(sourcePath, 'utf8');
  assert(!forbiddenBusinessTerms.test(source), `Application business term found in ${relative(repositoryRoot, sourcePath)}.`);
}

const distFiles = (await listFiles(distPath)).map((path) => relative(distPath, path).replaceAll('\\', '/')).sort();
if (distFiles.length > 0) {
  const allowedDistFiles = [
    'index.d.ts',
    'index.js',
    'styles.css',
    'styles.css.d.ts',
    'tokens.css',
    'tokens.css.d.ts',
    'tokens.json',
  ];
  assert(JSON.stringify(distFiles) === JSON.stringify(allowedDistFiles), `Unexpected dist files: ${distFiles.join(', ')}`);

  const builtJavaScript = await readFile(join(distPath, 'index.js'), 'utf8');
  assert(/from\s+['"]react['"]/.test(builtJavaScript), 'Button must import React as an external peer.');
  assert(/from\s+['"]@fluentui\/react-components['"]/.test(builtJavaScript), 'Fluent must remain an external peer.');
  assert(!/react\.production|react\.development|__CLIENT_INTERNALS/.test(builtJavaScript), 'React implementation must not be bundled.');
  const runtimeExports = await import(pathToFileURL(join(distPath, 'index.js')).href);
  const approvedExports = ['Button', 'NidecProvider', 'nidecLightTheme', 'Input', 'Field', 'Dialog', 'DialogTrigger', 'DialogSurface', 'DialogBody', 'DialogTitle', 'DialogContent', 'DialogActions', 'Textarea', 'Select', 'Checkbox', 'RadioGroup', 'Radio', 'Switch',
    'OverlayDrawer', 'DrawerHeader', 'DrawerHeaderTitle', 'DrawerBody', 'DrawerFooter',
    'MessageBar', 'MessageBarBody', 'MessageBarTitle', 'MessageBarActions',
    'Text', 'Body1', 'Caption1', 'Subtitle2', 'Spinner', 'IconButton',
    'Tooltip', 'Link', 'TabList', 'Tab', 'Menu', 'MenuTrigger', 'MenuPopover', 'MenuList', 'MenuItem', 'MenuDivider',
    'Combobox', 'Option', 'OptionGroup',
    'Table', 'TableHeader', 'TableBody', 'TableRow', 'TableHeaderCell', 'TableCell',
    'TableCellLayout', 'TableSelectionCell', 'TableCellActions',
    'DataGrid', 'DataGridHeader', 'DataGridBody', 'DataGridRow', 'DataGridHeaderCell', 'DataGridCell',
    'Card', 'CardHeader', 'CardPreview', 'CardFooter',
    'Badge', 'CounterBadge', 'PresenceBadge', 'Skeleton', 'SkeletonItem', 'ProgressBar',
    'Breadcrumb', 'BreadcrumbItem', 'BreadcrumbDivider', 'BreadcrumbButton',
    'Toolbar', 'ToolbarButton', 'ToolbarDivider', 'ToolbarGroup',
    'Nav', 'NavItem', 'NavCategory', 'NavCategoryItem', 'NavSubItem', 'NavSubItemGroup',
    'NavDrawer', 'NavDrawerHeader', 'NavDrawerBody', 'NavDrawerFooter', 'NavDivider',
    'AppItem', 'AppItemStatic', 'Hamburger',
    'Tree', 'TreeItem', 'TreeItemLayout',
    'Accordion', 'AccordionItem', 'AccordionHeader', 'AccordionPanel',
    'CollectionList', 'CollectionListItem', 'CardGallery', 'CardGalleryItem', 'ProcessStageIndicator', 'StageNavigator', 'BusinessProcessFlow',
    'RecordIdentityCellLayout', 'RecordTableHeader', 'RecordDataGridHeader', 'TableActionIconButton',
    'RecordSelectionRegion', 'RecordSelectionDataGrid', 'RecordSelectionDataGridRow',
    'SearchBox', 'SpinButton', 'Slider',
    'ToggleButton', 'MenuButton', 'SplitButton',
    'Label', 'InfoLabel', 'Divider',
    'Avatar', 'AvatarGroup', 'AvatarGroupItem', 'AvatarGroupPopover', 'Persona',
    'Tag', 'TagGroup', 'Popover', 'PopoverTrigger', 'PopoverSurface'].sort();
  assert(JSON.stringify(Object.keys(runtimeExports).sort()) === JSON.stringify(approvedExports), 'Only the explicitly listed governed runtime exports are allowed.');

  const declaration = await readFile(join(distPath, 'index.d.ts'), 'utf8');
  assert(declaration.includes('ButtonProps') && declaration.includes('function Button('), 'Button declaration is required.');
}

console.log(`Boundary contract verified${distFiles.length > 0 ? ` for ${distFiles.length} build files` : ' before build'}.`);
