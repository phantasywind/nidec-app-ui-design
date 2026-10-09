Table shows data compared across columns. Fluent's `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHeaderCell`, `TableCell`, `TableCellLayout`, `TableSelectionCell` and `TableCellActions` are re-exported unchanged. The package adds `RecordTableHeader` and `RecordIdentityCellLayout` for record tables.

Use DataGrid instead when you need grid keyboard movement or selection.

Table: `size` (`extra-small`, `small`, `medium`), `sortable` and `noNativeElements`. TableCellLayout takes `truncate` and an `appearance` of `primary`.

For a record table:

- Use `RecordTableHeader` in place of `TableHeader`. Give the primary column `RecordIdentityCellLayout` with a semantic `Link` as `primary`, and optionally `secondary` text. That Link is the only way into the record; clicking other cells must not open it.
- Keep status, owner and metadata in their own columns. Show a status with Badge.
- Put direct row commands in `TableCellActions` as `TableActionIconButton` with a Tooltip. Several or rare commands go into a Menu.
- Keep horizontal overflow inside the table region, not the page.

The consumer provides the columns, sorting, selection, paging, loading and the meaning of every value.

```tsx
<Table aria-label="Records" size="small">
  <RecordTableHeader><TableRow>
    <TableHeaderCell>Record</TableHeaderCell><TableHeaderCell>Status</TableHeaderCell>
  </TableRow></RecordTableHeader>
  <TableBody>{records.map((r) => (
    <TableRow key={r.id}>
      <TableCell><RecordIdentityCellLayout primary={<Link inline href={r.href}>{r.name}</Link>} truncate /></TableCell>
      <TableCell><Badge appearance="tint" color={r.tone}>{r.status}</Badge></TableCell>
    </TableRow>
  ))}</TableBody>
</Table>
```
