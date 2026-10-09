// @card group="Forms" height=240 subtitle="Live component"
function Demo() {
  return <Menu open><MenuTrigger disableButtonEnhancement><Button>Actions</Button></MenuTrigger><MenuPopover><MenuList><MenuItem>Duplicate</MenuItem><MenuItem>Archive</MenuItem><MenuDivider /><MenuItem>Export</MenuItem></MenuList></MenuPopover></Menu>;
}
