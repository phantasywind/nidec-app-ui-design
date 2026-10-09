// @card group="Page building blocks" height=300 subtitle="Live component"
function Demo() {
  return <CardGallery aria-label="Example gallery" minimumItemWidth="small">
    {['Foundations','Components'].map((n, i) => <CardGalleryItem key={n}><CardHeader header={<strong>{n}</strong>} description={<span>{i+1} governed area</span>} /><Body1>Display-only content without a nested surface.</Body1></CardGalleryItem>)}
    {['Patterns','Evidence'].map(n => <ActionableCardGalleryItem aria-label={'Open '+n} href={'#'+n.toLowerCase()} key={n}><CardHeader header={<strong>{n}</strong>} description={<span>Whole-card navigation</span>} /><Body1>Click anywhere on the card to open this destination.</Body1></ActionableCardGalleryItem>)}
  </CardGallery>;
}
