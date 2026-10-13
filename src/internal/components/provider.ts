import { createElement, useLayoutEffect, useState } from 'react';
import { FluentProvider, PortalMountNodeProvider } from '@fluentui/react-components';
import type { FluentProviderProps, Theme } from '@fluentui/react-components';

export type NidecProviderProps = Omit<FluentProviderProps,
  'theme' | 'customStyleHooks_unstable' | 'overrides_unstable'> & { theme: Theme };

const useClientLayoutEffect = typeof document === 'undefined' ? () => undefined : useLayoutEffect;

/**
 * Explicit theme required. The caller owns its approved theme values.
 *
 * Fluent renders Dialog, Drawer, Menu, Popover and Tooltip content in portals
 * under `body`, outside this root. Those portals mount inside one host element
 * that carries the same package scope attribute, so the package styles and
 * tokens reach them without the application marking `body`.
 */
export function NidecProvider({ children, targetDocument, ...props }: NidecProviderProps) {
  const [portalHost] = useState(() => {
    const doc = targetDocument ?? (typeof document === 'undefined' ? undefined : document);
    if (!doc) return undefined;
    const host = doc.createElement('div');
    host.setAttribute('data-nidec-ui', '');
    host.setAttribute('data-nidec-ui-portal-host', '');
    return host;
  });
  useClientLayoutEffect(() => {
    if (!portalHost) return undefined;
    portalHost.ownerDocument.body.appendChild(portalHost);
    return () => portalHost.remove();
  }, [portalHost]);
  const hostProps = { ...props, ...(targetDocument ? { targetDocument } : {}), 'data-nidec-ui': '' };
  return createElement(FluentProvider, hostProps,
    portalHost ? createElement(PortalMountNodeProvider, { value: portalHost }, children) : children);
}
