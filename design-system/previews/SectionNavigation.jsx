// @card group="Page building blocks" height=330 width=1280 subtitle="Live component"
function Demo() {
  const items = [{id:'overview',label:'Overview'},{id:'details',label:'Details'},{id:'delivery',label:'Delivery'},{id:'progress',label:'Progress tracking'}];
  const groups = [
    {id:'g1',label:'General',count:8,status:<StepStatusIcon status="done" size="small" label="Complete" />},
    {id:'g2',label:'Dimensions',count:12,status:<StepStatusIcon status="pending" size="small" label="Incomplete" />},
    {id:'g3',label:'Finishes',count:5},
    {id:'g4',label:'Accessories',count:0,status:<StepStatusIcon status="notApplicable" size="small" label="Not applicable" />},
  ];
  const [group, setGroup] = useState('g2');
  return <div style={{display:'grid',gap:24}}>
    <SectionNavigation aria-label="Record sections" items={items} currentId="overview" />
    <div style={{width:'16rem'}}><SectionNavigation aria-label="Field groups" orientation="vertical" items={groups} currentId={group} onSectionSelect={(e, id) => { e.preventDefault(); setGroup(id); }} /></div>
  </div>;
}
