// @card group="Page building blocks" height=110 width=1280 subtitle="Live component"
function Demo() {
  return <ApplicationTopBar location={<Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#">Records</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Directory</BreadcrumbButton></BreadcrumbItem></Breadcrumb>} utilities={<><Badge appearance="outline">Test environment</Badge><Avatar name="Alex Chen" size={24} /></>} />;
}
