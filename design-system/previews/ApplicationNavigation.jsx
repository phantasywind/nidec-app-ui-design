// @card group="Page building blocks" height=320 width=1280 subtitle="Live component"
function Demo() {
  return <div style={{width:'14rem'}}><ApplicationNavigation aria-label="Primary">
    <ApplicationNavigationGroup label="Workspace"><ApplicationNavigationItem href="#a" label="Overview" icon={<Icons.Home />} onClick={e => e.preventDefault()} /><ApplicationNavigationItem href="#b" current label="Records" icon={<Icons.Document />} onClick={e => e.preventDefault()} /></ApplicationNavigationGroup>
    <ApplicationNavigationGroup label="System"><ApplicationNavigationItem href="#c" label="Settings" icon={<Icons.Settings />} onClick={e => e.preventDefault()} /></ApplicationNavigationGroup>
  </ApplicationNavigation></div>;
}
