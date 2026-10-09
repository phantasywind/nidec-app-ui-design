import React from 'react';
import { createRoot } from 'react-dom/client';
import * as Pkg from '../../src/index.ts';
import * as Layouts from '../../src/layouts.ts';
import * as DatePickerMod from '../../src/date-picker.ts';
import * as Icons from './icons.ts';
import { createTableColumn } from '@fluentui/react-components';

(window as unknown as Record<string, unknown>).NidecUi = { ...Pkg, ...Layouts, ...DatePickerMod, Icons, createTableColumn, React, createRoot };
