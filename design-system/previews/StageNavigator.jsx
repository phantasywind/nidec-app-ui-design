// @card group="Specialized components" height=180 subtitle="Live component"
const stages = [
  { id: 'definition', label: 'Definition', description: 'Identity and scope', status: 'completed', statusLabel: 'Prepared' },
  { id: 'parameters', label: 'Parameters', description: 'Governed values', status: 'current', statusLabel: 'In progress' },
  { id: 'rules', label: 'Rules', description: 'Reusable logic', status: 'upcoming', statusLabel: 'Preparation ahead' },
  { id: 'review', label: 'Review', description: 'Readiness evidence', status: 'upcoming', statusLabel: 'Preparation ahead' },
];
function Demo() {
  const [id, setId] = useState('parameters');
  return <StageNavigator aria-label="Example workspace navigation" stages={stages} selectedStageId={id} onStageSelect={(_, s) => setId(s.id)} />;
}
