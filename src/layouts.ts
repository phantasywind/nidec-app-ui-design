import { createElement, useEffect, useRef } from 'react';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { Button as FluentButton, mergeClasses } from '@fluentui/react-components';

const withClass = (base: string, className?: string) => className ? `${base} ${className}` : base;

export type ApplicationFrameProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  'aria-label': string;
  brand: ReactNode;
  compactBrand?: ReactNode;
  topBar: ReactNode;
  navigation: ReactNode;
  children: ReactNode;
  navigationOpen: boolean;
  navigationToggleIcon: ReactElement;
  navigationToggleLabel: string;
  navigationCloseLabel: string;
  onNavigationOpenChange: (open: boolean) => void;
};

/** Visual application frame only; routes, permissions, identity and navigation data stay consumer-owned. */
export function ApplicationFrame({
  'aria-label': ariaLabel,
  brand,
  compactBrand,
  topBar,
  navigation,
  children,
  navigationOpen,
  navigationToggleIcon,
  navigationToggleLabel,
  navigationCloseLabel,
  onNavigationOpenChange,
  className,
  role = 'application',
  ...props
}: ApplicationFrameProps) {
  if (!ariaLabel.trim()) throw new Error('ApplicationFrame requires a non-empty aria-label.');
  if (!navigationToggleLabel.trim() || !navigationCloseLabel.trim()) {
    throw new Error('ApplicationFrame requires non-empty navigation control labels.');
  }
  const navigationRef = useRef<HTMLElement | null>(null);
  const priorFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (navigationOpen && !wasOpenRef.current) {
      priorFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      navigationRef.current?.focus();
    } else if (!navigationOpen && wasOpenRef.current) {
      priorFocusRef.current?.focus();
      priorFocusRef.current = null;
    }
    wasOpenRef.current = navigationOpen;
  }, [navigationOpen]);

  useEffect(() => {
    if (!navigationOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') onNavigationOpenChange(false);
    };
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [navigationOpen, onNavigationOpenChange]);

  return createElement('div', {
    ...props,
    'aria-label': ariaLabel,
    className: withClass(`nidec-ui-application-frame${navigationOpen ? ' nidec-ui-application-frame--navigation-open' : ''}`, className),
    role,
  },
  createElement('header', { className: 'nidec-ui-application-frame__topbar' },
    createElement('span', { className: 'nidec-ui-application-frame__navigation-toggle' },
      createElement(FluentButton, {
        'aria-expanded': navigationOpen,
        'aria-label': navigationToggleLabel,
        appearance: 'subtle',
        icon: navigationToggleIcon,
        onClick: () => onNavigationOpenChange(!navigationOpen),
        size: 'medium',
      })),
    topBar),
  createElement('aside', {
    'aria-label': `${ariaLabel} navigation`,
    className: 'nidec-ui-application-frame__navigation',
    ref: navigationRef,
    tabIndex: -1,
  }, createElement('div', { className: 'nidec-ui-application-frame__brand' },
    createElement('div', { className: 'nidec-ui-application-frame__brand-full' }, brand),
    compactBrand === undefined ? null : createElement('div', { className: 'nidec-ui-application-frame__brand-compact' }, compactBrand)), navigation),
  createElement('button', {
    'aria-label': navigationCloseLabel,
    className: 'nidec-ui-application-frame__backdrop',
    onClick: () => onNavigationOpenChange(false),
    tabIndex: navigationOpen ? 0 : -1,
    type: 'button',
  }),
  createElement('main', { className: 'nidec-ui-application-frame__content' }, children));
}

export type ApplicationTopBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  location: ReactNode;
  utilities?: ReactNode;
};

export function ApplicationTopBar({ location, utilities, className, ...props }: ApplicationTopBarProps) {
  return createElement('div', { ...props, className: withClass('nidec-ui-application-topbar', className) },
    createElement('div', { className: 'nidec-ui-application-topbar__location' }, location),
    utilities === undefined ? null : createElement('div', { className: 'nidec-ui-application-topbar__utilities' }, utilities));
}

export type ApplicationNavigationProps = Omit<ComponentPropsWithoutRef<'nav'>, 'children'> & {
  'aria-label': string;
  children: ReactNode;
};

export function ApplicationNavigation({ 'aria-label': ariaLabel, children, className, ...props }: ApplicationNavigationProps) {
  if (!ariaLabel.trim()) throw new Error('ApplicationNavigation requires a non-empty aria-label.');
  return createElement('nav', { ...props, 'aria-label': ariaLabel, className: withClass('nidec-ui-application-navigation', className) }, children);
}

export type ApplicationNavigationGroupProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'aria-label'> & {
  label: string;
  children: ReactNode;
};

export function ApplicationNavigationGroup({ label, children, className, ...props }: ApplicationNavigationGroupProps) {
  if (!label.trim()) throw new Error('ApplicationNavigationGroup requires a non-empty label.');
  return createElement('section', { ...props, 'aria-label': label, className: withClass('nidec-ui-application-navigation__group', className) },
    createElement('h2', { className: 'nidec-ui-application-navigation__group-label' }, label),
    createElement('div', { className: 'nidec-ui-application-navigation__items' }, children));
}

export type ApplicationNavigationItemProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'aria-current'> & {
  href: string;
  label: string;
  icon?: ReactNode;
  current?: boolean;
};

export function ApplicationNavigationItem({ href, label, icon, current = false, className, ...props }: ApplicationNavigationItemProps) {
  if (!href.trim() || !label.trim()) throw new Error('ApplicationNavigationItem requires a non-empty href and label.');
  return createElement('a', {
    ...props,
    'aria-current': current ? 'page' : undefined,
    className: withClass('nidec-ui-application-navigation__item', className),
    href,
  },
  icon === undefined ? null : createElement('span', { 'aria-hidden': true, className: 'nidec-ui-application-navigation__icon' }, icon),
  createElement('span', { className: 'nidec-ui-application-navigation__label' }, label));
}

export type AuthenticationLayoutProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'title' | 'form'> & {
  'aria-label': string;
  brand?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  form: ReactNode;
  feedback?: ReactNode;
  footer?: ReactNode;
};

export function AuthenticationLayout({
  'aria-label': ariaLabel,
  brand,
  title,
  description,
  form,
  feedback,
  footer,
  className,
  ...props
}: AuthenticationLayoutProps) {
  if (!ariaLabel.trim()) throw new Error('AuthenticationLayout requires a non-empty aria-label.');
  return createElement('section', { ...props, 'aria-label': ariaLabel, className: withClass('nidec-ui-authentication-layout', className) },
    createElement('section', { className: 'nidec-ui-authentication-layout__panel' },
      brand === undefined ? null : createElement('div', { className: 'nidec-ui-authentication-layout__brand' }, brand),
      createElement('header', { className: 'nidec-ui-authentication-layout__header' },
        createElement('h1', { className: 'nidec-ui-authentication-layout__title' }, title),
        description === undefined ? null : createElement('div', { className: 'nidec-ui-authentication-layout__description' }, description)),
      feedback === undefined ? null : createElement('div', { className: 'nidec-ui-authentication-layout__feedback' }, feedback),
      createElement('div', { className: 'nidec-ui-authentication-layout__form' }, form),
      footer === undefined ? null : createElement('footer', { className: 'nidec-ui-authentication-layout__footer' }, footer)));
}

export type DirectoryWorkspaceProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'results'> & {
  'aria-label': string;
  header: ReactNode;
  scope?: ReactNode;
  toolbar: ReactNode;
  results: ReactNode;
  resultsLabel: string;
  pagination?: ReactNode;
  details?: ReactNode;
};

export function DirectoryWorkspace({
  'aria-label': ariaLabel,
  header,
  scope,
  toolbar,
  results,
  resultsLabel,
  pagination,
  details,
  className,
  ...props
}: DirectoryWorkspaceProps) {
  if (!ariaLabel.trim() || !resultsLabel.trim()) throw new Error('DirectoryWorkspace requires non-empty workspace and results labels.');
  return createElement('section', { ...props, 'aria-label': ariaLabel, className: withClass('nidec-ui-directory-workspace', className) },
    createElement('div', { className: 'nidec-ui-directory-workspace__header' }, header),
    scope === undefined ? null : createElement('div', { className: 'nidec-ui-directory-workspace__scope' }, scope),
    createElement('div', { className: 'nidec-ui-directory-workspace__toolbar' }, toolbar),
    createElement('div', { 'aria-label': resultsLabel, className: 'nidec-ui-directory-workspace__results', role: 'region' }, results),
    pagination === undefined ? null : createElement('div', { className: 'nidec-ui-directory-workspace__pagination' }, pagination),
    details === undefined ? null : createElement('div', { className: 'nidec-ui-directory-workspace__details' }, details));
}

export type VersionedWorkspaceLayoutProps = Omit<ComponentPropsWithoutRef<'section'>, 'children' | 'content'> & {
  'aria-label': string;
  identity: ReactNode;
  governance: ReactNode;
  navigation?: ReactNode;
  content: ReactNode;
  history?: ReactNode;
};

export function VersionedWorkspaceLayout({
  'aria-label': ariaLabel,
  identity,
  governance,
  navigation,
  content,
  history,
  className,
  ...props
}: VersionedWorkspaceLayoutProps) {
  if (!ariaLabel.trim()) throw new Error('VersionedWorkspaceLayout requires a non-empty aria-label.');
  return createElement('section', { ...props, 'aria-label': ariaLabel, className: withClass('nidec-ui-versioned-workspace', className) },
    createElement('div', { className: 'nidec-ui-versioned-workspace__identity' }, identity),
    createElement('div', { className: 'nidec-ui-versioned-workspace__governance' }, governance),
    navigation === undefined ? null : createElement('div', { className: 'nidec-ui-versioned-workspace__navigation' }, navigation),
    createElement('div', { className: 'nidec-ui-versioned-workspace__body' },
      createElement('div', { className: 'nidec-ui-versioned-workspace__content' }, content),
      history === undefined ? null : createElement('aside', { 'aria-label': `${ariaLabel} history`, className: 'nidec-ui-versioned-workspace__history' }, history)));
}
