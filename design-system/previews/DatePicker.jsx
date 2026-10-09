// @card group="Forms" height=470 subtitle="Live component"
const fmt = d => d ? d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0') : '';
const parse = v => { const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v.trim()); if(!m) return null; const d=new Date(+m[1],+m[2]-1,+m[3]); return fmt(d)===v.trim()?d:null; };
function Demo() {
  const [d, setD] = useState(new Date(2026, 9, 14));
  return <div style={{display:'flex',gap:24,flexWrap:'wrap',alignItems:'flex-start'}}>
    <Field label="Effective date" hint="Choose from the calendar or type YYYY-MM-DD." style={{width:'18rem'}}><DatePicker allowTextInput formatDate={fmt} parseDateFromString={parse} placeholder="YYYY-MM-DD" showGoToToday value={d} onSelectDate={x => setD(x ?? null)} /></Field>
    <Field label="Unavailable date" style={{width:'14rem'}}><DatePicker disabled formatDate={fmt} value={new Date(2026, 9, 14)} /></Field>
  </div>;
}
