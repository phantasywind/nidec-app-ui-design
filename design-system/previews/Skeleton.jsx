// @card group="Forms" height=150 subtitle="Live component"
function Demo() {
  return <Skeleton aria-label="Loading placeholder" style={{width:'20rem',display:'flex',flexDirection:'column',gap:8}}><SkeletonItem size={16} style={{width:'60%'}} /><SkeletonItem size={12} /><SkeletonItem size={12} style={{width:'80%'}} /></Skeleton>;
}
