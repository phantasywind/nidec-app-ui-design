// @card group="Page building blocks" height=280 subtitle="Live component"
const items = [{ id: 'P-1', name: 'Height' }, { id: 'P-2', name: 'Capacity' }, { id: 'P-3', name: 'Openings' }];
const columns = [createTableColumn({ columnId: 'parameter', renderHeaderCell: () => 'Parameter', renderCell: i => i.name })];
function Demo() {
  const [sel, setSel] = useState('P-1');
  return <RecordSelectionRegion aria-label="Definition list" toolbar={<span>Select a record to edit</span>}>
    <RecordSelectionDataGrid columns={columns} items={items} getRowId={i => i.id} selectedItems={new Set([sel])} onSelectionChange={(_, d) => setSel(String([...d.selectedItems][0] ?? sel))} aria-label="Available definitions">
      <DataGridRow>{({ renderHeaderCell }) => <DataGridHeaderCell>{renderHeaderCell()}</DataGridHeaderCell>}</DataGridRow>
      <DataGridBody>{({ rowId }) => <RecordSelectionDataGridRow key={rowId} recordId={rowId}>{({ renderCell }) => <DataGridCell>{renderCell(items.find(i => i.id === rowId))}</DataGridCell>}</RecordSelectionDataGridRow>}</DataGridBody>
    </RecordSelectionDataGrid>
  </RecordSelectionRegion>;
}
