// @card group="Forms" height=200 subtitle="Live component"
function Demo() {
  return <Popover open positioning="below-start"><PopoverTrigger disableButtonEnhancement><Button>Show details</Button></PopoverTrigger><PopoverSurface>Contextual information remains consumer-owned.</PopoverSurface></Popover>;
}
