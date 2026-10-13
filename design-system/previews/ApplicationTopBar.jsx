// @card group="Page building blocks" height=170 width=1280 subtitle="Live component"
function Demo() {
  const crumbs = <Breadcrumb aria-label="Location" size="small"><BreadcrumbItem><BreadcrumbButton href="#">Records</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>R-2026-0142</BreadcrumbButton></BreadcrumbItem></Breadcrumb>;
  return <div style={{display:'grid',gap:16}}>
    <ApplicationTopBar location={<Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#">Records</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Directory</BreadcrumbButton></BreadcrumbItem></Breadcrumb>} utilities={<><Badge appearance="outline">Test environment</Badge><Avatar name="Alex Chen" size={24} /></>} />
    <ApplicationTopBar location={<strong style={{fontSize:20}}>Example App</strong>} utilities={<><Caption1>Test environment</Caption1><Avatar name="Alex Chen" size={24} /></>} breadcrumb={crumbs} />
  </div>;
}
