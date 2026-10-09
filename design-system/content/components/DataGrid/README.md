DataGrid is a table with keyboard grid behaviour and selection (DataGridHeader, DataGridBody, DataGridRow, DataGridHeaderCell, DataGridCell, RecordDataGridHeader).

Use it when you need grid keyboard movement or selection; otherwise use Table. For a same-surface editor, RecordSelectionRegion and RecordSelectionDataGrid use the whole row as the single selection target: the primary value is plain text, not a link; there is no extra Open or Select control; the selected row has a neutral state, not a brand bar. Selection proposes a change and does not mean navigation or saving.

Expose a labelled grid, row structure and controlled `aria-selected`. The consumer provides stable IDs, the selected-record authority and what happens to unsaved work when the selection changes.
