import { createContext, createElement, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  Button as FluentButton, Dialog as FluentDialog, DialogActions as FluentDialogActions, DialogBody as FluentDialogBody,
  DialogContent as FluentDialogContent, DialogSurface as FluentDialogSurface, DialogTitle as FluentDialogTitle,
} from '@fluentui/react-components';
import { withClass } from './with-class';

type UnsavedChangesContextValue = {
  setDirty: (source: string, dirty: boolean) => void;
  hasUnsavedChanges: boolean;
  confirmDiscard: () => Promise<boolean>;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextValue | null>(null);

export type UnsavedChangesProviderProps = {
  children: ReactNode;
  title?: string;
  message?: string;
  keepLabel?: string;
  discardLabel?: string;
};

/**
 * Tracks unsaved edits across the page. While any form reports changes, the
 * browser asks before the tab is closed or reloaded, and `confirmDiscard`
 * asks before an in-page switch (a tab, a stage, another record). Routing
 * stays with the application: call `confirmDiscard` from the router's blocker.
 */
export function UnsavedChangesProvider({
  children,
  title = 'Discard unsaved changes?',
  message = 'Your changes on this page have not been saved.',
  keepLabel = 'Keep editing',
  discardLabel = 'Discard changes',
}: UnsavedChangesProviderProps) {
  const [sources, setSources] = useState<ReadonlySet<string>>(() => new Set());
  const [pending, setPending] = useState<((discard: boolean) => void) | null>(null);
  const hasUnsavedChanges = sources.size > 0;

  const setDirty = useCallback((source: string, dirty: boolean) => setSources(current => {
    if (current.has(source) === dirty) return current;
    const next = new Set(current);
    if (dirty) next.add(source);
    else next.delete(source);
    return next;
  }), []);

  const latest = useRef(hasUnsavedChanges);
  latest.current = hasUnsavedChanges;
  const confirmDiscard = useCallback(() => (latest.current
    ? new Promise<boolean>(resolve => setPending(() => resolve))
    : Promise.resolve(true)), []);

  useEffect(() => {
    if (!hasUnsavedChanges || typeof window === 'undefined') return undefined;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [hasUnsavedChanges]);

  // Fluent focuses the first command; keeping the work is the safe default, so focus moves to it.
  const keepRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (pending !== null) keepRef.current?.focus();
  }, [pending]);

  const close = (discard: boolean) => {
    pending?.(discard);
    setPending(null);
  };
  const value = useMemo(() => ({ setDirty, hasUnsavedChanges, confirmDiscard }), [setDirty, hasUnsavedChanges, confirmDiscard]);
  return createElement(UnsavedChangesContext.Provider, { value },
    children,
    createElement(FluentDialog, {
      modalType: 'alert',
      open: pending !== null,
      onOpenChange: (_event, data) => {
        if (!data.open) close(false);
      },
      children: createElement(FluentDialogSurface, null, createElement(FluentDialogBody, null,
        createElement(FluentDialogTitle, null, title),
        createElement(FluentDialogContent, null, message),
        createElement(FluentDialogActions, null,
          createElement(FluentButton, { onClick: () => close(true) }, discardLabel),
          createElement(FluentButton, { appearance: 'primary', onClick: () => close(false), ref: (node: HTMLButtonElement | null) => {
            keepRef.current = node;
          } }, keepLabel)))),
    }));
}

const useUnsavedChangesContext = (hook: string) => {
  const context = useContext(UnsavedChangesContext);
  if (context === null) throw new Error(`${hook} must be used inside UnsavedChangesProvider.`);
  return context;
};

/** Reports whether this form has unsaved edits; the report is withdrawn when the form unmounts. */
export function useUnsavedChanges(dirty: boolean) {
  const { setDirty } = useUnsavedChangesContext('useUnsavedChanges');
  const source = useId();
  useEffect(() => {
    setDirty(source, dirty);
  }, [setDirty, source, dirty]);
  useEffect(() => () => setDirty(source, false), [setDirty, source]);
}

/** `confirmDiscard()` resolves true at once when nothing is unsaved, otherwise after the person chooses. */
export function useConfirmDiscard() {
  const { confirmDiscard, hasUnsavedChanges } = useUnsavedChangesContext('useConfirmDiscard');
  return { confirmDiscard, hasUnsavedChanges };
}

export type StickySaveBarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Usually "Unsaved changes" or a count of changed fields. */
  message: ReactNode;
  /** Discard and Save, with the primary command last. */
  actions: ReactNode;
};

/** Bar at the bottom of the window while a long page has unsaved edits; render it only when there are changes. */
export function StickySaveBar({ message, actions, className, ...props }: StickySaveBarProps) {
  return createElement('div', { role: 'region', 'aria-label': 'Unsaved changes', ...props, className: withClass('nidec-ui-sticky-save-bar', className) },
    createElement('div', { className: 'nidec-ui-sticky-save-bar__message' }, message),
    createElement('div', { className: 'nidec-ui-sticky-save-bar__actions' }, actions));
}
