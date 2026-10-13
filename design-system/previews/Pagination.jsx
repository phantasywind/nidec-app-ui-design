// @card group="Page building blocks" height=150 subtitle="Live component"
function Demo() {
  const [page, setPage] = useState(2);
  const [size, setSize] = useState(25);
  return <div style={{display:'grid',gap:16}}>
    <Pagination aria-label="Result pages" page={page} pageSize={size} totalCount={60} onPageChange={(_, p) => setPage(p)} />
    <Pagination aria-label="Result pages with page size" page={Math.min(page, Math.ceil(60 / size))} pageSize={size} totalCount={60} pageSizeOptions={[10, 25, 50]} onPageSizeChange={(_, s) => { setSize(s); setPage(1); }} onPageChange={(_, p) => setPage(p)} />
  </div>;
}
