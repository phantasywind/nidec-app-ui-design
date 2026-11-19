import { useEffect, useMemo, useState } from 'react';
import {
  BookRegular,
  ColorRegular,
  CubeRegular,
  DocumentToolboxRegular,
  HomeRegular,
  LayoutRowTwoRegular,
  NavigationRegular,
  TableRegular,
} from '@fluentui/react-icons';
import {
  Badge,
  Link,
  NidecProvider,
  PageHeader,
  SearchBox,
  WorkspaceSection,
  WorkspaceStack,
  nidecLightTheme,
} from '@phantasywind/nidec-app-ui-design';
import {
  ApplicationFrame,
  ApplicationNavigation,
  ApplicationNavigationGroup,
  ApplicationNavigationItem,
  ApplicationTopBar,
} from '@phantasywind/nidec-app-ui-design/layouts';
import {
  ALL_NAV_ITEMS,
  COMPONENT_PAGES,
  EXAMPLE_PAGES,
  NAV_GROUPS,
  type ComponentSpecPage,
  type ExampleSpecPage,
  type NavGroupId,
} from './data/catalog';
import { PACKAGE_NAME, PACKAGE_VERSION, REPO_URL } from './data/metadata';
import {
  GuidelinesSection,
  ImportBar,
  Playground,
  PropsSection,
} from './components/DocPrimitives';
import {
  ArchetypesPage,
  InstallUsagePage,
  OverviewPage,
  TokensPage,
} from './pages/FoundationsPages';

function parseHashRoute(): string {
  const raw = window.location.hash.replace(/^#\/?/, '').trim();
  if (!raw) return '';
  const match = ALL_NAV_ITEMS.find((item) => item.route === raw);
  return match ? match.route : '';
}

function iconForGroup(group: NavGroupId, route: string) {
  if (route === '') return <HomeRegular />;
  if (route === 'install') return <BookRegular />;
  if (route === 'tokens') return <ColorRegular />;
  if (route === 'archetypes') return <LayoutRowTwoRegular />;
  if (group === 'Tables & Grids') return <TableRegular />;
  if (group === 'Workspace Examples') return <DocumentToolboxRegular />;
  return <CubeRegular />;
}

function ComponentPageView({ spec }: { spec: ComponentSpecPage }) {
  const Demo = spec.Demo;
  return (
    <div className="site-page">
      <PageHeader
        eyebrow={spec.group}
        title={spec.title}
        description={spec.subtitle}
      />
      <ImportBar subpath={spec.subpath} symbols={spec.symbols} />
      <WorkspaceStack>
        <Playground
          title="Live interactive playground"
          description="Real compiled package components rendered inside NidecProvider with nidecLightTheme."
          code={spec.code}
          canvasBackground={spec.canvasBackground}
        >
          <Demo />
        </Playground>
        <GuidelinesSection
          dos={spec.dos}
          donts={spec.donts}
          ownership={spec.ownership}
        />
        <PropsSection propsList={spec.propsList} />
      </WorkspaceStack>
    </div>
  );
}

function ExamplePageView({ spec }: { spec: ExampleSpecPage }) {
  const Demo = spec.Demo;
  return (
    <div className="site-page site-page--wide">
      <PageHeader
        eyebrow="Workspace Example"
        title={spec.title}
        description={spec.subtitle}
      />
      <ImportBar subpath={spec.subpath} symbols={spec.symbols} />
      <WorkspaceStack>
        <WorkspaceSection title="Key archetype rules">
          <ul className="site-bullet-list">
            {spec.summaryPoints.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </WorkspaceSection>
        <Playground
          title="Interactive workspace preview"
          description="Synthetic local state only. Use the width switcher to verify responsive reflow at 900px and 640px."
          canvasBackground
        >
          <Demo />
        </Playground>
      </WorkspaceStack>
    </div>
  );
}

export function App() {
  const [route, setRoute] = useState<string>(() => parseHashRoute());
  const [navOpen, setNavOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onHashChange = () => {
      setRoute(parseHashRoute());
      setNavOpen(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (nextRoute: string) => {
    const targetHash = nextRoute ? `#/${nextRoute}` : '#/';
    if (window.location.hash !== targetHash) {
      window.location.hash = targetHash;
    } else {
      setRoute(nextRoute);
      setNavOpen(false);
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const activeNav = useMemo(
    () => ALL_NAV_ITEMS.find((item) => item.route === route) ?? ALL_NAV_ITEMS[0]!,
    [route],
  );

  const activeIndex = ALL_NAV_ITEMS.findIndex((item) => item.route === activeNav.route);
  const prevItem = activeIndex > 0 ? ALL_NAV_ITEMS[activeIndex - 1] : undefined;
  const nextItem = activeIndex >= 0 && activeIndex < ALL_NAV_ITEMS.length - 1 ? ALL_NAV_ITEMS[activeIndex + 1] : undefined;

  const query = search.trim().toLowerCase();
  const filteredByGroup = useMemo(() => {
    return NAV_GROUPS.map((group) => ({
      group,
      items: ALL_NAV_ITEMS.filter(
        (item) =>
          item.group === group &&
          (!query || item.keywords.toLowerCase().includes(query) || item.group.toLowerCase().includes(query)),
      ),
    })).filter((entry) => entry.items.length > 0);
  }, [query]);

  const componentSpec = COMPONENT_PAGES.find((p) => p.route === route);
  const exampleSpec = EXAMPLE_PAGES.find((p) => p.route === route);

  const renderMainContent = () => {
    if (route === '') return <OverviewPage onNavigate={navigate} />;
    if (route === 'install') return <InstallUsagePage />;
    if (route === 'tokens') return <TokensPage />;
    if (route === 'archetypes') return <ArchetypesPage onNavigate={navigate} />;
    if (componentSpec) return <ComponentPageView key={componentSpec.route} spec={componentSpec} />;
    if (exampleSpec) return <ExamplePageView key={exampleSpec.route} spec={exampleSpec} />;
    return <OverviewPage onNavigate={navigate} />;
  };

  const navigation = (
    <ApplicationNavigation
      aria-label="Design system sections"
      footer={
        <div className="site-nav-footer">
          <div className="site-nav-footer__row">
            <strong>{PACKAGE_NAME.split('/')[1]}</strong>
            <Badge appearance="tint" color="brand">
              v{PACKAGE_VERSION}
            </Badge>
          </div>
          <Link inline href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub repository
          </Link>
        </div>
      }
    >
      <div className="site-nav-search">
        <SearchBox
          aria-label="Search components and guides"
          placeholder="Search components..."
          size="small"
          value={search}
          onChange={(_, d) => setSearch(d.value)}
        />
      </div>
      {filteredByGroup.length === 0 ? (
        <p className="site-nav-empty">No matching components or guides.</p>
      ) : (
        filteredByGroup.map(({ group, items }) => (
          <ApplicationNavigationGroup key={group} label={group}>
            {items.map((item) => (
              <ApplicationNavigationItem
                key={item.route || 'overview'}
                href={item.route ? `#/${item.route}` : '#/'}
                label={item.title}
                icon={iconForGroup(item.group, item.route)}
                current={item.route === activeNav.route}
                onClick={(event) => {
                  event.preventDefault();
                  navigate(item.route);
                }}
              />
            ))}
          </ApplicationNavigationGroup>
        ))
      )}
    </ApplicationNavigation>
  );

  return (
    <NidecProvider theme={nidecLightTheme}>
      <ApplicationFrame
        className="site-shell"
        aria-label="Nidec Engineering Design System documentation"
        brand={
          <a
            className="site-brand"
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate('');
            }}
          >
            <span className="site-brand__mark" aria-hidden="true">
              N
            </span>
            <span className="site-brand__text">
              <span className="site-brand__title">Nidec UI Design</span>
              <span className="site-brand__subtitle">Spec &amp; Live Preview</span>
            </span>
          </a>
        }
        compactBrand={
          <span className="site-brand__mark" aria-hidden="true">
            N
          </span>
        }
        navigationOpen={navOpen}
        navigationToggleIcon={<NavigationRegular />}
        navigationToggleLabel="Open navigation menu"
        navigationCloseLabel="Close navigation menu"
        onNavigationOpenChange={setNavOpen}
        navigation={navigation}
        topBar={
          <ApplicationTopBar
            location={
              <div className="site-topbar-location">
                <span className="site-topbar-location__group">{activeNav.group}</span>
                <span className="site-topbar-location__group" aria-hidden="true">/</span>
                <span className="site-topbar-location__current">{activeNav.title}</span>
              </div>
            }
            utilities={
              <div className="site-topbar-utilities">
                <Badge appearance="tint" color="brand">
                  v{PACKAGE_VERSION}
                </Badge>
                <Link
                  inline
                  href="#/install"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('install');
                  }}
                >
                  Install
                </Link>
                <Link
                  inline
                  className="site-topbar-release"
                  href={`${REPO_URL}/releases/tag/v${PACKAGE_VERSION}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Release
                </Link>
              </div>
            }
          />
        }
      >
        <div className="site-main-content">
          {renderMainContent()}
          <nav className="site-pager site-page" aria-label="Previous and next pages">
            {prevItem ? (
              <a
                className="site-pager__link"
                href={prevItem.route ? `#/${prevItem.route}` : '#/'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(prevItem.route);
                }}
              >
                <span className="site-pager__dir">← Previous</span>
                <span className="site-pager__title">{prevItem.title}</span>
              </a>
            ) : (
              <span />
            )}
            {nextItem && (
              <a
                className="site-pager__link site-pager__link--next"
                href={nextItem.route ? `#/${nextItem.route}` : '#/'}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(nextItem.route);
                }}
              >
                <span className="site-pager__dir">Next →</span>
                <span className="site-pager__title">{nextItem.title}</span>
              </a>
            )}
          </nav>
        </div>
      </ApplicationFrame>
    </NidecProvider>
  );
}
