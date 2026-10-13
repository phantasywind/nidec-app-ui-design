// @card group="Page building blocks" height=420 width=1280 subtitle="Live component"
function Demo() {
  return <div style={{width:'14rem',height:400,display:'grid'}}><ApplicationNavigation aria-label="Primary" footer={<span>Version 1.4.0 · Test environment</span>}>
    <ApplicationNavigationGroup label="Workspace"><ApplicationNavigationItem href="#a" label="Overview" icon={<Icons.Home />} onClick={e => e.preventDefault()} /><ApplicationNavigationItem href="#b" current label="Records" icon={<Icons.Document />} onClick={e => e.preventDefault()} /><ApplicationNavigationItem href="#w" label="My work" icon={<Icons.Person />} badge={<CounterBadge count={3} size="small" appearance="filled" color="brand" />} onClick={e => e.preventDefault()} /></ApplicationNavigationGroup>
    <ApplicationNavigationGroup label="System"><ApplicationNavigationItem href="#c" label="Settings" icon={<Icons.Settings />} onClick={e => e.preventDefault()} /></ApplicationNavigationGroup>
  </ApplicationNavigation></div>;
}
