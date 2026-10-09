// @card group="Specialized components" height=200 subtitle="Live component"
const stages = [
  { id: 'draft', label: 'Draft', description: 'Completed', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'In review', description: 'Evidence requested', status: 'current', statusLabel: 'Current stage' },
  { id: 'approved', label: 'Approved', description: 'Not reached', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 'released', label: 'Released', description: 'Not released', status: 'upcoming', statusLabel: 'Upcoming' },
];
function Demo() {
  const [viewed, setViewed] = useState('review');
  return <div>
    <BusinessProcessFlow aria-label="Example lifecycle" stages={stages} viewedStageId={viewed} onStageView={(_, s) => setViewed(s.id)} />
    <p style={{color:'var(--text-secondary)',fontSize:12}}>Viewing: {stages.find(s=>s.id===viewed).label} · Actual process: In review</p>
  </div>;
}
