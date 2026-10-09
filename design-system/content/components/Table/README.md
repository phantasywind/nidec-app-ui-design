Table is for data that is compared across several columns. Compose it with TableHeader, TableBody, TableRow, TableHeaderCell, TableCell, TableCellLayout, TableSelectionCell and TableCellActions; use RecordTableHeader and RecordIdentityCellLayout for record tables.

For independent records declare one semantic identity Link in the primary column, and keep status, metadata and row actions in their own columns. Clicking other cells must not open the record. Direct row actions are TableActionIconButton with a Tooltip; several go into a Menu. Keep horizontal overflow inside the table region.

The consumer provides the columns, sorting, selection, paging, loading and what each value means. For keyboard grid behaviour or selection use DataGrid.
