// @card group="Page building blocks" height=100 subtitle="Live component"
function Demo() {
  return <Breadcrumb aria-label="Location"><BreadcrumbItem><BreadcrumbButton href="#">Records</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton href="#">Directory</BreadcrumbButton></BreadcrumbItem><BreadcrumbDivider /><BreadcrumbItem><BreadcrumbButton current>Example Alpha</BreadcrumbButton></BreadcrumbItem></Breadcrumb>;
}
