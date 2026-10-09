// @card group="Page building blocks" height=110 subtitle="Live component"
function Demo() {
  const [t, setT] = useState('overview');
  return <TabList selectedValue={t} onTabSelect={(_, d) => setT(String(d.value))}><Tab value="overview">Overview</Tab><Tab value="details">Details</Tab><Tab value="history">History</Tab></TabList>;
}
