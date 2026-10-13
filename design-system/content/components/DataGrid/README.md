DataGrid is a table with grid keyboard behaviour and selection. Fluent's `DataGrid`, `DataGridHeader`, `DataGridBody`, `DataGridRow`, `DataGridHeaderCell` and `DataGridCell` are re-exported unchanged. The package adds `RecordDataGridHeader`, `RecordSelectionRegion`, `RecordSelectionDataGrid` and `RecordSelectionDataGridRow`.

Use Table when you do not need grid keyboard movement or selection.

DataGrid takes `items`, `columns` (build them with Fluent's `createTableColumn`) and `getRowId`, plus `selectionMode` (`single` or `multiselect`, off by default), `onSelectionChange`, `sortState` / `defaultSortState` / `onSortChange`, `focusMode`, `subtleSelection`, `selectionAppearance` and `resizableColumns`. Use `RecordDataGridHeader` for the header of a record grid.

For a same-surface editor, where selecting a row loads the record into a form on the same page, use the record selection pieces:

- `RecordSelectionRegion` takes a `toolbar` and the grid as children, and spaces them.
- `RecordSelectionDataGrid` is controlled and single-selection. It requires `aria-label`, `getRowId`, `onSelectionChange` and `selectedItems` (a Set holding at most one id; two throw). It fixes the selection mode, focus mode and neutral appearance for you.
- `RecordSelectionDataGridRow` takes a `recordId` and makes the whole row the selection target: pointer, Space and Enter propose the same selection. It must be inside a `RecordSelectionDataGrid`.
- The primary value is plain text, not a link, and the row has no Open or Select control. The selected row has a neutral state, not a brand bar.
- Selection proposes a change. It does not mean navigation, saving or permission. Decide in `onSelectionChange` whether to accept it, for example after asking about unsaved edits.

The consumer provides stable row ids, the selected-record authority, the form that loads, and what happens to unsaved work when the selection changes.

```tsx
<RecordSelectionRegion aria-label="Definition list" toolbar={<span>Select a record to edit</span>}>
  <RecordSelectionDataGrid
    aria-label="Available definitions" items={items} columns={columns}
    getRowId={(i) => i.id} selectedItems={new Set([selectedId])}
    onSelectionChange={(_, data) => requestSelect(String([...data.selectedItems][0]))}
  >
    <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
    <DataGridBody>{({ rowId }) => (
      <RecordSelectionDataGridRow key={rowId} recordId={rowId}>
        {({ renderCell }) => <DataGridCell>{renderCell(byId(rowId))}</DataGridCell>}
      </RecordSelectionDataGridRow>
    )}</DataGridBody>
  </RecordSelectionDataGrid>
</RecordSelectionRegion>
```

- One column shows one field. Do not stack two fields in one column; an exception needs separate approval (shared rule, see the page selection guide).
