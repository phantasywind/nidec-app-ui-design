// @card group="Specialized components" height=600 subtitle="Live component"
const stages = [
  { id: 'draft', label: 'Draft', description: 'Completed', status: 'completed', statusLabel: 'Completed' },
  { id: 'review', label: 'In review', description: 'Evidence requested', status: 'current', statusLabel: 'Current stage' },
  { id: 'approved', label: 'Approved', description: 'Not reached', status: 'upcoming', statusLabel: 'Upcoming' },
  { id: 'released', label: 'Released', description: 'Not released', status: 'upcoming', statusLabel: 'Upcoming' },
];
// After a return: the process went back to Preparation, so the later reached stage must be redone but stays viewable.
const returned = [
  { id: 'r-draft', label: 'Draft', description: 'Completed', status: 'completed', statusLabel: 'Completed' },
  { id: 'r-prep', label: 'Evidence collection and preparation', description: 'Returned for changes', status: 'current', statusLabel: 'Current stage' },
  { id: 'r-review', label: 'Technical review', description: 'Redo · draft kept', status: 'revisit', statusLabel: 'Reached before, must be redone' },
  { id: 'r-approved', label: 'Approved', description: 'Not reached', status: 'upcoming', statusLabel: 'Upcoming' },
];
const details = {
  draft: { title: 'Draft', status: 'Completed', checksTitle: 'Completed with', checks: [
    { id: 'scope', label: 'Scope described', met: true, stateLabel: 'Done' },
    { id: 'owner', label: 'Owner assigned', met: true, stateLabel: 'Done' },
  ] },
  review: { title: 'In review', status: 'Waiting for you (Reviewer)', checksTitle: 'To move to Approved', checks: [
    { id: 'evidence', label: 'Evidence attached', met: true, stateLabel: 'Done' },
    { id: 'summary', label: 'Summary completed', met: false, stateLabel: 'Missing', detail: 'Returned by Example Author: "Add the test results"' },
    { id: 'reference', label: 'Reference number', met: false, stateLabel: 'Missing', action: <Link href="#reference">Go to field</Link> },
  ], actionsTitle: 'Your actions', actions: <><Button appearance="primary">Edit and resubmit</Button><Button>Set not required</Button></>,
  next: 'Next after you: an approver checks the evidence and approves the record.' },
};
function Demo() {
  const [viewed, setViewed] = useState('review');
  const [returnedView, setReturnedView] = useState('r-prep');
  const host = useRef(null);
  useEffect(() => { host.current?.querySelector('[aria-label="Example lifecycle"] [data-viewed="true"] button')?.click(); }, []);
  return <div ref={host} style={{display:'grid',gap:12,maxWidth:1100}}>
    <BusinessProcessFlow aria-label="Returned lifecycle" stages={returned} viewedStageId={returnedView} onStageView={(_, s) => setReturnedView(s.id)} />
    <BusinessProcessFlow aria-label="Returned lifecycle, revisit stage viewed" stages={returned} viewedStageId="r-review" onStageView={() => undefined} />
    <BusinessProcessFlow aria-label="Example lifecycle" stages={stages} viewedStageId={viewed} onStageView={(_, s) => setViewed(s.id)}
      renderStageDetail={s => details[s.id] && <BusinessProcessStageDetail {...details[s.id]} />} />
  </div>;
}
