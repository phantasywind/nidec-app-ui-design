import { createElement } from 'react';
import type { ReactElement } from 'react';

// Small outline glyphs drawn in currentColor so the package keeps no icon
// dependency. Each is decorative; the surrounding control carries the name.
const glyph = (d: string, size = 20): ReactElement => createElement('svg', {
  'aria-hidden': true, focusable: false, viewBox: '0 0 20 20', width: size, height: size,
  className: 'nidec-ui-glyph', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round',
}, createElement('path', { d }));

export const chevronLeftIcon = () => glyph('M12.5 4.5 7 10l5.5 5.5');
export const chevronRightIcon = () => glyph('M7.5 4.5 13 10l-5.5 5.5');
// Padlock: shackle and body, for read-only content.
export const lockIcon = (size = 14) => glyph('M6.5 9V6.75a3.5 3.5 0 0 1 7 0V9M5.5 9h9v7h-9z', size);
export const dismissIcon = () => glyph('M5 5l10 10M15 5 5 15');
export const chevronDownIcon = () => glyph('M4.5 7.5 10 13l5.5-5.5');
export const checkIcon = () => glyph('M4.5 10.5 8 14l7.5-8');
// Pencil: body and tip, for an edit action.
export const editIcon = () => glyph('M13.5 3.5l3 3L7 16H4v-3zM11.5 5.5l3 3');
// Magnifying glass: lens and handle, for lookup triggers.
export const searchIcon = (size = 20) => glyph('M8.5 3.5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12.2 12.2L16.5 16.5', size);
