import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import {
  Tab as FluentTab, TabList as FluentTabList, makeStyles, mergeClasses, tabClassNames as fluentTabClassNames, tokens,
} from '@fluentui/react-components';
import type { SelectTabEvent as FluentSelectTabEvent, TabListProps as FluentTabListProps } from '@fluentui/react-components';

export type InlineModeTabOption = Readonly<{
  value: string;
  label: string;
  tabId: string;
  panelId: string;
  disabled?: boolean;
}>;

export type InlineModeTabsProps = Omit<ComponentPropsWithoutRef<'div'>,
  'children' | 'onChange' | 'role'> & {
  'aria-label': string;
  options: readonly InlineModeTabOption[];
  value: string;
  onValueChange: (event: FluentSelectTabEvent, value: string) => void;
  disabled?: boolean;
};

const useInlineModeSelectorStyles = makeStyles({
  root: {
    alignItems: 'center',
    backgroundColor: tokens.colorNeutralBackground3,
    border: `${tokens.strokeWidthThin} solid ${tokens.colorNeutralStroke1}`,
    borderRadius: tokens.borderRadiusCircular,
    display: 'inline-flex',
    gap: tokens.strokeWidthThin,
    maxWidth: '100%',
    padding: tokens.spacingVerticalXXS,
    width: 'fit-content',
  },
  item: {
    borderRadius: tokens.borderRadiusCircular,
    color: tokens.colorNeutralForeground2,
    fontSize: tokens.fontSizeBase100,
    fontWeight: tokens.fontWeightRegular,
    height: '20px',
    lineHeight: tokens.lineHeightBase100,
    minHeight: '20px',
    flex: '0 0 auto',
    paddingLeft: tokens.spacingHorizontalXS,
    paddingRight: tokens.spacingHorizontalXS,
    transitionDuration: tokens.durationFaster,
    transitionProperty: 'background-color, box-shadow, color',
    transitionTimingFunction: tokens.curveEasyEase,
    whiteSpace: 'nowrap',
    '&& *': {
      fontSize: tokens.fontSizeBase100,
      lineHeight: tokens.lineHeightBase100,
    },
    '&&::before': {
      display: 'none',
    },
    '&&::after': {
      display: 'none',
    },
    '&&:enabled:hover::before': {
      display: 'none',
    },
    '&&:enabled:hover::after': {
      display: 'none',
    },
    '&&:enabled:active::before': {
      display: 'none',
    },
    '&&:enabled:active::after': {
      display: 'none',
    },
    '&&:enabled:hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
      color: tokens.colorBrandForeground1,
    },
    '&&:enabled:hover *': {
      color: tokens.colorBrandForeground1,
    },
    [`&&&&:enabled:hover .${fluentTabClassNames.content}`]: {
      color: tokens.colorBrandForeground1,
    },
    '&&[aria-selected="true"]': {
      backgroundColor: tokens.colorBrandBackground,
      boxShadow: tokens.shadow2,
      color: tokens.colorNeutralForegroundOnBrand,
      fontWeight: tokens.fontWeightSemibold,
    },
    '&&[aria-selected="true"] *': {
      color: tokens.colorNeutralForegroundOnBrand,
    },
    '&&[aria-selected="true"]:hover': {
      backgroundColor: tokens.colorBrandBackgroundHover,
      boxShadow: tokens.shadow2,
      color: tokens.colorNeutralForegroundOnBrand,
    },
    '&&[aria-selected="true"]:hover *': {
      color: tokens.colorNeutralForegroundOnBrand,
    },
    [`&&&&[aria-selected="true"]:hover .${fluentTabClassNames.content}`]: {
      color: tokens.colorNeutralForegroundOnBrand,
    },
    '&&[aria-selected="true"]:active': {
      backgroundColor: tokens.colorBrandBackgroundPressed,
      boxShadow: tokens.shadow2,
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
});

/** Compact tabs for switching the mode and panel of one nearby inline editor. */
export function InlineModeTabs({
  'aria-label': ariaLabel,
  options,
  value,
  onValueChange,
  disabled = false,
  className,
  ...props
}: InlineModeTabsProps): ReactElement<FluentTabListProps> {
  const styles = useInlineModeSelectorStyles();
  if (!ariaLabel.trim()) throw new Error('InlineModeTabs requires a non-empty aria-label.');
  if (options.length < 2) throw new Error('InlineModeTabs requires at least two options.');
  if (new Set(options.map(option => option.value)).size !== options.length) throw new Error('InlineModeTabs option values must be unique.');
  if (options.some(option => !option.value.trim() || !option.label.trim() || !option.tabId.trim() || !option.panelId.trim())) {
    throw new Error('InlineModeTabs options require non-empty values, labels, tab IDs and panel IDs.');
  }
  if (new Set(options.map(option => option.tabId)).size !== options.length ||
    new Set(options.map(option => option.panelId)).size !== options.length) {
    throw new Error('InlineModeTabs tab IDs and panel IDs must be unique.');
  }
  if (!options.some(option => option.value === value)) throw new Error('InlineModeTabs value must match an option.');

  return createElement(FluentTabList, {
    ...props,
    'aria-label': ariaLabel,
    appearance: 'transparent',
    className: mergeClasses('nidec-ui-inline-mode-tabs', styles.root, className),
    onTabSelect: (event, data) => {
      const nextValue = data.value;
      if (typeof nextValue === 'string' && nextValue !== value) {
        onValueChange(event, nextValue);
      }
    },
    selectedValue: value,
    size: 'small',
  }, options.map(option => createElement(FluentTab, {
    'aria-controls': option.panelId,
    className: mergeClasses('nidec-ui-inline-mode-tabs__item', styles.item),
    ...((disabled || option.disabled) ? { disabled: true } : {}),
    id: option.tabId,
    key: option.value,
    value: option.value,
  }, option.label)));
}
