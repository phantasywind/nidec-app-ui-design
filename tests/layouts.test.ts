import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import * as layouts from '../src/layouts';

describe('page layout public boundary', () => {
  it('exports only the approved layout capabilities', () => {
    expect(Object.keys(layouts).sort()).toEqual([
      'ApplicationFrame', 'ApplicationNavigation', 'ApplicationNavigationGroup', 'ApplicationNavigationItem',
      'ApplicationTopBar', 'AuthenticationLayout', 'DirectoryWorkspace', 'VersionedWorkspaceLayout',
    ].sort());
  });

  it('renders a labelled application shell with current navigation', () => {
    const navigation = createElement(layouts.ApplicationNavigation, {
      'aria-label': 'Primary',
      children: createElement(layouts.ApplicationNavigationGroup, {
        label: 'Work',
        children: createElement(layouts.ApplicationNavigationItem, { current: true, href: '/records', label: 'Records' }),
      }),
    });
    const html = renderToStaticMarkup(createElement(layouts.ApplicationFrame, {
      'aria-label': 'Example application', brand: 'Brand', topBar: createElement(layouts.ApplicationTopBar, { location: 'Records' }),
      navigation, navigationOpen: false, navigationToggleIcon: createElement('span', {}, 'Menu'),
      navigationToggleLabel: 'Open navigation', navigationCloseLabel: 'Close navigation',
      onNavigationOpenChange: () => undefined, children: createElement('h1', {}, 'Records'),
    }));
    expect(html).toContain('nidec-ui-application-frame');
    expect(html).toContain('role="application"');
    expect(html).toContain('aria-current="page"');
    expect(html.match(/<h1/g)).toHaveLength(1);
  });

  it('keeps directory regions in governed order', () => {
    const html = renderToStaticMarkup(createElement(layouts.DirectoryWorkspace, {
      'aria-label': 'Records', header: 'Header', scope: 'Scope', toolbar: 'Toolbar', results: 'Results',
      resultsLabel: 'Record results', pagination: 'Pagination', details: 'Details',
    }));
    expect(html.indexOf('Header')).toBeLessThan(html.indexOf('Scope'));
    expect(html.indexOf('Scope')).toBeLessThan(html.indexOf('Toolbar'));
    expect(html.indexOf('Toolbar')).toBeLessThan(html.indexOf('Results'));
    expect(html.indexOf('Results')).toBeLessThan(html.indexOf('Pagination'));
    expect(html.indexOf('Pagination')).toBeLessThan(html.indexOf('Details'));
  });

  it('renders one authentication title and explicit version workspace regions', () => {
    const auth = renderToStaticMarkup(createElement(layouts.AuthenticationLayout, {
      'aria-label': 'Sign in', title: 'Sign in', description: 'Description', form: createElement('form'),
    }));
    const versioned = renderToStaticMarkup(createElement(layouts.VersionedWorkspaceLayout, {
      'aria-label': 'Versioned object', identity: 'Identity', governance: 'Governance', content: 'Content', history: 'History',
    }));
    expect(auth.match(/<h1/g)).toHaveLength(1);
    expect(versioned).toContain('nidec-ui-versioned-workspace__identity');
    expect(versioned).toContain('aria-label="Versioned object history"');
  });
});
